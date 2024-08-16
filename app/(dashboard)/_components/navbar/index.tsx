"use client";

import { UserButton } from "@clerk/nextjs";

export const Navbar = () => {
  return (
    <div className="flex items-center gap-x-4 bg-green-200">
      <div className="hidden lg:flex flex-1 bg-yellow-200">Search!</div>
      <UserButton />
    </div>
  );
};
