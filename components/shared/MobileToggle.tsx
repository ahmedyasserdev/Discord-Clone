import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Button } from "../ui/button"
import NavigationSidebar from "../navigation/NavigationSidebar"
import ServerSidebar from "../server/ServerSidebar"
  
const MobileToggle = ({serverId} : {serverId : string}) => {
  return (
    <Sheet>
  <SheetTrigger>
    <Button variant={'ghost'} size={'icon'} className="md:hidden" asChild >
    <Menu className="size-5 " />
    </Button>
  </SheetTrigger>
  <SheetContent side = "left" className="p-0 gap-0 flex">
     <div className = "w-[72px] " >
        <NavigationSidebar />
     </div>
     <ServerSidebar serverId={serverId}/>
  </SheetContent>
</Sheet>

  )
}

export default MobileToggle