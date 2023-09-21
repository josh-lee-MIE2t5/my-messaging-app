import { Grid, List, ListItem } from "@mui/material";
import NavigationControl from "./NavigationControl";
import styles from "../styles/ChatroomListHolder.module.css";
import ChatRoomListType from "@/types/ChatRoomListType";
import ChatRoomListItem from "./ChatRoomListItem";
import { FindChatRoomPopUpContext } from "@/context/FindChatRoomPopUpContext";
import { useContext, useEffect } from "react";
import FindChatRoomPopUp from "./FindChatRoomPopUp";

interface Props {
  myChatRooms: ChatRoomListType[];
  uid: string;
  chatRoomId: string | string[] | undefined;
  selectedChatroom: string | undefined;
  onMessageRead: Function;
  setMessages: Function;
  atRoot: Boolean;
}

export default function ChatRoomListHolder({
  myChatRooms,
  uid,
  chatRoomId,
  selectedChatroom,
  onMessageRead,
  setMessages,
  atRoot,
}: Props) {
  //   useEffect(() => {
  //     console.log(
  //       myChatRooms,
  //       uid,
  //       chatRoomId,
  //       selectedChatroom,
  //       onMessageRead,
  //       setMessages
  //     );
  //   }, []);
  const findChatRoomPopupContext = useContext(FindChatRoomPopUpContext);

  return findChatRoomPopupContext && findChatRoomPopupContext.isOpen ? (
    <FindChatRoomPopUp />
  ) : (
    <Grid item xs={2} md={4} lg={3} className={styles.chatroomListHolder}>
      <NavigationControl />
      <List>
        {myChatRooms.map((c) => (
          <ListItem
            onClick={() => {
              onMessageRead(c.id);
              if (chatRoomId !== c.id) setMessages([]);
            }}
            button
            key={c.id}
            style={{ padding: 0 }}
          >
            <ChatRoomListItem
              isSelected={!atRoot && c.id === selectedChatroom}
              id={c.id}
              name={c.name}
              isUnopened={c.readBy.some((u) => u.uid === uid)}
              mostRecentMsg={c.mostRecentMsg}
            />
          </ListItem>
        ))}
      </List>
    </Grid>
  );
}
