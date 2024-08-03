interface InventoryItem {
  id: number;
  image: string;
  public_id: string;
  name: string;
  quantity: number;
}

type FormState = {
  errors?: {
    name?: string[];
    quantity?: string[];
    image?: string[];
    public_id?: string[];
  };
  message: string | null;
};

interface CloudinaryResponse {
  imageUrl: string;
  publicId: string;
}
