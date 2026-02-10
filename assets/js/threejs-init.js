// 3D Scene Initialization
let scene, camera, renderer, container;

// Initialize the 3D scene
function init3D() {
    // Check for WebGL support
    if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
        console.warn('WebGL not supported, falling back to 2D');
        return false;
    }

    // Create container if it doesn't exist
    container = document.getElementById('threejs-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'threejs-container';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.zIndex = '-2'; // Behind content but above page background
        container.style.pointerEvents = 'none'; // Don't interfere with UI interactions
        document.body.appendChild(container);
    }

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Match site's dark background

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit DPR for performance
    container.appendChild(renderer.domElement);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create a simple test object (tetrahedron)
    const geometry = new THREE.TetrahedronGeometry(1, 0);
    const material = new THREE.MeshStandardMaterial({
        color: 0xffd700, // Gold color to match site accents
        metalness: 0.3,
        roughness: 0.7
    });
    const tetrahedron = new THREE.Mesh(geometry, material);
    scene.add(tetrahedron);

    // Add rotation animation
    function animate() {
        requestAnimationFrame(animate);

        // Rotate the tetrahedron
        tetrahedron.rotation.x += 0.01;
        tetrahedron.rotation.y += 0.01;

        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);

    return true;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const threeJSInitialized = init3D();

    // If 3D initialization fails, we can fall back to 2D effects
    if (!threeJSInitialized) {
        console.log('3D initialization failed, using 2D fallback');
        // The existing 2D effects will continue to work
    }
});

// Simple detector for WebGL (similar to three.js's Detector but lightweight)
var Detector = {
    canvas: !!window.CanvasRenderingContext2D,
    webgl: (function () {
        try {
            var canvas = document.createElement('canvas');
            return !!window.WebGLRenderingContext &&
                (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch(e) {
            return false;
        }
    })(),
    workers: !!window.Worker,
    fileapi: window.File && window.FileReader && window.FileList && window.Blob,
    getWebGLErrorMessage: function () {
        var element = document.createElement('div');
        element.id = 'webgl-error-message';
        element.style.fontFamily = 'monospace';
        element.style.fontSize = '13px';
        element.style.fontWeight = 'normal';
        element.style.textAlign = 'center';
        element.style.background = '#fff';
        element.style.color = '#000';
        element.style.padding = '1.5em';
        element.style.width = '400px';
        element.style.margin = '5em auto 0';

        element.innerHTML = 'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />';
        return element;
    },
    addGetWebGLMessage: function () {
        // Create a container for the message if it doesn't exist
        let container = document.getElementById('webgl-message-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'webgl-message-container';
            container.style.position = 'fixed';
            container.style.top = '0';
            container.style.left = '0';
            container.style.width = '100%';
            container.style.height = '100%';
            container.style.background = 'rgba(0,0,0,0.8)';
            container.style.color = '#fff';
            container.style.display = 'flex';
            container.style.justifyContent = 'center';
            container.style.alignItems = 'center';
            container.style.zIndex = '9999';
            document.body.appendChild(container);
        }

        // If message element doesn't exist, create it
        if (!document.getElementById('webgl-message')) {
            var div = document.createElement('div');
            div.id = 'webgl-message';
            div.style.padding = '20px';
            div.style.maxWidth = '80%';
            div.style.textAlign = 'center';

            div.innerHTML = Detector.getWebGLErrorMessage();
            container.appendChild(div);
        }
    }
};

// Export for use in other modules if needed
window.threeJS = {
    scene: scene,
    camera: camera,
    renderer: renderer,
    init: init3D
};