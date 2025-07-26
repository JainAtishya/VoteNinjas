import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "../../components/ui/menubar"

export function Menu() {
  return (
    <div className="flex justify-center">
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>My Dashboard</MenubarTrigger>

      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Live LeaderBoard</MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Analytics</MenubarTrigger>
      </MenubarMenu>
    </Menubar>
    </div>
  )
}
