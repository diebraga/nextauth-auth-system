import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import axios from "axios";
import Router from 'next/router'
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { api } from "../services/api";

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

export function signOut() {
  destroyCookie(null, 'nextauth.token',)
  destroyCookie(null, 'nextauth.refreshToken',)

  Router.push('/')
}

export function AuthProvider({ children }: AuthProviderProps){
  const [user, setUser] = useState<User>()
  const isAuthenticated = !!user 

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies()

    if (token) {
      api.get('/me').then(response => {
        const { email, permissions, roles } = response.data 

        setUser({ email, permissions, roles })
      }).catch(() => {
        signOut()
      })
    }
  }, [])

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

      api.defaults.headers['Authorization'] = `Bearer ${token}`

      Router.push('/dashboard')
      alert(JSON.stringify(response.data))  
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