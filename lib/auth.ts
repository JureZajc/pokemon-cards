// lib/auth.ts
import {AuthOptions, Session} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {connectToDatabase} from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";
import {registrationSchema} from "@/lib/schemas";
import {ZodError} from "zod";

interface SessionUser {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id?: string;
}

interface CustomSession extends Session {
    user: SessionUser;
}

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {label: "Username", type: "text"},
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials) {
                if (!credentials) throw new Error("No credentials provided");

                try {
                    await connectToDatabase();

                    let user = await User.findOne({username: credentials.username});

                    if (!user) {
                        const validatedData = registrationSchema.safeParse({
                            username: credentials.username,
                            email: credentials.email,
                            password: credentials.password,
                        });

                        if (!validatedData.success) {
                            const errorMessage = validatedData.error.errors[0].message;
                            throw new Error(`Registration error: ${errorMessage}`);
                        }

                        const hashedPassword = await bcrypt.hash(credentials.password, 10);

                        user = new User({
                            username: credentials.username,
                            email: credentials.email,
                            password: hashedPassword,
                        });

                        await user.save();
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isValid) throw new Error("Invalid credentials");

                    return {id: user.id, name: user.username, email: user.email};
                } catch (error) {
                    if (error instanceof ZodError) {
                        throw new Error(error.errors[0].message);
                    }
                    console.error("Authentication/Registration error:", error);
                    throw new Error("Authentication failed");
                }
            },
        }),
    ],
    session: {strategy: "jwt"},
    secret: process.env.NEXTAUTH_SECRET,
    pages: {signIn: "/login"},
    callbacks: {
        async session({session, token}) {
            const customSession: CustomSession = {
                ...session,
                user: {
                    id: token.id as string,
                    name: session.user?.name,
                    email: token.email as string,
                    image: session.user?.image,
                },
            };
            return customSession;
        },
        async jwt({token, user}) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },
    },
};
