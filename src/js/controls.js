export class Controls {
    constructor(physics, threejs) {
        this.params = {
            colliderOptions: {
                colliderType: 'auto',
                shape: {
                    length: "1",
                    width: "1",
                    height: "1",
                    radius: "0.5"
                }
            },
            rigidBodyType : "fixed",
            simulationRunning: false
        };
        this.colliderTypeSelect = document.getElementById('colliderType');
        this.colliderProperties = document.getElementById('colliderProperties');
        this.rigidBodyType = document.getElementById('rigidBody');
        this.properties = document.getElementById('properties');
        this.addColliderButton = document.getElementById('addCollider');
        this.simulationButton = document.getElementById('simulation');
        this.physics = physics;
        this.threejs = threejs;

        this.setupEventListeners();
        this.updateGUI();
    }

    setupEventListeners() {
        this.colliderTypeSelect.addEventListener('change', () => {
            this.params.colliderOptions.colliderType = this.colliderTypeSelect.value;
            this.updateGUI();
        });
        this.rigidBodyType.addEventListener('change', () => {
            this.params.rigidBodyType = this.rigidBodyType.value;
            this.updateGUI();
        });
        this.simulationButton.addEventListener('click', () => {
            this.toggleSimulation();
        });
        this.addColliderButton.addEventListener('click', () => this.addCollider());
    }

    addCollider() {
        
        switch (this.params.colliderOptions.colliderType) {
            case 'auto':
                if (this.threejs.currentlySelected) {
                    this.physics.addModel(this.threejs.currentlySelected);
                } else {
                    console.log("No object selected");
                }
                break;
            case 'box':
                if (this.threejs.currentlySelected) {
                    console.log("box")
                    this.physics.addCube(this.params.colliderOptions.shape.length,
                                        this.params.colliderOptions.shape.width,
                                        this.params.colliderOptions.shape.height,
                                        this.threejs.currentlySelected);
                    
                } else {
                    console.log("No object selected");
                }
                break;
            case 'sphere':
                if (this.threejs.currentlySelected) {
                    console.log("sphere")
                    this.physics.addSphere(this.params.colliderOptions.shape.radius,
                        this.threejs.currentlySelected);
                    
                } else {
                    console.log("No object selected");
                }
                break;
            case 'plane':
                if (this.threejs.currentlySelected) {
                    console.log("plane")
                    this.physics.addPlane(this.params.colliderOptions.shape.length,
                                        this.params.colliderOptions.shape.width,
                                        this.threejs.currentlySelected
                    )
                    
                } else {
                    console.log("No object selected");
                }
                break;
            case 'cone':
                if (this.threejs.currentlySelected) {
                    console.log("cone")
                    this.physics.addCone(this.params.colliderOptions.shape.radius,
                        this.params.colliderOptions.shape.height,
                        this.threejs.currentlySelected);
                    
                } else {
                    console.log("No object selected");
                }
                break;
            case 'cylinder':
                if (this.threejs.currentlySelected) {
                    console.log("cylinder")
                    this.physics.addCylinder(this.params.colliderOptions.shape.radius,
                                            this.params.colliderOptions.shape.height,
                                            this.threejs.currentlySelected);
                    
                } else {
                    console.log("No object selected");
                }
                break;
            default:
                break;
        }
    }

    updateGUI() {
        this.colliderProperties.innerHTML = ''; 
        
        switch (this.params.colliderOptions.colliderType) {
            case 'box':
                this.addInput('length', 'Length');
                this.addInput('width', 'Width');
                this.addInput('height', 'Height');
                break;
            case 'sphere':
                this.addInput('radius', 'Radius');
                break;
            case 'cone':
            case 'cylinder':
                this.addInput('radius', 'Radius');
                this.addInput('height', 'Height');
                break;
            case 'plane':
                this.addInput('length', 'Length');
                this.addInput('width', 'Width');
                break;
            case 'auto':
            default:
                break;
        }

        switch (this.params.rigidBodyType) {
            case 'dynamic' :
                this.properties.style.display = "block"
                break;
            case "fixed" : 
                this.properties.style.display = "none"
                break;
            default:
                break;
        }
    }

    toggleSimulation() {
        this.params.simulationRunning = !this.params.simulationRunning;

        if (this.params.simulationRunning) {
            this.simulationButton.innerText = "Stop Simulation";
            this.physics.simulate();
        } else {
            this.simulationButton.innerText = "Start Simulation";
            this.physics.stopSimulation();
        }
    }

    addInput(property, label) {
        const inputElement = document.createElement('div');
        inputElement.innerHTML = `
            <label for="${property}">${label}:</label>
            <input type="number" id="${property}" value="${this.params.colliderOptions.shape[property]}"> </br></br>
        `;
        this.colliderProperties.appendChild(inputElement);
        
        const input = inputElement.querySelector('input');
        input.addEventListener('change', (e) => {
            this.params.colliderOptions.shape[property] = e.target.value;
        });
    }
}