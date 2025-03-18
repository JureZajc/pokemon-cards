import NextAuth, { AuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { registrationSchema } from "@/lib/schemas"; // Import Zod schema
import { ZodError } from "zod";

interface SessionUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface CustomSession extends Session {
  user: SessionUser;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        email: { label: "Email", type: "email" }, // Add email
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("No credentials provided");
        }

        try {
          await connectToDatabase();

          // Check if the user exists
          let user = await User.findOne({ username: credentials.username });

          if (!user) {
            // User doesn't exist, so register them

            // Validate input using Zod (server-side)
            const validatedData = registrationSchema.safeParse({
              username: credentials.username,
              email: credentials.email, // Use email
              password: credentials.password,
            });

            if (!validatedData.success) {
              // Zod validation failed
              const errorMessage = validatedData.error.errors[0].message;
              throw new Error(`Registration error: ${errorMessage}`);
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(credentials.password, 10);

            // Create the new user
            user = new User({
              username: credentials.username,
              email: credentials.email, // Save email
              password: hashedPassword,
            });

            await user.save();
          }

          // At this point, we have a user (either existing or newly registered)

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValid) throw new Error("Invalid credentials");

          return { id: user.id, name: user.username, email: user.email };
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
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login", // Redirect to login page on error
  },
  callbacks: {
    async session({ session, token }) {
      const customSession: CustomSession = {
        ...session,
        user: {
          name: session.user?.name,
          email: token.email as string, // Safely access token.email, it's used in jwt
          image: session.user?.image,
        },
      };

      return customSession;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
