import GUI from 'lil-gui';

export class Controls {
    params = {
        colliderOptions: {
            colliderType: 'auto',
            shape: {
                length: "1",
                width: "1",
                height: "1",
                radius: "0.5"
            }
        }
    }

    constructor() {
        this.gui = new GUI();
        this.folder = null;
        this.setupGUI();
    }

    updateGUI() {
        this.folder = this.gui.addFolder(`Collider Properties: ${this.params.colliderOptions.colliderType}`);
        
        switch (this.params.colliderOptions.colliderType) {
            case 'box':
                this.folder.add(this.params.colliderOptions.shape, 'length').name('Length');
                this.folder.add(this.params.colliderOptions.shape, 'width').name('Width');
                this.folder.add(this.params.colliderOptions.shape, 'height').name('Height');
                break;
            case 'sphere':
                this.folder.add(this.params.colliderOptions.shape, 'radius').name('Radius');
                break;
            case 'cone':
                this.folder.add(this.params.colliderOptions.shape, 'radius').name('Radius');
                this.folder.add(this.params.colliderOptions.shape, 'height').name('Height');
                break;
            case 'cylinder':
                this.folder.add(this.params.colliderOptions.shape, 'radius').name('Radius');
                this.folder.add(this.params.colliderOptions.shape, 'height').name('Height');
                break;
            case 'plane':
                this.folder.add(this.params.colliderOptions.shape, 'length').name('Length');
                this.folder.add(this.params.colliderOptions.shape, 'width').name('Width');
                break;
            case 'auto':
            default:
                break;
        }

        this.folder.open();
    }

    setupGUI() {        
        this.gui.add(this.params.colliderOptions, 'colliderType', ['auto', 'box', 'sphere', 'plane', 'cone', 'cylinder'])
            .name("Shape")
            .onChange(() => this.updateGUI());
        
        // Initial setup of the folder
        this.updateGUI();
    }
}