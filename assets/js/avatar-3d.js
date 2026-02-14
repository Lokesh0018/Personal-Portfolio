// 3D Avatar Integration
let avatarScene, avatarCamera, avatarRenderer, avatarContainer;
let avatarMesh = null;
let isAvatarReady = false;
let isUsingGLTF = false;

// Animation variables
let targetRotationX = 0;
let targetRotationY = 0;
let currentRotationX = 0;
let currentRotationY = 0;

// Initialize 3D avatar with GLTF model loading
function initAvatar3D() {
    // Check if Three.js and loaders are available
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded');
        return false;
    }

    if (typeof THREE.GLTFLoader === 'undefined' || typeof THREE.DRACOLoader === 'undefined') {
        console.warn('GLTFLoader or DRACOLoader not available, using procedural avatar');
        return initProceduralAvatar();
    }

    // Get container
    avatarContainer = document.getElementById('avatar-3d-container');
    if (!avatarContainer) {
        console.warn('Avatar 3D container not found');
        return false;
    }

    // Create scene
    avatarScene = new THREE.Scene();

    // Create camera
    avatarCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    avatarCamera.position.z = 3;

    // Create renderer
    avatarRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    avatarRenderer.setSize(80, 80); // Match the avatar container size
    avatarRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    avatarContainer.appendChild(avatarRenderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    avatarScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    avatarScene.add(directionalLight);

    // Load the GLTF model with Draco compression
    const loader = new THREE.GLTFLoader();
    const dracoLoader = new THREE.DRACOLoader();

    // Set the decoder path to where Draco decoder is hosted
    // Using the official Three.js CDN for Draco decoder
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    loader.setDRACOLoader(dracoLoader);

    // Load the model
    loader.load(
        // Model URL - using a simple test model (Duck) for demonstration
        // In production, replace with your own low-poly humanoid model
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
        // Called when the resource is loaded
        function (gltf) {
            // Scale and position the model appropriately
            const model = gltf.scene;

            // Scale down the model to fit in our avatar container
            // The duck model is large, so we scale it down significantly
            model.scale.set(0.15, 0.15, 0.15);
            model.position.y = -0.1; // Adjust to center in view

            avatarMesh = model;
            avatarScene.add(avatarMesh);

            isUsingGLTF = true;
            isAvatarReady = true; // Mark as ready when model loads
            console.log('GLTF model loaded successfully');

            // Start animation loop after model loads
            requestAnimationFrame(animateAvatar);
        },
        // Called while loading is progressing
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% model loaded');
        },
        // Called when loading has errors
        function (error) {
            console.error('Error loading GLTF model:', error);
            console.log('Falling back to procedural avatar');
            // Fall back to procedural avatar if GLTF loading fails
            return initProceduralAvatar();
        }
    );

    // Return true - the actual readiness will be set in the callbacks
    return true;
}

// Initialize procedural avatar as fallback
function initProceduralAvatar() {
    // Create scene
    avatarScene = new THREE.Scene();

    // Create camera
    avatarCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    avatarCamera.position.z = 3;

    // Create renderer
    avatarRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    avatarRenderer.setSize(80, 80); // Match the avatar container size
    avatarRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    avatarContainer.appendChild(avatarRenderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    avatarScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    avatarScene.add(directionalLight);

    // Create a more realistic avatar using multiple meshes
    avatarMesh = new THREE.Group();

    // Head (more detailed)
    const headGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({
        color: 0xffdbac, // Skin tone
        metalness: 0.0,
        roughness: 0.8
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    avatarMesh.add(head);

    // Neck
    const neckGeometry = new THREE.CylinderGeometry(0.2, 0.25, 0.3, 16);
    const neckMaterial = new THREE.MeshStandardMaterial({
        color: 0xffdbac,
        metalness: 0.0,
        roughness: 0.8
    });
    const neck = new THREE.Mesh(neckGeometry, neckMaterial);
    neck.position.y = -0.5;
    avatarMesh.add(neck);

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });

    // Left eye
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.2, 0.1, 0.5);
    avatarMesh.add(leftEye);

    // Right eye
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.2, 0.1, 0.5);
    avatarMesh.add(rightEye);

    // Eyebrows (simple boxes)
    const eyebrowGeometry = new THREE.BoxGeometry(0.25, 0.03, 0.02);
    const eyebrowMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });

    // Left eyebrow
    const leftEyebrow = new THREE.Mesh(eyebrowGeometry, eyebrowMaterial);
    leftEyebrow.position.set(-0.2, 0.2, 0.5);
    avatarMesh.add(leftEyebrow);

    // Right eyebrow
    const rightEyebrow = new THREE.Mesh(eyebrowGeometry, eyebrowMaterial);
    rightEyebrow.position.set(0.2, 0.2, 0.5);
    avatarMesh.add(rightEyebrow);

    // Nose (simple pyramid)
    const noseGeometry = new THREE.ConeGeometry(0.08, 0.2, 4);
    const noseMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.set(0, 0, 0.6);
    avatarMesh.add(nose);

    // Mouth (more detailed)
    const mouthGroup = new THREE.Group();
    const lipGeometry = new THREE.TorusGeometry(0.18, 0.03, 8, 16, Math.PI);
    const lipMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b6b });
    const lip = new THREE.Mesh(lipGeometry, lipMaterial);
    lip.rotation.x = Math.PI;
    lip.position.set(0, -0.2, 0.5);
    mouthGroup.add(lip);

    // Teeth (simple)
    const toothGeometry = new THREE.BoxGeometry(0.03, 0.02, 0.02);
    const toothMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

    // Upper teeth
    for (let i = -2; i <= 2; i++) {
        const tooth = new THREE.Mesh(toothGeometry, toothMaterial);
        tooth.position.set(i * 0.04, -0.18, 0.52);
        mouthGroup.add(tooth);
    }

    avatarMesh.add(mouthGroup);

    // Simple hair (using a modified sphere)
    const hairGeometry = new THREE.SphereGeometry(0.75, 32, 32);
    // Remove the bottom part to make it more like a hair helmet
    const hairMaterial = new THREE.MeshStandardMaterial({
        color: 0x3b4cca, // Dark blue hair
        metalness: 0.1,
        roughness: 0.9
    });
    const hair = new THREE.Mesh(hairGeometry, hairMaterial);
    hair.scale.set(1.05, 1.1, 1.05); // Slightly larger than head
    hair.position.y = 0.1; // Slightly above head
    avatarMesh.add(hair);

    avatarScene.add(avatarMesh);

    // Position avatar
    avatarMesh.position.y = 0;
    avatarMesh.scale.set(1, 1, 1);

    isUsingGLTF = false;
    isAvatarReady = true; // Mark as ready when procedural avatar is created

    // Start animation loop for procedural avatar
    requestAnimationFrame(animateAvatar);

    return true;
}

