//import * as BABYLON from "@babylonjs/core";
import Pica from "./Pica.js";
import Sale from "./Sale.js";
import Chemin from "./Chemin.js";
import Createur from "./Createur.js";
import Enemi from "./Enemi.js";

let canvas;
let engine;
let scene;
let camera;


let inputStates = {};
let mymouse = {};

let playground = [0,0,50,50]
let salles = [];
let chemin = [];
let cubes = [];
let chargecubes = [];
let mystart = false;
let gamestart = true;
let endgame = false;
let externenmies = [];
let first =true;
let scenestart;
let actuelimput = true;    

window.onload = startGame;

function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);
    engine.displayLoadingUI();
    
    let guigame = guiscene();
    let last = lastscene();
    let win = winscene();
    const promise = createScene();
    
    promise.then(() => { 
        let picamesh = scene.pica.bounder;
        //picamesh.position.x = salles[0].ox+50;
        //picamesh.position.z = salles[0].oz+50;
        picamesh.position.y = 10;
        scene.activeCamera = createFollowCamera(scene,picamesh.position, scene.pica.vuecube);
        

        modifySettings();

        setTimeout(() => {
            engine.hideLoadingUI() 
        }, 1000)
         // main animation loop 60 times/s
        engine.runRenderLoop(() => {
            if(mystart){
                scenestart.render();
                //setTimeout(gamestart = true,1000)
                //mystart=true;
            }else if(gamestart){
                guigame.render();
            }else if(endgame){
                guigame.dispose();
                last.render();
            }else if(scene.endgame){
                guigame.dispose();
                last.dispose();
                win.render();
            }else{
                let picatchu = scene.getMeshByName("mypicatchu");
                if(picatchu){
                    picatchu.Pica.move(scene,inputStates,mymouse);
                    //console.log(picatchu.Pica.bounder.x);
                    if(picatchu.Pica.life <=0){
                    //empesh une boucle
                       // picatchu.Pica.life = 10;
                       //picatchu.Pica.animation(scene,9);
                       gamestart=true; 
                       salles = [];
                        chemin = [];
                        cubes = [];
                        chargecubes = [];
                        scene.dispose();
                        playground = [0,0,50,50];
                        const promise = createScene();
                        
                        promise.then(() => {
                            let picamesh = scene.pica.bounder;
                            scene.activeCamera = createFollowCamera(scene,picamesh.position, scene.pica.vuecube);
                           pointerlog();
                        })
                        
                        
                    }
                    if(scene.endgame){
                        last.render();
                    }
                    // when the picka is not on the ground he dies
                    if (picatchu.position.y <=0.1){
                        setTimeout(() => {
                            if (picatchu.position.y <=0.1){
                                picatchu.Pica.degat(0.1);
                        }},2000);
                    }
                    effect();
            
                    actionEnemies();
                }
                    
                if(scene.activeCamera){
                    scene.render();
                }else{
                    scene.activeCamera = createFreeCamera(scene)
                }
            }
        });
    })
}
    //scene.assetsManager.load();



function createscenevideo() {
    let videoscene = new BABYLON.Scene(engine);
    canvas = document.querySelector("#myCanvas");
    var startvideo = new BABYLON.VideoTexture("video", "videos/depart.mp4", videoscene, false);
    var planeOpts = {
        height: 120, 
        width: 240, 
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
    };
    //let box = BABYLON.Mesh.CreateBox("Box1", 100, videoscene);
    //box.position = new BABYLON.Vector3(0, 50, 0);
    let alllightv = new BABYLON.HemisphericLight("myLight", new BABYLON.Vector3(0, 20, 0), videoscene);
    alllightv.intensity = 3;
    alllightv.diffuse = new BABYLON.Color3(1, 1, 1);

    var ANote0Video = BABYLON.MeshBuilder.CreatePlane("plane", planeOpts, videoscene);
    ANote0Video.position = new BABYLON.Vector3(0,0,0.1);
    var ANote0VideoMat = new BABYLON.StandardMaterial("m", videoscene);
    ANote0VideoMat.diffuseTexture = startvideo;
    ANote0VideoMat.roughness = 1;
    //ANote0VideoMat.emissiveColor = new BABYLON.Color3.White();
    ANote0Video.material = ANote0VideoMat;
    //videoscene.onPointerDown = function () {
        startvideo.video.play();
        videoscene.onPointerDown = null;
        setTimeout(() => {
            mystart = false;
            const videoEl = startvideo.video 
            // Dispose texture
            startvideo.video.pause();
            startvideo.dispose();


            // Remove any <source> elements, etc.
            while (videoEl.firstChild) {
                videoEl.removeChild(videoEl.lastChild);
            }

            // Set a blank src
            videoEl.src = ''

            // Prevent non-important errors in some browsers
            videoEl.removeAttribute('src')

            // Get certain browsers to let go
            videoEl.load()

            videoEl.remove()
            
            engine.displayLoadingUI();
            scenestart.dispose()
            salles = [];
            chemin = [];
            cubes = [];
            chargecubes = [];
            scene.dispose();
            playground = [0,0,50,50];
            const promise = createScene();
        
            promise.then(() => {
                setTimeout(() => {
                    engine.hideLoadingUI() 
                }, 500)
                let picamesh = scene.pica.bounder;
                scene.activeCamera = createFollowCamera(scene,picamesh.position, scene.pica.vuecube);
                // modifySettings();
                gamestart=false;
                pointerlog();
                music()
            })
            
        }, 48000)

    //};
    startvideo.onended = function() {
        alert("The audio has ended");
      };

    //let camera = createFreeCamera(videoscene) 
    let camera = new BABYLON.FollowCamera("picatchuFollowCamera",new BABYLON.Vector3(0,0,0), videoscene, ANote0Video);
    camera.radius = 125; // how far from the object to follow
	camera.heightOffset = 0; // how high above the object to place the camera
	camera.rotationOffset = 180; // the viewing angle
	
    camera.cameraAcceleration = 0.1; // how fast to move
	camera.maxCameraSpeed = 1;
    videoscene.camera = camera;
    
    return videoscene;
}


