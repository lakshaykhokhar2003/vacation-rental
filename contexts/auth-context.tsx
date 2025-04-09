"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut, GoogleAuthProvider, signInWithPopup,
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import {getCookie, setCookie} from "cookies-next";
import {addDays} from "date-fns";
import {useRouter} from "next/navigation";
import {createOrUpdateUser} from "@/lib/services/user-service";
import {toast} from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signInWithGoogle: async () => {},
  logOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const authCookie = getCookie('auth');

  useEffect(() => {
    const signOutUser = async () => {
      if (!authCookie) {
        await signOut(auth);
        setUser(null);
        router.push("/")
      } else {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user)
          setLoading(false)
        })
        return () => unsubscribe()
      }
    }

    signOutUser();
  }, [authCookie])


  const signUp = async (email: string, password: string) => {
    const response = await createUserWithEmailAndPassword(auth, email, password)
    const data = response.user
    await createOrUpdateUser({uid: data?.uid, email: email, displayName: data?.displayName ? data?.displayName : (data?.email as string).slice(0, (data?.email as string).indexOf("@")), role: 'guest'})
    setUser(data)
    setCookie('auth',email,{expires: addDays(new Date(),30)});
  }

  const signIn = async (email: string, password: string) => {
    const response = await signInWithEmailAndPassword(auth, email, password)
    await createOrUpdateUser({uid: response.user.uid})
    setUser(response.user)
    setCookie('auth',response.user.email,{expires: addDays(new Date(),30)});
  }

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const response = await signInWithPopup(auth, provider);
      setUser(response.user);
      setCookie('auth',response.user.email,{expires: addDays(new Date(),30)});
      await createOrUpdateUser({uid: response.user.uid, email:( response.user.email as string), displayName: (response.user.displayName as string) ,photoURL: response.user.photoURL || "",})
      router.push('/')
    } catch (error) {
        toast({
            title: "Error",
            description: "Something went wrong while signing in with Google.",
            variant: "destructive",
        })
    }
  };

  const logOut = async () => {
    await signOut(auth)
    router.push('/')
  }

  return <AuthContext.Provider value={{ user, loading, signUp, signIn, signInWithGoogle,logOut }}>{children}</AuthContext.Provider>
}

