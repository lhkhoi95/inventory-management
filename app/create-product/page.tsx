import React from "react";
import CreateItemForm from "../components/create-item-form";
import { redirect } from "next/navigation";
import { rightArrowIcon } from "../components/ui/Icons";

async function handleGoBack() {
  "use server";
  redirect("/");
}

export default function CreateProduct() {
  return (
    <div className="flex flex-col items-center justify-center align-middle">
      <form className="relative" action={handleGoBack}>
        <button className="absolute left-0 top-1/2 size-6 -translate-x-16 -translate-y-1/2 hover:text-[#f01d56] peer-focus:text-gray-900">
          {rightArrowIcon}
        </button>
        <h1 className="my-4 text-4xl font-semibold">Create Item</h1>
      </form>

      <CreateItemForm />
    </div>
  );
}
