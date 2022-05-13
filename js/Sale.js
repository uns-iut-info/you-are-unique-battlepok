//import * as BABYLON from "@babylonjs/core";
import Enemi from "./Enemi.js";
import EnemiStatue from "./EnemiStatue.js";

export default class Sale {
    constructor(x,z,y,length,width,height,taille,scene) {
        this.gx = x;
        this.gy = y;
        this.gz = z;
        this.ox = x*taille;
        this.oy = y*taille;
        this.oz = z*taille;
        this.length = length;
        this.width = width;
        this.height = height;
        this.taille = taille;
        this.t = 2;
        this.portesmoke;
        this.porte = this.createporte();
        this.cub = [this.gx,this.gz,this.gx+this.length-1,this.gz+this.width-1];
        this.loaded = 0;
        this.boxes;
        this.box1;
        this.boxlav = BABYLON.Mesh.CreateBox("Box1", 10, scene);
        var lavaMaterial = new BABYLON.StandardMaterial("lava", scene);
        lavaMaterial.noiseTexture = new BABYLON.Texture("img/lavacloud.png", scene); // Set the bump texture
        lavaMaterial.diffuseTexture = new BABYLON.Texture("img/lavatile.jpg", scene);
        lavaMaterial.emissiveColor = new BABYLON.Color3(0.1, 0, 0);
        lavaMaterial.fogColor = new BABYLON.Color3(1, 0, 0);
        lavaMaterial.speed = 1;
        lavaMaterial.unlit = true;
        this.boxlav.material = lavaMaterial
        this.roomtype = parseInt(Math.random()*3);
        this.lights = []
        this.salleenv = []
        this.enemies = []
        this.scene = scene;

        
    }

