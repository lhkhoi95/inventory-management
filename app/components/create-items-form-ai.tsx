"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Button } from "./ui/Buttons";
import { useFormState } from "react-dom";
import { addItems, fetchItemsAI } from "@/app/lib/actions";
import CameraComponent from "./ui/CameraComponent";
import ImageUpload from "./ui/ImageInput";
import { Modal } from "./ui/Modal";
import AIGeneratedItemsTable from "./ui/AIGeneratedItemsTable";

export default function CreateItemsAIForm() {
  const initialState: FormState = { message: null, items: null };
  const [state, dispatch] = useFormState(fetchItemsAI, initialState);
  const [showCamera, setShowCamera] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedItems, setSelectedItems] = useState<AIDetectedItem[] | []>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (state.items) {
      setSelectedItems(state.items);
    }
  }, [state.items]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageUrl(null);
      setImageFile(null);
    }
  };

  const handleCapture = async (image: string) => {
    setImageUrl(image);

    // Convert type base64 string to type File
    const base64Response = await fetch(image);
    const blob = await base64Response.blob();
    const file = new File([blob], `capture_${new Date().getTime()}.jpg`, {
      type: "image/jpeg",
    });

    setImageFile(file);
  };

  const handleSubmit = async (formData: FormData) => {
    setSelectedItems([]);
    // Attach the image file of type File to the field "image" in the FormData object
    if (imageFile) {
      formData.set("name", imageFile.name);
      formData.set("image", imageFile);
    }
    dispatch(formData);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = selectedItems.filter((_, i) => i !== index);
    setSelectedItems(updatedItems);
  };

  const handleAddItem = (item: AIDetectedItem) => {
    setSelectedItems([...selectedItems, item]);
  };

  return (
    <div className="flex flex-row flex-wrap gap-4">
      <form
        action={handleSubmit}
        className="m-4 mx-auto flex w-80 flex-col gap-6 rounded-md border-4 border-[#2a3b45] p-4 align-middle md:w-96"
      >
        <h1 className="mx-auto mt-4 text-xl">Upload an Image to continue</h1>
        {/* Image Upload */}
        <ImageUpload
          handleFileChange={handleFileChange}
          setShowCamera={setShowCamera}
          label={""}
        />

        {/* Display Taken/Uploaded Image */}
        {imageUrl && (
          <div className="mt-4">
            <h2 className="mb-4">Selected Image:</h2>
            <img src={imageUrl} alt="Selected" className="mx-auto h-72" />
          </div>
        )}

        <Button type="submit" onPending={setIsAnalyzing}>
          Analyze
        </Button>

        {/* Error Message */}
        {state.message && (
          <div className="mx-auto text-red-500">{state.message}</div>
        )}
        {state.errors?.image && (
          <span className="mx-auto text-red-500">{state.errors.image[0]}</span>
        )}
      </form>

      {/* Display the AI generated items */}
      <div className="mx-auto my-4 w-80 rounded-md border-4 border-[#2a3b45] p-4 text-center md:w-96">
        <AIGeneratedItemsTable
          items={selectedItems}
          onRemove={handleRemoveItem}
          onAdd={handleAddItem}
          isPending={isAnalyzing}
        />

        {!isAnalyzing && imageFile && (
          <AddItems items={selectedItems} image={imageFile} />
        )}
      </div>

      {showCamera && (
        <Modal onClose={() => setShowCamera(false)}>
          <CameraComponent onCapture={handleCapture} />
        </Modal>
      )}
    </div>
  );
}

export function AddItems({
  items,
  image,
}: {
  items: AIDetectedItem[];
  image: File;
}) {
  const initialState: FormState = { message: null };
  const [state, dispatch] = useFormState(addItems, initialState);

  const handleSubmit = async (formData: FormData) => {
    formData.set("items", JSON.stringify(items));
    formData.set("image", image);
    dispatch(formData);
  };

  return (
    <form action={handleSubmit}>
      <input type="hidden" name="items" value={JSON.stringify(items)} />
      <Button type="submit">Add To Inventory</Button>
    </form>
  );
}
