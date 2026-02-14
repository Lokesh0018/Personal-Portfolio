// 3D Navigation Enhancement
let navScene, navCamera, navRenderer, navContainer;
let navObjects = []; // Array to hold nav item meshes
let navGroup = null; // Group to hold all nav items
let raycaster = null;
let mouse = null; // Will be initialized when Three.js is available
let INTERSECTED = null;
let isNavSceneReady = false;

// Animation parameters
let rotationSpeed = 0.0005;
let hoverExtrusion = 0.2; // How much nav items extrude on hover
let normalScale = 1.0;
let hoverScale = 1.1;

// Navigation items data - will be populated from actual navbar
let navItemsData = [];

// Initialize the 3D navigation scene
function initNavScene() {
    // Check if Three.js is available
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded for 3D navigation scene');
        return false;
    }

    // Get or create container
    navContainer = document.getElementById('nav-scene-container');
    if (!navContainer) {
        // Create container if it doesn't exist
        navContainer = document.createElement('div');
        navContainer.id = 'nav-scene-container';
        navContainer.style.position = 'fixed';
        navContainer.style.top = '0';
        navContainer.style.left = '0';
        navContainer.style.width = '100%';
        navContainer.style.height = '100%';
        navContainer.style.pointerEvents = 'none'; // Don't interfere with UI
        navContainer.style.zIndex = '3'; // Above everything else
        document.body.appendChild(navContainer);
    }

    // Create scene
    navScene = new THREE.Scene();
    navScene.background = new THREE.Color(0x000000); // Transparent background

    // Create camera
    navCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    navCamera.position.z = 5;

    // Create renderer
    navRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    navRenderer.setSize(window.innerWidth, window.innerHeight);
    navRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit DPR for performance
    navContainer.appendChild(navRenderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    navScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    navScene.add(directionalLight);

    // Initialize raycaster for mouse interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Create nav group
    navGroup = new THREE.Group();
    navScene.add(navGroup);

    // Load navigation items from the actual navbar
    loadNavItemsData();

    // Create nav objects (3D text or shapes)
    createNavObjects();

    // Set up mouse move event listener for hover detection
    document.addEventListener('mousemove', onMouseMove, false);

    // Set up click event listener for nav items
    document.addEventListener('mousedown', onMouseDown, false);

    // Start animation loop
    animateNavScene();

    isNavSceneReady = true;
    return true;
}

// Load navigation items from the actual navbar
function loadNavItemsData() {
    // Find the navbar links
    const navLinks = document.querySelectorAll('[data-nav-link]');
    navItemsData = [];

    navLinks.forEach((link, index) => {
        const text = link.textContent.trim();
        const href = link.getAttribute('href') || '#';
        const isActive = link.classList.contains('active');

        navItemsData.push({
            id: `nav-item-${index}`,
            text: text,
            href: href,
            isActive: isActive,
            originalElement: link
        });
    });

    // If no nav links found, use fallback data
    if (navItemsData.length === 0) {
        navItemsData = [
            { id: 'nav-home', text: 'Home', href: '#', isActive: true },
            { id: 'nav-about', text: 'About', href: '#about', isActive: false },
            { id: 'nav-resume', text: 'Resume', href: '#resume', isActive: false },
            { id: 'nav-projects', text: 'Projects', href: '#projects', isActive: false },
            { id: 'nav-contact', text: 'Contact', href: '#contact', isActive: false }
        ];
    }
}

// Create nav objects (3D text or simple boxes for now)
function createNavObjects() {
    // Clear existing objects
    if (navGroup) {
        navGroup.clear();
    }
    navObjects = [];

    // Create a group for each nav item
    const spacing = 1.5; // Space between nav items
    const startX = -(navItemsData.length - 1) * spacing / 2;

    navItemsData.forEach((item, index) => {
        const x = startX + index * spacing;
        const y = 2; // Fixed Y position (above the content)
        const z = 0;

        // Create a simple box for now (we can replace with text later)
        const navItem = createNavItemBox(item.text, item.isActive);
        navItem.position.set(x, y, z);
        navItem.userData = {
            index: index,
            item: item,
            originalPosition: { x, y, z },
            originalRotation: { x: 0, y: 0, z: 0 },
            isHovered: false,
            isActive: item.isActive,
            extrusion: item.isActive ? hoverExtrusion : 0
        };

        navGroup.add(navItem);
        navObjects.push(navItem);
    });
}

// Create a nav item box (simple representation)
function createNavItemBox(text, isActive) {
    // Dimensions
    const width = 1.0;
    const height = 0.3;
    const depth = 0.1;

    // Create geometry
    const geometry = new THREE.BoxGeometry(width, height, depth);

    // Create material
    const color = isActive ? 0xffd700 : 0xcccccc; // Gold for active, light gray for inactive
    const material = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.2,
        roughness: 0.8
    });

    // Create mesh
    const mesh = new THREE.Mesh(geometry, material);

    // Store original scale for hover effect
    mesh.userData = mesh.userData || {};
    mesh.userData.originalScale = mesh.scale.clone();
    mesh.userData.hoverScale = new THREE.Vector3(1.1, 1.1, 1.1);

    return mesh;
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

    checkInteractions(true); // true indicates click event
}

