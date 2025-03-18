"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "./interfaces/Card"; // Corrected import
import { useSession } from "next-auth/react"; // Import useSession hook

interface CardItemProps {
  card: Card;
}

export default function CardItem({ card }: CardItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const { status } = useSession(); // Get session information
  const [collectionMessage, setCollectionMessage] = useState("");
  const [wishlistMessage, setWishlistMessage] = useState("");

  const handleImageClick = () => {
    setIsModalOpen(true); // Open the modal on image click
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal(); // Close if click is on the overlay itself
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseModal(); // Close if Escape key is pressed
      }
    };

    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown); // Add event listener when modal is open
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown); // Remove event listener when modal is closed or component unmounts
    };
  }, [isModalOpen]); // Run effect when isModalOpen changes

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
      <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
        <Image
          src={card.images.large}
          alt={card.name}
          width={200}
          height={280}
          className="mb-2 cursor-pointer" // Add cursor style
          unoptimized={true}
          onClick={handleImageClick} // Handle image click
        />
        <h2 className="text-xl font-bold text-gray-800">{card.name}</h2>
        {card.cardmarket?.prices?.averageSellPrice && (
          <p className="text-gray-600">
            Price: ${card.cardmarket.prices.averageSellPrice.toFixed(2)}
          </p>
        )}

        {/* Conditionally render buttons based on session status */}
        {status === "authenticated" ? (
          <div className="flex justify-center mt-2">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
              onClick={handleAddToCollection}
            >
              Add to Collection
            </button>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleAddToWishlist}
            >
              Add to Wishlist
            </button>
            {collectionMessage && (
              <p className="text-sm text-blue-500 ml-2">{collectionMessage}</p>
            )}
            {wishlistMessage && (
              <p className="text-sm text-green-500 ml-2">{wishlistMessage}</p>
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
              className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center"
              onClick={handleCloseModal} // Keep close button functionality
            >
              X
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
