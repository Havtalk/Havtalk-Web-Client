import { createAuthClient } from "better-auth/react";
import { usernameClient,adminClient } from "better-auth/client/plugins";



const auth=createAuthClient({
    baseURL:'http://localhost:8080',

    plugins:[
      usernameClient(),
      adminClient()
    ]
  })

export const {signIn,signUp,useSession,changePassword,signOut}=auth;