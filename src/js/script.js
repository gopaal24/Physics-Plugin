
import { Physics } from "./physics.js";
import { ThreejsScene } from "./sceneSetup.js";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js"

const threejs = new ThreejsScene();
const physics = new Physics(threejs);

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
                // model.scale.set(0.020, 0.020, 0.020)
                threejs.addToScene(model)
                physics.addModel(model);
            }, function(error){
                console.error('Error loading GLB:', error);
            })
        }

        reader.readAsArrayBuffer(file);
    }
})

async function main() {

    await physics.init();
    // physics.debuging = true;
    
    threejs.initiate();

    physics.simulate();
}

main().catch(console.error);