import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";


const auth=createAuthClient({
    baseURL:'http://localhost:8080',
    plugins:[
      usernameClient()
    ]
  })

export const {signIn,signUp,useSession}=auth;