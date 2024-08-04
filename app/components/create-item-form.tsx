"use client";

import React, { useState } from "react";
import { Button } from "./ui/Buttons";
import { useFormState } from "react-dom";
import { addItem } from "@/app/lib/actions";
import CameraComponent from "./ui/CameraComponent";
import TextInput from "./ui/TextInput";
import ImageUpload from "./ui/ImageInput";
import { Modal } from "./ui/Modal";

export default function CreateItemForm() {
  const initialState: FormState = { message: null };
  const [state, dispatch] = useFormState(addItem, initialState);
  const [showCamera, setShowCamera] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

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
    // Attach the image file of type File to the field "image" in the FormData object
    if (imageFile) {
      formData.set("image", imageFile);
    }
    dispatch(formData);
  };

  return (
    <>
      <form
        action={handleSubmit}
        className="m-4 mx-auto flex w-80 flex-col gap-6 rounded-md border-4 border-[#2a3b45] p-4 align-middle md:w-96"
      >
        {/* Inventory Name */}
        <TextInput
          label="Name"
          name="name"
          placeholder="e.g: Pens"
          error={state.errors?.name ? state.errors.name[0] : undefined}
        />

        {/* Quantity */}
        <TextInput
          label="Quantity"
          name="quantity"
          placeholder="e.g: 10"
          error={state.errors?.quantity ? state.errors.quantity[0] : undefined}
        />

        {/* Image Upload */}
        <ImageUpload
          handleFileChange={handleFileChange}
          setShowCamera={setShowCamera}
        />

        {/* Display Taken/Uploaded Image */}
        {imageUrl && (
          <div className="mt-4">
            <h2 className="mb-4">Selected Image:</h2>
            <img src={imageUrl} alt="Selected" className="mx-auto h-72" />
          </div>
        )}

        <Button type="submit">Add Item</Button>

        {/* Error Message */}
        {state.message && (
          <div className="mx-auto text-red-500">{state.message}</div>
        )}
        {state.errors?.image && (
          <span className="mx-auto text-red-500">{state.errors.image[0]}</span>
        )}
      </form>

      {showCamera && (
        <Modal onClose={() => setShowCamera(false)}>
          <CameraComponent onCapture={handleCapture} />
        </Modal>
      )}
    </>
  );
}