async function createScene () {

    scene = new BABYLON.Scene(engine);
    canvas = document.querySelector("#myCanvas");
    scene.enablePhysics();
    scene.enemies = [];
    scene.blockMaterialDirtyMechanism = true;
    scene.blockfreeActiveMeshesAndRenderingGroups = true;
    

    var physicsEngine =  scene.getPhysicsEngine();
    //Get gravity
    var gravity = physicsEngine.gravity;

    //Set gravity
    physicsEngine.setGravity(new BABYLON.Vector3(0, 0, 0))
    
    let ground = BABYLON.MeshBuilder.CreateGround("myGround", {width: 2000, height: 2000, segments:1000}, scene);
    ground.position = new BABYLON.Vector3(250,-1,250);
    ground.checkCollisions = true;
    //ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 }, scene);
    let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("img/ground.jpg", scene);
    // groundMaterial.diffuseTexture = new BABYLON.Texture("img/sole1.jpg", scene);
    ground.material = groundMaterial;
    scene.ground = ground;

    var skybox = BABYLON.Mesh.CreateBox("BackgroundSkybox", 2000, scene, undefined, BABYLON.Mesh.BACKSIDE);
    skybox.checkCollisions = true;
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("img/skybox/skybox", scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0.72, 0.4, 0.61);
	skyboxMaterial.specularColor = new BABYLON.Color3(0.4, 0.4, 0.95);
	skyboxMaterial.disableLighting = true;
	skybox.material = skyboxMaterial;
    skyboxMaterial.luminance = 100;
    scene.skybox = skybox;

    var waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 2000, 2000, 32, scene, false);
	var water = new BABYLON.WaterMaterial("water", scene, new BABYLON.Vector2(512, 512));
	water.bumpTexture = new BABYLON.Texture("img/waterbump.png", scene);
	water.windForce = -15;
	water.waveHeight = 0.1;
	water.windDirection = new BABYLON.Vector2(1, 1);
	water.waterColor = new BABYLON.Color3(0.75, 0.02, 0.78);
	water.colorBlendFactor = 0.3;
	water.bumpHeight = 1;
	water.waveLength = 0.4;
	//water.addToRenderList(skybox);
	water.addToRenderList(ground);
	waterMesh.material = water;
    scene.waterground = waterMesh; 

    BABYLON.ParticleHelper.BaseAssetsUrl = "./particuleeffects"
    let Psystem = await BABYLON.ParticleHelper.CreateAsync("bluesmoke", scene);
    scene.bluesmoke = Psystem.systems[0];
    let Pfire =  await BABYLON.ParticleHelper.CreateAsync("fire", scene);
    scene.fire = Pfire.systems[0];
    let Prain = await BABYLON.ParticleHelper.CreateAsync("rain", scene);
    let rain = Prain.systems[0];
    rain.particleTexture = new BABYLON.Texture("img/Rain.png");

    
    
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    scene.fogColor = new BABYLON.Color3(0.50, 0.25, 0.40);
    scene.fogDensity = 0.004;
    
    //scene.fogStart = 0.0;
    //scene.fogEnd = 500.0;
    /*scene.debugLayer.show({
        embedMode: true,
    });
    */
    camera = new BABYLON.FreeCamera("myCamera", new BABYLON.Vector3(0, 5, 10), scene);
    camera.attachControl(canvas);
    //scene.assetsManager = configureAssetManager(scene);

    const vlightmesh = await BABYLON.SceneLoader.ImportMeshAsync("", "3dmodule/light/", "light.babylon", scene);
    const marowakobj = await BABYLON.SceneLoader.ImportMeshAsync("", "3dmodule/Marowak/", "marowak.babylon", scene);
    const picaeclaireobj = await BABYLON.SceneLoader.ImportMeshAsync("", "3dmodule/Picatchu/Picalightatac/", "picalightatc.babylon", scene); 
    const picamesh = await BABYLON.SceneLoader.ImportMeshAsync("", "3dmodule/Picatchu/", "picatchu5d.babylon", scene);
    const labras = await BABYLON.SceneLoader.ImportMeshAsync("", "3dmodule/Labras/", "lapras.babylon", scene);
    const statuedragon = await BABYLON.SceneLoader.ImportMeshAsync("","3dmodule/StatueDragon/","StatueDragon.babylon",scene);
    const papillon = await BABYLON.SceneLoader.ImportMeshAsync("","3dmodule/Papillon/","papillon.babylon",scene);
    const explosif = await BABYLON.SceneLoader.ImportMeshAsync("","3dmodule/Plosif/","pokemonexplosif.babylon");
    const arena = await BABYLON.SceneLoader.ImportMeshAsync("","3dmodule/Arena/","arene.babylon",scene);
    const mewtwo = await BABYLON.SceneLoader.ImportMeshAsync("","3dmodule/Mewtwo/","mewtwo.babylon",scene);
    const epona = await BABYLON.SceneLoader.ImportMeshAsync("","3dmodule/Epona/","epona.babylon",scene);
    
    scene.enemies.mewtwo = mewtwo;
    mewtwo.meshes[0].scaling = new BABYLON.Vector3(4,4,4);
    mewtwo.meshes[0].setEnabled(false);
    arena.meshes[0].scaling = new BABYLON.Vector3(10,10,10);
    arena.meshes[0].position = new BABYLON.Vector3(800,30,700);
    arena.meshes[0].rotation.y +=3.2;
    arena.meshes[0].checkCollisions = true;

    epona.meshes[0].setEnabled(false);
    scene.enemies.epona = epona;
    scene.enemies.epona.meshes[0].scaling = new BABYLON.Vector3(8,8,8);

    explosif.meshes[0].setEnabled(false);
    scene.enemies.explosif = explosif;

    scene.enemies.statuedragon = statuedragon.meshes[0];
    scene.enemies.statuedragon.scaling = new BABYLON.Vector3(0.2,0.2,0.2);
    papillon.meshes[0].setEnabled(false);
    statuedragon.meshes[0].setEnabled(false);
    scene.enemies.marowakobj = marowakobj.meshes[0];
    scene.enemies.labras = labras;
    scene.enemies.papillon = papillon;
    labras.meshes[0].setEnabled(false);
    marowakobj.meshes[0].setEnabled(false);
    scene.endgame = false;

     //creer box départ pour ne pas étre dans le feut des le départ
     var box1 = BABYLON.Mesh.CreateBox("Box1",10,scene);
     var materialBox = new BABYLON.StandardMaterial("mat", scene);
     var texture = new BABYLON.Texture("img/sole2.jpg", scene);
     box1.position = new BABYLON.Vector3(0, 0.5, 0);
     materialBox.diffuseTexture = texture;
     box1.material = materialBox;
     box1.checkCollisions = true;
     box1.addLODLevel(500, null);

    // Create and tweak the background material.
    /*backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay", scene);
    backgroundMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skybox.material = backgroundMaterial;
    */
    // background
    //let ground = BABYLON.MeshBuilder.CreateGround("myGround", {width: 60, height: 60}, scene);
    scene.collisionsEnabled = true;

    
    let alllight = new BABYLON.HemisphericLight("myLight", new BABYLON.Vector3(0, 20, 0), scene);
    alllight.intensity = 0.8;
    // color of the light
    alllight.diffuse = new BABYLON.Color3(0.5, 0.5, 0.5);

    var clowlayer = new BABYLON.GlowLayer("lightglow",scene);
    clowlayer.intensity = 5;
    
    
    let vlight = vlightmesh.meshes[0];
    vlight.addLODLevel(200, null);
    vlight.setEnabled(false);
    let larmature = vlightmesh.skeletons[0];
    scene.beginAnimation(larmature, 0, 16, true, 1);
    vlight.name = "vlight"
    vlight.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5)
    
    
    //clowlayer.addIncludedOnlyMesh(vlight)
    vlight.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
    
    
    let picatchu = picamesh.meshes[0];

    let armature = picamesh.skeletons[0];
    picatchu.name = "mypicatchu";
    scene.pica = new Pica(picatchu,armature,picaeclaireobj,rain, 1.3,scene);  
    scene.pica.bounder.position = new BABYLON.Vector3(0,15,0);

    createenv(vlight,marowakobj,scene);

    return scene;
}

