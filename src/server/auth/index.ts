import NextAuth from "next-auth";
import { getServerSession } from "next-auth";

import { authConfig } from "./config";

const { handlers, signIn, signOut } = NextAuth(authConfig);

const auth = () => getServerSession(authConfig);

export { auth, handlers, signIn, signOut };