// Update avatar rotation based on mouse position
function updateAvatarRotation(mouseX, mouseY, containerWidth, containerHeight) {
    if (!avatarMesh) return;

    // Normalize mouse position to -1 to 1 range
    const normX = (mouseX / containerWidth) * 2 - 1;
    const normY = (mouseY / containerHeight) * 2 - 1;

    // Clamp to reasonable range and invert for natural movement
    targetRotationY = Math.max(-0.5, Math.min(0.5, -normX * 0.4));
    targetRotationX = Math.max(-0.3, Math.min(0.3, -normY * 0.3));
}

// Animate the avatar
function animateAvatar() {
    if (!avatarMesh || !avatarRenderer) {
        requestAnimationFrame(animateAvatar);
        return;
    }

    // Smoothly interpolate towards target rotation
    currentRotationX += (targetRotationX - currentRotationX) * 0.1;
    currentRotationY += (targetRotationY - currentRotationY) * 0.1;

    // Apply rotation
    avatarMesh.rotation.x = currentRotationX;
    avatarMesh.rotation.y = currentRotationY;

    // Add subtle breathing/scaling animation
    const time = Date.now() * 0.001;
    const scale = 1 + Math.sin(time * 0.5) * 0.015; // Very subtle scale
    avatarMesh.scale.set(scale, scale, scale);

    // Render
    avatarRenderer.render(avatarScene, avatarCamera);

    // Request next frame
    requestAnimationFrame(animateAvatar);
}

// Initialize and start the avatar system
function initAvatarSystem() {
    // Get DOM elements
    const avatar2DImg = document.getElementById('avatar-img-2d');
    const avatar3dContainer = document.getElementById('avatar-3d-container');

    if (!avatar2DImg || !avatar3dContainer) {
        console.warn('Avatar elements not found');
        return;
    }

    // Initialize 3D avatar (either GLTF or procedural)
    const threeDSuccess = initAvatar3D();

    // Handle 3D vs 2D display
    if (threeDSuccess) {
        // Initially show 2D avatar while loading 3D model (if using GLTF)
        avatar2DImg.style.display = 'block';
        avatar3dContainer.style.display = 'none';

        // Set up mouse tracking for rotation (will work once model loads)
        document.addEventListener('mousemove', function(e) {
            if (!isAvatarReady) return;

            // Get avatar container position
            const rect = avatar3dContainer.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            updateAvatarRotation(mouseX, mouseY, rect.width, rect.height);
        });
    } else {
        // Fallback to 2D avatar with existing tilt effect
        isAvatarReady = false;
        avatar2DImg.style.display = 'block';
        avatar3dContainer.style.display = 'none';
        console.log('3D avatar initialization failed, using 2D avatar fallback');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initAvatarSystem();
});

// For debugging - expose some functions globally
window.avatarAPI = {
    isReady: function() { return isAvatarReady; },
    isUsingGLTF: function() { return isUsingGLTF; },
    reset: function() {
        targetRotationX = 0;
        targetRotationY = 0;
        currentRotationX = 0;
        currentRotationY = 0;
    }
};