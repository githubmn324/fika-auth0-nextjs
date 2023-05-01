import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, OAuthProvider, 
    signInWithRedirect,　signInWithPopup, signInWithCredential, signInWithCustomToken,
    signOut 
} from "firebase/auth";
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

export const signInFirebase = async (org_id) => {
    console.log({
        method: "signInFirebase",
        message: "entering",
    })

    // firebaseエンドポイントにカスタムヘッダを付与してアクセストークンを取得
    // const response = await fetch('/api/firebase');
    // const data = await response.json();
    // console.log({
    //     method: "fetch '/api/firebase'",
    //     result: data
    // })
    
    const provider = new OAuthProvider("oidc.testnakagome");
    provider.addScope('openid');
    provider.setCustomParameters({
        prompt: "consent",
        login_hint: "org_id"
    });
    console.log({
        provider: provider
    })

    // signInWithRedirect(auth, provider);
    // getRedirectResult(auth)
    // .then((result) => {
    //     // User is signed in.
    //     // IdP data available in result.additionalUserInfo.profile.
    //     // Get the OAuth access token and ID Token
    //     const credential = OAuthProvider.credentialFromResult(result);
    //     console.log(creadential)
    //     const accessToken = credential.accessToken;
    //     const idToken = credential.idToken;
    // })
    // .catch((error) => {
    //     // Handle error.
    //     console.log(error)
    // });

    // 【sign in with Popup バージョン】
    try{
        const result = await signInWithPopup(auth, provider);
        const credential = OAuthProvider.credentialFromResult(result);
        const user = result.user;
        const accessToken = credential.accessToken;
        const idToken = credential.idToken;
        console.log({
            user: user,
            credential: credential,
            accessToken: accessToken,
            idToken: idToken
        })
    }catch(error){
        const errorCode = error.code;
                const errorMessage = error.message;
                const credential = OAuthProvider.credentialFromError(error);
                console.log({
                    errorCode: errorCode,
                    errorMessage: errorMessage,
                    credential: credential
                })
    }

    // // 【手動でログインフローを処理する】
    // const response = await fetch('/api/session');
    // const data = await response.json();
    // const credential = provider.credential({
    //     idToken: data.idToken,
    //     rawNonce: nonce
    // });
    // try{
    //     const result = await signInWithCredential(auth, credential)
    //     const credentialFromResult  = OAuthProvider.credentialFromResult(result);
    //     const accessToken = credentialFromResult.accessToken;
    //     const idToken = credentialFromResult.idToken;
    //     console.log({
    //         credentialFromResult:credentialFromResult
    //     })
    // }catch(error){
    //     // Handle Errors here.
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     // The email of the user's account used.
    //     // const email = error.customData.email;
    //     // The AuthCredential type that was used.
    //     const credential = OAuthProvider.credentialFromError(error);
    //     console.log({
    //         errorCode:errorCode,
    //         errorMessage: errorMessage,
    //         credential: credential
    //     })
    // }
    

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
