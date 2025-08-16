import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "./mongodb";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Missing credentials");
          }

          const client = await clientPromise;
          const db = client.db("votingApp");
          const user = await db
            .collection("users")
            .findOne({ email: credentials.email });

          if (!user) throw new Error("No user found with this email.");

          const passwordsMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!passwordsMatch) throw new Error("Incorrect password.");

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role || "user",
          };
        } catch (error) {
          console.error("NextAuth authorize error:", error);
          throw error;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          token.id = user.id;
          token.role = user.role;
        }
        return token;
      } catch (error) {
        console.error("NextAuth JWT callback error:", error);
        return token;
      }
    },
    async session({ session, token }) {
      try {
        if (session.user) {
          session.user.id = token.id;
          session.user.role = token.role;
        }
        return session;
      } catch (error) {
        console.error("NextAuth session callback error:", error);
        return session;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { 
    signIn: "/auth/signin",
    error: "/auth/signin"
  },
  debug: process.env.NODE_ENV === "development",
  // Override NEXTAUTH_URL if needed
  ...(process.env.NODE_ENV === "development" && {
    url: process.env.NEXTAUTH_URL || "http://localhost:3001"
  })
};
