'use client'

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  
} from "@/components/ui/command"
import { useParams, useRouter } from "next/navigation";

type ServerSearchProps = {
    data : {
        label : string;
        type : 'channel' | 'member',
        data : {
            id : string;
            name : string;
            icon : React.ReactNode
        }[] | undefined
    }[]
}
const ServerSearch = ({data} : ServerSearchProps ) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
 
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, []);

  const onChoose = ({id , type} : {id : string ; type : 'channel' | 'member'}) => {
    setOpen(false);
      if (type === 'member') {
        return router.push(`/server/${params?.serverId}/conversations/${id}`)
      }
      
      if (type === 'channel') {	
        return router.push(`/server/${params?.serverId}/channels/${id}`)
      }

  }
  return (
    <> 
    <button onClick={() => setOpen(!open)} className="flex items-center  group gap-x-2 p-2 rounded-md w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
      <Search className="size-4  text-zinc-500 dark:text-zinc-400"/>
      <p className="p-semibold-14 text-zinc-500	dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300">Search</p>

      <kbd className="pointer-events-none inline-flex h-5 select-none rounded border bg-muted font-mono gap-1 px-1.5 p-medium-12 ml-auto text-muted-foreground "><span className="p-regular-12">CTRL</span>k</kbd>
    </button>

    <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search all channels and members" />
        <CommandList>
          <CommandEmpty>No Results Found</CommandEmpty>

            {
              data.map(({label, type, data}) =>   {
                if(!data?.length) return null;
                return (
                  <CommandGroup key = {label} heading = {label} >
                    {data?.map(({name , id , icon}) => (
                      <CommandItem onSelect = {() => onChoose({id , type})} key = {id} className="">
                        {icon}
                        <span>{name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )
              })
            }


        </CommandList>
       </CommandDialog>
    </>
  )
}

export default ServerSearch