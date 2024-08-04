import { Suspense } from "react";
import Products from "./components/products";
import { Button } from "./components/ui/Buttons";
import { plusIcon } from "./components/ui/Icons";
import SearchBar from "./components/ui/SearchBar";
import { redirect } from "next/navigation";
import ProductsSkeleton from "./components/ui/Skeletons";

async function handleAddItem() {
  "use server";
  redirect("/create-product");
}
export default async function Home({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || "";
  return (
    <main className="box-border flex w-full flex-col gap-5 px-4 lg:px-44">
      <h1 className="mt-4 text-center text-4xl uppercase md:text-8xl">
        Inventory
      </h1>
      <div className="mt-4 flex flex-row flex-wrap gap-5">
        <SearchBar />

        {/* Create Item Button */}
        <form className="flex" action={handleAddItem}>
          <Button>
            <div className="flex flex-row items-center justify-items-center md:gap-2">
              <span className="hidden md:block">Create Item</span>
              {plusIcon}
            </div>
          </Button>
        </form>
      </div>
      <Suspense fallback={<ProductsSkeleton />}>
        <Products query={query} />
      </Suspense>
    </main>
  );
}
