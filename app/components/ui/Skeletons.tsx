import React from "react";

export function ProductsSkeleton() {
  return (
    <div className="mb-12 mt-4 rounded-lg border-8 border-[#2a3b45]">
      {/* Mobile Skeleton */}
      <div className="block md:hidden">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="flex flex-col overflow-hidden border-b-[1px] border-[#2a3b45] pb-4"
          >
            <div className="flex w-full flex-row items-center justify-between gap-2 p-2">
              <div className="flex flex-row items-center gap-2 p-2">
                <div className="h-10 w-10 animate-pulse rounded-md bg-gray-300" />
                <div className="h-4 w-24 animate-pulse bg-gray-300" />
              </div>
              <div className="h-4 w-16 animate-pulse bg-gray-300" />
            </div>
            <div className="flex w-full flex-row justify-end justify-items-end gap-2 p-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-8 animate-pulse rounded-full bg-gray-300"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Skeleton */}
      <table className="hidden min-w-full md:table">
        <thead className="bg-[#2a3b45] text-left text-sm font-bold">
          <tr>
            <th scope="col" className="w-1/6 px-4 py-5 font-medium">
              Image
            </th>
            <th scope="col" className="w-2/6 px-3 py-5 font-medium">
              Name
            </th>
            <th scope="col" className="w-1/6 px-3 py-5 font-medium">
              Available
            </th>
            <th scope="col" className="w-2/6 px-3 py-5 font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, index) => (
            <tr
              key={index}
              className="border-b-[1px] border-[#2a3b45] text-sm font-normal"
            >
              <td className="w-1/6 px-4 py-4">
                <div className="h-10 w-10 animate-pulse rounded-md bg-gray-300" />
              </td>
              <td className="w-2/6 px-3 py-4">
                <div className="h-4 w-24 animate-pulse bg-gray-300" />
              </td>
              <td className="w-1/6 px-3 py-4">
                <div className="h-4 w-16 animate-pulse bg-gray-300" />
              </td>
              <td className="w-2/6 py-2">
                <div className="flex flex-row items-center gap-2 px-3 py-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 animate-pulse rounded-full bg-gray-300"
                    />
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
