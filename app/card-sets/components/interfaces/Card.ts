// app/card-sets/interfaces/Card.ts
export interface Card {
  id: string;
  name: string;
  images: {
    small: string;
    large: string;
  };
  cardmarket: {
    prices: {
      averageSellPrice: number;
      // Add other price fields as needed
    };
  };
  // Add other card properties as needed
}
