import React, { createContext, useState } from "react";

const initState = {
  backend: null,
  userPrincipal: null,
  userSubacccount: null,
}

const UserContext = createContext(null)


export default function Main({children}) {
  const userDetails = useState(initState)
  return (
    <UserContext.Provider value={userDetails}>
      {children}
    </UserContext.Provider>
  )
}
