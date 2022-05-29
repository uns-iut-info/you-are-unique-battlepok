import Enemi from "./Enemi.js";

export default class Epona extends Enemi {
    constructor(enemiMesh, armature , speed, height,live,nbenergie,scene) {
        super(enemiMesh, armature , speed, height,live,nbenergie,scene,true);

        this.life = live;
        this.maxlife=live;
        this.lifebar = new BABYLON.MeshBuilder.CreateBox("enemilivebar", {height: 0.08, width: 0.3, depth: 0.05},scene);
        this.lifebar.parent = this.enemiMesh;
        this.lifebar.position.y += 1.7;
        this.lifebar.scaling.x = this.life;
        this.lifebar.addLODLevel(200, null);

        const lifemat = new BABYLON.StandardMaterial("mat");
        lifemat.Color = new BABYLON.Color3(1, 0, 0);
        lifemat.diffuseColor = new BABYLON.Color3(1, 0, 0);
        lifemat.specularColor  = new BABYLON.Color3(0, 0, 0);
        this.lifebar.material = lifemat;
        this.enemiMesh.frontVector=new BABYLON.Vector3(0,0,0);
        this.laststande = new BABYLON.Vector3(0,0,0);
        this.enemiMesh.actionManager = new BABYLON.ActionManager(this.scene);
        this.run = true;
        this.enemiMesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
              {
                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter: this.scene.pica.bounder,
              }, 
              () => {
                if (this.scene.pica.bounder._isDisposed) return;
                if(this.run){
                        this.scene.pica.degat(0.3);
                    }
              }
            )
        );
        this.makeaction= true;
        
    }

    action(scene){
        
        if (!this.bounder) return;
        this.animation(scene,1);
        this.bounder.moveWithCollisions(new BABYLON.Vector3(0,-1,0));
        this.enemiMesh.position = new BABYLON.Vector3(
            this.bounder.position.x,
            this.bounder.position.y-this.height/2,
            this.bounder.position.z
        );
        let player = scene.getMeshByName("mypicatchu");
        if(this.makeaction){
            let direction = player.position.subtract(this.enemiMesh.position);
            this.laststande = direction.normalize();
            let alpha = Math.atan2(-this.laststande.x, -this.laststande.z);
            this.enemiMesh.rotation.y = alpha;
            this.enemiMesh.frontVector = new BABYLON.Vector3(-1*Math.sin(this.enemiMesh.rotation.y), 0,-1*Math.cos(this.enemiMesh.rotation.y));
            this.makeaction = false;
            setTimeout(() => {
                this.makeaction = true;
            }, 3000);
        }else{
            this.bounder.moveWithCollisions(this.laststande.multiplyByFloats(0.7, 0, 0.7));
        }
        
    
    }
}