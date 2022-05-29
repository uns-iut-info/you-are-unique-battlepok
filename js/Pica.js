//import * as BABYLON from "@babylonjs/core";

export default class Pica {
    
    constructor(picaMesh, armature ,picaeclaireobj,rain, speed,scene) {

        
        this.picaMesh = picaMesh;
        this.armature = armature;
        this.allanymation = armature._ranges;
        //console.log(this.allanymation)
        this.picaMesh.frontVector = new BABYLON.Vector3(0, 0, 1);
        //initialiser la vision with a cube in front of the player
        this.vuecube = new BABYLON.Mesh.CreateBox("picavue",2,scene);
        this.vuecube.parent = this.picaMesh;
        this.vuecube.position.y += 8;
        this.vuecube.position.z += 5;
        this.vuecube.visibility = 0;

        ///////////////////////         creer les affichage statistique       //////////////////////

        const blackmat = new BABYLON.StandardMaterial("mat");
        blackmat.Color = new BABYLON.Color3(0, 0, 0);
        blackmat.diffuseColor = new BABYLON.Color3(0, 0, 0);
        blackmat.specularColor  = new BABYLON.Color3(0, 0, 0);

        this.life = 5;
        this.maxlife=5;
        this.lifebar = new BABYLON.MeshBuilder.CreateBox("picalivebar", {height: 0.2, width: 1},scene);
        this.lifebar.parent = this.picaMesh;
        this.lifebar.position.y += 11;
        this.lifebar.scaling.x = this.life;

        const lifemat = new BABYLON.StandardMaterial("mat");
        lifemat.Color = new BABYLON.Color3(1, 0, 0);
        lifemat.diffuseColor = new BABYLON.Color3(1, 0, 0);
        lifemat.specularColor  = new BABYLON.Color3(0, 0, 0);
        this.lifebar.material = lifemat;

        this.lifeblackbar = new BABYLON.MeshBuilder.CreatePlane("picablackbar", {height: 0.2, width: 1},scene);
        this.lifeblackbar.parent = this.picaMesh;
        this.lifeblackbar.position.y += 11;
        this.lifeblackbar.position.z -=0.1;
        this.lifeblackbar.material = blackmat;
        this.lifeblackbar.scaling.x = this.maxlife;


        this.nextlevelexperience = 5;
        this.experience = 0;
        this.experiencebar = new BABYLON.MeshBuilder.CreateBox("picalivebar", {height: 0.05, width: 1},scene);
        this.experiencebar.parent = this.picaMesh;
        this.experiencebar.position.y += 10.7;
        this.experiencebar.position.x -= 2.5;
        this.experiencebar.scaling.x = 0;

        const experiencemat = new BABYLON.StandardMaterial("mat");
        experiencemat.Color = new BABYLON.Color3(0, 1, 0);
        experiencemat.diffuseColor = new BABYLON.Color3(0, 1, 0);
        experiencemat.specularColor  = new BABYLON.Color3(0, 0, 0);
        this.experiencebar.material = experiencemat;

        this.expblackbar = new BABYLON.MeshBuilder.CreatePlane("picablackbar", {height: 0.05, width: 1},scene);
        this.expblackbar.parent = this.picaMesh;
        this.expblackbar.position.y += 10.7;
        this.expblackbar.position.z +=0.1;
        this.expblackbar.material = blackmat;
        this.expblackbar.scaling.x = this.nextlevelexperience;
    

        //creer bar d'energie
        this.maxenergie=5;
        this.energie = 5;
        this.energiebar = new BABYLON.MeshBuilder.CreateBox("picalivebar", {height: 0.08, width: 1},scene);
        this.energiebar.parent = this.picaMesh;
        this.energiebar.position.y += 10.4;
        this.energiebar.scaling.x = this.energie;

        const energiemat = new BABYLON.StandardMaterial("mat");
        energiemat.Color = new BABYLON.Color3(0, 1, 1);
        energiemat.diffuseColor = new BABYLON.Color3(0, 1, 1);
        energiemat.specularColor  = new BABYLON.Color3(0, 0, 0);
        this.energiebar.material = energiemat;

        this.energieblackbar = new BABYLON.MeshBuilder.CreatePlane("picablackbar", {height: 0.08, width: 1},scene);
        this.energieblackbar.parent = this.picaMesh;
        this.energieblackbar.position.y += 10.4;
        this.energieblackbar.position.z -=0.1;
        this.energieblackbar.material = blackmat;
        this.energieblackbar.scaling.x = this.maxenergie;



        this.level = 1;
        this.maxlevel = 8;
        this.dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", {width:30, height:30}, scene, false);
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseTexture = this.dynamicTexture;
        //Set font
	    
        this.dynamicTexture.drawText(""+this.level, null, null, "bold " + 16 + "px Arial", "#000000", "#ffffff", true);
        
    
        //Create plane and set dynamic texture as material
        this.planelevel = BABYLON.MeshBuilder.CreatePlane("plane", {width:1, height:1}, scene);
        this.planelevel.parent = this.picaMesh;
        this.planelevel.position.y += 10.7;
        this.planelevel.position.x -= 3.5;
        this.planelevel.material = mat;

        ///////////////////////////////////////////////////////////////////////////////////////////////


        
        

        this.animationstate = 0;
        this.anim;
        this.isrunning = false;
        this.notbloque=true;
        if(speed)
            this.speed = speed;
        else
            this.speed = 0.75;
        if(speed)
            this.runspeed = speed*2;
        else
            this.runspeed = 1.5;
        // in case, attach the instance to the mesh itself, in case we need to retrieve
        // it after a scene.getMeshByName that would return the Mesh
        // SEE IN RENDER LOOP !
        
        this.attacstate = 0;
        this.boolincrenergie = true;
        this.jump = -2;
        
        picaMesh.Pica = this;

        //bounder to controle colision
        
        this.bounder = new BABYLON.Mesh.CreateBox("bounderpica", 1, scene);
        let bounderMaterial = new BABYLON.StandardMaterial("mat", scene);;
        bounderMaterial.alpha = 0;
        this.bounder.material = bounderMaterial;
        this.bounder.checkCollisions = true;
        this.bounder.ellipsoid = new BABYLON.Vector3(4, 5, 4);
        
        this.bounder.position = this.picaMesh.position.clone();
        this.bounder.position.y +=6;
        this.bounder.scaling.x = 10;
        this.bounder.scaling.y = 10;
        this.bounder.scaling.z = 10;
        
        this.bounder.physicsImpostor = new BABYLON.PhysicsImpostor(this.bounder, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);
        

        this.bounder.isVisible = true;
        //this.picaMesh.showBoundingBox = true;
        this.picaMesh.checkCollisions = false;
        
        
        //this.picaMesh.showSubMeshesBoundingBox = true;
        //this.picaMesh.setBoundingInfo(this.bounder.getBoundingInfo());
        /*this.picaMesh.bounder.scaling.x = 3;
        this.picaMesh.bounder.scaling.y = 2;
        this.picaMesh.bounder.scaling.z = 1.3;
        */
        this.bounder.picaMesh = this.picaMesh;

        this.picaeclairemesh = picaeclaireobj.meshes[0];
        this.picaeclairemeshes = picaeclaireobj.meshes;
        this.picaeclairemesh.scaling = new BABYLON.Vector3(7,7,20);
        this.picaeclairemesh.position.y +=2;
        this.picaeclairemesh.position.x +=2;
        this.picaeclairemesh.position.z +=11;
        this.picaeclairemesh.parent = picaMesh;
        this.picaatarmature = picaeclaireobj.skeletons[0];
        this.picaeclairemesh.name = "picaeclaire";
        this.picaeclairemeshes.forEach(picaeclairemesh => {
            picaeclairemesh.material.alpha = .1;
            picaeclairemesh.visibility= 0.9;
        });
        this.visibilityeclairemesh(false);
        this.cplight = new BABYLON.PointLight("myLight2", new BABYLON.Vector3(0,  0, 0), scene);
        
        this.cplight.parent = this.picaMesh;
        this.cplight.position = new BABYLON.Vector3(0,  5, -4)
        this.cplight.diffuse = new BABYLON.Color3(0.97, 0.8, 0.02);
        this.cplight.range = 100;
        this.cplight.intensity = 2;
        
        
        //console.log(rain.emitter);
        rain.start();
        this.rain = rain;
    }


