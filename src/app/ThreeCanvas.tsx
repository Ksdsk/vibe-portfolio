"use client";
import { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import type { Font } from 'three/examples/jsm/loaders/FontLoader';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

// Throttle function moved outside component
const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

export default function ThreeCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Set up camera so the card fills the parent div
    const width = 4;
    const height = 2.5;
    const aspect = width / height;
    const frustumHeight = height;
    const frustumWidth = width;
    const camera = new THREE.OrthographicCamera(
      -frustumWidth / 2, frustumWidth / 2,
      frustumHeight / 2, -frustumHeight / 2,
      0.001, 1000
    );
    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);
    
    // Optimize renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // Business card geometry (flat rectangle with rounded corners)
    // Use the same width/height as the camera setup
    const radius = 0.3;
    const cardShape = new THREE.Shape();
    cardShape.moveTo(-width/2 + radius, -height/2);
    cardShape.lineTo(width/2 - radius, -height/2);
    cardShape.quadraticCurveTo(width/2, -height/2, width/2, -height/2 + radius);
    cardShape.lineTo(width/2, height/2 - radius);
    cardShape.quadraticCurveTo(width/2, height/2, width/2 - radius, height/2);
    cardShape.lineTo(-width/2 + radius, height/2);
    cardShape.quadraticCurveTo(-width/2, height/2, -width/2, height/2 - radius);
    cardShape.lineTo(-width/2, -height/2 + radius);
    cardShape.quadraticCurveTo(-width/2, -height/2, -width/2 + radius, -height/2);
    const cardGeometry = new THREE.ShapeGeometry(cardShape);

    // Custom UV mapping for perfect linear mapping
    cardGeometry.computeBoundingBox();
    if (cardGeometry.boundingBox) {
      const { min, max } = cardGeometry.boundingBox;
      const uvAttribute = [];
      for (let i = 0; i < cardGeometry.attributes.position.count; i++) {
        const x = cardGeometry.attributes.position.getX(i);
        const y = cardGeometry.attributes.position.getY(i);
        const u = (x - min.x) / (max.x - min.x);
        const v = (y - min.y) / (max.y - min.y);
        uvAttribute.push(u, v);
      }
      cardGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvAttribute, 2));
    }

    // Load the brushed metal image texture
    const textureLoader = new THREE.TextureLoader();
    const brushedTexture = textureLoader.load('/brushed-metal.jpg');
    brushedTexture.wrapS = THREE.ClampToEdgeWrapping;
    brushedTexture.wrapT = THREE.ClampToEdgeWrapping;
    brushedTexture.repeat.set(1, 1);
    const cardMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff, // pure white
      map: brushedTexture,
      metalness: 0.7,
      roughness: 0.38
    });
    const card = new THREE.Mesh(cardGeometry, cardMaterial);
    card.castShadow = true;
    card.receiveShadow = true;

    // Scale down the card for a more balanced look
    card.scale.set(0.45, 0.45, 1);
    
    // Add some thickness to the card for better shadow casting
    card.position.z = 0.05; // Move card slightly forward

    // Remove the two directional stage lights, leaving only the ambient light
    // (No directional lights added)

    // Add a spot light that shines on the face of the card
    const spotLight = new THREE.SpotLight(0xffffff, 2.2);
    spotLight.position.set(0, 0, 3); // In front of the card
    spotLight.target.position.set(0, 0, 0); // Aimed at the center of the card
    spotLight.angle = 3.5; // Much wider beam
    spotLight.penumbra = 0.4; // Softer edges
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    scene.add(spotLight);
    scene.add(spotLight.target);

    // Create a group for the card and text so they move together
    const cardGroup = new THREE.Group();
    cardGroup.add(card);
    
    // Add text overlay image on top of the card
    const textOverlayTexture = textureLoader.load('/text-overlay-1.png');
    textOverlayTexture.wrapS = THREE.ClampToEdgeWrapping;
    textOverlayTexture.wrapT = THREE.ClampToEdgeWrapping;
    textOverlayTexture.repeat.set(1, 1);
    const textOverlayMaterial = new THREE.MeshStandardMaterial({
      map: textOverlayTexture,
      transparent: true,
      alphaTest: 0.1,
      side: THREE.DoubleSide,
      metalness: 1.0,
      roughness: 0.0,
      envMapIntensity: 1.0
    });
    const textOverlayGeometry = new THREE.PlaneGeometry(1.8, 1.125); // Match card proportions
    const textOverlay = new THREE.Mesh(textOverlayGeometry, textOverlayMaterial);
    textOverlay.position.set(0, 0, 0.08); // Slightly above card surface
    cardGroup.add(textOverlay);
    
    scene.add(cardGroup);

    // Add a glass wall behind all components
    const glassWallGeometry = new THREE.PlaneGeometry(20, 20); // Large enough to cover the entire view
    const glassWallMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x88ccff, // Light blue tint
      transparent: true,
      opacity: 0.5, // More visible for testing
      metalness: 0.1, // Slight metallic quality
      roughness: 0.0,
      transmission: 0.8,
      thickness: 0.5,
      envMapIntensity: 1.0,
      clearcoat: 1.0, // Add clearcoat for extra shine
      clearcoatRoughness: 0.0
    });
    const glassWall = new THREE.Mesh(glassWallGeometry, glassWallMaterial);
    glassWall.position.set(0, 0, -5); // Behind the card
    glassWall.receiveShadow = true;
    scene.add(glassWall);

    // Mouse interaction with throttling
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = throttle((event: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      
      // Get mouse position relative to the canvas center
      const mouseScreenX = event.clientX - rect.left;
      const mouseScreenY = event.clientY - rect.top;
      
      // Calculate center of the canvas
      const canvasCenterX = rect.width / 2;
      const canvasCenterY = rect.height / 2;
      
      // Calculate mouse position relative to center
      const mouseXFromCenter = mouseScreenX - canvasCenterX;
      const mouseYFromCenter = mouseScreenY - canvasCenterY;
      
      // Normalize to -1 to 1 range and apply natural tilting
      // When mouse is on the right, card tilts right (positive Y rotation)
      // When mouse is on the left, card tilts left (negative Y rotation)
      // When mouse is on the top, card tilts up (positive X rotation)
      // When mouse is on the bottom, card tilts down (negative X rotation)
      targetRotationX = mouseYFromCenter / (rect.height / 2) * 0.3; // Natural tilt
      targetRotationY = mouseXFromCenter / (rect.width / 2) * 0.3;   // Natural tilt
    }, 16);

    const handleMouseLeave = () => {
      targetRotationX = 0;
      targetRotationY = 0;
    };

    mount.addEventListener('mousemove', handleMouseMove);
    mount.addEventListener('mouseleave', handleMouseLeave);

    // Optimized animation loop
    const animate = () => {
      // Apply target rotations with smooth interpolation
      cardGroup.rotation.x += (targetRotationX - cardGroup.rotation.x) * 0.1;
      cardGroup.rotation.y += (targetRotationY - cardGroup.rotation.y) * 0.1;
      
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Optimized resize handler for orthographic camera
    const handleResize = throttle(() => {
      if (!mount) return;
      const aspect = mount.clientWidth / mount.clientHeight;
      const frustumHeight = height;
      const frustumWidth = frustumHeight * aspect;
      camera.left = -frustumWidth / 2;
      camera.right = frustumWidth / 2;
      camera.top = frustumHeight / 2;
      camera.bottom = -frustumHeight / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    }, 100);

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      mount.removeEventListener('mousemove', handleMouseMove);
      mount.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      
      // Dispose of geometries and materials
      cardGeometry.dispose();
      cardMaterial.dispose();
      renderer.dispose();
      
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ 
        width: "100%", 
        height: "100%", 
        margin: "0",
        position: "relative"
      }}
      aria-label="Interactive 3D business card"
    />
  );
} 