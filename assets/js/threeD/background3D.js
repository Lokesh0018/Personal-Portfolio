// 3D Background Particles Implementation
let particleScene, particleCamera, particleRenderer, particleContainer;
let particleCount = 80; // Number of particles
let mouse = null;
let clock = null;
let isParticleSystemReady = false;

// Particle parameters
let particleSize = 0.1;
let particleSpeed = 0.01;
let particleColor = 0xffd700; // Gold color to match site accents
let mouseInfluenceRadius = 3.0;
let mouseInfluenceStrength = 0.05;

// Initialize the particle system
function initParticleSystem() {
    // Check if Three.js is available
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded for particle system');
        return false;
    }

    // Get or create container
    particleContainer = document.getElementById('particle-system-container');
    if (!particleContainer) {
        // Create container if it doesn't exist
        particleContainer = document.createElement('div');
        particleContainer.id = 'particle-system-container';
        particleContainer.style.position = 'fixed';
        particleContainer.style.top = '0';
        particleContainer.style.left = '0';
        particleContainer.style.width = '100%';
        particleContainer.style.height = '100%';
        particleContainer.style.pointerEvents = 'none'; // Don't interfere with UI
        particleContainer.style.zIndex = '-5'; // Behind everything
        document.body.appendChild(particleContainer);
    }

    // Create scene
    particleScene = new THREE.Scene();
    particleScene.background = new THREE.Color(0x000000); // Transparent background

    // Create camera
    particleCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    particleCamera.position.z = 5;

    // Create renderer
    particleRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    particleRenderer.setSize(window.innerWidth, window.innerHeight);
    particleRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit DPR for performance
    particleContainer.appendChild(particleRenderer.domElement);

    // Initialize clock for animation
    clock = new THREE.Clock();

    // Initialize mouse for interaction
    mouse = new THREE.Vector2();

    // Create particles
    createParticles();

    // Set up mouse move event listener for interaction
    document.addEventListener('mousemove', onMouseMove, false);

    // Start animation loop
    animateParticleSystem();

    isParticleSystemReady = true;
    return true;
}

// Create particle objects
function createParticles() {
    // Create a geometry for all particles (using BufferGeometry for better performance)
    const positions = new Float32Array(particleCount * 3); // x, y, z for each particle
    const colors = new Float32Array(particleCount * 3); // r, g, b for each particle
    const sizes = new Float32Array(particleCount); // size for each particle
    const speeds = new Float32Array(particleCount); // speed for each particle
    const phases = new Float32Array(particleCount); // phase for floating animation

    const color = new THREE.Color(particleColor);

    for (let i = 0; i < particleCount; i++) {
        // Position particles randomly in a sphere
        const radius = 3 + Math.random() * 2; // Between 3-5 units from center
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = 2 * Math.PI * Math.random();

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        // Color (all same for now, could be varied)
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        // Size (small variation)
        sizes[i] = particleSize + (Math.random() - 0.5) * 0.05;

        // Speed (random)
        speeds[i] = particleSpeed * (0.5 + Math.random());

        // Phase for floating animation
        phases[i] = Math.random() * Math.PI * 2;
    }

    // Create buffer geometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    geometry.setAttribute('speed', new THREE.Float32BufferAttribute(speeds, 1));
    geometry.setAttribute('phase', new THREE.Float32BufferAttribute(phases, 1));

    // Create material
    const material = new THREE.ShaderMaterial({
        vertexShader: `
            attribute float size;
            attribute float speed;
            attribute float phase;

            varying vec3 vColor;
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

                // Add floating motion
                float time = position.x * 10.0 + phase;
                mvPosition.y += sin(time * 0.5) * 0.01 * speed;
                mvPosition.x += cos(time * 0.3) * 0.01 * speed;

                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            void main() {
                float dist = distance(gl_PointCoord, vec2(0.5));
                if (dist > 0.5) discard;
                gl_FragColor = vec4(vColor, smoothstep(0.5, 0.0, dist));
            }
        `,
        transparent: true,
        vertexColors: true
    });

    // Create points object
    const points = new THREE.Points(geometry, material);
    particleScene.add(points);
}

