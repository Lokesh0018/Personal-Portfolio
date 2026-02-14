// 3D Project Cards Implementation
let projectScene, projectCamera, projectRenderer, projectContainer;
let projectObjects = []; // Array to hold project card mesh objects
let projectGroup = null; // Group to hold all project cards
let raycaster = null;
let mouse = null; // Will be initialized when Three.js is available
let INTERSECTED = null;
let isProjectSceneReady = false;

// Animation parameters
let rotationSpeed = 0.001;
let hoverLift = 0.2; // How much cards lift on hover
let hoverRotation = 0.1; // How much cards rotate on hover
let normalScale = 1.0;
let hoverScale = 1.05;

// Project data structure - will be populated from existing script.js
let projectsData3D = [];

// Initialize the 3D project scene
function initProjectScene() {
    // Check if Three.js is available
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded for 3D project scene');
        return false;
    }

    // Get or create container
    projectContainer = document.getElementById('project-scene-container');
    if (!projectContainer) {
        // Create container if it doesn't exist
        projectContainer = document.createElement('div');
        projectContainer.id = 'project-scene-container';
        projectContainer.style.position = 'fixed';
        projectContainer.style.top = '0';
        projectContainer.style.left = '0';
        projectContainer.style.width = '100%';
        projectContainer.style.height = '100%';
        projectContainer.style.pointerEvents = 'none'; // Don't interfere with UI
        projectContainer.style.zIndex = '2'; // Above skill sphere but below UI
        document.body.appendChild(projectContainer);
    }

    // Create scene
    projectScene = new THREE.Scene();
    projectScene.background = new THREE.Color(0x000000); // Transparent background

    // Create camera
    projectCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    projectCamera.position.z = 8;

    // Create renderer
    projectRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    projectRenderer.setSize(window.innerWidth, window.innerHeight);
    projectRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit DPR for performance
    projectContainer.appendChild(projectRenderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    projectScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 2, 2);
    projectScene.add(directionalLight);

    // Initialize raycaster for mouse interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Create project group
    projectGroup = new THREE.Group();
    projectScene.add(projectGroup);

    // Load projects data from existing script
    loadProjectsData();

    // Create project objects (cards)
    createProjectObjects();

    // Set up mouse move event listener for hover detection
    document.addEventListener('mousemove', onMouseMove, false);

    // Set up click event listener for project cards
    document.addEventListener('mousedown', onMouseDown, false);

    // Start animation loop
    animateProjectScene();

    isProjectSceneReady = true;
    return true;
}

// Load projects data from existing script.js
function loadProjectsData() {
    // Extract featured projects for 3D display
    // We'll use the projectsData array from script.js
    if (typeof projectsData !== 'undefined') {
        projectsData3D = projectsData.filter(project => project.featured);
    } else {
        // Fallback data if projectsData is not available
        projectsData3D = [
            {
                id: "result-scale",
                title: "Result Scale",
                description: "Multi-tenant SaaS platform with role-based portals",
                techStack: ["React", "Node.js", "Express", "MongoDB"],
                image: "./assets/images/projects/ResultScale.png",
                githubLink: "#",
                caseStudy: { /* simplified */ }
            },
            {
                id: "ht-generator",
                title: "Hall Ticket Generator",
                description: "Automatically generate and manage hall tickets for university examinations",
                techStack: ["Spring Boot", "React", "MySQL"],
                image: "./assets/images/projects/HTG.png",
                githubLink: "https://github.com/Lokesh0018/HT-Generator",
                caseStudy: { /* simplified */ }
            }
        ];
    }
}