function createenv(vlight,marowakobj,scene){
    let taille = 10;
    let nbsalles = 4;
    let found = false;
    for(let i = 0; i<nbsalles;i++){
        found = false;
        let x;
        let y;
        let z;
        while(!found){
            found = true;
            x = parseInt(playground[0]+Math.random()*(playground[2]-playground[0]));
            z = parseInt(playground[1]+Math.random()*(playground[3]-playground[1]));
            y = 0;
            for(let icubes= 0; icubes<cubes.length; icubes++){
                if(containe([x,z,x+20,z+20], cubes[icubes])){
                    found=false;
                }
            }
        }
        cubes[i] = [x,z,x+20,z+20];
        chargecubes[i] = new BABYLON.Mesh.CreateBox("cobesi",185,scene);
        chargecubes[i].position = new BABYLON.Vector3((x+9)*taille,y,(z+9)*taille);
        chargecubes[i].actionManager = new BABYLON.ActionManager(scene);
        chargecubes[i].actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
              {
                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter: scene.pica.bounder,
              },
              () => {
                    salles[i].portesmoke.reset();
                    salles[i].portesmoke.stop();
                    salles[i].createroom(marowakobj, scene);
                    scene.pica.rain.stop();
                    //Décharge les enemies extérieur
                    externenmies.forEach(enemi => {
                        
                        enemi.setEnabled(false);
                    });
                }
            )
        );
        chargecubes[i].actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
              {
                trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
                parameter: scene.pica.bounder,
              },
              () => {
                    salles[i].portesmoke.start();
                    salles[i].disolveroom(scene);
                    scene.pica.rain.start();
                    //recreez le monde exterieur
                    externenmies.forEach(enemi => {
                        enemi.setEnabled(true);
                    });
                }
            )
        );
        chargecubes[i].visibility = 0;
        salles[i] = new Sale(x,z,y,19,19,5,taille, scene);
        salles[i].create(vlight, scene);
    }
    
    for(let isalle = 0; isalle<salles.length-1; isalle++){
        let debutsalle = salles[isalle];
        let debut = [debutsalle.porte[0]+debutsalle.gx,debutsalle.porte[1]+debutsalle.gz,debutsalle.porte[0]+debutsalle.gx,debutsalle.porte[1]+debutsalle.gz]
        let endsalle = salles[isalle+1];
        let fin = [endsalle.porte[0]+endsalle.gx,endsalle.porte[1]+endsalle.gz,endsalle.porte[0]+endsalle.gx,endsalle.porte[1]+endsalle.gz]
        debut = decalcub(debut, debutsalle);
        fin  = decalcub(fin, endsalle);
        chemin[isalle] = new Chemin([debut],debut,fin,salles);
    }
    let debutsalle = salles[salles.length-1];
    let debut = [debutsalle.porte[0]+debutsalle.gx,debutsalle.porte[1]+debutsalle.gz,debutsalle.porte[0]+debutsalle.gx,debutsalle.porte[1]+debutsalle.gz]
    let fin = [playground[2]+20,playground[3]+20,playground[2]+20,playground[3]+20+1]
    debut = decalcub(debut, debutsalle);
    chemin[chemin.length] = new Chemin([debut],debut,fin,salles);
    debutsalle = salles[0];
    debut =  [playground[0]-2,playground[1]-2,playground[0]-2,playground[1]-2]
    fin = [debutsalle.porte[0]+debutsalle.gx,debutsalle.porte[1]+debutsalle.gz,debutsalle.porte[0]+debutsalle.gx,debutsalle.porte[1]+debutsalle.gz]
    fin  = decalcub(fin, debutsalle);
    chemin[chemin.length] = new Chemin([debut],debut,fin,salles);
    let chargenext = new BABYLON.Mesh.CreateBox("cobesi",60,scene);
    chargenext.position = new BABYLON.Vector3((playground[2]+30)*taille,50,(playground[3]+20)*taille);
    chargenext.actionManager = new BABYLON.ActionManager(scene);
    chargenext.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
        {
        trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
        parameter: scene.pica.bounder,
        },
        () => {
            chargenext.dispose();
            salles.forEach(salle => {
                salle.disposesalle()
            });
            chemin.forEach(unchemin => {
                unchemin.chemindispose()
            });
            chargecubes.forEach(chargecube => {
                chargecube.dispose();
            });
            externenmies.forEach(enemi => {
                scene.enemies.pop(enemi);
                enemi.Enemi.bounder.dispose()
                enemi.dispose();
            })
            scene.pica.rain.stop();
            let createur = new Createur(scene);
            createur.creerEnemie(scene.enemies.mewtwo,new BABYLON.Vector3(800,20,700),'b');
            /*
            playground=[playground[2]+20,playground[3]+20,playground[2]+70,playground[3]+70]
            scene.ground.position = new BABYLON.Vector3((playground[2]+playground[2]/2)*5,0,(playground[3]+playground[3]/2)*5);
            scene.skybox.position = new BABYLON.Vector3((playground[2]+playground[2]/2)*5,0,(playground[3]+playground[3]/2)*5);
            scene.waterground.position = new BABYLON.Vector3((playground[2]+playground[2]/2)*5,0,(playground[3]+playground[3]/2)*5);
            createenv(vlight,marowakobj,scene);
            */ 
        }
    )
    );
    chargenext.visibility = 0;
    creerEnemieExterieure(scene);
}

