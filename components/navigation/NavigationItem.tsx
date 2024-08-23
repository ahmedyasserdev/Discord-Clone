"use client";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import ActionTooltip from "@/components/shared/ActionTooltip";

type NavigationItemProps = {
  id: string;
  name: string;
  imageUrl: string;
};

const NavigationItem = ({ id, name, imageUrl }: NavigationItemProps) => {
  const params = useParams();
  const router = useRouter();

  const handleClick = () => router.push(`/servers/${id}`);

  return (
    <ActionTooltip label={name} side="right" align="center">
      <button className="group relaive flex items-center" onClick={handleClick}>
        <div
          className={cn(
            "absolute left-0 w-[4px] bg-primary rounded-r-full  transition",
            params?.serverId === id
              ? "h-[36px]"
              : "h-[8px] group-hover:h-[20px]"
          )}
        />

        <div
          className={cn(
            "relative mx-3  flex group size-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
            params?.serverId === id &&
              "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
            <Image  src = {imageUrl} alt = {name} fill  />
        </div>
      </button>
    </ActionTooltip>
  );
};

export default NavigationItem;
