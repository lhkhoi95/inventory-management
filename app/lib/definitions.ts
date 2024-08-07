interface InventoryItem {
  id: number;
  image: string;
  public_id: string;
  name: string;
  quantity: number;
}

interface AIDetectedItem {
  name: string;
  quantity: number;
}

interface AIDetectedItems {
  items: AIDetectedItem[];
}

type FormState = {
  errors?: {
    name?: string[];
    quantity?: string[];
    image?: string[];
    public_id?: string[];
  };
  message: string | null;
  items?: AIDetectedItem[] | null;
};

interface CloudinaryResponse {
  imageUrl: string;
  publicId: string;
}
