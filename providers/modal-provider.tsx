"use client";

// For this RenameModal
// the below codes ensure the modal only be visible completely on the client.
// And the only reason we do this is because if we don't, it's still work.
// But we will get some cryptic hydration errors which are gonna be very hard to debug unless you do this.
// So the reason I`m doing this inside of a modal provider is set in the future I can have as many of these types of modals as I want
// and I can just easily add them here as to opposed to add this logic in every one of my modals.
// So. I can just do it once and add all of them here.

import { useState, useEffect } from "react";

import { RenameModal } from "@/components/modals/rename-modal";
import { ProModal } from "@/components/modals/pro-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // How do we know when we get into the client side?
    // useEffect can only be called on the client side.
    // So, we create a useEffect with an empty dependency array and set isMounted to true
    // this will ensure the component is only ever rendered on the client side.
    // so that when the useEffect working means that the component is on the client side
    // which would not cause the hydrate problem now.

    // Besides, the ''use client'' is only means the component is a client component, not a server component, but not means client side rendering.
    // !IMPORTANT: The server component  and server side rendering is not the same thing. Those are two different things.
    // Components marked as ''use client'' are still server side rendered. They are just not server components.

    setIsMounted(true);
  });

  if (!isMounted) {
    // For the first rendering - server side,
    // return null for server side rendering to avoid hydrate error
    return null;
  }

  return (
    <>
      <RenameModal />
      <ProModal />
    </>
  );
};
