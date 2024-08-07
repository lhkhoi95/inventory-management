import React from "react";

import { redirect } from "next/navigation";
import { rightArrowIcon } from "../components/ui/Icons";
import CreateItemsAIForm from "../components/create-items-form-ai";

async function handleGoBack() {
  "use server";
  redirect("/create-product");
}

export default function CreateProductsAI() {
  return (
    <div className="flex flex-col items-center justify-center align-middle">
      <form className="relative" action={handleGoBack}>
        <button className="absolute left-0 top-1/2 size-6 -translate-x-16 -translate-y-1/2 hover:text-[#f01d56] peer-focus:text-gray-900">
          {rightArrowIcon}
        </button>
        <h1 className="my-4 text-4xl font-semibold">Objects Detection</h1>
      </form>

      <CreateItemsAIForm />
    </div>
  );
}
