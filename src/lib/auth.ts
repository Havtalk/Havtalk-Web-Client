import { createAuthClient } from "better-auth/react";
import { usernameClient,adminClient } from "better-auth/client/plugins";
// import { BaseUrl } from "./utils";



const auth=createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    plugins:[
      usernameClient(),
      adminClient()
    ]
  })

export const {signIn,signUp,useSession,changePassword,signOut,forgetPassword,resetPassword}=auth;