import { createContext, ReactNode, useContext, useEffect } from "react";

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
    console.log({ email, password })
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