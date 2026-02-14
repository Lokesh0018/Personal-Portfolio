global.THREE = require('three');
// 3D Skill Sphere Implementation
let skillScene, skillCamera, skillRenderer, skillContainer;
let skillObjects = []; // Array to hold skill mesh objects
let skillGroup = null; // Group to hold all skills
let raycaster = null;
let mouse = null;
let INTERSECTED = null;
let isSkillSphereReady = false;

// Animation parameters
let rotationSpeed = 0.002;
let hoverScale = 1.2;
let normalScale = 1.0;

// Skill data structure - will be populated from existing skills
let skillsData = [];

// Initialize the skill sphere
function initSkillSphere() {
    // Check if Three.js is available
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded for skill sphere');
        return false;
    }

    // Get or create container
    skillContainer = document.getElementById('skill-sphere-container');
    if (!skillContainer) {
        // Create container if it doesn't exist
        skillContainer = document.createElement('div');
        skillContainer.id = 'skill-sphere-container';
        skillContainer.style.position = 'fixed';
        skillContainer.style.top = '0';
        skillContainer.style.left = '0';
        skillContainer.style.width = '100%';
        skillContainer.style.height = '100%';
        skillContainer.style.pointerEvents = 'none'; // Don't interfere with UI
        skillContainer.style.zIndex = '1';
        document.body.appendChild(skillContainer);
    }

    // Create scene
    skillScene = new THREE.Scene();
    skillScene.background = new THREE.Color(0x000000); // Transparent background

    // Create camera
    skillCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    skillCamera.position.z = 5;

    // Create renderer
    skillRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    skillRenderer.setSize(window.innerWidth, window.innerHeight);
    skillRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit DPR for performance
    skillContainer.appendChild(skillRenderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    skillScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    skillScene.add(directionalLight);

    // Initialize raycaster for mouse interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Create skill group
    skillGroup = new THREE.Group();
    skillScene.add(skillGroup);

    // Load skills data from existing script
    loadSkillsData();

    // Create skill objects in sphere distribution
    createSkillObjects();

    // Set up mouse move event listener for hover detection
    document.addEventListener('mousemove', onMouseMove, false);

    // Start animation loop
    animateSkillSphere();

    isSkillSphereReady = true;
    return true;
}

// Load skills data from existing script.js
function loadSkillsData() {
    // Extract skills from the existing skills data in script.js
    // We'll use the skills from the skills-tags section
    skillsData = [
        { name: "Java", proficiency: 90, color: 0xff8c00 },
        { name: "JavaScript", proficiency: 85, color: 0xf0db4f },
        { name: "TypeScript", proficiency: 85, color: 0x2b7489 },
        { name: "React.js", proficiency: 90, color: 0x61dafb },
        { name: "HTML5", proficiency: 85, color: 0xe34c26 },
        { name: "CSS3", proficiency: 85, color: 0x1572b6 },
        { name: "Spring Boot", proficiency: 85, color: 0x6db33f },
        { name: "Express.js", proficiency: 80, color: 0x000000 },
        { name: "REST APIs", proficiency: 80, color: 0x007acc },
        { name: "MySQL", proficiency: 85, color: 0x4479a1 },
        { name: "PostgreSQL", proficiency: 80, color: 0x336791 },
        { name: "MongoDB", proficiency: 75, color: 0x47a248 },
        { name: "Git & GitHub", proficiency: 90, color: 0xf05032 },
        { name: "VS Code", proficiency: 85, color: 0x007acc },
        { name: "Data Structures & Algorithms", proficiency: 90, color: 0xff6b6b },
        { name: "OOP", proficiency: 85, color: 0x4ecdc4 },
        { name: "System Design", proficiency: 80, color: 0x45b7d1 },
        { name: "Team Collaboration", proficiency: 85, color: 0x96ceb4 },
        { name: "Problem Solving", proficiency: 80, color: 0xffeead }
    ];
}

// Create skill objects distributed in a sphere
function createSkillObjects() {
    // Clear existing objects
    if (skillGroup) {
        skillGroup.clear();
    }
    skillObjects = [];

    // Create a sphere of points using Fibonacci spiral for even distribution
    const particleCount = skillsData.length;
    const radius = 2.5;

    for (let i = 0; i < particleCount; i++) {
        // Fibonacci sphere algorithm for even distribution
        const phi = Math.acos(-1 + (2 * i) / particleCount);
        const theta = Math.sqrt(particleCount * Math.PI) * phi;

        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);

        // Create skill sprite (using a sprite for text representation)
        const sprite = createSkillSprite(skillsData[i].name, skillsData[i].proficiency, skillsData[i].color);
        sprite.position.set(x, y, z);
        sprite.scale.set(normalScale, normalScale, normalScale);
        sprite.userData = {
            index: i,
            name: skillsData[i].name,
            proficiency: skillsData[i].proficiency,
            originalScale: normalScale,
            hoverScale: hoverScale,
            isHovered: false
        };

        skillGroup.add(sprite);
        skillObjects.push(sprite);
    }
}

