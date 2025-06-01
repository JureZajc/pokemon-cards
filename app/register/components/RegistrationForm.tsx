"use client";

import React, {FormEvent, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {signIn} from "next-auth/react"; // Import signIn
import {z} from "zod";
import {registrationSchema} from "@/lib/schemas"; // Import your Zod schema

export default function RegistrationForm() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState(""); // Add email state
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const [registrationSuccess, setRegistrationSuccess] = useState(false); // Track registration

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError(""); // Clear old errors

        try {
            // ✅ 1. Client-side Zod validation
            registrationSchema.parse({username, email, password});

            // ✅ 2. Try to register/login via signIn
            const result = await signIn("credentials", {
                username,
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError(result.error);
            } else {
                setRegistrationSuccess(true);
            }
        } catch (error) {
            // ✅ 3. Catch client-side Zod error
            if (error instanceof z.ZodError) {
                setError(error.errors[0].message); // Show first error
            } else {
                console.error("Unexpected error:", error);
                setError("An unexpected error occurred.");
            }
        }
    };


    React.useEffect(() => {
        if (registrationSuccess) {
            router.push("/login"); // Redirect to login page
        }
    }, [registrationSuccess, router]);

    return (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
            <h2 className="text-center text-2xl font-bold mb-6 text-gray-800 my-4">
                Join the Pokémon Trainer Club!
            </h2>
            <form onSubmit={handleSubmit}>
                {error && (
                    <div
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                        role="alert"
                    >
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="username"
                    >
                        Username
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="username"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                {/* Email field */}
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="email"
                    >
                        Email
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Register
                    </button>
                    <Link
                        className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                        href="/login"
                    >
                        Already have an account?
                    </Link>
                </div>
            </form>
        </div>
    );
}
