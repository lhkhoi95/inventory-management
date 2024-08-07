import { CircleButton } from "./ui/Buttons";
import { removeItem, updateItem } from "../lib/actions";
import { trashIcon } from "./ui/Icons";
import { fetchInventoryItems } from "../lib/data";

export default async function Products({ query }: { query: string }) {
  const items = await fetchInventoryItems(query);

  // // Delay 1 second to simulate loading
  // await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <div className="my-4 mb-12 mt-4 rounded-lg border-8 border-[#2a3b45]">
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

                <div className="flex w-full flex-row justify-end justify-items-end gap-2 p-2">
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
                  <td className="w-1/6 px-4 py-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  </td>
                  <td className="w-2/6 px-3 py-4">
                    {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                  </td>
                  <td className="w-1/6 px-3 py-4">{item.quantity}</td>
                  <td className="w-2/6 py-2">
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
      <CircleButton>{trashIcon}</CircleButton>
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
