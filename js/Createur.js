import Enemi from "./Enemi.js";
import Labras from "./Labras.js";
import Papillon from "./Papillon.js";
import Explosif from "./Explosif.js";
import Mewtwo from "./Mewtwo.js";
import Epona from "./Epona.js";
/*

    Creer les enemies

*/

export default class Createur {
    constructor(scene) {
        this.scene = scene;
        this.id = 1;
    }
    /**
     * 
     * @param {*} meshobj : le objet importer
     * @param {*} position : BABYLON.Vector3(x,y,z)
     * @param {*} type : 'm'->marrowak 'l' -> labras 'p' -> papillon 'e'-> explosif 'h'->Epona 'b' -> bos mewtwo
     */
    creerEnemie(meshobj,position,type) {
        let mesh = this.doClone(meshobj.meshes[0],meshobj.skeletons,this.id);
        mesh.setEnabled(true);
        mesh.addLODLevel(200, null);
        mesh.position = position;
        this.scene.enemies.push(mesh);
        this.id+=1;
        if(type=='m'){
            new Enemi(mesh,mesh.skeleton,1,7,3,3,this.scene);
        }else if(type=='l'){
            new Labras(mesh,mesh.skeleton,0.3,20,3,3,this.scene);
        }else if(type=='p'){
            new Papillon(mesh,mesh.skeleton,1,7,2,3,this.scene);
            mesh.Enemi.bounder.position = position;
        }else if(type=='e'){
            new Explosif(mesh,mesh.skeleton,0.7,7,1,0,this.scene);
        }else if(type=='b'){
            new Mewtwo(mesh,mesh.skeleton,2,4,10,10,this.scene);
        }else if(type == 'h'){
            new Epona(mesh,mesh.skeleton,0.7,12,4,3,this.scene);
        }
        return mesh;
    }

    /**
     * Clone on mesh avec skelete
     */
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