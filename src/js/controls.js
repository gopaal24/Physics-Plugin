export class Controls {
    constructor() {
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
            rigidBodyType : "fixed"
        };
        this.colliderTypeSelect = document.getElementById('colliderType');
        this.colliderProperties = document.getElementById('colliderProperties');
        this.rigidBodyType = document.getElementById('rigidBody');
        this.properties = document.getElementById('properties');
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
    }

    updateGUI() {
        this.colliderProperties.innerHTML = ''; // Clear existing properties
        
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

    addInput(property, label) {
        const inputElement = document.createElement('div');
        inputElement.innerHTML = `
            <label for="${property}">${label}:</label>
            <input type="number" id="${property}" value="${this.params.colliderOptions.shape[property]}">
        `;
        this.colliderProperties.appendChild(inputElement);
        
        const input = inputElement.querySelector('input');
        input.addEventListener('change', (e) => {
            this.params.colliderOptions.shape[property] = e.target.value;
        });
    }
}