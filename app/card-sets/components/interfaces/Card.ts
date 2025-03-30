export interface Card {
  id: string;
  name: string;
  supertype: string;
  subtypes?: string[];
  rarity?: string;
  quantity?: number;
  set: {
    id: string;
    name: string;
  };
  images: {
    small: string;
    large: string;
  };
  cardmarket?: {
    prices?: {
      averageSellPrice?: number;
    };
  };
}
