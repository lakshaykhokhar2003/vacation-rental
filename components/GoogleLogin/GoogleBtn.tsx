import styles from './GoogleBtn.module.css'
import React from "react";
import {useAuth} from "@/contexts/auth-context";


export const GoogleBtn: React.FC = () => {
    const {signInWithGoogle} = useAuth();
    return <button className={styles.GoogleBtn} onClick={signInWithGoogle}><img
        src="https://static-00.iconduck.com/assets.00/google-icon-2048x2048-czn3g8x8.png" alt=""/>
        Sign in with Google
    </button>;
};