    visibilityeclairemesh(visible){
        this.picaeclairemeshes.forEach(picaeclairemesh => {
            picaeclairemesh.isVisible = visible;
        });
    }

    incrlevel(){
        this.level+=1;
        this.maxlife+=0.5;
        this.modifiemaxbar(this.lifeblackbar,0.5);
        this.maxenergie+=0.5;
        this.modifiemaxbar(this.energieblackbar,0.5);
        this.nextlevelexperience+=2;
        this.modifiemaxbar(this.expblackbar,2);
        this.dynamicTexture.drawText(""+this.level, null, null, "bold " + 16 + "px Arial", "#000000", "#ffffff", true);
        //full live
        this.degat(-1*(this.maxlife-this.life));
        
    }

    increxperience(val){
        if(this.level<this.maxlevel){
            this.experience+=val;
            if(this.experience>= this.nextlevelexperience){
                this.incrlevel();
                this.modifiemaxbar(this.experiencebar,-this.experiencebar.scaling.x);
                this.experience=0;
            }else{
                this.modifiemaxbar(this.experiencebar,val);
            }
        }
        
    }


    degat(degat){
        if(this.life>=0  && this.life - degat <= this.maxlife){
            this.life-=degat;
            this.modifiemaxbar(this.lifebar,-degat); 
        }
    }



