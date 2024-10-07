import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class ThreejsScene {
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color("#844CB7");
        this.aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(45, this.aspect, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows
        document.body.appendChild(this.renderer.domElement);
        this.camera.position.set(0, 0, 10);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.addLights();
    }

    initiate() {
        this.animate();
        window.addEventListener("resize", this.windowResizeHandler.bind(this));
    }

    windowResizeHandler() {
        this.aspect = window.innerWidth / window.innerHeight;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = this.aspect;
        this.camera.updateProjectionMatrix();
    }

    addLights() {
        const ambient = new THREE.AmbientLight(0xffffff, 0.5);
        this.addToScene(ambient);

        const directional = new THREE.DirectionalLight(0xffffff, 0.8);
        directional.position.set(5, 10, 7.5);
        directional.castShadow = true;
        directional.shadow.mapSize.width = 1024;
        directional.shadow.mapSize.height = 1024;
        directional.shadow.camera.near = 1;
        directional.shadow.camera.far = 20;
        directional.shadow.camera.left = -10;
        directional.shadow.camera.right = 10;
        directional.shadow.camera.top = 10;
        directional.shadow.camera.bottom = -10;
        this.addToScene(directional);

        // const light1 = new THREE.SpotLight(undefined, 0.6)
        // light1.position.set(2.5, 5, 5)
        // light1.angle = Math.PI / 3
        // light1.penumbra = 0.5
        // light1.castShadow = true
        // light1.shadow.blurSamples = 10
        // light1.shadow.radius = 5
        // this.addToScene(light1)

        // const light2 = light1.clone()
        // light2.position.set(-2.5, 5, 5)
        // this.addToScene(light2)
    }

    addToScene(obj) {
        this.scene.add(obj);
    }

    removeFromScene(obj) {
        this.scene.remove(obj);
    }

    animate() {
        this.renderer.render(this.scene, this.camera);
        this.controls.update();
        requestAnimationFrame(() => this.animate());
    }

    createGround() {
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
        const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
        groundMesh.rotation.x = -Math.PI / 2;
        groundMesh.receiveShadow = true;
        this.addToScene(groundMesh);
    }

    createCube(x, y, z) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(x, y, z);
        cube.castShadow = true;
        cube.receiveShadow = true;
        this.addToScene(cube);
        return cube;
    }
}

export const group = new THREE.Group();