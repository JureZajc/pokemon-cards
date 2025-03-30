// app/page.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-yellow-400 via-red-500 to-purple-500 overflow-hidden rounded-lg shadow-xl">
        <div className="absolute inset-0">
          <Image
            src="/images/image2.webp" // Replace with your hero image
            alt="Pokémon Card Collection Hero"
            layout="fill"
            objectFit="cover"
            priority
            quality={75}
          />
          <div className="absolute inset-0 bg-black opacity-20"></div>{" "}
          {/* Darken the image */}
        </div>
        <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
          <h1 className="text-white text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-center">
            Embark on Your Pokémon Card Collecting Journey
          </h1>
          <p className="mt-6 text-xl text-gray-200 max-w-2xl mx-auto text-center">
            Discover, collect, and trade your favorite Pokémon cards. Build your
            ultimate collection and become a master trainer!
          </p>
          <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
            <Link
              href="/card-sets"
              className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 sm:px-8"
            >
              Explore Card Sets
            </Link>
            <Link
              href="/search"
              className="mt-3 flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-gray-50 sm:mt-0 sm:ml-3"
            >
              Search for Cards
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section (Optional) */}
      <div className="bg-white py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2 text-gray-700">
                Explore Vast Card Sets
              </h3>
              <p className="text-gray-600">
                Browse through a comprehensive database of Pokémon card sets,
                from classic to modern.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2 text-gray-700">
                Build Your Collection
              </h3>
              <p className="text-gray-600">
                Easily track and manage your Pokémon card collection with our
                intuitive tools.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2 text-gray-700">
                Discover Card Prices
              </h3>
              <p className="text-gray-600">
                Stay up-to-date on the latest market prices for your favorite
                Pokémon cards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
