import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "../../../../lib/mongodb";
import bcrypt from "bcrypt";
export const runtime = 'nodejs';




export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email:{label: "Email", type: "text"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials){
                if(!credentials.email || !credentials.password){
                    throw new Error("Missing credentials");
                }

                const client = await clientPromise;
                const db= client.db("votingApp");
                const user = await db.collection("users").findOne({email: credentials.email});

                if(!user){
                    throw new Error("No user found with this email.");
                }

                const passwordsMatch = await bcrypt.compare(credentials.password, user.password);

                if(!passwordsMatch){
                    throw new Erro("Incorrect password.");
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role || 'user',
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({token, user}){
            if(user){
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({session, token}){
            if(session.user){
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages:{
        signIn: '/auth/signin',
    }
};
const handler = NextAuth(authOptions);
export {handler as GET, handler as POST};