"use client";

import Image from "next/image";
import { Poppins } from "next/font/google";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { Button } from "../ui/button";
import { useAction } from "convex/react";
import { useProModal } from "@/store/use-pro-modal";
import { useOrganization } from "@clerk/nextjs";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

export const ProModal = () => {

  const { isOpen, onClose } = useProModal();

  const pay = useAction(api.stripe.pay);
  const [pending, setPending] = useState(false);

  const { organization } = useOrganization();


  const onClick = async () => {
    if (!organization?.id) {
      throw new Error("Organization not found");
    }

    setPending(true);

    try {
      const redirectUrl = await pay({
        orgId: organization.id
      });

      window.location.href = redirectUrl;
    } finally {
      setPending(false);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[340px] p-0 overflow-hidden" >
        <div className="aspect-video relative flex items-center justify-center">
          <Image
            src={"/pro.svg"}
            alt={"Pro"}
            className="object-fit pt-8"
            fill />
        </div>
        <div className={cn(
          "text-neutral-700 mx-auto space-y-6 p-6",
          font.className
        )}>
          <h2 className="font-medium text-lg">
            🎖️ Upgrade to Pro today!
          </h2>
          <div className="pl-3">
            <ul className="text-[11px] space-y-1 list-disc">
              <li>Unlimited boards</li>
              <li>Unlimited tools</li>
              <li>Unlimited organizations</li>
              <li>Unlimited members</li>
              <li>More function will come soon...</li>
            </ul>
          </div>
          <Button
            size={"sm"}
            className="w-full"
            onClick={onClick}
            disabled={pending}
          >
            Upgrade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
