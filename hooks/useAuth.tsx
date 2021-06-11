import { createContext, ReactNode, useContext, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/router'
import { setCookie } from "nookies";

interface AuthProviderProps {
  children: ReactNode;
}

type SignInCredentials = {
  email: string
  password: string
}

type User = {
  email: string
  roles: string[]
  permissions: string[]
}

type AuthContextData = {
  signIn(credentrial: SignInCredentials): Promise<void>
  isAuthenticated: boolean
  user: User
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps){
  const router = useRouter()
  const [user, setUser] = useState<User>()
  const isAuthenticated = !!user 

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await axios.post(`http://localhost:3333/sessions`, {
        email,
        password
      })

      const { permissions, roles, token, refreshToken } = response.data

      setCookie(null, "nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
      setCookie(null, "nextauth.refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });

      setUser({ email, permissions, roles })

      router.push('/dashboard')
      alert(JSON.stringify('Success', response.data))  
    } catch (error) {
      alert(JSON.stringify(error))
    }
  }

  return (
    <AuthContext.Provider value={{
      signIn,
      isAuthenticated,
      user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)