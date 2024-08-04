"use client";
import React from "react";
import { useFormStatus } from "react-dom";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  classes?: string;
}

// Default Button
export function Button({ children, classes, ...props }: ButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      className={`${classes} duration-250 relative mx-auto inline-block touch-manipulation select-none border-none bg-transparent p-0 outline-offset-4 transition-[filter] hover:brightness-110 focus:outline-none ${
        pending ? "opacity-70" : ""
      }`}
      disabled={pending}
    >
      <span className="duration-600 group-active:translate-y-0.25 absolute inset-0 translate-y-0.5 rounded-xl bg-black/50 transition-transform ease-[cubic-bezier(.3,.7,.4,1)] will-change-transform group-hover:translate-y-1"></span>
      <span
        className={`absolute inset-0 rounded-xl bg-gradient-to-l ${
          pending
            ? "from-[#6B6B6B] via-[#858585] to-[#6B6B6B]"
            : "from-[#470013] via-[#940029] to-[#470013]"
        }`}
      ></span>
      <span
        className={`duration-600 relative block -translate-y-1 rounded-xl px-5 py-1 text-white transition-transform ease-[cubic-bezier(.3,.7,.4,1)] will-change-transform hover:-translate-y-1.5 active:-translate-y-0.5 md:px-4 ${
          pending
            ? "bg-[#A0A0A0] cursor-not-allowed"
            : "bg-[#f01d56] cursor-pointer"
        }`}
      >
        {children}
      </span>
    </button>
  );
}

// Text Button
export function TextButton({ children, classes, ...props }: ButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      className={`hover:text-red-500 ${classes}`}
      disabled={pending}
    >
      {children}
    </button>
  );
}

// Circle Button
export function CircleButton({ children, classes, ...props }: ButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      className={`duration-250 relative inline-block h-8 w-8 touch-manipulation select-none border-none bg-transparent p-0 outline-offset-4 transition-[filter] hover:brightness-110 focus:outline-none ${
        pending ? "opacity-70" : ""
      }`}
      disabled={pending}
    >
      <span className="duration-600 group-active:translate-y-0.25 absolute inset-0 translate-y-0.5 rounded-full bg-black/50 transition-transform ease-[cubic-bezier(.3,.7,.4,1)] will-change-transform group-hover:translate-y-1"></span>
      <span
        className={`absolute inset-0 rounded-full bg-gradient-to-l ${
          pending
            ? "from-[#6B6B6B] via-[#858585] to-[#6B6B6B]"
            : "from-[#470013] via-[#940029] to-[#470013]"
        }`}
      ></span>
      <span
        className={`duration-600 relative flex h-full w-full -translate-y-1 items-center justify-center rounded-full text-lg text-white transition-transform ease-[cubic-bezier(.3,.7,.4,1)] will-change-transform hover:-translate-y-1.5 active:-translate-y-0.5 md:text-lg ${
          pending
            ? "bg-[#A0A0A0] cursor-not-allowed"
            : "bg-[#f01d56] cursor-pointer"
        }`}
      >
        {children}
      </span>
    </button>
  );
}