function creerEnemieExterieure(scene){
    let createur = new Createur(scene);
    for (let nblabrasy = 0; nblabrasy < 3; nblabrasy++) {
        for(let nblabrasx=0; nblabrasx<3; nblabrasx++){
            if(nblabrasx!=0 || nblabrasy!=0 ){
                let noGround = false;
                let choix = parseInt(Math.random()*2);
                let origin = new BABYLON.Vector3( 0,0,0);
                if(choix == 0){
                    while(!noGround){
                        noGround=true;
                        origin = new BABYLON.Vector3( Math.random()*200+nblabrasx*220,0,Math.random()*200+nblabrasy*220);
                        let direction = new BABYLON.Vector3(0, -90,0);
                        let ray = new BABYLON.Ray(origin, direction, 0.2);
                        var hit = scene.pickWithRay(ray, (mesh) => {
                            return (mesh.name.startsWith("copy"));   
                        });
    
                        if (hit.pickedMesh){
                            if(hit.pickedMesh.name.startsWith("copy")){
                                //console.log("hit copy ", hit.pickedMesh.name);
                                noGround= false;
                            }
                        }
                    }
                    let enemi = createur.creerEnemie(scene.enemies.labras, origin, 'l');
                    externenmies.push(enemi);
                }else{
                    noGround = false;
                origin = new BABYLON.Vector3( 0,0,0);
                while(!noGround){
                    noGround=true;
                    origin = new BABYLON.Vector3( Math.random()*200+nblabrasx*220,0,Math.random()*200+nblabrasy*220);
                    let direction = new BABYLON.Vector3(0, -90,0);
                    let ray = new BABYLON.Ray(origin, direction, 0.2);
                    var hit = scene.pickWithRay(ray, (mesh) => {
                        return (mesh.name.startsWith("copy"));   
                    });

                    if (hit.pickedMesh){
                        if(hit.pickedMesh.name.startsWith("copy")){
                            //console.log("hit copy ", hit.pickedMesh.name);
                            noGround= false;
                        }
                    }
                }
                let enemi2 = createur.creerEnemie(scene.enemies.papillon,new BABYLON.Vector3(origin.x,15,origin.z), 'p')
                externenmies.push(enemi2);
                }
            }
            
        }
        //raycast to verify no ground;

    }

    
}

