import { createContext, ReactNode, useEffect, useState } from "react"

import { auth, firebase } from '../services/firebase'

type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthContextType = {
  user: User | undefined;
  signInWithGoggle: () => Promise<void>;
}

type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider({ children }: AuthContextProviderProps) {

  const [user, setUser] = useState<User>()

  async function signInWithGoggle() {
    const provider = new firebase.auth.GoogleAuthProvider()

    const result = await auth.signInWithPopup(provider)

    if (result.user) {
      const { displayName, photoURL, uid } = result.user
      if (!displayName || !photoURL) {
        throw new Error('Missing information from Goggle Account.')
      }
      setUser({ id: uid, name: displayName, avatar: photoURL })
    }

  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL, uid } = user
        if (!displayName || !photoURL) {
          throw new Error('Missing information from Goggle Account.')
        }
        setUser({ id: uid, name: displayName, avatar: photoURL })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return <AuthContext.Provider value={{ user, signInWithGoggle }}>
    {children}
  </AuthContext.Provider>
}