// Mouse move handler for particle interaction
function onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Update particle positions based on mouse and time
function updateParticles(deltaTime) {
    const points = particleScene.children.find(child => child.type === 'Points');
    if (!points) return;

    const geometry = points.geometry;
    const positions = geometry.attributes.position.array;
    const sizes = geometry.attributes.size.array;
    const speeds = geometry.attributes.speed.array;
    const phases = geometry.attributes.phase.array;

    // Update each particle
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Get mouse influence
        let mouseInfluenceX = 0;
        let mouseInfluenceY = 0;
        let mouseInfluenceZ = 0;

        // Calculate distance from mouse (normalized to 3D space)
        const mouseVector = new THREE.Vector3(
            mouse.x * 3,
            mouse.y * 3,
            0
        );

        const particlePos = new THREE.Vector3(
            positions[i3],
            positions[i3 + 1],
            positions[i3 + 2]
        );

        const distanceToMouse = particlePos.distanceTo(mouseVector);

        if (distanceToMouse < mouseInfluenceRadius) {
            // Calculate repulsion force
            const force = (mouseInfluenceRadius - distanceToMouse) / mouseInfluenceRadius;
            const diffX = particlePos.x - mouseVector.x;
            const diffY = particlePos.y - mouseVector.y;
            const diffZ = particlePos.z - mouseVector.z;

            if (distanceToMouse > 0) {
                mouseInfluenceX += (diffX / distanceToMouse) * force * mouseInfluenceStrength;
                mouseInfluenceY += (diffY / distanceToMouse) * force * mouseInfluenceStrength;
                mouseInfluenceZ += (diffZ / distanceToMouse) * force * mouseInfluenceStrength;
            }
        }

        // Apply movement
        positions[i3] += (mouseInfluenceX + (Math.random() - 0.5) * 0.005) * speeds[i] * deltaTime * 60;
        positions[i3 + 1] += (mouseInfluenceY + (Math.random() - 0.5) * 0.005) * speeds[i] * deltaTime * 60;
        positions[i3 + 2] += (mouseInfluenceZ + (Math.random() - 0.5) * 0.005) * speeds[i] * deltaTime * 60;

        // Keep particles within bounds
        const radius = Math.sqrt(
            positions[i3] * positions[i3] +
            positions[i3 + 1] * positions[i3 + 1] +
            positions[i3 + 2] * positions[i3 + 2]
        );

        if (radius > 6) {
            // Reset position to surface of sphere
            const normalizedX = positions[i3] / radius;
            const normalizedY = positions[i3 + 1] / radius;
            const normalizedZ = positions[i3 + 2] / radius;

            positions[i3] = normalizedX * 6;
            positions[i3 + 1] = normalizedY * 6;
            positions[i3 + 2] = normalizedZ * 6;
        }
    }

    // Mark geometry as needing update
    geometry.attributes.position.needsUpdate = true;
}

// Animation loop for particle system
function animateParticleSystem() {
    const delta = clock.getDelta();

    // Update particles
    updateParticles(delta);

    // Render
    particleRenderer.render(particleScene, particleCamera);

    // Request next frame
    requestAnimationFrame(animateParticleSystem);
}

// Handle window resize
function onWindowResize() {
    particleCamera.aspect = window.innerWidth / window.innerHeight;
    particleCamera.updateProjectionMatrix();
    particleRenderer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particle system after a short delay to ensure dependencies are loaded
    setTimeout(initParticleSystem, 400);
});

// Expose API for debugging and control
window.particleSystemAPI = {
    init: initParticleSystem,
    isReady: function() { return isParticleSystemReady; },
    setParticleCount: function(count) {
        particleCount = count;
        // Would need to recreate particles in a real implementation
    },
    setParticleSpeed: function(speed) { particleSpeed = speed; }
};

// Handle window resize
window.addEventListener('resize', onWindowResize, false);