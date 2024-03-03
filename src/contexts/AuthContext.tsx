import { createContext, ReactNode, useEffect, useState } from "react";


type verifiedUser = {
 email: string
  name: string;
  authToken : string 
}

type AuthContextType = {
  verifiedUser: verifiedUser | undefined;
  setVerifiedUser: React.Dispatch<React.SetStateAction<verifiedUser | undefined>>
}

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [verifiedUser, setVerifiedUser] = useState<verifiedUser>();

  
  return (
    <AuthContext.Provider value={{ verifiedUser, setVerifiedUser }}>
      {props.children}
    </AuthContext.Provider>
  );
}