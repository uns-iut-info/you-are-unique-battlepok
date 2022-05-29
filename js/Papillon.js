import Enemi from "./Enemi.js";

export default class Papillon extends Enemi {
    constructor(enemiMesh, armature , speed, height,live,nbenergie,scene) {
        super(enemiMesh, armature , speed, height,live,nbenergie,scene);
        this.enemiMesh.frontVector=new BABYLON.Vector3(0,0,0);
        this.fireball=true;
    }

    action(scene){
        this.animation(scene,0);
        this.enemiMesh.position = new BABYLON.Vector3(
            this.bounder.position.x,
            this.bounder.position.y-this.height/2,
            this.bounder.position.z
        );
        let player = scene.getMeshByName("mypicatchu");
        let direction = player.position.subtract(this.enemiMesh.position);
        let distance = direction.length();
        let dir = direction.normalize();
        let alpha = Math.atan2(-dir.x, -dir.z);
        this.enemiMesh.rotation.y = alpha;
        this.enemiMesh.frontVector = new BABYLON.Vector3(-1*Math.sin(this.enemiMesh.rotation.y), 0,-1*Math.cos(this.enemiMesh.rotation.y));
        if(distance<100){
            if(this.fireball){
                this.fireball=false;
                this.myfire(scene,dir);
                setTimeout(() => { 
                    this.fireball=true;
                }, 1000 * 5)
            }
        }
    }

    myfire(scene,dir){
        
        let sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 4, segments: 32});
        let sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial", scene);
        sphere.material = sphereMaterial;
        sphereMaterial.emissiveColor = new BABYLON.Color3(0.05, 0.05, 0.05);
        sphereMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        sphereMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        sphereMaterial.emissiveTexture = new BABYLON.Texture("img/star.jpg", scene);

        sphere.position = new BABYLON.Vector3(this.enemiMesh.position.x,this.enemiMesh.position.y,this.enemiMesh.position.z);
        sphere.position.addInPlace(this.enemiMesh.frontVector.multiplyByFloats(15, 0, 15));
        sphere.physicsImpostor = new BABYLON.PhysicsImpostor(
            sphere,
            BABYLON.PhysicsImpostor.SphereImpostor,
            { mass: 1 },
            scene
        );
        let powerOfFire = 20;

        let aimForceVector = new BABYLON.Vector3(
            this.enemiMesh.frontVector.x * powerOfFire,
            (dir.y-0.1)*powerOfFire,
            this.enemiMesh.frontVector.z * powerOfFire
        );
        sphere.physicsImpostor.applyImpulse(aimForceVector, sphere.getAbsolutePosition());
        sphere.actionManager = new BABYLON.ActionManager(scene);
        sphere.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
              {
                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter: scene.pica.bounder,
              }, 
              () => {
                if (scene.pica.bounder._isDisposed) return;
                scene.pica.degat(0.5);
              }
            )
        );
        setTimeout(() => { 
            sphere.dispose();
        },1000*2)
    }

    mort(){
        let player = this.scene.getMeshByName("mypicatchu");  
        player.Pica.increxperience(2);
        this.animation(this.scene,2);
        setTimeout(() => {
            this.enemiMesh.dispose();
            this.bounder.dispose();
        }, 1000 * 1)
    }
}