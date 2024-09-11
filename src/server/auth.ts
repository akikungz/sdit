import {
  type Awaitable,
  type RequestInternal,
  type User,
  type DefaultSession,
  type NextAuthOptions,
  getServerSession,
} from "next-auth";

import Credentials from "next-auth/providers/credentials";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
  },
  providers: [
    Credentials({
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "s6xxxxxxxxxxxx",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "********"
        }
      },
      authorize: (
        credentials: Record<"username", string> | undefined,
        req: Pick<RequestInternal, "body" | "query" | "headers" | "method">
      ): Awaitable<User | null> => {
        console.log("credentials", credentials);
        throw new Error("Function not implemented.");
      },
      name: "ICIT Account",
    })
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
