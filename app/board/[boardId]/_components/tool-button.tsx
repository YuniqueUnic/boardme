"use client";

import { LucideIcon } from "lucide-react";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";

interface ToolButtonProps {
    lable: string;
    icon: LucideIcon;
    onClick: () => void;
    isActive?: boolean;
    isDisabled?: boolean;
}

export const ToolButton = ({
    lable,
    icon: Icon,
    onClick,
    isActive,
    isDisabled }: ToolButtonProps) => {
    return (
        <div className="flex flex-col p-1 m-0 items-center justify-center">
            <Hint label={lable} side="right" sideOffset={14} >
                <Button onClick={onClick}
                    size={"icon"}
                    variant={isActive ? "boardAcive" : "board"}
                    disabled={isDisabled}>
                    <Icon className="w-6 h-6" />
                </Button>
            </Hint>
        </div>);
};