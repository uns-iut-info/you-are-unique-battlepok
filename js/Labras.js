import Enemi from "./Enemi.js";

export default class Labras extends Enemi {
    constructor(enemiMesh, armature , speed, height,live,nbenergie,scene) {
        super(enemiMesh, armature , speed, height,live,nbenergie,scene);
        this.fireball = true;
        this.enemiMesh.frontVector=new BABYLON.Vector3(0,0,0);
    }

    action(scene){
        if (!this.bounder) return;
        this.bounder.moveWithCollisions(new BABYLON.Vector3(0,-1,0));
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
                }, 1000 * 8)
            }
            if(distance<20){
                this.bounder.moveWithCollisions(dir.multiplyByFloats(-1*this.speed, 0, -1*this.speed))
            }else{
                this.bounder.moveWithCollisions(new BABYLON.Vector3((Math.random()-0.5)*2*5, 0, (Math.random()-0.5)*2*5))
            }
        }else if(distance<150){
            this.bounder.moveWithCollisions(dir.multiplyByFloats(this.speed, 0, this.speed))
        }
        
    }

    myfire(scene,dir){
        let sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 4, segments: 32});
        let sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial", scene);
        sphere.material = sphereMaterial;
        sphereMaterial.emissiveColor = new BABYLON.Color3(0.05, 0.05, 0.05);
        sphereMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        sphereMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        sphereMaterial.emissiveTexture = new BABYLON.Texture("img/water.jpg", scene);

        sphere.position = new BABYLON.Vector3(this.enemiMesh.position.x,this.enemiMesh.position.y+17,this.enemiMesh.position.z);
        sphere.position.addInPlace(this.enemiMesh.frontVector.multiplyByFloats(15, 0, 15));
        sphere.physicsImpostor = new BABYLON.PhysicsImpostor(
            sphere,
            BABYLON.PhysicsImpostor.SphereImpostor,
            { mass: 1 },
            scene
        );
        let powerOfFire = 30;

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
}