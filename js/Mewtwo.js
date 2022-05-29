
import Enemi from "./Enemi.js";

export default class Mewtwo extends Enemi {
    constructor(enemiMesh, armature , speed, height,live,nbenergie,scene) {
        super(enemiMesh, armature , speed, height,live,nbenergie,scene,true);
        this.enemiMesh.frontVector=new BABYLON.Vector3(0,0,0);
        
        this.life = live;
        this.maxlife=live;
        this.lifebar = new BABYLON.MeshBuilder.CreateBox("enemilivebar", {height: 0.2, width: 0.2, depth: 0.2},scene);
        this.lifebar.parent = this.enemiMesh;
        this.lifebar.position.y += height + 0.2;
        this.lifebar.scaling.x = this.life;
        this.lifebar.addLODLevel(200, null);

        const lifemat = new BABYLON.StandardMaterial("mat");
        lifemat.Color = new BABYLON.Color3(1, 0, 0);
        lifemat.diffuseColor = new BABYLON.Color3(1, 0, 0);
        lifemat.specularColor  = new BABYLON.Color3(0, 0, 0);
        this.lifebar.material = lifemat;

        

        //creer bar d'energie
        this.maxenergie=nbenergie;
        this.energie = nbenergie;
        this.energiebar = new BABYLON.MeshBuilder.CreateBox("enemilivebar", {height: 0.1, width: 0.2, depth: 0.2},scene);
        this.energiebar.parent = this.enemiMesh;
        this.energiebar.position.y += height;
        this.energiebar.scaling.x = this.energie;

        const energiemat = new BABYLON.StandardMaterial("mat");
        energiemat.Color = new BABYLON.Color3(0, 1, 1);
        energiemat.diffuseColor = new BABYLON.Color3(0, 1, 1);
        energiemat.specularColor  = new BABYLON.Color3(0, 0, 0);
        this.energiebar.material = energiemat;
        this.energiebar.addLODLevel(200, null);

        this.protected = true;
        this.strategie = -1;
        this.jumpreg = true;
        this.firereg = true;
        this.center = this.enemiMesh.position;
        this.nbjump = 0;
        this.strategie1start=true;
        this.strategie2start=true;
        this.runes= 0;
        this.laststrategie=-1;
        this.laststande = new BABYLON.Vector3(0,0,0);
        this.enemiMesh.actionManager = new BABYLON.ActionManager(this.scene);
        this.enemiMesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
              {
                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter: this.scene.pica.bounder,
              }, 
              () => {
                if (this.scene.pica.bounder._isDisposed) return;
                    if(this.strategie==2){
                        this.scene.pica.degat(0.4);
                    }
              }
            )
        );
    }
    action(scene){

        if (!this.bounder) return;
        this.enemiMesh.position = new BABYLON.Vector3(
            this.bounder.position.x,
            this.bounder.position.y-15/2,
            this.bounder.position.z
        );
        let player = scene.getMeshByName("mypicatchu");
        let direction = player.position.subtract(this.enemiMesh.position);
        let distance = direction.length();
        let dir = direction.normalize();
        let alpha = Math.atan2(-dir.x, -dir.z);
        

        if(this.strategie==-1){
            this.strategietoucher(scene,dir);
        }else if(this.strategie==1){
            if(this.strategie1start){
                this.protected = true;
                this.strategie1start=false;
                this.bounder.position =  new BABYLON.Vector3(this.center.x+60,25+7,this.center.z);
                this.enemiMesh.position = new BABYLON.Vector3(this.center.x+60,25,this.center.z);
            }
            this.strategiefireball(scene);
            
        }else if(this.strategie==2){
            this.protected = false;
            if(this.strategie2start){
                this.runes+=1;
                var teleportvector = this.randompositionrayon(60);
                this.bounder.position =  new BABYLON.Vector3(this.center.x+teleportvector[0],25+7,this.center.z+teleportvector[1]);
                this.enemiMesh.position = new BABYLON.Vector3(this.center.x+teleportvector[0],25,this.center.z+teleportvector[1]);
                let direction = player.position.subtract(this.enemiMesh.position);
                this.laststande = direction.normalize();
                let alpha = Math.atan2(-this.laststande.x, -this.laststande.z);
                this.enemiMesh.rotation.y = alpha;
                this.enemiMesh.frontVector = new BABYLON.Vector3(-1*Math.sin(this.enemiMesh.rotation.y), 0,-1*Math.cos(this.enemiMesh.rotation.y));
                this.strategie2start = false;
                setTimeout(() => {
                    this.strategie2start = true;
                }, 2500)
                
            }  
            this.strategieattac(scene,this.laststande);
        }
        if(this.nbjump>9){
            this.nbjump=0;
            if(this.laststrategie==-1){
                this.strategie = parseInt(Math.random()*2)+1;
            }else if(this.laststrategie==1){
                this.strategie=2;
                this.laststrategie=-1;
            }else{
                this.strategie=1;
                this.laststrategie=-1;
            }
            
            if(this.strategie==1){
                setTimeout(() => {
                    this.strategie=-1;
                    this.jumpreg = true;
                    this.strategie1start=true;
                },10000)
            }
        }
        if(this.runes>6){
            this.strategie2start=true;
            this.runes=0;
            this.strategie = -1
            this.jumpreg = true;
        }

        if(this.strategie!=2){
            this.enemiMesh.rotation.y = alpha;
            this.enemiMesh.frontVector = new BABYLON.Vector3(-1*Math.sin(this.enemiMesh.rotation.y), 0,-1*Math.cos(this.enemiMesh.rotation.y));
        }
        
    }

    degat(degat){
        if(!this.protected){
            this.life-=degat;
            if(this.life<=0){
                this.mort();
            }else{
                this.modifiemaxbar(this.lifebar,-degat);
            }
        }  
    }

    mort(){
        this.scene.endgame = true; 
    }

    hpositionrayon(radius,l){
        return Math.sqrt(radius*radius - l*l);
    }

    randompositionrayon(radius){
        let teleportvector = []
        let l = Math.random()*radius;
        let h = this.hpositionrayon(radius,l);
        if(parseInt(Math.random()*2)==0){l= -1*l}
        if(parseInt(Math.random()*2)==0){h= -1*h}
        teleportvector.push(l);
        teleportvector.push(h);
        return teleportvector;
    }

    //y = 25 y2 = 20 rayon1 = 40 rayon2 = 60

    strategietoucher(scene){
        if(this.jumpreg){
            this.jumpreg = false;
            setTimeout(() => {
                if(this.strategie==-1){
                    this.protected=false;
                    this.nbjump+=1;
                    if(this.nbjump%2==0){
                        this.throwball(scene)
                    } 
                    this.jumpreg =true;
                    var teleportvector = this.randompositionrayon(40);
                    this.bounder.position =  new BABYLON.Vector3(this.center.x+teleportvector[0],20+7,this.center.z+teleportvector[1]);
                    this.enemiMesh.position = new BABYLON.Vector3(this.center.x+teleportvector[0],20,this.center.z+teleportvector[1]);
                      
                }
            },2500)
        }
        
    }

    strategiefireball(scene){
        if(this.firereg){
            this.firereg = false;
            setTimeout(() => {
                this.firereg=true;
                //console.log("createball")
                let player = scene.getMeshByName("mypicatchu");
                var teleportvector = this.randompositionrayon(Math.random()*7);
                let sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 10, segments: 32});
                this.bouildsphere(sphere,new BABYLON.Vector3(player.position.x+teleportvector[0],60,player.position.z+teleportvector[1]),scene);
                sphere.physicsImpostor.applyImpulse(new BABYLON.Vector3(0,-20,0), sphere.getAbsolutePosition());
                this.bouldamage(sphere,scene,0.2)
                setTimeout(() => { 
                    sphere.dispose();
                },2500)
            },200)
        }
    }



    strategieattac(scene,laststande){
        this.bounder.moveWithCollisions(
            laststande.multiplyByFloats(0.7, 0, 0.7)
        );
    }
    

    modifiemaxbar(bar,incr){
        bar.scaling.x +=incr;
        bar.position.x+=incr/10;
    }
    throwball(scene){
        let player = scene.getMeshByName("mypicatchu");
        let direction = player.position.subtract(this.enemiMesh.position);
        let dir = direction.normalize();
        let alpha = Math.atan2(-dir.x, -dir.z);
        this.enemiMesh.rotation.y = alpha;
        this.enemiMesh.frontVector = new BABYLON.Vector3(-1*Math.sin(this.enemiMesh.rotation.y), 0,-1*Math.cos(this.enemiMesh.rotation.y));

        let sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 8, segments: 32});
        let sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial", scene);
        sphere.material = sphereMaterial;
        sphereMaterial.emissiveColor = new BABYLON.Color3(0.05, 0.05, 0.05);
        sphereMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        sphereMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        sphereMaterial.emissiveTexture = new BABYLON.Texture("img/water.jpg", scene);

        sphere.position = new BABYLON.Vector3(this.enemiMesh.position.x,this.enemiMesh.position.y+15,this.enemiMesh.position.z)
        sphere.position.addInPlace(this.enemiMesh.frontVector.multiplyByFloats(15, 0, 15));
        //sphere.position.addInPlace(position);
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
        this.bouldamage(sphere,scene,0.5);
        sphere.physicsImpostor.applyImpulse(aimForceVector, sphere.getAbsolutePosition());
       

        setTimeout(() => { 
            sphere.dispose();
        },1000*2)
    }

    bouildsphere(sphere,position,scene){
        //sphere.checkCollisions = true;
        let sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial", scene);
        sphere.material = sphereMaterial;
        sphereMaterial.emissiveColor = new BABYLON.Color3(0.05, 0.05, 0.05);
        sphereMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        sphereMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        sphereMaterial.emissiveTexture = new BABYLON.Texture("img/boulefeut.jpg", scene);

        sphere.position = new BABYLON.Vector3(position.x,position.y,position.z);
        //sphere.position.addInPlace(position);
        sphere.physicsImpostor = new BABYLON.PhysicsImpostor(
            sphere,
            BABYLON.PhysicsImpostor.SphereImpostor,
            { mass: 1 },
            scene
        );
    }

    bouldamage(sphere,scene,degat){
        sphere.actionManager = new BABYLON.ActionManager(scene);
        sphere.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
              {
                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter: scene.pica.bounder,
              }, 
              () => {
                if (scene.pica.bounder._isDisposed) return;
                scene.pica.degat(degat);
              }
            )
        );
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
        bounderMaterial.alpha = 0;
        bounder.material = bounderMaterial;
        bounder.checkCollisions = true;
    
        bounder.position = new BABYLON.Vector3(this.enemiMesh.position.x, this.enemiMesh.position.y+7, this.enemiMesh.position.z);
    
        bounder.scaling.x =  10;
        bounder.scaling.y =  15;
        bounder.scaling.z =  10;

        
        
    
        return bounder;
      }
}