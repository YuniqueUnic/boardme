"use client";

import { memo } from "react";

import { Cursor } from "./cursor";

import { useOthersConnectionIds } from "@liveblocks/react";

const Cursors = () => {
    const ids = useOthersConnectionIds();

    return (
        <>
            {ids.map((connectionId) => {
                return <Cursor
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