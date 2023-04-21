import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    // Your web app's Firebase configuration
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const signInFirebase = async () => {

    const response = await fetch('/api/firebase');
    const data = await response.json();

    signInWithCustomToken(auth, data.firebaseToken)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log("Firebase Sign-in successful");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Firebase Sign-in faild");
            console.log(`errorCode: ${errorCode} errorMessage: ${errorMessage}`)
        });
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
