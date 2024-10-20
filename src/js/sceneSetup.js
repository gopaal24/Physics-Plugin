import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js"

export class ThreejsScene {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#844CB7");
    this.aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, this.aspect, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(this.renderer.domElement);
    this.camera.position.set(0, 5, 20);
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
    directional.shadow.camera.left = -20;
    directional.shadow.camera.right = 20;
    directional.shadow.camera.top = 20;
    directional.shadow.camera.bottom = -20;
    this.addToScene(directional);
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
    console.log(groundMesh)
    this.addToScene(groundMesh);
  }

  createShape(
    shapeType,
    size = { x: 1, y: 1, z: 1 },
    materialOptions = {},
    position = { x: 0, y: 0, z: 0 },
    rotation = { x: 0, y: 0, z: 0 }
  ) {
    let geometry;

    switch (shapeType.toLowerCase()) {
      case "cube":
      case "box":
        geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        break;
      case "sphere":
        geometry = new THREE.SphereGeometry(size.x, 32, 32);
        break;
      case "cylinder":
        geometry = new THREE.CylinderGeometry(size.x, size.y, size.z, 32);
        break;
      case "cone":
        geometry = new THREE.ConeGeometry(size.x, size.y, 32);
        break;
      case "torus":
        geometry = new THREE.TorusGeometry(size.x, size.y, 16, 100);
        break;
      case "plane":
        geometry = new THREE.PlaneGeometry(size.x, size.y);
        break;
      case "tetrahedron":
        geometry = new THREE.TetrahedronGeometry(size.x);
        break;
      case "octahedron":
        geometry = new THREE.OctahedronGeometry(size.x);
        break;
      case "icosahedron":
        geometry = new THREE.IcosahedronGeometry(size.x);
        break;
      case "dodecahedron":
        geometry = new THREE.DodecahedronGeometry(size.x);
        break;
      case "knot":
        geometry = new THREE.TorusKnotGeometry(
            size.x,   // Radius of the knot
            size.y,   // Radius of the tube
            100,      // Number of radial segments
            16        // Number of tubular segments
        );
        break;
      default:
        console.error(`Shape type "${shapeType}" is not supported.`);
        return;
    }

    const material = new THREE.MeshStandardMaterial({
      color: materialOptions.color || 0x00ff00,
      metalness: materialOptions.metalness || 0,
      roughness: materialOptions.roughness || 1,
      ...materialOptions,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    this.addToScene(mesh);

    return mesh;
  }

  addModel() {
    const loader = new GLTFLoader();
    loader.load(
        './src/assets/shiba.glb',
        (gltf) => {
            const model = gltf.scene;
            model.position.set(6, 5, 0);
            this.addToScene(model);
        },
        undefined,
        (error) => { 
            console.error('An error occurred while loading the model:', error);
        }
    );
}

  raycastHandler(e, physics) {
    const pointer = {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1,
    };

    this.raycast.setFromCamera(pointer, this.camera, true);

    const intersects = this.raycast.intersectObjects(this.scene.children);
    if (intersects.length > 0 && intersects[0].object.name != "ground") {
      let intersectedObject = intersects[0].object;

      while (intersectedObject.parent && intersectedObject.parent !== this.scene) {
        intersectedObject = intersectedObject.parent;
      }
      console.log(intersectedObject)
      physics.addModel(intersectedObject);
  }
  }

  addRaycast(physics) {
    this.raycast = new THREE.Raycaster();

    document.addEventListener("click", (e) => this.raycastHandler(e, physics));
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
