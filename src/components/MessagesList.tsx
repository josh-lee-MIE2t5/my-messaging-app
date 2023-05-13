import { List, ListItem, Avatar, Typography, Link } from "@mui/material";
import useChatRooms from "@/hooks/useChatRooms";
import styles from "../styles/MessagesList.module.css";
import ChatRoomListItem from "./ChatRoomListItem";
import { AuthContext } from "@/context/AuthContext";
import { ReactElement, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import useMessages from "@/hooks/useMessages";
import MessageDisplay from "./MessageDisplay";

function MessagesList({ atRoot }: { atRoot: boolean }) {
  const authContext = useContext(AuthContext);
  const { myChatRooms, isParticpant, removeUser, onMessageRead } =
    useChatRooms();
  const router = useRouter();
  const { chatRoomId } = router.query;
  const {
    loading,
    readBy,
    SendMessage,
    getChatRoomDetails,
    onMessageChange,
    getOlderMsgs,
    message,
    setMessage,
    messages,
    admin,
    setMessages,
  } = useMessages();
  const [userList, setUserList] = useState<ReactElement<any, any> | undefined>(
    undefined
  );

  useEffect(() => {
    if (authContext?.user && typeof chatRoomId === "string" && admin) {
      //confirm user is a participant of the group to be able to enter the chatRoom
      //if the user is no longer a participant redirect user
      if (admin.uid === authContext.user.uid)
        setUserList(
          <ul>
            {message.to.map((p) => (
              <li>
                {p.email}
                <button
                  onClick={(e) => {
                    typeof p.uid === "string" &&
                      removeUser(message.chatRoomId, p.uid);
                  }}
                >
                  remove
                </button>
              </li>
            ))}
          </ul>
        );

      const isParticipantPromise = isParticpant(
        authContext.user.uid,
        chatRoomId
      );
      isParticipantPromise.then((p) => {
        p ? getChatRoomDetails() : router.push("/"); //this is only client side guarding look into other options
      });
    }
  }, [chatRoomId, authContext, admin]);

  let listOfChatRooms: JSX.Element[] = myChatRooms.map((c) => (
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
        readBy={c.readBy}
        id={c.id}
        name={c.name}
        isUnopened={c.readBy.some((u) => u.uid === authContext?.user?.uid)}
        mostRecentMsg={c.mostRecentMsg}
      />
    </ListItem>
  ));

  return (
    <section className={styles.msgsListSection}>
      {authContext !== undefined ? (
        <>
          <div className={styles.chatroomListHolder}>
            <List style={{ maxWidth: "100%" }}>{listOfChatRooms}</List>
          </div>
          {atRoot ? (
            <>
              <div>send a message to friends</div>
            </>
          ) : (
            <div className={styles.chatroomSection}>
              <div>
                {loading && <span>Loading...</span>}
                <ul>
                  {messages.map((m, i) =>
                    i ? (
                      <MessageDisplay
                        text={m.text}
                        from={m.from}
                        fromOfMsgJustBefore={messages[i - 1].from}
                      />
                    ) : (
                      <MessageDisplay text={m.text} from={m.from} />
                    )
                  )}
                </ul>
                <p>
                  {readBy.length
                    ? `read by ${readBy.map((rb) => {
                        //compare authcontext user and sent by user of the most recent msg
                        return ` ${rb.email}`;
                      })}`
                    : "delivered"}
                </p>

                <input
                  type="text"
                  onChange={onMessageChange}
                  value={message.text}
                />
                <button
                  onClick={(e) => {
                    if (typeof chatRoomId === "string") SendMessage(chatRoomId);
                    setMessage((prevState) => ({ ...prevState, text: "" }));
                  }}
                >
                  Send
                </button>
                <button
                  onClick={() => {
                    getOlderMsgs();
                  }}
                >
                  More
                </button>
                {userList}
              </div>
            </div>
          )}
        </>
      ) : (
        <div>Loading element here</div>
      )}
    </section>
  );
}

export default MessagesList;
