//import * as BABYLON from "@babylonjs/core";


export default class Enemi {
    constructor(enemiMesh, armature , speed, height,live,nbenergie,scene,option) {
        
        this.enemiMesh = enemiMesh;
        this.armature = armature;
        this.allanymation = armature._ranges;
        //console.log(this.allanymation)
        if (speed) this.speed = speed;
        else this.speed = 1;
        enemiMesh.Enemi = this;
        this.height = height;
        this.scene = scene;
        this.animationstate;
        



        ///////////////////////         creer les affichage statistique       //////////////////////
        if(option==true){

        }else{
            this.life = live;
            this.maxlife=live;
            this.lifebar = new BABYLON.MeshBuilder.CreateBox("enemilivebar", {height: 0.8, width: 1, depth: 0.4},scene);
            this.lifebar.parent = this.enemiMesh;
            this.lifebar.position.y += height + 1;
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
            this.energiebar = new BABYLON.MeshBuilder.CreateBox("enemilivebar", {height: 0.4, width: 1, depth: 0.4},scene);
            this.energiebar.parent = this.enemiMesh;
            this.energiebar.position.y += height;
            this.energiebar.scaling.x = this.energie;

            const energiemat = new BABYLON.StandardMaterial("mat");
            energiemat.Color = new BABYLON.Color3(0, 1, 1);
            energiemat.diffuseColor = new BABYLON.Color3(0, 1, 1);
            energiemat.specularColor  = new BABYLON.Color3(0, 0, 0);
            this.energiebar.material = energiemat;
            this.energiebar.addLODLevel(200, null);



            this.level = 1;
            this.maxlevel = 15;
            this.dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", {width:30, height:30}, scene, false);
            var mat = new BABYLON.StandardMaterial("mat", scene);
            mat.diffuseTexture = this.dynamicTexture;
            mat.specularColor = new BABYLON.Color3(0, 0, 0);
            //Set font
            
            this.dynamicTexture.drawText(""+this.level, null, null, "bold " + 16 + "px Arial", "#000000", "#ffffff", true);
            
        
            //Create plane and set dynamic texture as material
            this.planelevel = BABYLON.MeshBuilder.CreatePlane("plane", {width:1, height:1}, scene);
            this.planelevel.parent = this.enemiMesh;
            this.planelevel.position.y += height + 0.7;
            this.planelevel.position.x -= 3.5;
            this.planelevel.material = mat;
            this.planelevel.addLODLevel(200, null);
        
        }
        
        /////////////////////////                 coloision controle           /////////////

        this.bounder = this.createBoundingBox();
        this.bounder.ellipsoid = new BABYLON.Vector3(4, 5, 4);
        this.bounder.checkCollisions = true;
        this.bounder.physicsImpostor = new BABYLON.PhysicsImpostor(this.bounder, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);
        //this.bounder.isVisible = false; not good because block raycasting
    
        this.bounder.enemiMesh = this.enemiMesh;
        this.anim;

        this.fight=true;
        this.notbloque=true;
        //this.enemiMesh.showBoundingBox = true;

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
        if(this.notbloque){
            if (distance > 80) {
                this.animation(scene,0);
            } else if(distance > 10) {
                this.animation(scene,1);
                this.bounder.moveWithCollisions(
                    dir.multiplyByFloats(this.speed, 0, this.speed)
                );
            }else{
                if(this.fight){
                    this.animation(scene,2);
                    this.fight = false;
                    setTimeout(() => {
                        this.aplyataccolision(scene,1,10,dir);   
                    }, 1000 * 1)
                    
                    setTimeout(() => {
                        this.fight = true;   
                    }, 1000 * 4)
                }else{
                    this.animation(scene,0);
                }
            }
        }
    }
    
    /*
    //peut etre util rajouter un evenement en physic a l'animation a une frame
    var event1 = new BABYLON.AnimationEvent(
        50,
        function () {
          console.log("Yeah!");
        },
        true,
      );
      // Attach your event to your animation
      animation.addEvent(event1);
    */

    animation(scene,number){
        if(this.animationstate!==number){
            //await this.anim.waitAsync();
            this.animationstate = number;
            let myanimation = Object.values(this.allanymation)[number];
            //wait end animation
            if(number==2||number==3){
                this.notbloque =false;
                setTimeout(async () => {
                    this.anim = scene.beginAnimation(this.armature, myanimation.from, myanimation.to, false);
                    await this.anim.waitAsync();
                    this.notbloque = true;
                });
            }else{
                this.anim = scene.beginAnimation(this.armature, myanimation.from, myanimation.to, true,1);
            }
        }         
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
        bounderMaterial.alpha = 0
        bounder.material = bounderMaterial;
        bounder.checkCollisions = true;
    
        bounder.position = this.enemiMesh.position;
    
        bounder.scaling.x =  10;
        bounder.scaling.y =  this.height;
        bounder.scaling.z =  10;
    
        return bounder;
      }

      degat(degat){
        this.life-=degat;
        if(this.life<=0){
            this.modifiemaxbar(this.lifebar,-degat);
            this.mort();
        }else{
            this.modifiemaxbar(this.lifebar,-degat);
        }  
      }
      mort(){
        let player = this.scene.getMeshByName("mypicatchu");  
        player.Pica.increxperience(2);
        this.animation(this.scene,3);
        setTimeout(() => {
            this.enemiMesh.dispose();
            this.bounder.dispose();
        }, 1000 * 3)
      }

    modifiemaxbar(bar,incr){
        if(bar.scaling.x+incr>=0){
            bar.scaling.x +=incr;
            bar.position.x+=incr/2;
        }else{
            if(bar.scaling.x>0){
                bar.scaling.x-=bar.scaling.x;
            }
        }
    }
   

    aplyataccolision(scene,hitpoint,length,direct){
        let origin = new BABYLON.Vector3(this.enemiMesh.position.x,this.enemiMesh.position.y+4,this.enemiMesh.position.z);
        //let origin = this.position.add(this.frontVector);10

        // Looks a little up (0.1 in y) 
        let direction = direct;
        let ray = new BABYLON.Ray(origin, direction, length);

        // to make the ray visible :
        //let rayHelper = new BABYLON.RayHelper(ray);
        //rayHelper.show(scene, new BABYLON.Color3.Red);
    
        var hit = scene.pickWithRay(ray);

        if (hit.pickedMesh){
            //console.log(hit.pickedMesh.name);
            if(hit.pickedMesh.name == "bounderpica"){
                //console.log(hit.pickedMesh.name);
                let enemibounder = hit.pickedMesh;
                let player = enemibounder.picaMesh.Pica;
                //console.log(enemi.life);
                player.degat(hitpoint);
            } 
	    }
    }
}