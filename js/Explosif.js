import Enemi from "./Enemi.js";

export default class Explosif extends Enemi {
    constructor(enemiMesh, armature , speed, height,live,nbenergie,scene) {
        super(enemiMesh, armature , speed, height,live,nbenergie,scene);
        this.enemiMesh.frontVector=new BABYLON.Vector3(0,0,0);
    }

    action(scene){
        if (!this.bounder) return;
        this.bounder.moveWithCollisions(new BABYLON.Vector3(0,-1,0));
        this.enemiMesh.position = new BABYLON.Vector3(this.bounder.position.x,this.bounder.position.y-this.height/2,this.bounder.position.z);
        let player = scene.getMeshByName("mypicatchu");
        let direction = player.position.subtract(this.enemiMesh.position);
        let distance = direction.length();
        let dir = direction.normalize();
        let alpha = Math.atan2(-dir.x, -dir.z);
        this.enemiMesh.rotation.y = alpha;
        this.bounder.moveWithCollisions(dir.multiplyByFloats(this.speed, 0, this.speed));
        if(distance < 10) {
            this.explosion(scene);    
        }
    }
    explosion(scene){
        scene.enemies.pop(this.enemiMesh);
        this.enemiMesh.dispose();
        this.bounder.dispose();
        scene.pica.degat(1.5);
    }

    mort(){
        let player = this.scene.getMeshByName("mypicatchu");  
        player.Pica.increxperience(2);
        //this.animation(this.scene,1);
        setTimeout(() => {
            this.enemiMesh.dispose();
            this.bounder.dispose();
        }, 1000 *1)
    }



}