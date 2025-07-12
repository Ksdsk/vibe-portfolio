"use client";
import { useRef, useEffect } from "react";
import * as THREE from "three";

// Throttle function for mouse event handlers
function throttleMouse(func: (event: MouseEvent) => void, limit: number): (event: MouseEvent) => void {
  let inThrottle = false;
  return function(event: MouseEvent) {
    if (!inThrottle) {
      func(event);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
}

export default function ThreeCanvas({ cardYOffset = 0, cardZRotation = 0 }: { cardYOffset?: number, cardZRotation?: number }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const cardYOffsetRef = useRef(cardYOffset);
  const cardZRotationRef = useRef(cardZRotation);

  // Keep the ref updated with the latest prop value
  useEffect(() => {
    cardYOffsetRef.current = cardYOffset;
    cardZRotationRef.current = cardZRotation;
  }, [cardYOffset, cardZRotation]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup
    const scene = new THREE.Scene();
    const width = 4;
    const height = 2.5;
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
    renderer.setClearColor(0x18191c, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // Business card geometry (flat rectangle with rounded corners)
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
    card.position.z = 0.05; // Move card slightly forward

    // Lighting setup (no unused variables)
    const spotLight = new THREE.SpotLight(0xffffff, 2.2);
    spotLight.position.set(0, 0, 5);
    spotLight.target.position.set(0, 0, 0);
    spotLight.angle = Math.PI / 2;
    spotLight.penumbra = 0.4;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    scene.add(spotLight);
    scene.add(spotLight.target);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(2, 1, 2);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // Card group
    const cardGroup = new THREE.Group();
    cardGroup.add(card);

    // Text overlay
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
    const textOverlayGeometry = new THREE.PlaneGeometry(1.8, 1.125);
    const textOverlay = new THREE.Mesh(textOverlayGeometry, textOverlayMaterial);
    textOverlay.position.set(0, 0, 0.08);
    cardGroup.add(textOverlay);
    scene.add(cardGroup);

    // Aurora/light streaks background effect - Refined version
    const auroraColors = [
      0x60a5fa, 0xa78bfa, 0xf472b6, 0x34d399, 0xfbbf24, 0xec4899
    ];
    const auroraPlanes: THREE.Mesh[] = [];
    const particles: THREE.Mesh[] = [];
    const auroraCount = 6;
    
    for (let i = 0; i < auroraCount; i++) {
      // Create more organic, varied shapes
      const width = 2.5 + Math.random() * 2; // Varied widths
      const height = 0.4 + Math.random() * 0.8; // Varied heights
      
      // Create curved geometry for more organic look
      const curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(-width/2, -height/2, 0),
        new THREE.Vector3(-width/4, height/2, 0),
        new THREE.Vector3(width/4, -height/2, 0),
        new THREE.Vector3(width/2, height/2, 0)
      );
      
      // Create tube geometry for more organic aurora shapes
      const tubeGeometry = new THREE.TubeGeometry(curve, 20, 0.1, 8, false);
      
      const mat = new THREE.MeshBasicMaterial({
        color: auroraColors[i % auroraColors.length],
        transparent: true,
        opacity: 0.15 + Math.random() * 0.1, // Varied opacity
        depthWrite: false,
        blending: THREE.AdditiveBlending // Additive blending for glow effect
      });
      
      const mesh = new THREE.Mesh(tubeGeometry, mat);
      
      // More varied positioning
      mesh.position.set(
        -1.5 + i * 0.6 + Math.random() * 0.4, // Varied X positions
        0.8 - i * 0.3 + Math.random() * 0.6,  // Varied Y positions
        -2.5 - i * 0.3 - Math.random() * 0.5   // Varied Z positions
      );
      
      // More varied rotations
      mesh.rotation.z = Math.PI / 6 * (i - auroraCount/2) + Math.random() * 0.5;
      mesh.rotation.x = Math.random() * 0.3;
      mesh.rotation.y = Math.random() * 0.3;
      
      scene.add(mesh);
      auroraPlanes.push(mesh);
    }

    // Add additional floating light particles for enhanced effect
    const particleCount = 12;
    
    for (let i = 0; i < particleCount; i++) {
      // Use CircleGeometry for smooth 2D circular particles
      const particleRadius = 0.02 + Math.random() * 0.03;
      const particleGeometry = new THREE.CircleGeometry(particleRadius, 32); // 32 segments for smooth circle
      const particleMaterial = new THREE.MeshBasicMaterial({
        color: auroraColors[Math.floor(Math.random() * auroraColors.length)],
        transparent: true,
        opacity: 0.3 + Math.random() * 0.4,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide // Render both sides for better visibility
      });
      
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      particle.position.set(
        -2 + Math.random() * 4,
        -1 + Math.random() * 2,
        -3 - Math.random() * 2
      );
      
      scene.add(particle);
      particles.push(particle);
    }

    // Mouse interaction with throttling
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = throttleMouse((event: MouseEvent) => {
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
    function animateAurora() {
      const t = performance.now() * 0.0003;
      
      // Animate aurora tubes with more complex movement
      auroraPlanes.forEach((mesh: THREE.Mesh, i: number) => {
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.opacity = 0.12 + 0.1 * Math.sin(t + i * 1.5);
        
        // More complex movement patterns
        mesh.position.x = -1.5 + i * 0.6 + Math.sin(t + i * 0.8) * 0.4;
        mesh.position.y = 0.8 - i * 0.3 + Math.cos(t + i * 1.2) * 0.3;
        mesh.position.z = -2.5 - i * 0.3 + Math.sin(t + i * 0.5) * 0.2;
        
        // Rotate auroras for more dynamic effect
        mesh.rotation.z = Math.PI / 6 * (i - auroraCount/2) + Math.sin(t + i * 1.8) * 0.1;
        mesh.rotation.x = Math.sin(t + i * 0.7) * 0.05;
        mesh.rotation.y = Math.cos(t + i * 0.9) * 0.05;
        
        // Subtle scale animation
        const scale = 1 + 0.1 * Math.sin(t + i * 2.1);
        mesh.scale.set(scale, scale, scale);
      });
      
      // Animate floating particles
      particles.forEach((particle: THREE.Mesh, i: number) => {
        const material = particle.material as THREE.MeshBasicMaterial;
        material.opacity = 0.2 + 0.3 * Math.sin(t + i * 0.6);
        
        // Floating particle movement
        particle.position.x = -2 + Math.sin(t + i * 0.4) * 2;
        particle.position.y = -1 + Math.cos(t + i * 0.7) * 1.5;
        particle.position.z = -3 + Math.sin(t + i * 0.3) * 1;
        
        // Pulse scale for breathing effect
        const pulseScale = 1 + 0.3 * Math.sin(t + i * 1.3);
        particle.scale.set(pulseScale, pulseScale, pulseScale);
      });
      
      // Card animation
      cardGroup.rotation.x += (targetRotationX - cardGroup.rotation.x) * 0.1;
      cardGroup.rotation.y += (targetRotationY - cardGroup.rotation.y) * 0.1;
      cardGroup.position.y += (cardYOffsetRef.current - cardGroup.position.y) * 0.04;
      cardGroup.rotation.z += (cardZRotationRef.current - cardGroup.rotation.z) * 0.04;
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animateAurora);
    }
    animateAurora();

    // Set base card size
    const BASE_CARD_HEIGHT = 2.5;

    function resizeScene() {
      if (!mount) return;
      const aspect = mount.clientWidth / mount.clientHeight;
      const frustumHeight = BASE_CARD_HEIGHT;
      const frustumWidth = frustumHeight * aspect;
      camera.left = -frustumWidth / 2;
      camera.right = frustumWidth / 2;
      camera.top = frustumHeight / 2;
      camera.bottom = -frustumHeight / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);

      // Responsive scaling factor
      const scale = Math.min(mount.clientWidth / 900, mount.clientHeight / 600, 1);

      // Responsive card scaling
      if (cardGroup) {
        cardGroup.scale.set(scale, scale, 1);
      }
      // Responsive aurora scaling
      auroraPlanes.forEach((mesh: THREE.Mesh) => {
        mesh.scale.set(scale * 1.1, scale * 1.1, 1);
      });
      
      // Responsive particle scaling
      particles.forEach((particle: THREE.Mesh) => {
        particle.scale.set(scale * 1.2, scale * 1.2, scale * 1.2);
      });
    }

    window.addEventListener('resize', resizeScene);
    resizeScene();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      mount.removeEventListener('mousemove', handleMouseMove);
      mount.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resizeScene);
      
      // Dispose of geometries and materials
      cardGeometry.dispose();
      cardMaterial.dispose();
      
      // Dispose of aurora geometries and materials
      auroraPlanes.forEach((mesh: THREE.Mesh) => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });
      
      // Dispose of particle geometries and materials
      particles.forEach((particle: THREE.Mesh) => {
        particle.geometry.dispose();
        (particle.material as THREE.Material).dispose();
      });
      
      renderer.dispose();
      
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [cardYOffset, cardZRotation]); // Fix useEffect dependency

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