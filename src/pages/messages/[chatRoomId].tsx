import { AuthContext } from "@/context/AuthContext";
import useChatRooms from "@/hooks/useChatRooms";

import useMessages from "@/hooks/useMessages";
import { useRouter } from "next/router";
import { ReactElement, useContext, useEffect, useState } from "react";
import MessagesList from "@/components/MessagesList";
function DirectMessagePage() {
  return (
    <>
      <MessagesList />
    </>
  );
}

export default DirectMessagePage;
