import { Physics } from "./physics.js";
import { ThreejsScene } from "./sceneSetup.js";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js"
import { Controls } from "./controls.js";

const threejs = new ThreejsScene();
const physics = new Physics(threejs);

const gui = new Controls(physics, threejs);

const glbUpload = document.getElementById("glb");
const loader = new GLTFLoader();

glbUpload.addEventListener("change", (e)=>{
    const file = e.target.files[0];
    if(file){
        const reader = new FileReader();

        reader.onload = function(e){
            const arrayBuffer = e.target.result;
            loader.parse(arrayBuffer, '', function(gltf){
                const model = gltf.scene;
                threejs.addToScene(model)
                physics.addModel(model);
            }, function(error){
                console.error('Error loading GLB:', error);
            })
        }

        reader.readAsArrayBuffer(file);
    }
})

async function addPhysics() {
    
    await physics.init();
    physics.debuging = true;
    
    threejs.initiate();
    
}


function main(){

    threejs.createShape('cube', {x: 2, y: 2, z: 2}, {color: 0xff0000}, {x: -2, y: 5, z: 0});
    threejs.createShape('sphere', {x: 1.5}, {color: 0x0000ff}, {x: 2, y: 5, z: 0});
    threejs.createShape('cylinder', {x: 1, y: 1, z: 3}, {color: 0x00ff00}, {x: -5, y: 5, z: 0});
    // threejs.createShape('torus', {x: 1.5, y: 0.4}, {color: 0xffff00}, {x: 6, y: 5, z: 0});
    threejs.createShape('knot', {x: 1, y: 0.4}, {color: 0xffff00}, {x: -9, y: 5, z: 0});
    threejs.addModel()

    threejs.addRaycast(physics, gui);

    addPhysics().catch(console.error);
}

main();