function decalcub(cube,salle){
    let decaleb = [[1,0,1,0],[0,1,0,1],[-1,0,-1,0],[0,-1,0,-1]];
    let sallecub = salle.cub;
    if(containe(cube,sallecub)){
        for (let index = 0; index < decaleb.length; index++) {
            const d = decaleb[index];  
            if(!containe([cube[0]+d[0],cube[1]+d[1],cube[2]+d[2],cube[3]+d[3]],sallecub)){
                return [cube[0]+d[0],cube[1]+d[1],cube[2]+d[2],cube[3]+d[3]];
            }
        }
    }
    return cube;
}


function actionEnemies() {
    if(scene.enemies) {
        
        scene.enemies.forEach(enemi => {
            if(enemi.isEnabled()){
                enemi.Enemi.action(scene);
                //remove dead enemi from enemies list
                if(enemi.Enemi.life<=0){
                    var enemiIndex = scene.enemies.indexOf(enemi);
                    scene.enemies.splice(enemiIndex, 1);
                    
                }

            }
            
        });

    }    
}



/**
 * forme x,y,x2,y2
 * @param {*} cube1 
 * @param {*} cube2 
 * @returns 
 */
function containe(cube1, cube2){
    if(cube2[2] < cube1[0] || cube1[2] < cube2[0]){
        return false;
    }
    if(cube2[3] < cube1[1] || cube1[3] < cube2[1]){
        return false;
    }
    return true;
}


window.addEventListener("resize", () => {
    engine.resize()
})

//gerer key:

function createFreeCamera(scene) {
    let camera = new BABYLON.FreeCamera("freeCamera", new BABYLON.Vector3(0, 50, 0), scene);
    camera.attachControl(canvas);
    // prevent camera to cross ground
    //camera.checkCollisions = true; 
    // avoid flying with the camera
    //camera.applyGravity = true;


    // Add extra keys for camera movements
    // Need the ascii code of the extra key(s). We use a string method here to get the ascii code
    camera.keysUp.push('z'.charCodeAt(0));
    camera.keysDown.push('s'.charCodeAt(0));
    camera.keysLeft.push('q'.charCodeAt(0));
    camera.keysRight.push('d'.charCodeAt(0));
    camera.keysUp.push('Z'.charCodeAt(0));
    camera.keysDown.push('S'.charCodeAt(0));
    camera.keysLeft.push('Q'.charCodeAt(0));
    camera.keysRight.push('D'.charCodeAt(0));

    return camera;
}

function createFollowCamera(scene, pos, target) {
    //let camera = new BABYLON.ArcFollowCamera("picatchuFollowCamera", target.position, scene)
    let camera = new BABYLON.FollowCamera("picatchuFollowCamera", pos, scene, target);
    //camera.setMeshTarget(target);
    camera.radius = 30; // how far from the object to follow
	camera.heightOffset = 5; // how high above the object to place the camera
	camera.rotationOffset = 180; // the viewing angle
	
    camera.cameraAcceleration = .2; // how fast to move
	camera.maxCameraSpeed = 12; // speed limit
    //camera.minZ = 10;
    

    return camera;
}