    modifiemaxbar(bar,incr){
        bar.scaling.x +=incr;
        bar.position.x+=incr/2;
    }


    
    move(scene,inputStates, mymouse) {
        this.checkColisionAction(scene);
        this.rain.emitter = new BABYLON.Vector3(this.bounder.position.x,30,this.bounder.position.z);
        // bloque mouvement si bounder not ready
        if (!this.bounder) return;
        this.bounder.computeWorldMatrix();
        this.picaMesh.position = new BABYLON.Vector3(this.bounder.position.x,
            this.bounder.position.y-5, this.bounder.position.z);
        this.bounder.moveWithCollisions(new BABYLON.Vector3(0,this.jump,0));
        if(this.jump>-2){
            this.jump-=0.5;
        }
        if(this.boolincrenergie){
            this.boolincrenergie = false;
            this.degat(-0.3)
            if(this.energie<this.maxenergie){
                this.energie += 1;
                this.modifiemaxbar(this.energiebar,1);
                
            }
            setTimeout(() => {
                this.boolincrenergie=true;   
            }, 1000 *4)
        }
        


        if(inputStates.switch){
            
            this.attacstate = !this.attacstate;
            //console.log("switch",this.attacstate)
            inputStates.switch = false;
        }
            

        if(inputStates.up) {
            if(this.isrunning){
                this.bounder.moveWithCollisions(this.picaMesh.frontVector.multiplyByFloats(this.runspeed, this.runspeed, this.runspeed));
            }else{
                this.bounder.moveWithCollisions(this.picaMesh.frontVector.multiplyByFloats(this.speed,this.speed,this.speed));
            }
        }    
        if(inputStates.down) {
            //tank.moveWithCollisions(new BABYLON.Vector3(0, 0, -1*tank.speed));
            if(this.isrunning){
                this.bounder.moveWithCollisions(this.picaMesh.frontVector.multiplyByFloats(-this.runspeed, -this.runspeed, -this.runspeed));
            }else{
                this.bounder.moveWithCollisions(this.picaMesh.frontVector.multiplyByFloats(-this.speed, -this.speed, -this.speed));
            }
        }    
        if(inputStates.left) {
            //tank.moveWithCollisions(new BABYLON.Vector3(-1*tank.speed, 0, 0));
            let left =  new BABYLON.Vector3(Math.sin(this.picaMesh.rotation.y-1.40), 0, Math.cos(this.picaMesh.rotation.y-1.40))
            if(this.isrunning){
                this.bounder.moveWithCollisions(left.multiplyByFloats(this.runspeed, this.runspeed, this.runspeed));
            }else{
                this.bounder.moveWithCollisions(left.multiplyByFloats(this.speed, this.speed, this.speed));
            }
            //this.picaMesh.frontVector = new BABYLON.Vector3(Math.sin(this.picaMesh.rotation.y), 0, Math.cos(this.picaMesh.rotation.y));
        }    
        if(inputStates.right) {
            //tank.moveWithCollisions(new BABYLON.Vector3(1*tank.speed, 0, 0));
            let left =  new BABYLON.Vector3(Math.sin(this.picaMesh.rotation.y+1.40), 0, Math.cos(this.picaMesh.rotation.y+1.40))
            if(this.isrunning){
                this.bounder.moveWithCollisions(left.multiplyByFloats(this.runspeed, this.runspeed, this.runspeed));
            }else{
                this.bounder.moveWithCollisions(left.multiplyByFloats(this.speed, this.speed, this.speed));
            }
            //this.picaMesh.frontVector = new BABYLON.Vector3(Math.sin(this.picaMesh.rotation.y), 0, Math.cos(this.picaMesh.rotation.y));
        }
        if(mymouse.x<0){
            if(mymouse.x<-200)mymouse.x=-200;
            this.picaMesh.rotation.y += 0.002*mymouse.x;
            this.vuecube.rotation.y += 0.002*mymouse.x;
            this.picaMesh.frontVector = new BABYLON.Vector3(Math.sin(this.picaMesh.rotation.y), 0, Math.cos(this.picaMesh.rotation.y));
            
        }else if(mymouse.x>0){
            if(mymouse.x>200)mymouse.x=200;
            this.picaMesh.rotation.y += 0.002*mymouse.x;
            this.vuecube.rotation.y += 0.002*mymouse.x;
            this.picaMesh.frontVector = new BABYLON.Vector3(Math.sin(this.picaMesh.rotation.y), 0, Math.cos(this.picaMesh.rotation.y));
        }
        
        if(this.notbloque){
            if(inputStates.space && this.picaMesh.position.y<10){
                if(this.isrunning){
                    this.jump=3;
                    this.animation(scene,6)
                }else{
                    this.jump=3;
                }
            }else if(inputStates.run){
                if(this.isrunning){
                    this.isrunning=false;
                    this.animation(scene,3) 
                }else{
                    this.isrunning=true;
                    this.animation(scene,2)
                }
            }else if(inputStates.fight){
                if(this.energie>0){
                    if(this.attacstate){
                        this.aplyshortataccolision(scene,3,20)
                        this.energie-=1;
                        this.modifiemaxbar(this.energiebar,-1);
                        this.animation(scene,7)
                    }else{
                        this.aplyshortataccolision(scene,1,20);
                        this.animation(scene,8);
                    }
                    
                }
            }else if(inputStates.fire){
                if(this.energie>0){
                    if(this.attacstate){
                        this.animation(scene,7)
                        this.notbloque = false;
                        setTimeout(() => {
                            this.throwelectricball(scene);
                            this.notbloque = true;
                        }, 1000 * 1)
                        this.energie-=1;
                        this.modifiemaxbar(this.energiebar,-1);
                    }else{
                        this.visibilityeclairemesh(true);
                        scene.beginAnimation(this.picaatarmature, 0, 32, false);
                        this.notbloque = false;
                        setTimeout(() => { 
                            this.visibilityeclairemesh(false);
                            this.notbloque = true;  
                        }, 1000 * 1)
                        this.aplyshortataccolision(scene,2,200);
                        //this.animation(scene,8);
                        this.energie-=2;
                        this.modifiemaxbar(this.energiebar,-2);
                    }   
                }
            }else if(inputStates.up || inputStates.down || inputStates.left || inputStates.right){
                if(this.isrunning){
                    this.animation(scene,5);
                }else{
                    this.animation(scene,4);
                } 
            }else{
                if(this.isrunning){
                    this.animation(scene,1); 
                }else{
                    this.animation(scene,0); 
                }
            } 
        }
        
        inputStates.fight = false;
        inputStates.fire = false;
        inputStates.space = false;
        mymouse.x = 0;
        mymouse.y = 0;
    }
    

