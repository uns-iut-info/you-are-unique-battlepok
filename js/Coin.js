export default class Coin{
    constructor(scene){


    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0));
    
    //coin face UVs
    const coinUV = [];
    coinUV[0] = new BABYLON.Vector4(0, 0, 1, 1);
    coinUV[1] = new BABYLON.Vector4(0, 0.5, 0, 0.5);
    coinUV[2] = new BABYLON.Vector4(0, 0, 1, 1);

    const Mat = new BABYLON.StandardMaterial("mat");
    Mat.diffuseTexture = new BABYLON.Texture("../img/Gold_coin_icon.jpg");

    let coinRB = BABYLON.MeshBuilder.CreateCylinder("wheelRB", {diameter: 0.125, height: 0.05, faceUV: coinUV});
    coinRB.material = Mat;

    //Animate the Wheels
    const animWheel = new BABYLON.Animation("coinAnimation", "rotation.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    const coinKeys = []; 

    //At the animation key 0, the value of rotation.y is 0
    coinKeys.push({
        frame: 0,
        value: 0
    });

    //At the animation key 30, (after 1 sec since animation fps = 30) the value of rotation.y is 2PI for a complete rotation
    coinKeys.push({
        frame: 30,
        value: 2 * Math.PI
    });

    //set the keys
    animWheel.setKeys(coinKeys);

    //Link this animation to a coin
    coinRB.animations = [];
    coinRB.animations.push(animWheel);

    scene.beginAnimation(coinRB, 0, 30, true);
}
}