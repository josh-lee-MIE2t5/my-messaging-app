import ReactFCProps from "@/types/ReactFCProps.types";
import { ChangeEvent, createContext, useState } from "react";

export interface FindChatRoomPopUpCTXType {
  isOpen: boolean;
  toggle: Function;
  query: string;
  onQueryChange: Function;
}

function useFindChatRoomPopUp() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  function toggle() {
    setIsOpen((prevOpenState) => !prevOpenState);
    setQuery("");
  }

  function onQueryChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setQuery(e.target.value);
  }

  return { isOpen, toggle, query, onQueryChange };
}

export const FindChatRoomPopUpContext = createContext<
  FindChatRoomPopUpCTXType | undefined
>(undefined);

export default function FindChatRoomPopUpProvider({ children }: ReactFCProps) {
  return (
    <FindChatRoomPopUpContext.Provider value={{ ...useFindChatRoomPopUp() }}>
      {children}
    </FindChatRoomPopUpContext.Provider>
  );
}