    //0 stand 1 staydown 2 up 3 down 4 walk 5 run  6 jump 7 .. attaque 
    animation(scene,number){
        if(this.animationstate!==number){
            //await this.anim.waitAsync();
            this.animationstate = number;
            let myanimation = Object.values(this.allanymation)[number];
            //wait end animation
            if(number==2 || number == 3 || number == 7 || number == 8 || number == 9){
                this.notbloque = false;
                setTimeout(async () => {
                    this.anim = scene.beginAnimation(this.armature, myanimation.from+2, myanimation.to, false);
                    await this.anim.waitAsync();
                    this.notbloque = true;
                });
            }else{
                this.anim = scene.beginAnimation(this.armature, myanimation.from+2, myanimation.to, true,1);
            }
        }         
    }

    aplyshortataccolision(scene,hitpoint,length){
        let origin = new BABYLON.Vector3(this.picaMesh.position.x,this.picaMesh.position.y+4,this.picaMesh.position.z);
        //let origin = this.position.add(this.frontVector);10

        // Looks a little up (0.1 in y) 
        let direction = new BABYLON.Vector3(this.picaMesh.frontVector.x, this.picaMesh.frontVector.y, this.picaMesh.frontVector.z);
        let ray = new BABYLON.Ray(origin, direction, length);

        // to make the ray visible :
        //let rayHelper = new BABYLON.RayHelper(ray);
        //rayHelper.show(scene, new BABYLON.Color3.Red);
    
        var hit = scene.pickWithRay(ray, (mesh) => {
           return (mesh.name.startsWith("enemy"));
        });

        if (hit.pickedMesh){
            //console.log(hit.pickedMesh.name)
            if(hit.pickedMesh.name.startsWith("enemy")){
                let enemibounder = hit.pickedMesh;
                let enemi = enemibounder.enemiMesh.Enemi;

                enemi.degat(hitpoint);
            }  
	    }
    }

