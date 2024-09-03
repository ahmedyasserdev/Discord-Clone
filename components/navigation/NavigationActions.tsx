"use client"
import { PlusIcon } from "lucide-react";
import React from "react";
import ActionTooltip from "../shared/ActionTooltip";
import { useModal } from "@/hooks/use-modal-store";

const NavigationActions = () => {
  const {onOpen } = useModal()
  return (
    <div>
      <ActionTooltip label = "Add a server" side = "right" align = "center">
      <button onClick = { () =>  onOpen("createServer")} className = "group flex items-center">
        <div className="mx-3 flex-center overflow-hidden bg-background dark:bg-neutral-700 group-hover:bg-emerald-500 size-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all  ">
            <PlusIcon size={25} className = "group-hover:text-white text-emerald-500 transition" />
        </div>
      </button>
      </ActionTooltip>
    </div>
  );
};

export default NavigationActions;