import { CircleButton } from "./ui/Buttons";
import { removeItem, updateItem } from "../lib/actions";

export default function Products({ items }: { items: InventoryItem[] }) {
  return (
    <div className="mb-12 mt-4 rounded-lg border-8 border-[#2a3b45]">
      {items.length > 0 ? (
        <>
          {/* Table for mobile */}
          <div className="block md:hidden">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col overflow-hidden border-b-[1px] border-[#2a3b45] pb-4"
              >
                <div className="flex w-full flex-row items-center justify-between gap-2 p-2">
                  <div className="flex flex-row items-center gap-2 p-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                    <span>{item.name}</span>
                  </div>
                  <span>Qty: {item.quantity}</span>
                </div>

                <div className="ml-auto flex flex-row justify-items-end gap-2 py-2 pr-2">
                  <AddOne itemId={item.id} quantity={item.quantity} />
                  <RemoveOne itemId={item.id} quantity={item.quantity} />
                  <DeleteItem id={item.id} />
                </div>
              </div>
            ))}
          </div>

          {/* Table for desktop */}
          <table className="hidden min-w-full md:table">
            <thead className="bg-[#2a3b45] text-left text-sm font-bold">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium">
                  Image
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Available
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  <span>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b-[1px] border-[#2a3b45] text-sm font-normal"
                >
                  <td className="px-4 py-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  </td>
                  <td className="px-3 py-4">
                    {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                  </td>
                  <td className="px-3 py-4">{item.quantity}</td>
                  <td className="py-2">
                    <div className="flex flex-row items-center gap-2 px-3 py-4">
                      <AddOne itemId={item.id} quantity={item.quantity} />
                      <RemoveOne itemId={item.id} quantity={item.quantity} />
                      <DeleteItem id={item.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div className="my-8 text-center text-xl">No Item Found</div>
      )}
    </div>
  );
}

export function DeleteItem({ id }: { id: number }) {
  const deleteItemWithId = removeItem.bind(null, id);

  return (
    <form action={deleteItemWithId}>
      <CircleButton>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </CircleButton>
    </form>
  );
}

export function AddOne({
  itemId,
  quantity,
}: {
  itemId: number;
  quantity: number;
}) {
  const newQty = quantity + 1;
  const updateItemWithId = updateItem.bind(null, itemId, newQty);

  return (
    <form action={updateItemWithId}>
      <CircleButton classes="w-20">+</CircleButton>
    </form>
  );
}

export function RemoveOne({
  itemId,
  quantity,
}: {
  itemId: number;
  quantity: number;
}) {
  const newQty = quantity - 1;
  const updateItemWithId = updateItem.bind(null, itemId, newQty);

  return (
    <form action={updateItemWithId}>
      <CircleButton classes="w-20">-</CircleButton>
    </form>
  );
}
