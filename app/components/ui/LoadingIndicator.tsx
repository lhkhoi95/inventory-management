import React from "react";

const LoadingIndicator = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        {/* Pulsating circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-24 w-24 animate-pulse rounded-full bg-teal-400"></div>
        </div>

        {/* Rotating ring */}
        <div className="h-24 w-24 animate-spin rounded-full border-t-4 border-solid border-teal-200"></div>

        {/* Loading text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-[#10191e]">
            {children}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
