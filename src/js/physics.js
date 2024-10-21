import * as THREE from "three";

import RAPIER from "@dimforge/rapier3d-compat";

export class Physics {
  debuging = false;
  mesh;

  constructor(threejs) {
    this.threejs = threejs;
    this.dynamicBodies = [];
    this.clock = new THREE.Clock();
    this.mesh = new THREE.LineSegments(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: true })
    );
    this.mesh.frustumCulled = false;
    this.simulationActive = false;
  }

  async init() {

    await RAPIER.init();
    this.gravity = new RAPIER.Vector3(0, -9.81, 0);
    this.world = new RAPIER.World(this.gravity);
    this.makeGround();
  }

  debug() {
    if (this.debuging) {
      const { vertices, colors } = this.world.debugRender();
      this.mesh.geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(vertices, 3)
      );
      this.mesh.geometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colors, 4)
      );
      this.mesh.visible = true;
      this.threejs.addToScene(this.mesh);
    } else {
      this.mesh.visible = false;
    }
  }

  makeGround() {
    const floorMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100, 10, 10),
      new THREE.MeshStandardMaterial()
    );
    floorMesh.position.y = -1;
    floorMesh.rotateX(-Math.PI / 2);
    floorMesh.receiveShadow = true;
    this.threejs.addToScene(floorMesh);
    const floorBody = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.fixed().setTranslation(0, -1, 0)
    );
    const floorShape = RAPIER.ColliderDesc.cuboid(50, 0, 50);
    this.world.createCollider(floorShape, floorBody);
  }

  addCube(l, b, h, model) {
    const modelPos = model.getWorldPosition(new THREE.Vector3());

    const cubeBody = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(modelPos.x, modelPos.y, modelPos.z)
      .setCanSleep(true)
    );
    const cubeShape = RAPIER.ColliderDesc.cuboid(l / 2, b / 2, h / 2)
      .setMass(1)
      .setRestitution(0.5);
    this.world.createCollider(cubeShape, cubeBody);
    this.dynamicBodies.push([model, cubeBody]);
    this.debug()
  }

  addCylinder(r, h, model) {
    const modelPos = model.getWorldPosition(new THREE.Vector3());

    const cylinderBody = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(modelPos.x, modelPos.y, modelPos.z)
      .setCanSleep(true)
    );
    const cylinderShape = RAPIER.ColliderDesc.cylinder(h / 2, r)
      .setMass(1)
      .setRestitution(0.2);
    this.world.createCollider(cylinderShape, cylinderBody);
    this.dynamicBodies.push([model, cylinderBody]);
    this.debug()
  }

  addPlane(l, w, model) {
    const modelPos = model.getWorldPosition(new THREE.Vector3());

    const planeBody = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()  
      .setTranslation(modelPos.x, modelPos.y, modelPos.z)
    );
    const planeShape = RAPIER.ColliderDesc.cuboid(l / 2, 0.01, w / 2); 
    this.world.createCollider(planeShape, planeBody);
    this.dynamicBodies.push([model, planeBody]);
    this.debug();
}

addSphere(r, model) {
  const modelPos = model.getWorldPosition(new THREE.Vector3());

  const sphereBody = this.world.createRigidBody(
    RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(modelPos.x, modelPos.y, modelPos.z)
    .setCanSleep(true)
  );
  const sphereShape = RAPIER.ColliderDesc.ball(r)
    .setMass(1)
    .setRestitution(0.5);
  this.world.createCollider(sphereShape, sphereBody);
  this.dynamicBodies.push([model, sphereBody]);
  this.debug();
}

addCone(r, h, model) {
  const modelPos = model.getWorldPosition(new THREE.Vector3());

  const coneBody = this.world.createRigidBody(
    RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(modelPos.x, modelPos.y, modelPos.z)
    .setCanSleep(true)
  );
  const coneShape = RAPIER.ColliderDesc.cone(h / 2, r) 
    .setMass(1)
    .setRestitution(0.4);
  this.world.createCollider(coneShape, coneBody);
  this.dynamicBodies.push([model, coneBody]);
  this.debug();
}


addModel(model) { 
    const modelPosition = new THREE.Vector3();
    model.getWorldPosition(modelPosition);
    
    const modelBody = this.world.createRigidBody( 
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(modelPosition.x, modelPosition.y, modelPosition.z)
        .setCanSleep(true) 
    ); 
  
    model.traverse((object) => { 
      if (object.isMesh) { 
        const geometry = object.geometry; 
        const worldMatrix = object.matrixWorld; 
        const points = geometry.attributes.position.array; 
  
        const tempVector = new THREE.Vector3(); 
        const modelVertices = new Float32Array(points.length); 
  
        for (let i = 0; i < points.length; i += 3) { 
          tempVector.set(points[i], points[i + 1], points[i + 2]); 
          tempVector.applyMatrix4(worldMatrix); 
          tempVector.sub(modelPosition); 
  
          modelVertices[i] = tempVector.x; 
          modelVertices[i + 1] = tempVector.y; 
          modelVertices[i + 2] = tempVector.z; 
        } 
  
        const modelShape = RAPIER.ColliderDesc.convexHull(modelVertices) 
          .setMass(1) 
          .setRestitution(1.2)
  
        this.world.createCollider(modelShape, modelBody); 
        this.dynamicBodies.push([model, modelBody]); 
      } 
    }); 
    
    this.debug();
    model.position.copy(modelPosition);
}

  simulate() {
    this.simulationActive = true;

    const runSimulation = () => {
      if (!this.simulationActive) return;

      this.delta = this.clock.getDelta();
      this.world.timestep = Math.min(this.delta, 0.1);
      this.world.step();

      for (let i = 0, n = this.dynamicBodies.length; i < n; i++) {
        this.dynamicBodies[i][0].position.copy(this.dynamicBodies[i][1].translation());
        this.dynamicBodies[i][0].quaternion.copy(this.dynamicBodies[i][1].rotation());
      }

      this.debug();
      requestAnimationFrame(runSimulation);
    };

    runSimulation();
  }

  stopSimulation() {
    this.simulationActive = false;
  }
}