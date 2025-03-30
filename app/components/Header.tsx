"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { status } = useSession();

  return (
    <header className="bg-gray-100 py-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Pokémon Card Collection
        </Link>

        <nav className="flex items-center">
          <Link
            href="/search"
            className="mr-4 text-gray-700 hover:text-blue-500"
          >
            Search
          </Link>
          <Link
            href="/card-sets"
            className="mr-4 text-gray-700 hover:text-blue-500"
          >
            Card Sets
          </Link>

          {status === "authenticated" ? (
            <>
              <Link
                href="/your-collection"
                className="mr-4 text-gray-700 hover:text-blue-500"
              >
                Your Collection
              </Link>
              <Link
                href="/change-password"
                className="mr-4 text-gray-700 hover:text-blue-500"
              >
                Change Password
              </Link>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => signOut()}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="mr-4 text-gray-700 hover:text-blue-500"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
