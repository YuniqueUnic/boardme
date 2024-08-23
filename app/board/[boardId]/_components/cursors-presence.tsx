"use client";

import { memo } from "react";

import { Cursor } from "./cursor";

import { useOthersConnectionIds } from "@liveblocks/react/suspense";

const Cursors = () => {
    const ids = useOthersConnectionIds();

    return (
        <>
            {ids.map((connectionId) => {
                <Cursor
                    key={connectionId}
                    connectionId={connectionId} />;
            })}
        </>
    );
};

export const CursorsPresence = memo(() => {
    return (
        <>

            {/* TODO: Draft Pencil */}
            <Cursors />
        </>
    );
});

CursorsPresence.displayName = "CursorsPresence";