    throwelectricball(scene){
        let sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 4, segments: 32});
        let sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial", scene);
        sphere.material = sphereMaterial;
        sphereMaterial.emissiveColor = new BABYLON.Color3(0.05, 0.05, 0.05);
        sphereMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        sphereMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        sphereMaterial.emissiveTexture = new BABYLON.Texture("img/bouleelec.jpg", scene);

        sphere.position = new BABYLON.Vector3(this.picaMesh.position.x,this.picaMesh.position.y+5,this.picaMesh.position.z);
        sphere.position.addInPlace(this.picaMesh.frontVector.multiplyByFloats(7, 7, 7));
        
        sphere.physicsImpostor = new BABYLON.PhysicsImpostor(
            sphere,
            BABYLON.PhysicsImpostor.SphereImpostor,
            { mass: 1 },
            scene
        );

        let powerOfFire = 100;
        let aimForceVector = new BABYLON.Vector3(
            this.picaMesh.frontVector.x * powerOfFire,
            0,
            this.picaMesh.frontVector.z * powerOfFire
        );
        sphere.physicsImpostor.applyImpulse(aimForceVector, sphere.getAbsolutePosition());
        sphere.actionManager = new BABYLON.ActionManager(scene);

        scene.enemies.forEach(enemi => {
            sphere.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                  {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: enemi.Enemi.bounder,
                  }, 
                  () => {
                    if (enemi.Enemi.bounder._isDisposed) return;
                    enemi.Enemi.degat(2);
                  }
                )
              );
        });

        setTimeout(() => { 
            sphere.dispose();
        },1000*2)
        
    }



    checkColisionAction(scene){
        let origin = new BABYLON.Vector3(this.picaMesh.position.x,this.picaMesh.position.y+7,this.picaMesh.position.z);
        let direction = new BABYLON.Vector3(0, -90,0);
        let ray = new BABYLON.Ray(origin, direction, 0.08);
        //let rayHelper = new BABYLON.RayHelper(ray);
        //rayHelper.show(scene, new BABYLON.Color3.Red);
        var hit = scene.pickWithRay(ray, (mesh) => {
            if(mesh.name.startsWith("LaveCopy")){
                return (mesh.name.startsWith("LaveCopy"));
            }else{
                return (mesh.name.startsWith("fire"));
            }
        });

        if (hit.pickedMesh){
            //console.log(hit.pickedMesh.name)
            if(hit.pickedMesh.name.startsWith("LaveCopy")){
                this.degat(0.03)
            }else if(hit.pickedMesh.name.startsWith("fire")){
                this.degat(0.03)
            }
	    }
    }

}