function pointerlog(){
    scene.onPointerDown = (event) => {
        if(!gamestart){
            if(actuelimput){
                actuelimput =false;
                setTimeout(() => { 
                    actuelimput= true;
                },150)
            }else{
                return;
            }
            if(!scene.alreadyLocked) {
                //console.log("requesting pointer lock");
                canvas.requestPointerLock();
            } else {
                //console.log(event.button)
                //event.preventDefault();
                if(event.button==0){
                    inputStates.fire = true;
                }
                if(event.button==1){
                    inputStates.switch = true;
                }
                if(event.button==2){
                    inputStates.fight = true;
                }
    
            }

        }

    }
}
function modifySettings() {
    // as soon as we click on the game window, the mouse pointer is "locked"
    // you will have to press ESC to unlock it
    
    pointerlog();

    

    document.addEventListener("pointerlockchange", () => {
        let element = document.pointerLockElement || null;
        if(element) {
            // lets create a custom attribute
            scene.alreadyLocked = true;
        } else {
            scene.alreadyLocked = false;
        }
    })
    
    // key listeners for the player
    inputStates.left = false;
    inputStates.right = false;
    inputStates.up = false;
    inputStates.down = false;
    inputStates.space = false;
    inputStates.run = false;
    inputStates.fight = false;
    inputStates.fire = false;
    inputStates.switch = false;
    


    // mouse listener for the player
    mymouse.x = 0;
    mymouse.y = 0;
    
    //add the listener to the main, window object, and update the states
    window.addEventListener('keydown', (event) => {
        if ((event.key === "ArrowLeft") || (event.key === "q")|| (event.key === "Q")) {
           inputStates.left = true;
        } else if ((event.key === "ArrowUp") || (event.key === "z")|| (event.key === "Z")){
           inputStates.up = true;
        } else if ((event.key === "ArrowRight") || (event.key === "d")|| (event.key === "D")){
           inputStates.right = true;
        } else if ((event.key === "ArrowDown")|| (event.key === "s")|| (event.key === "S")) {
           inputStates.down = true;
        } else if (event.key === "f") {
            inputStates.fire = true;
            spark();
        } else if (event.key === "g"){
            inputStates.fight = true;
        } else if (event.key === " ") {
           inputStates.space = true;
        } else if (event.key === "r") {
            inputStates.run = true;
        } 
    }, false);

    //if the key will be released, change the states object 
    window.addEventListener('keyup', (event) => {
        if ((event.key === "ArrowLeft") || (event.key === "q")|| (event.key === "Q")) {
           inputStates.left = false;
        } else if ((event.key === "ArrowUp") || (event.key === "z")|| (event.key === "Z")){
           inputStates.up = false;
        } else if ((event.key === "ArrowRight") || (event.key === "d")|| (event.key === "D")){
           inputStates.right = false;
        } else if ((event.key === "ArrowDown")|| (event.key === "s")|| (event.key === "S")) {
           inputStates.down = false;
        }else if (event.key === "f") {
            inputStates.fire = false;
        }else if (event.key === "g"){
            inputStates.fight = false;
        }else if(event.key === "h"){
            inputStates.switch = true;
        }else if (event.key === " ") {
           inputStates.space = false;
        }else if (event.key === "r") {
           inputStates.run = false;
        }else if (event.key === "p"){
            if(gamestart){
                gamestart =false; 
            }else{
                gamestart=true;
            }
        }
    }, false);

    window.addEventListener('mousemove', (event) => {
        // fait varier la position de la souris en pourcentage entre -1 et 1 avec 0 le centre de l'ecran
        //if(event.movementX)
        mymouse.x = event.movementX;
        mymouse.y = event.movementY;
        //mymouse.x = event.pageX/document.documentElement.clientWidth*2 -1;
        //mymouse.y = event.pageY/document.documentElement.clientHeight*2-1;
        //console.log(mymouse.x, mymouse.y);
      },false);
    
}

function clear() {
  
  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
  }, clear));
}

