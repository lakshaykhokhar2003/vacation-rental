import React from "react";
import { useAuth } from "@/contexts/auth-context";

export const GoogleBtn: React.FC = () => {
    const { signInWithGoogle } = useAuth();
    return (
        <button
            onClick={signInWithGoogle}
            className="flex items-center justify-center mt-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <img
                src="https://static-00.iconduck.com/assets.00/google-icon-2048x2048-czn3g8x8.png"
                alt="Google Icon"
                className="w-6 h-6 mr-2"
            />
            Sign in with Google
        </button>
    );
};
