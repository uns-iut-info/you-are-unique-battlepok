export default class EnemiStatue{
    constructor(enemiMesh,fires, scene) {
        this.scene = scene;
        this.fires = fires;
        
        enemiMesh.Enemi = this;
        this.timeFire= true;
        this.enemiMesh = enemiMesh;
        this.bounder = this.createBoundingBox();
        this.bounder.ellipsoid = new BABYLON.Vector3(4, 5, 4);
        this.bounder.checkCollisions = true;
        this.boxes = []
    }


    action(scene){
        if(this.timeFire==true){
            this.timeFire=false;
            this.activatefires();

            setTimeout(() => {
                this.stopfires();  
            }, 1000 * 1) 
            setTimeout(() => {
                this.remouveboxes();  
            }, 1000 * 3)            
            setTimeout(() => {
                this.timeFire=true;   
            }, 1000 * 8)
        }
    }

    activatefires(){
        this.fires.forEach(fire => {
           fire.start();
           let box = BABYLON.MeshBuilder.CreateBox("fire",{height: 12, width: 5, depth: 5},this.scene);
           box.position = fire.emitter;
           let materialtransparnet = new BABYLON.StandardMaterial("mat", this.scene);;
           materialtransparnet.alpha = 0;
           box.material = materialtransparnet
           this.boxes.push(box);
        });
    }

    stopfires(){
        this.fires.forEach(fire => {
            fire.stop(); 
         });
    }
    remouveboxes(){
        this.boxes.forEach(box => {
            box.dispose(); 
         });
         this.boxes=[]
    }


    createBoundingBox() {
        // Create a box as BoundingBox of the enemi
        let bounder = new BABYLON.Mesh.CreateBox(
          "enemymarak"+1 ,
          1,
          this.scene
        );
        let bounderMaterial = new BABYLON.StandardMaterial(
          "bounderMaterial",
          this.scene
        );
        //bounderMaterial.alpha = 0;
        bounder.material = bounderMaterial;
        bounder.checkCollisions = true;
    
        bounder.position = this.enemiMesh.position.clone();
    
        bounder.scaling.x =  10;
        bounder.scaling.y =  this.height;
        bounder.scaling.z =  10;
    
        return bounder;
      }

}