// Create a sprite for displaying skill text
function createSkillSprite(name, proficiency, color) {
    // Create canvas for text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;

    // Background
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Text
    context.font = 'bold 24px Arial';
    context.textAlign = 'center';
    context.fillStyle = '#ffffff';
    context.fillText(`${name} (${proficiency}%)`, canvas.width / 2, canvas.height / 2 + 8);

    // Create texture
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    // Create sprite material
    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: true
    });

    // Create sprite
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(0.5, 0.125, 1); // Adjust aspect ratio

    return sprite;
}

// Mouse move handler for hover detection
function onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Check for intersections and handle hover effects
function checkIntersections() {
    if (!raycaster || !skillCamera || !skillGroup) return;

    // Update the raycaster with camera and mouse position
    raycaster.setFromCamera(mouse, skillCamera);

    // Calculate objects intersecting the pick ray
    const intersects = raycaster.intersectObjects(skillGroup.children, true);

    if (intersects.length > 0) {
        const intersected = intersects[0].object;
        if (intersected.isSprite && intersected.userData) {
            // Handle hover state
            if (INTERSECTED !== intersected) {
                // Prevent multiple notifications
                if (INTERSECTED) {
                    // Reset previous hovered object
                    INTERSECTED.scale.set(
                        INTERSECTED.userData.originalScale,
                        INTERSECTED.userData.originalScale,
                        INTERSECTED.userData.originalScale
                    );
                    INTERSECTED.userData.isHovered = false;
                }

                // Set new hovered object
                INTERSECTED = intersected;
                INTERSECTED.scale.set(
                    INTERSECTED.userData.hoverScale,
                    INTERSECTED.userData.hoverScale,
                    INTERSECTED.userData.hoverScale
                );
                INTERSECTED.userData.isHovered = true;

                // Optional: Show tooltip or update UI
                showSkillTooltip(INTERSECTED.userData.name, INTERSECTED.userData.proficiency);
            }
        } else {
            // Reset if we intersect with non-sprite object
            if (INTERSECTED) {
                INTERSECTED.scale.set(
                    INTERSECTED.userData.originalScale,
                    INTERSECTED.userData.originalScale,
                    INTERSECTED.userData.originalScale
                );
                INTERSECTED.userData.isHovered = false;
                INTERSECTED = null;
                hideSkillTooltip();
            }
        }
    } else {
        // No intersection - reset previous hovered object
        if (INTERSECTED) {
            INTERSECTED.scale.set(
                INTERSECTED.userData.originalScale,
                INTERSECTED.userData.originalScale,
                INTERSECTED.userData.originalScale
            );
            INTERSECTED.userData.isHovered = false;
            INTERSECTED = null;
            hideSkillTooltip();
        }
    }
}

// Show skill tooltip (simple implementation)
function showSkillTooltip(name, proficiency) {
    // Remove existing tooltip if any
    hideSkillTooltip();

    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'skill-tooltip';
    tooltip.innerHTML = `<strong>${name}</strong><br>${proficiency}%`;
    tooltip.style.position = 'fixed';
    tooltip.style.background = 'rgba(0, 0, 0, 0.8)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '8px 12px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '14px';
    tooltip.style.zIndex = '1000';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.top = (mouse.y * window.innerHeight / 2 + window.innerHeight / 2 + 20) + 'px';
    tooltip.style.left = (mouse.x * window.innerWidth / 2 + window.innerWidth / 2 + 20) + 'px';

    document.body.appendChild(tooltip);
}

// Hide skill tooltip
function hideSkillTooltip() {
    const existingTooltip = document.querySelector('.skill-tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }
}

// Animation loop for skill sphere
function animateSkillSphere() {
    if (!skillGroup || !skillRenderer || !skillCamera) {
        requestAnimationFrame(animateSkillSphere);
        return;
    }

    // Rotate the entire skill group
    if (skillGroup) {
        skillGroup.rotation.y += rotationSpeed;
        // Slow pulsing rotation on x and z for subtle movement
        skillGroup.rotation.x += rotationSpeed * 0.5;
        skillGroup.rotation.z += rotationSpeed * 0.3;
    }

    // Check for mouse interactions
    checkIntersections();

    // Render
    skillRenderer.render(skillScene, skillCamera);

    // Request next frame
    requestAnimationFrame(animateSkillSphere);
}

// Handle window resize
function onWindowResize() {
    skillCamera.aspect = window.innerWidth / window.innerHeight;
    skillCamera.updateProjectionMatrix();
    skillRenderer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize skill sphere after a short delay to ensure dependencies are loaded
    setTimeout(initSkillSphere, 200);
});

// Expose API for debugging and control
window.skillSphereAPI = {
    init: initSkillSphere,
    isReady: function() { return isSkillSphereReady; },
    getSkillCount: function() { return skillsData.length; },
    setRotationSpeed: function(speed) { rotationSpeed = speed; },
    togglePause: function() {
        // In a real implementation, we would pause the animation
        console.log('Skill sphere animation control not fully implemented');
    }
};

// Handle window resize
window.addEventListener('resize', onWindowResize, false);