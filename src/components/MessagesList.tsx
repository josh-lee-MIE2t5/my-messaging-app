import {
  List,
  ListItem,
  Avatar,
  Typography,
  Link,
  TextField,
} from "@mui/material";
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

  const [oldDiff, setOldDiff] = useState(0);

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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid grey",
                }}
              >
                <Avatar style={{ margin: "0.5em 1em" }}></Avatar>
                {/* putt the profile picture here later */}
                <Typography style={{ color: "white" }}>
                  {myChatRooms.find((c) => c.id === message.chatRoomId)?.name}
                </Typography>
              </div>
              <div
                id="listOfMessagesWrapper"
                className={styles.messagesHolderForChatroomOpen}
              >
                {loading && <span>Loading...</span>}
                {myChatRooms.find((c) => c.id === chatRoomId)?.mostRecentMsg
                  ?.from.uid === authContext.user?.uid && (
                  <Typography
                    style={{
                      textAlign: "end",
                      color: "white",
                      fontSize: "0.75em",
                      marginRight: "0.5em",
                    }}
                  >
                    {readBy.filter((u) => u.uid !== authContext.user?.uid)
                      .length
                      ? `read by ${readBy
                          .filter((u) => u.uid !== authContext.user?.uid)
                          .map((rb) => {
                            return ` ${rb.email}`;
                          })}`
                      : "Delivered"}
                  </Typography>
                )}

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
              </div>
              <div className={styles.msgSendingControls}>
                <textarea
                  onInput={(element) => {
                    element.currentTarget.style.height = "10px";
                    element.currentTarget.style.height =
                      element.currentTarget.scrollHeight + "px";
                  }}
                  onKeyDown={(e) => {
                    if (e.keyCode === 13 && !e.shiftKey) {
                      // prevent default behavior
                      e.preventDefault();
                      if (typeof chatRoomId === "string" && message.text.length)
                        SendMessage(chatRoomId);
                      setMessage((prevState) => ({ ...prevState, text: "" }));
                    }
                  }}
                  onChange={onMessageChange}
                  value={message.text}
                  className={styles.msgTxtInput}
                  placeholder="Message"
                  rows={1}
                />
                <button
                  onClick={(e) => {
                    if (typeof chatRoomId === "string" && message.text.length)
                      SendMessage(chatRoomId);
                    setMessage((prevState) => ({ ...prevState, text: "" }));
                  }}
                >
                  Send
                </button>
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