// Create project objects (3D cards)
function createProjectObjects() {
    // Clear existing objects
    if (projectGroup) {
        projectGroup.clear();
    }
    projectObjects = [];

    // Create a grid of project cards
    const cols = 3;
    const rows = Math.ceil(projectsData3D.length / cols);
    const spacing = 3.5; // Space between cards
    const startX = -(cols - 1) * spacing / 2;
    const startY = (rows - 1) * spacing / 2;

    projectsData3D.forEach((project, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;

        const x = startX + col * spacing;
        const y = startY - row * spacing;
        const z = 0;

        // Create project card (plane)
        const card = createProjectCard(project);
        card.position.set(x, y, z);
        card.rotation.y = Math.PI * 0.3; // Initial slight rotation for depth
        card.userData = {
            index: index,
            project: project,
            originalPosition: { x, y, z },
            originalRotation: { x: 0, y: card.rotation.y, z: 0 },
            isHovered: false,
            isFlipped: false,
            flipProgress: 0
        };

        projectGroup.add(card);
        projectObjects.push(card);
    });
}

// Create a 3D card for a project
function createProjectCard(project) {
    // Card dimensions
    const width = 2.0;
    const height = 2.5;
    const depth = 0.1;

    // Create card geometry (thin box)
    const geometry = new THREE.BoxGeometry(width, height, depth);

    // Create material - we'll use a texture for the front
    const textureLoader = new THREE.TextureLoader();

    // Front face (project thumbnail/screenshot)
    const frontMaterial = new THREE.MeshBasicMaterial({
        map: textureLoader.load(project.image, undefined, undefined, () => {
            console.log(`Loaded texture for ${project.title}`);
        }),
        transparent: false
    });

    // Back face (project details)
    const backMaterial = new THREE.MeshBasicMaterial({
        color: 0x1a1a1a,
        transparent: true,
        opacity: 0.9
    });

    // Side faces
    const sideMaterial = new THREE.MeshBasicMaterial({
        color: 0x333333
    });

    // Create multi-material
    const materials = [
        frontMaterial,  // right
        backMaterial,   // left
        sideMaterial,   // top
        sideMaterial,   // bottom
        sideMaterial,   // front
        sideMaterial    // back
    ];

    // Create the card mesh
    const card = new THREE.Mesh(geometry, materials);

    // Add hover effect data
    card.userData = card.userData || {};
    card.userData.hoverLift = hoverLift;
    card.userData.hoverRotation = hoverRotation;
    card.userData.normalScale = normalScale;
    card.userData.hoverScale = hoverScale;

    return card;
}

// Mouse move handler for hover detection
function onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Mouse down handler for click detection
function onMouseDown(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    checkIntersections(true); // true indicates click event
}

// Check for intersections and handle hover/click effects
function checkInteractions(isClick = false) {
    if (!raycaster || !projectCamera || !projectGroup) return;

    // Update the raycaster with camera and mouse position
    raycaster.setFromCamera(mouse, projectCamera);

    // Calculate objects intersecting the pick ray
    const intersects = raycaster.intersectObjects(projectGroup.children, true);

    if (intersects.length > 0) {
        const intersected = intersects[0].object;
        if (intersected.isMesh && intersected.userData) {
            // Handle hover state
            if (!isClick) {
                handleHover(intersected);
            } else {
                // Handle click - flip the card
                handleClick(intersected);
            }
        } else {
            // Reset if we intersect with non-mesh object
            resetHoverState();
        }
    } else {
        // No intersection - reset previous hovered object
        resetHoverState();
    }
}

// Handle hover effects
function handleHover(intersected) {
    if (INTERSECTED !== intersected) {
        // Reset previous hovered object
        if (INTERSECTED) {
            resetObjectHover(INTERSECTED);
        }

        // Set new hovered object
        INTERSECTED = intersected;
        applyObjectHover(INTERSECTED);
    }
}

// Handle click effects (flip card)
function handleClick(intersected) {
    const card = intersected;
    if (!card.userData.isFlipped) {
        flipCard(card, true);
    } else {
        flipCard(card, false);
    }
}