// Check for intersections and handle hover/click effects
function checkInteractions(isClick = false) {
    if (!raycaster || !navCamera || !navGroup) return;

    // Update the raycaster with camera and mouse position
    raycaster.setFromCamera(mouse, navCamera);

    // Calculate objects intersecting the pick ray
    const intersects = raycaster.intersectObjects(navGroup.children, true);

    if (intersects.length > 0) {
        const intersected = intersects[0].object;
        if (intersected.isMesh && intersected.userData) {
            // Handle hover state
            if (!isClick) {
                handleHover(intersected);
            } else {
                // Handle click - activate the nav item
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

// Handle click effects (activate nav item)
function handleClick(intersected) {
    const navItem = intersected;
    const itemIndex = navItem.userData.index;
    const itemData = navItemsData[itemIndex];

    // Update active state in data
    navItemsData.forEach(item => item.isActive = false);
    itemData.isActive = true;

    // Update visual state
    updateNavItemActiveState();

    // Trigger click on the original element if it exists
    if (itemData.originalElement) {
        itemData.originalElement.click();
    }
}

// Apply hover effects to an object
function applyObjectHover(object) {
    if (!object.userData.isHovered) {
        object.userData.isHovered = true;

        // Increase scale
        gsap.to(object.scale, {
            x: object.userData.hoverScale.x,
            y: object.userData.hoverScale.y,
            z: object.userData.hoverScale.z,
            duration: 0.3,
            ease: "power2.out"
        });

        // Change color slightly (brighten)
        const currentColor = object.material.color.getHex();
        const targetColor = 0xffffff; // White for hover
        gsap.to(object.material.color, {
            r: (targetColor >> 16 & 0xFF) / 255,
            g: (targetColor >> 8 & 0xFF) / 255,
            b: (targetColor & 0xFF) / 255,
            duration: 0.3,
            ease: "power2.out"
        });
    }
}

// Reset hover effects on an object
function resetObjectHover(object) {
    if (object.userData.isHovered) {
        object.userData.isHovered = false;

        // Return to original scale
        gsap.to(object.scale, {
            x: object.userData.originalScale.x,
            y: object.userData.originalScale.y,
            z: object.userData.originalScale.z,
            duration: 0.3,
            ease: "power2.out"
        });

        // Return to original color based on active state
        const isActive = object.userData.item.isActive;
        const targetColor = isActive ? 0xffd700 : 0xcccccc;
        gsap.to(object.material.color, {
            r: (targetColor >> 16 & 0xFF) / 255,
            g: (targetColor >> 8 & 0xFF) / 255,
            b: (targetColor & 0xFF) / 255,
            duration: 0.3,
            ease: "power2.out"
        });
    }
}

// Update the active state of nav items (call when active item changes)
function updateNavItemActiveState() {
    navObjects.forEach((obj, index) => {
        const isActive = navItemsData[index].isActive;
        object.userData.isActive = isActive;

        // Smoothly transition color based on active state
        const targetColor = isActive ? 0xffd700 : 0xcccccc;
        gsap.to(obj.material.color, {
            r: (targetColor >> 16 & 0xFF) / 255,
            g: (targetColor >> 8 & 0xFF) / 255,
            b: (targetColor & 0xFF) / 255,
            duration: 0.3,
            ease: "power2.out"
        });

        // Adjust extrusion for active state
        const targetExtrusion = isActive ? hoverExtrusion : 0;
        // Note: For a more advanced implementation, we would actually modify the geometry
        // For now, we'll just change the scale slightly to simulate extrusion
        gsap.to(obj.scale, {
            z: 0.1 + (targetExtrusion * 2), // Base depth + extrusion effect
            duration: 0.3,
            ease: "power2.out"
        });
    });
}

// Reset all hover states
function resetHoverState() {
    if (INTERSECTED) {
        resetObjectHover(INTERSECTED);
        INTERSECTED = null;
    }
}

// Animation loop for nav scene
function animateNavScene() {
    if (!navGroup || !navRenderer || !navCamera) {
        requestAnimationFrame(animateNavScene);
        return;
    }

    // Rotate the entire nav group slightly
    if (navGroup) {
        navGroup.rotation.y += rotationSpeed;
    }

    // Check for mouse interactions
    checkIntersections();

    // Render
    navRenderer.render(navScene, navCamera);

    // Request next frame
    requestAnimationFrame(animateNavScene);
}

// Handle window resize
function onWindowResize() {
    navCamera.aspect = window.innerWidth / window.innerHeight;
    navCamera.updateProjectionMatrix();
    navRenderer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize nav scene after a short delay to ensure dependencies are loaded
    setTimeout(initNavScene, 500);
});

// Expose API for debugging and control
window.navSceneAPI = {
    init: initNavScene,
    isReady: function() { return isNavSceneReady; },
    getNavItemCount: function() { return navItemsData.length; },
    setRotationSpeed: function(speed) { rotationSpeed = speed; },
    togglePause: function() {
        // In a real implementation, we would pause the animation
        console.log('Navigation scene animation control not fully implemented');
    }
};

// Handle window resize
window.addEventListener('resize', onWindowResize, false);