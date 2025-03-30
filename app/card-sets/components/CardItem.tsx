"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "./interfaces/Card";
import { useSession } from "next-auth/react";

interface CardItemProps {
  card: Card;
  quantity?: number;
}

export default function CardItem({ card, quantity }: CardItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { status } = useSession();
  const [collectionMessage, setCollectionMessage] = useState("");
  const [wishlistMessage, setWishlistMessage] = useState("");

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseModal();
      }
    };

    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  const handleAddToCollection = async () => {
    try {
      const response = await fetch("/api/collection/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cardId: card.id }),
      });

      const data = await response.json();

      if (response.ok) {
        setCollectionMessage(data.message);
      } else {
        setCollectionMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error adding to collection:", error);
      setCollectionMessage("An unexpected error occurred.");
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const response = await fetch("/api/wishlist/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cardId: card.id }),
      });

      const data = await response.json();

      if (response.ok) {
        setWishlistMessage(data.message);
      } else {
        setWishlistMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      setWishlistMessage("An unexpected error occurred.");
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center transform transition-transform duration-200 hover:scale-105 hover:shadow-lg">
        <Image
          src={card.images.small}
          alt={card.name}
          width={200}
          height={280}
          className="mb-2 cursor-pointer"
          unoptimized={true}
          onClick={handleImageClick}
        />
        <h2 className="text-xl font-bold text-gray-800">{card.name}</h2>
        {card.cardmarket?.prices?.averageSellPrice && (
          <p className="text-gray-600">
            Price: ${card.cardmarket.prices.averageSellPrice.toFixed(2)}
          </p>
        )}

        {status === "authenticated" ? (
          <div className="flex flex-col justify-center mt-2 items-center">
            <div className="flex items-center justify-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 mb-1"
                onClick={handleAddToCollection}
              >
                Add to Collection
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-1"
                onClick={handleAddToWishlist}
              >
                Add to Wishlist
              </button>
              {collectionMessage && (
                <p className="text-sm text-blue-500 ml-2">
                  {collectionMessage}
                </p>
              )}
              {wishlistMessage && (
                <p className="text-sm text-green-500 ml-2">{wishlistMessage}</p>
              )}
            </div>

            {quantity !== undefined && (
              <p className=" mt-2 text-sm text-blue-600">
                You own: <span className="font-bold">{quantity}</span>
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-500 mt-2">
            Log in to add to your collection or wishlist.
          </p>
        )}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={handleOverlayClick} // Close on overlay click
        >
          {/* Modal Content */}
          <div className="bg-white rounded-lg p-4 max-w-3xl max-h-screen overflow-auto relative">
            <button
              className="absolute top-2 right-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center"
              onClick={handleCloseModal}
            >
              {/* SVG Close Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <Image
              src={card.images.large}
              alt={card.name}
              width={800} // Larger size for the modal
              height={1120}
              unoptimized={true}
              className="mx-auto"
            />
            <h2 className="text-2xl font-bold text-gray-800 mt-4 text-center">
              {card.name}
            </h2>
            {/* Add any other relevant card details here */}
          </div>
        </div>
      )}
    </>
  );
}