// Apply hover effects to an object
function applyObjectHover(object) {
    if (!object.userData.isHovered) {
        object.userData.isHovered = true;

        // Lift up and scale
        gsap.to(object.position, {
            y: object.userData.originalPosition.y + object.userData.hoverLift,
            duration: 0.5,
            ease: "power2.out"
        });

        // Rotate slightly based on mouse position
        const rotationX = (mouse.y > 0 ? -1 : 1) * object.userData.hoverRotation;
        const rotationY = (mouse.x > 0 ? -1 : 1) * object.userData.hoverRotation;

        gsap.to(object.rotation, {
            x: object.userData.originalRotation.x + rotationX,
            y: object.userData.originalRotation.y + rotationY,
            duration: 0.5,
            ease: "power2.out"
        });

        // Scale up
        gsap.to(object.scale, {
            x: object.userData.hoverScale,
            y: object.userData.hoverScale,
            z: object.userData.hoverScale,
            duration: 0.3,
            ease: "power2.out"
        });
    }
}

// Reset hover effects on an object
function resetObjectHover(object) {
    if (object.userData.isHovered) {
        object.userData.isHovered = false;

        // Return to original position and scale
        gsap.to(object.position, {
            y: object.userData.originalPosition.y,
            duration: 0.5,
            ease: "power2.out"
        });

        // Return to original rotation
        gsap.to(object.rotation, {
            x: object.userData.originalRotation.x,
            y: object.userData.originalRotation.y,
            duration: 0.5,
            ease: "power2.out"
        });

        // Return to normal scale
        gsap.to(object.scale, {
            x: object.userData.normalScale,
            y: object.userData.normalScale,
            z: object.userData.normalScale,
            duration: 0.3,
            ease: "power2.out"
        });
    }
}

// Reset all hover states
function resetHoverState() {
    if (INTERSECTED) {
        resetObjectHover(INTERSECTED);
        INTERSECTED = null;
    }
}

// Flip a card to show front or back
function flipCard(card, showFront) {
    if (card.userData.isFlipped === showFront) return;

    card.userData.isFlipped = showFront;

    // Animate flip (rotation around Y axis)
    const targetRotationY = showFront ? Math.PI * 0.3 : Math.PI * 0.3 + Math.PI;

    gsap.to(card.rotation, {
        y: targetRotationY,
        duration: 0.8,
        ease: "power2.inOut",
        onUpdate: function() {
            // During flip, we might want to adjust materials or visibility
            // For simplicity, we'll just rotate
        }
    });

    // Optional: Add a slight lift during flip
    gsap.to(card.position, {
        y: card.userData.originalPosition.y + 0.3,
        duration: 0.4,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
    });
}

// Check for intersections (called in animation loop)
function checkIntersections() {
    checkInteractions(false); // false indicates hover check
}

// Animation loop for project scene
function animateProjectScene() {
    if (!projectGroup || !projectRenderer || !projectCamera) {
        requestAnimationFrame(animateProjectScene);
        return;
    }

    // Rotate the entire project group slowly
    if (projectGroup) {
        projectGroup.rotation.y += rotationSpeed;
    }

    // Check for mouse interactions
    checkIntersections();

    // Render
    projectRenderer.render(projectScene, projectCamera);

    // Request next frame
    requestAnimationFrame(animateProjectScene);
}

// Handle window resize
function onWindowResize() {
    projectCamera.aspect = window.innerWidth / window.innerHeight;
    projectCamera.updateProjectionMatrix();
    projectRenderer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize project scene after a short delay to ensure dependencies are loaded
    setTimeout(initProjectScene, 300);
});

// Expose API for debugging and control
window.projectSceneAPI = {
    init: initProjectScene,
    isReady: function() { return isProjectSceneReady; },
    getProjectCount: function() { return projectsData3D.length; },
    setRotationSpeed: function(speed) { rotationSpeed = speed; },
    togglePause: function() {
        // In a real implementation, we would pause the animation
        console.log('Project scene animation control not fully implemented');
    }
};

// Handle window resize
window.addEventListener('resize', onWindowResize, false);