    create(vlight,scene) {
        this.portesmoke = scene.bluesmoke.clone("system2");
        this.portesmoke.particleTexture = new BABYLON.Texture("img/Smoke_SpriteSheet_8x8.png");
        if(this.porte[0]-this.porte[2]!= 0){
            
            this.portesmoke.emitter = new BABYLON.Vector3((this.porte[0]+1)*this.taille+this.ox,5,(this.porte[1])*this.taille+this.oz)
            
        }else{
            this.portesmoke.emitter = new BABYLON.Vector3((this.porte[0])*this.taille+this.ox,5,(this.porte[1]+1)*this.taille+this.oz)
        }
        this.portesmoke.start();
        //this.portesmoke.addLODLevel(500,null);
        
        let posx = parseInt(this.ox+Math.random()*60+80);
        let posz = parseInt(this.oz+Math.random()*60+80);
        let cvlight = vlight.createInstance("vlight1")
        cvlight.position = new BABYLON.Vector3(posx,  20, posz)
        this.salleenv.push(cvlight);
        let cplight = new BABYLON.PointLight("myLight1", new BABYLON.Vector3(posx,  20, posz), scene);
        this.lights[1] = cplight;
        //this.salleenv.push(cplight)
        cplight.intensity = 10;
        cplight.range = 100;
        cplight.diffuse = new BABYLON.Color3(1, 0.1, 0.1);  
        cplight.specularColor = new BABYLON.Color3(0, 0, 0);
        let choice = parseInt(Math.random()*3)
        if(choice===0){
            cplight.diffuse = new BABYLON.Color3(1, 0.1, 0.1);    
        }
        if(choice===1){
            cplight.diffuse = new BABYLON.Color3(0.1, 1, 0.1);    
        }
        if(choice===2){
            cplight.diffuse = new BABYLON.Color3(0.1, 0.1, 1);    
        }
        
        
        let pos2x = parseInt(this.ox+Math.random()*40+20);
        let pos2z = parseInt(this.oz+Math.random()*40+20);
        let cvlight2 = vlight.createInstance("vlight1")
        this.salleenv.push(cvlight2)
        cvlight2.position = new BABYLON.Vector3(pos2x,  20, pos2z)
        this.lights[2] = cvlight2;
        let cplight2 = new BABYLON.PointLight("myLight2", new BABYLON.Vector3(pos2x,  20, pos2z), scene);
        this.lights[3] = cplight2;
        cplight2.intensity = 5;
        cplight2.range = 100;
        //this.salleenv.push(cplight2)        

        let choice2 = parseInt(Math.random()*3)
        cplight2.diffuse = new BABYLON.Color3(1, 0.1, 0.1);  
        cplight2.specularColor = new BABYLON.Color3(0, 0, 0);
        if(choice2===0){
            cplight2.diffuse = new BABYLON.Color3(1, 0.1, 0.1);   
        }else if(choice2===1){
            cplight2.diffuse = new BABYLON.Color3(0.1, 1, 0.1);     
        }
        else{
            cplight2.diffuse = new BABYLON.Color3(0.1, 0.1, 1);    
        }
        

        var box1 = BABYLON.Mesh.CreateBox("Box1", this.taille, scene);
        this.box1 = box1;
        //light of all copies are only affexted by cplight2
        

        this.boxlav.position.y= this.oy;
        this.boxlav.position.x= this.ox;
        this.boxlav.position.z= this.oz;


        box1.Color = new BABYLON.Color3(1, 0, 0);
        var materialBox = new BABYLON.StandardMaterial("mat", scene);
        var texture = new BABYLON.Texture("img/sole2.jpg", scene);
        materialBox.specularColor = new BABYLON.Color3(0, 0, 0);
        materialBox.diffuseTexture = texture;
        materialBox.freeze();
        box1.material = materialBox;
        box1.position.y= this.oy;
        box1.position.x= this.ox;
        box1.position.z= this.oz;
        box1.checkCollisions = true;
        box1.setEnabled(false);
        box1.addLODLevel(500, null);
        box1.computeWorldMatrix();
        box1.freezeWorldMatrix();
        box1.convertToUnIndexedMesh();
        
        var box2 = BABYLON.Mesh.CreateBox("Box1", this.taille, scene);
        
        //creating spher
        const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameterX: 5, diameterY: 5, diameterZ: 1});

        
        
        
        var materialBox2 = new BABYLON.StandardMaterial("mat", scene);
        materialBox2.specularColor = new BABYLON.Color3(0, 0, 0);
        var texture2 = new BABYLON.Texture("img/mure.jpg", scene);
        materialBox2.diffuseTexture = texture2;
        materialBox2.freeze()
        box2.material = materialBox2;
        box2.position.y= this.oy;
        box2.position.x= this.ox;
        box2.position.z= this.oz;
        box2.setEnabled(false);
        box2.addLODLevel(500, null);
        box2.checkCollisions = true;
        box2.computeWorldMatrix();
        box2.freezeWorldMatrix();
        box2.convertToUnIndexedMesh();
        this.salleobjects = []

        // light only
        cplight.includedOnlyMeshes.push(box1);
        cplight2.includedOnlyMeshes.push(box1);
        cplight.includedOnlyMeshes.push(box2);
        cplight2.includedOnlyMeshes.push(box2);
        // to be taken into account by collision detection
        //
        let boxes = [];
        let nb = 0
        for (let x = 0; x < this.length; x++) {
            for(let z = 0; z < this.width; z++){
                if(x==0 || x==this.length-1 || z==0 || z==this.width-1){
                    if(this.porte[0]<=x && x<=this.porte[2] && this.porte[1]<=z && z<=this.porte[3]){
                        boxes[nb] = box1.createInstance("copySaleSolebox"+nb);
                        boxes[nb].position.x += x*this.taille;
                        boxes[nb].position.z += z*this.taille;
                        boxes[nb].freezeWorldMatrix();
                        //collision
                        boxes[nb].checkCollisions = true;
                        //boxes[nb].physicsImpostor = new BABYLON.PhysicsImpostor(boxes[nb], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);
                        nb+=1;
                    }else{
                        for(let y = 0; y < this.height; y++){
                            boxes[nb] = box2.createInstance("copySaleMurebox"+nb);
                            boxes[nb].position.x += x*this.taille;
                            boxes[nb].position.z += z*this.taille;
                            boxes[nb].position.y += y*this.taille;
                            boxes[nb].freezeWorldMatrix();
                            //boxes[nb].physicsImpostor = new BABYLON.PhysicsImpostor(boxes[nb], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 1 }, scene);
                            boxes[nb].checkCollisions = true;
                            nb+=1;  
                        }
                    }
                }else{
                    //type lave au sol
                    if(this.roomtype==1){
                        if(parseInt(Math.random()*7)==0){
                            boxes[nb] = this.boxlav.createInstance("LaveCopy"+nb);
                        }else{
                            boxes[nb] = this.box1.createInstance("copySaleSolebox"+nb);
                        }   
                    }else{
                        boxes[nb] = this.box1.createInstance("copySaleSolebox"+nb);
                    }
                    boxes[nb].position.x += x*this.taille;
                    boxes[nb].position.z += z*this.taille;
                    boxes[nb].freezeWorldMatrix();
                    boxes[nb].checkCollisions = true;
                    this.salleenv.push(boxes[nb]);
                    nb+=1; 
                }
            }    
        }
        this.boxes = boxes;
        // fais desenable tous les objets interne
        this.salleenv.forEach(element => {
            element.setEnabled(false);
        });
    }
    createporte() {
        
        let descript = [];
        let val = parseInt(Math.random ()*4);
        if(val==0){
            let positionz = parseInt( Math.random ()*(this.length-this.t));
            descript[0] = 0; 
            descript[1] = positionz;
            descript[2] = 0;
            descript[3] = positionz+this.t;
        }else if(val==1){
            let positionz = parseInt(Math.random ()*(this.length-this.t));
            descript[0] = this.length-1; 
            descript[1] = positionz; 
            descript[2] = this.length-1; 
            descript[3] = positionz+this.t;
        }else if(val==2){
            let positionx = parseInt(Math.random ()*(this.width-this.t));
            descript[0] = positionx; 
            descript[1] = 0;
            descript[2] = positionx+this.t;
            descript[3] = 0;
        }else{
            let positionx = parseInt(Math.random ()*(this.width-this.t));
            descript[0] = positionx;
            descript[1] = this.length-1; 
            descript[2] = positionx+this.t;
            descript[3] = this.length-1;
        }
        
        return descript;

    }

    createroom(marowakobj,scene){
        this.salleenv.forEach(element => {
            element.setEnabled(true);
        });
        let marowakmesh = this.doClone(marowakobj.meshes[0],  marowakobj.skeletons,1)
        marowakmesh.setEnabled(true);
        marowakmesh.addLODLevel(200, null);
        marowakmesh.position = new BABYLON.Vector3(this.ox+100, 8, this.oz+100)
        
        if(this.roomtype==2){
            this.createDragonRoom(scene)
        }
        
       
        
        let marowak = new Enemi(marowakmesh,marowakmesh.skeleton,1,7,scene);
        scene.enemies.push(marowakmesh);
        this.enemies.push(marowakmesh);    
        
    }

    createDragonRoom(scene){
        for (let i = 0; i < 4; i++) {
            let xval = Math.random()*4;
            let fires = [];
            for (let z = 0; z < 15; z++) {
                let fire2 = scene.fire.clone("fire");
                fire2.particleTexture = new BABYLON.Texture("img/Fire_SpriteSheet1_8x8.png");
                fire2.emitter = new BABYLON.Vector3(this.ox+40*i+15, 5, this.oz+30+10*z);
                fires.push(fire2);
            }
            let statueDragon = scene.enemies.statuedragon.clone("Statue");
            statueDragon.position = new BABYLON.Vector3(this.ox+40*i+10, 5, this.oz+5)
            statueDragon.setEnabled(true);
            let statueDragonp = new EnemiStatue(statueDragon,fires,scene);
            this.enemies.push(statueDragon);
            scene.enemies.push(statueDragon);
        }

    }


    disolveroom(scene){
        this.salleenv.forEach(element => {
            element.setEnabled(false);
        });
        this.enemies.forEach(enemi => {
            scene.enemies.pop(enemi);
            enemi.dispose();
            enemi.Enemi.bounder.dispose();
        });
        this.enemies = [];
    }


    disposesalle(){
        this.boxes.forEach(box => {
            box.dispose()
        }); 
        this.lights.forEach(light => {
            light.dispose()
        });
        this.portesmoke.dispose();
    }


    doClone(originalMesh, skeletons,id) {
        let myClone;
    
        myClone = originalMesh.clone("enemimarowak");
        if(!skeletons) return myClone;
    
        // The mesh has at least one skeleton
        if(!originalMesh.getChildren()) {
            myClone.skeleton = skeletons[0].clone("clone_" + id + "_skeleton");
            return myClone;
        } else {
            if(skeletons.length === 1) {
                // the skeleton controls/animates all children, like in the Dude model
                let clonedSkeleton = skeletons[0].clone("clone_" + id + "_skeleton");
                myClone.skeleton = clonedSkeleton;
                let nbChildren = myClone.getChildren().length;
    
                for(let i = 0; i < nbChildren;  i++) {
                    myClone.getChildren()[i].skeleton = clonedSkeleton
                }
                return myClone;
            } else if(skeletons.length === originalMesh.getChildren().length) {
                // each child has its own skeleton
                for(let i = 0; i < myClone.getChildren().length;  i++) {
                    myClone.getChildren()[i].skeleton = skeletons[i].clone("clone_" + id + "_skeleton_" + i);
                }
                return myClone;
            }
        }
    }
}