function music(){
   //adding audio 
  var music = new BABYLON.Sound("music","twostepsfromhell.mp3", scene, function(){music.play();},{loop:true, volume: 0.1});
}
function guiscene(){
    // This creates a basic Babylon Scene object (non-mesh)
    let scene1 = new BABYLON.Scene(engine);
    // GUI
    var advancedTexture = new BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI");
    var clic =0;

    var rectangle = new BABYLON.GUI.Rectangle("rect");
    rectangle.background = "black";
    rectangle.color = "yellow";
    rectangle.width = "100%";
    rectangle.height = "100%";
    advancedTexture.addControl(rectangle);

    var image = new BABYLON.GUI.Image("but", "img/picabackground.PNG");
    image.width = 1;
    image.height = 1;

    rectangle.addControl(image);

    let rectangleinfo = new BABYLON.GUI.Rectangle("info");
    rectangleinfo.background = "#B91372";
    rectangleinfo.width = "45%";
    rectangleinfo.height = "60%";

    var text1 = new BABYLON.GUI.TextBlock("text1");
    
    text1.fontFamily = "Helvetica";
    text1.textWrapping = true;
    
    text1.text = "BattlePok: it's the pockemon revolution.\n\n Pica must survive and fight these enemies in this world to give humans a 2nd chance to live"+
    "\n\n ¤ <P>   -> make a pause                                 "
    +"\n ¤ <Space> -> Jump                                         "
    +"\n ¤ <R> -> switch beetween walk and run         "
    +"\n ¤ <G> or <Left mouseclick> -> short  attack   "
    +"\n ¤ <F> or <Right mouseclick> -> distant attack"
    +"\n ¤ <h> or <wheelclick>  -> switch attack types "
    +"\n\n\nJoin the adventure and make the world better. \n(click informations button to come back to start menu)";

    text1.color = "white";
    text1.fontSize = "22px";

   var informationbtn = BABYLON.GUI.Button.CreateSimpleButton("Informations","Informations")
   informationbtn.width=0.1;
   informationbtn.height=0.06;
   informationbtn.top=-200;
   informationbtn.cornerRadius = 20;
   informationbtn.left =450;
   informationbtn.color = "white";
   informationbtn.background ="#048ba8";
   informationbtn.onPointerUpObservable.add(function(){
       if(gamestart){
        clic+=1;
        if(clic %2 ==0){
            advancedTexture.addControl(playbtn);
            advancedTexture.addControl(replaybtn);
            advancedTexture.addControl(exitbtn);
            advancedTexture.removeControl(rectangleinfo);
 
        } else{
            advancedTexture.removeControl(playbtn);
            advancedTexture.removeControl(replaybtn);
            advancedTexture.removeControl(exitbtn);
            advancedTexture.addControl(rectangleinfo);
            rectangleinfo.addControl(text1);
        }
       }

   });
   advancedTexture.addControl(informationbtn);

   var playbtn = BABYLON.GUI.Button.CreateSimpleButton("but1", "Play!");
   playbtn.width = 0.15;
   playbtn.height = 0.06;
   playbtn.top = -140;
   playbtn.cornerRadius = 20;
   playbtn.color = "white";
   playbtn.fontSize = 14;
   playbtn.background = "#16db93";
   playbtn.onPointerUpObservable.add(function() {
       if(gamestart){
           if(first){
                scenestart = createscenevideo();
                first=false;
                mystart = true;
           }else{
                music();
            }
        setTimeout(gamestart = false,2000);
        }
   });
   advancedTexture.addControl(playbtn);

   var replaybtn = BABYLON.GUI.Button.CreateSimpleButton("but2", "Replay");
   replaybtn.width = 0.15;
   replaybtn.height = 0.06;
   replaybtn.top = -70;
   replaybtn.cornerRadius = 20;
   replaybtn.color = "white";
   replaybtn.fontSize = 14;
   replaybtn.background = "#f1c453";
   replaybtn.onPointerUpObservable.add(function() {
       if(gamestart){
        salles = [];
        chemin = [];
        cubes = [];
        chargecubes = [];
        scene.dispose();
        playground = [0,0,50,50];
        engine.displayLoadingUI();
        const promise = createScene();
        
        promise.then(() => {
            let picamesh = scene.pica.bounder;
            scene.activeCamera = createFollowCamera(scene,picamesh.position, scene.pica.vuecube);
           // modifySettings();
           gamestart=false;
           pointerlog();
           music();
           engine.hideLoadingUI()
        })

       }
   });
   advancedTexture.addControl(replaybtn);

   var exitbtn = BABYLON.GUI.Button.CreateSimpleButton("but3", "Quit ?");
   exitbtn.width = 0.15;
   exitbtn.height = 0.06;
   exitbtn.cornerRadius = 20;
   exitbtn.color = "white";
   exitbtn.fontSize = 14;
   exitbtn.background = "#ee6055";
   exitbtn.onPointerUpObservable.add(function() {
       if(gamestart){
        endgame = true; 
        gamestart = false
       }
        //setTimeout(window.close(),10000)
   });
   advancedTexture.addControl(exitbtn);

   let camera = new BABYLON.FollowCamera("picatchuFollowCamera",new BABYLON.Vector3(0,0,0), scene1);
   camera.radius = 125; // how far from the object to follow
   camera.heightOffset = 0; // how high above the object to place the camera
   camera.rotationOffset = 180; // the viewing angle
   
   camera.cameraAcceleration = 0.1; // how fast to move
   camera.maxCameraSpeed = 1;
   scene1.camera = camera;

   return scene1;
}

function spark(){
    var spark = new BABYLON.Sound("spark","spark.mp3",scene, function(){spark.play();},{loop:false, volume : 0.1})
}

function effect(){
    window.addEventListener("mousedown", function(evt) {
		// left click to attack
		if (evt.button === 0) {
			spark();  
		}
	});
	
	window.addEventListener("keyGdown", function (evt) {
        // Press g key to attack with spark
        if (evt.keyCode === 71) {
            spark();
        }
    });
}

