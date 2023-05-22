// firebase
import { db, cloudStorage, signInFirebase, signOutFirebase } from '../Firebase/firebase'
// cloud storage
import { 
  ref, uploadBytes, getDownloadURL, updateMetadata, getMetadata, uploadString, deleteObject 
} from "firebase/storage";
// Firestore
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";

const postManagementAPI = async(path, body, success, params, headers={'Content-Type': 'application/json'})=>{

}
export const createAuth0Organization = async(data, accessToken) => {
    
    console.log({
        method: "createAuth0Organization",
        message: "entering"
    });

    try {
        const JSONdata = JSON.stringify(data);
        const response = await fetch('/api/createOrg', { 
            method: 'POST',
            body: JSONdata,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        });
        const result = await response.json();
        const newOrgId = result.id;

        console.log({
            method: "createAuth0Organization",
            message: "exiting",
            newOrgId: newOrgId
        });

        return newOrgId;

    }catch(error){
        throw new Error(`Auth0 Organization 作成失敗。error: ${error.message}`);
    }
    
}

export const createM2MApp = async(data, accessToken) => {

    console.log({
        method: "createM2MApp",
        message: "entering"
    });

    try{
        const JSONdata = JSON.stringify(data);
        const response = await fetch('/api/createM2M', { 
            method: 'POST',
            body: JSONdata,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        });
        const result = await response.json();
        const client_id = result.client_id;

        console.log({
            method: "createM2MApp",
            message: "exiting",
            newAppId: client_id
        });

        return client_id;

    }catch(error){
        throw new Error(`Auth0 M2Mアプリ 作成失敗。error: ${error.message}`);
    }
}

export const createClientGrant = async(data, accessToken) => {

    console.log({
        method: "createClientGrant",
        message: "entering"
    });

    try{
        const JSONdata = JSON.stringify(data);
        const response = await fetch('/api/createClientGrant', { 
            method: 'POST',
            body: JSONdata,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        });
        if(response.status == 200){

        }
        const result = await response.json();
        const clientGrantId = result.id;
        
        console.log({
            method: "createClientGrant",
            message: "exiting",
        });

        return clientGrantId;

    }catch(error){
        throw new Error(`Auth0 Client Grant 作成失敗。error: ${error.message}`);
    }
}

/** 
 * Cloud Storage for firebaseに引数を名前とする階層を作成します。
 * Cloud Storageは階層のみの作成ができない為、同時に.initFileを作成します。
 * @param {string} newOrgId 新規企業のAuth0上のOrganization Identifier
 * @return {string} fullPath 作成したファイルのフルパス
 */
export const createCloudStorageHierarchy = async(newOrgId) => {
    try {
        // await signInFirebase();
        const initFileRef = ref(
            cloudStorage,
            `gs://kaigofika-poc01.appspot.com/${newOrgId}/.initFile`
        );
        const res = await uploadString(initFileRef, "initial");
        // await signOutFirebase();
        const fullPath = res.metadata.fullPath;
        return fullPath;
    }catch(error){
        // await signOutFirebase();
        throw new Error(`Cloud Storage for firebase新規階層 作成失敗。error: ${error.message}`);
    }
}

/** 
 * Firestoreに引数を名前とするのドキュメントを作成します。
 * @param {string} newOrgId 新規企業のAuth0上のOrganization Identifier
 */
export const createFirestoreDocument = async(newOrgId) => {
    // await signInFirebase();
    const ref = doc(db, 'mt-facilities', newOrgId);
    console.log({
        method : "we will set a new document",
        ref: ref
    })
    await setDoc(ref, {})
        .then((result) =>{
            console.log("succeeded: " + result)
        }).catch((error)=>{
            console.log("error:" + error || error.message)
            throw new Error(`Firestore新規階層 作成失敗。error: ${error.message}`);
        });
    // await signOutFirebase();
}

