"use client";

import React, { useState } from "react";
import { Button, CircleButton } from "./ui/Buttons";
import { cameraIcon, closeIcon, uploadIcon } from "./ui/Icons";
import { useFormState } from "react-dom";
import { addItem } from "@/app/lib/actions";
import CameraComponent from "./ui/CameraComponent";

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

    // Convert base64 string to File
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
        <label className="flex flex-col text-white">
          Name:
          <input
            className="mt-1 rounded-md p-2 text-sm text-black"
            placeholder="e.g: Pens"
            type="text"
            name="name"
            aria-describedby="name-error"
          />
          {state.errors?.name && (
            <span id="name-error" className="mt-4 text-red-500">
              {state.errors.name[0]}
            </span>
          )}
        </label>

        {/* Quantity */}
        <label className="flex flex-col text-white">
          Quantity:
          <input
            className="mt-1 rounded-md p-2 text-sm text-black"
            placeholder="e.g: 10"
            type="number"
            name="quantity"
            aria-describedby="quantity-error"
          />
          {state.errors?.quantity && (
            <span id="quantity-error" className="mt-4 text-red-500">
              {state.errors.quantity[0]}
            </span>
          )}
        </label>

        {/* Image Upload */}
        <label>
          <span className="my-4 text-left">Image:</span>
          <div className="mt-4 flex items-center justify-center gap-8 text-xs text-stone-300">
            <div className="flex flex-col items-center justify-center gap-1 align-middle">
              <CircleButton type="button">
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  id="image-upload"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label htmlFor="image-upload">{uploadIcon}</label>
              </CircleButton>
              <span>Upload</span>
            </div>

            <div className="flex flex-col items-center justify-center gap-1 align-middle">
              <CircleButton type="button" onClick={() => setShowCamera(true)}>
                {cameraIcon}
              </CircleButton>
              <span>Camera</span>
            </div>
          </div>
        </label>

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

export function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-90 text-right text-gray-800">
      <div className="w-96 max-w-lg rounded-lg bg-purple-100 p-4">
        <CircleButton onClick={onClose}>{closeIcon}</CircleButton>
        {children}
      </div>
    </div>
  );
}
