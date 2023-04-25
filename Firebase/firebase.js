import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, OAuthProvider, signInWithCredential, signInWithCustomToken, signOut } from "firebase/auth";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBJSIFyuqKWF06rjGYwgERXxaaz_fxI2_E",
    authDomain: "kaigofika-poc01.firebaseapp.com",
    projectId: "kaigofika-poc01",
    storageBucket: "kaigofika-poc01.appspot.com",
    messagingSenderId: "901508578456",
    appId: "1:901508578456:web:aa06b827829b91b373e4ed"
};

const app = initializeApp(firebaseConfig);
// const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
console.log({
    'firebase authentication': auth
})
export const db = getFirestore(app);
export const cloudStorage = getStorage(app);

export const signInFirebase = async () => {
    console.log({
        method: "signInFirebase",
        message: "entering"
    })
    // const response = await fetch('/api/firebase');
    // const data = await response.json();
    // console.log({
    //     method: "fetch '/api/firebase'",
    //     result: data
    // })
    
    const response = await fetch('/api/session');
    
    const provider = new OAuthProvider("oidc.auth0-nakagome");
    const credential = provider.credential({
        idToken: data.idToken,
    });
    signInWithCredential(auth, credential).then((result) => {
        // User is signed in.
        const newCredential = OAuthProvider.credentialFromResult(result);
        // This gives you a new access token for the OIDC provider. You can use it to directly interact with that provider.
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = OAuthProvider.credentialFromError(error);
            // Handle / display error.
            // ...
        });
    // signInWithCustomToken(auth, data.firebaseToken)
    //     .then((userCredential) => {
    //         const user = userCredential.user;
    //         console.log({
    //             method: "signInWithCustomToken",
    //             message: "Firebase Sign-in successful",
    //             userCredential: userCredential,
    //             idToken: userCredential["_tokenResponse"]["idToken"]
    //         });
    //     })
    //     .catch((error) => {
    //         const errorCode = error.code;
    //         const errorMessage = error.message;
    //         console.log({
    //             method: "signInWithCustomToken",
    //             message: "Firebase Sign-in failed",
    //             error: `errorCode: ${errorCode} errorMessage: ${errorMessage}`
    //         });
    //     });
}

export const signOutFirebase = () => {
    signOut(auth)
        .then(() => {
            // Sign-out successful.
            console.log("Firebase Sign-out successful");
        }).catch((error) => {
            // An error happened.
            console.log("Firebase Sign-out faild");
            console.log(error);
        });
}
