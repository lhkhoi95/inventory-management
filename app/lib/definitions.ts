interface InventoryItem {
  id: number;
  image: string;
  name: string;
  quantity: number;
}

type FormState = {
  errors?: {
    name?: string[];
    quantity?: string[];
    image?: string[];
  };
  message: string | null;
};
