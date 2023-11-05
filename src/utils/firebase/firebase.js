import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { loginService } from '../../services/auth.service';

const firebaseConfig = {
    apiKey: 'AIzaSyAsIO9YPVdYgK8XNWpYLFREFuZnyvJ9Vmg',
    authDomain: 'virtual-rarity-383701.firebaseapp.com',
    projectId: 'virtual-rarity-383701',
    storageBucket: 'virtual-rarity-383701.appspot.com',
    messagingSenderId: '983421413321',
    appId: '1:983421413321:web:33874a091c10ef3224ea18'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = async (dispatch, actions, state, navigate) => {
    try {
        const data = await signInWithPopup(auth, provider);
        const displayName = data.user.displayName;
        const email = data.user.email;
        const photo = data.user.photoURL;
        await loginService(
            {
                displayName,
                email,
                photo
            },
            dispatch,
            actions,
            state,
            navigate
        );
    } catch (error) {
        console.log(error.message);
    }
};

export default signInWithGoogle;