var gui = function () {

    // GUI
   var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI");
    
   var informationbtn = BABYLON.GUI.Button.CreateSimpleButton("settings","settings")
   informationbtn.width=0.08;
   informationbtn.height=0.04;
   informationbtn.top=-200;
   informationbtn.left =450;
   informationbtn.color = "white";
   informationbtn.background ="#048ba8";
   informationbtn.onPointerUpObservable.add(function(){
       if(replaybtn.isVisible){
           playbtn.isVisible=false;
           replaybtn.isvisible=false;
           exitbtn.isVisible=false;
       }
       else{
           playbtn.isVisible=true;
           replaybtn.isvisible=false;
           exitbtn.isVisible=true;
       }
   });
   advancedTexture.addControl(informationbtn);

   var playbtn = BABYLON.GUI.Button.CreateSimpleButton("but1", "Play!");
   playbtn.width = 0.15;
   playbtn.height = 0.05;
   playbtn.top = -120;
   playbtn.color = "white";
   playbtn.fontSize = 12;
   playbtn.background = "#16db93";
   playbtn.onPointerUpObservable.add(function() {
       advancedTexture.removeControl(playbtn);
   });
   advancedTexture.addControl(playbtn);

   var replaybtn = BABYLON.GUI.Button.CreateSimpleButton("but2", "Replay");
   replaybtn.width = 0.15;
   replaybtn.height = 0.05;
   replaybtn.top = -60;
   replaybtn.color = "white";
   replaybtn.fontSize = 12;
   replaybtn.background = "#f1c453";
   replaybtn.onPointerUpObservable.add(function() {
       advancedTexture.removeControl(playbtn);
       advancedTexture.removeControl(replaybtn);
       advancedTexture.removeControl(exitbtn);
       setTimeout(gui,500);
   });
   advancedTexture.addControl(replaybtn);

   var exitbtn = BABYLON.GUI.Button.CreateSimpleButton("but3", "Exit");
   exitbtn.width = 0.15;
   exitbtn.height = 0.05;
   exitbtn.color = "white";
   exitbtn.fontSize = 12;
   exitbtn.background = "#ee6055";
   exitbtn.onPointerUpObservable.add(function() {
       advancedTexture.removeControl(playbtn);
       advancedTexture.removeControl(replaybtn);
       advancedTexture.removeControl(exitbtn);
       setTimeout(gui,1000);
   });
   advancedTexture.addControl(exitbtn); 

    return scene;

}

function lastscene(){
     // This creates a basic Babylon Scene object (non-mesh)
     let lastscene = new BABYLON.Scene(engine);
     // GUI
     var advancedTexture = new BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("LastGUI");

     var rectangle = new BABYLON.GUI.Rectangle("rect");
    rectangle.background = "black";
    rectangle.color = "yellow";
    rectangle.width = "100%";
    rectangle.height = "100%";
    advancedTexture.addControl(rectangle);

    var image = new BABYLON.GUI.Image("but", "img/picabattleroom.PNG");
    image.width = 1;
    image.height = 1;

    rectangle.addControl(image);

    var quitbtn = BABYLON.GUI.Button.CreateSimpleButton("but3", "EXIT GAME");
   quitbtn.width = 0.15;
   quitbtn.height = 0.06;
   quitbtn.top = 160;
   quitbtn.cornerRadius = 20;
   quitbtn.color = "white";
   quitbtn.fontSize = 14;
   quitbtn.background = "#ee6055";
   quitbtn.onPointerUpObservable.add(function() {
        //endgame = true; 
        setTimeout(window.close(),10000)
   });
   advancedTexture.addControl(quitbtn);


    let camera = new BABYLON.FollowCamera("picatchuFollowCamera",new BABYLON.Vector3(0,0,0), lastscene);
    camera.radius = 125; // how far from the object to follow
    camera.heightOffset = 0; // how high above the object to place the camera
    camera.rotationOffset = 180; // the viewing angle
   
    camera.cameraAcceleration = 0.1; // how fast to move
    camera.maxCameraSpeed = 1;
    lastscene.camera = camera;

    return lastscene;
}

function winscene(){
    // This creates a basic Babylon Scene object (non-mesh)
    let winscene = new BABYLON.Scene(engine);
    // GUI
    var advancedTexture = new BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("winGUI");

    var rectangle = new BABYLON.GUI.Rectangle("rect");
   rectangle.background = "black";
   rectangle.color = "yellow";
   rectangle.width = "100%";
   rectangle.height = "100%";
   advancedTexture.addControl(rectangle);

   var image = new BABYLON.GUI.Image("but", "img/youdidit.png");
   image.width = 1;
   image.height = 1;

   rectangle.addControl(image);

   var quitbtn = BABYLON.GUI.Button.CreateSimpleButton("but3", "CLOSE GAME");
   quitbtn.width = 0.15;
   quitbtn.height = 0.06;
   quitbtn.top = 220;
   quitbtn.left = 450;
   quitbtn.cornerRadius = 20;
   quitbtn.color = "white";
   quitbtn.fontSize = 14;
   quitbtn.background = "#ee6055";
   quitbtn.onPointerUpObservable.add(function() {
        //endgame = true; 
        setTimeout(window.close(),10000)
   });
   advancedTexture.addControl(quitbtn);

   let camera = new BABYLON.FollowCamera("picatchuFollowCamera",new BABYLON.Vector3(0,0,0), winscene);
   camera.radius = 125; // how far from the object to follow
   camera.heightOffset = 0; // how high above the object to place the camera
   camera.rotationOffset = 180; // the viewing angle
  
   camera.cameraAcceleration = 0.1; // how fast to move
   camera.maxCameraSpeed = 1;
   winscene.camera = camera;

   return winscene;
}