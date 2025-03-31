import React from 'react'
import {LogIn} from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";

const SignInPrompt = () => {
    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
            <div className="flex flex-col items-center space-y-4">
                <div className="bg-blue-100 p-4 rounded-full">
                    <LogIn className="h-8 w-8 text-primary"/>
                </div>

                <h2 className="text-2xl font-bold text-gray-800">Sign in to book</h2>

                <p className="text-gray-600">
                    Please sign in to continue with your booking. You'll need an account to reserve this property.
                </p>

                <div className="flex flex-col space-y-3 w-full">
                    <Link href={"/login"}>
                        <Button
                            className="w-full bg-primary"
                        >
                            Sign In
                        </Button>
                    </Link>
                    <p className="text-sm text-gray-500">
                        Don't have an account? Signing in will create one for you.
                    </p>
                </div>
            </div>
        </div>
    )
}
export default SignInPrompt
