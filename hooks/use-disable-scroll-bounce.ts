import { useEffect } from "react";

export const useDisableScrollBounce = () => {
    useEffect(() => {
        document.body.classList.add(
            "overscroll-none",
            "overflow-hidden",
            // "disable-scroll-bounce"
        );

        return () => {
            document.body.classList.remove(
                "overscroll-none",
                "overflow-hidden",
                // "disable-scroll-bounce"
            );
        };
    }, []);
};