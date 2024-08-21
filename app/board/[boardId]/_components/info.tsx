"use client";

import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";

import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

import { cn } from "@/lib/utils";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { useRenameModal } from "@/store/use-rename-modal";

interface InfoProps {
  boardId: string;
}

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export const TabSeparator = () => {
  return (
    <div className="text-neutral-300 px-1.5"></div>
  );
};

export const Info = ({ boardId }: InfoProps) => {
  const { onOpen } = useRenameModal();

  const data = useQuery(api.board.get, {
    id: boardId as Id<"boards">,
  });

  if (!data) return <InfoSkeleton />;

  return (
    <div
      className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12
                 flex items-center shadow-md">
      <Hint label="Go to boards" side="bottom" sideOffset={10}>
        <Button asChild className="px-2" variant={"board"}>
          <Link href={"/"}>
            <Image
              src={"/logo.svg"}
              alt={"Logo"}
              width={40}
              height={40}
            />
            <span className={cn(
              "font-semibold text-xl ml-2 text-black",
              font.className
            )}>
              Board
            </span>
          </Link>
        </Button>
      </Hint>
      <TabSeparator />
      <Button
        onClick={() => { onOpen(data._id, data.title); }}
        variant={"board"}
        className="text-base font-normal px-2">
        {data.title}
      </Button>
    </div >
  );
};

export const InfoSkeleton = () => {
  return (
    <div
      className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12
               flex items-center shadow-md w-[300px]"></div>
  );
};
