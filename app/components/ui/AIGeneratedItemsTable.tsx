import React from "react";
import { TextButton } from "./Buttons";
import crossIcon, { plusIcon } from "./Icons";
import { getRandomColor } from "@/app/lib/colors";
import LoadingIndicator from "./LoadingIndicator";

interface AIDetectedItemsTableProps {
  items: AIDetectedItem[];
  onRemove: (index: number) => void;
  onAdd: (item: AIDetectedItem) => void;
  isPending: boolean;
}

export default function AIGeneratedItemsTable({
  items,
  onRemove,
  onAdd,
  isPending,
}: AIDetectedItemsTableProps) {
  const crossSymbol = crossIcon({ classes: "w-5 h-5" });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name") as string;

    if (name) {
      onAdd({ name, quantity: 1 });
      form.reset();
    }
  };

  if (isPending) {
    return (
      <div className="my-4 flex min-w-full flex-wrap items-center justify-center gap-3 rounded-md p-2">
        <LoadingIndicator>Identifying...</LoadingIndicator>
      </div>
    );
  }

  // If no items are detected, display a message
  if (items.length === 0) {
    return (
      <div className="my-4 flex min-w-full flex-wrap items-center justify-center gap-3 rounded-md p-2">
        No items detected
      </div>
    );
  }

  // Display the items
  return (
    <>
      <div className="flex min-w-full flex-wrap items-center justify-center gap-3 p-2">
        {items.map((item, index) => (
          <div
            key={index}
            className={`inline-block focus:outline-none hover:brightness-110 text-xs rounded-full ${getRandomColor()} p-2`}
          >
            <div className="flex items-center gap-2">
              {item.name} ({item.quantity})
              <button onClick={() => onRemove(index)}>{crossSymbol}</button>
            </div>
          </div>
        ))}
      </div>
      <form
        className="my-4 flex items-center justify-center"
        onSubmit={handleSubmit}
      >
        <input
          className="w-[50%] rounded-md px-4 py-1 text-sm text-black focus:border-none focus:outline-pink-500"
          placeholder="E.g: Pens"
          required={true}
          name="name"
        />
        <TextButton classes="block">{plusIcon}</TextButton>
      </form>
    </>
  );
}
