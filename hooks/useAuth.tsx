import { createContext, ReactNode, useContext } from "react";
import axios from "axios";

interface AuthProviderProps {
  children: ReactNode;
}

type SignInCredentials = {
  email: string
  password: string
}

type AuthContextData = {
  signIn(credentrial: SignInCredentials): Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps){
  const isAuthenticated = false

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await axios.post(`http://localhost:3333/sessions`, {
        email,
        password
      })
      alert(JSON.stringify(response.data))  
    } catch (error) {
      alert(JSON.stringify(error))
    }
  }

  return (
    <AuthContext.Provider value={{
      signIn,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)