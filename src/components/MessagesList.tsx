import {
  List,
  ListItem,
  Avatar,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import TryIcon from "@mui/icons-material/Try";
import useChatRooms from "@/hooks/useChatRooms";
import styles from "../styles/MessagesList.module.css";
import ChatRoomListItem from "./ChatRoomListItem";
import { AuthContext } from "@/context/AuthContext";
import { ReactElement, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import useMessages from "@/hooks/useMessages";
import MessageDisplay from "./MessageDisplay";
import MessageTextField from "./MessageTextField";

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

  //come back to this it is used for admin to kick users
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
        id={c.id}
        name={c.name}
        isUnopened={c.readBy.some((u) => u.uid === authContext?.user?.uid)}
        mostRecentMsg={c.mostRecentMsg}
      />
    </ListItem>
  ));

  return (
    <Grid container className={styles.msgsListSection}>
      {authContext !== undefined ? (
        <>
          <Grid item xs={2} md={4} className={styles.chatroomListHolder}>
            <List>{listOfChatRooms}</List>
          </Grid>
          {atRoot ? (
            <Grid
              item
              className={styles.chatroomSection}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className={styles.rootPageDisplay}>
                <TryIcon
                  style={{
                    fontSize: "150",
                    color: "#e2e2e2",
                  }}
                />
                <Typography
                  style={{
                    fontSize: "1em",
                    color: "#e2e2e2",
                    textAlign: "center",
                  }}
                >
                  Start connecting with your friends
                </Typography>
                <Button>Send Message</Button>
              </div>
            </Grid>
          ) : (
            <Grid item xs={10} md={8} className={styles.chatroomSection}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid grey",
                }}
              >
                <Avatar style={{ margin: "0.5em 1em" }}></Avatar>
                {/* put the profile picture here later */}
                <Typography style={{ color: "white" }}>
                  {myChatRooms.find((c) => c.id === message.chatRoomId)?.name}
                </Typography>
              </div>
              <div className={styles.messagesHolderForChatroomOpen}>
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
                <ul
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    padding: "0",
                    margin: "0",
                  }}
                >
                  {messages.map((m, i) =>
                    i ? (
                      <MessageDisplay
                        text={m.text}
                        from={m.from}
                        fromOfMsgJustBefore={messages[i - 1].from}
                        date={m.date}
                        dateOfMsgJustBefore={messages[i - 1].date}
                      />
                    ) : (
                      <MessageDisplay
                        text={m.text}
                        from={m.from}
                        date={m.date}
                      />
                    )
                  )}
                </ul>
              </div>
              <MessageTextField
                message={message}
                onMessageChange={onMessageChange}
                setMessage={setMessage}
                SendMessage={SendMessage}
              />
            </Grid>
          )}
        </>
      ) : (
        <div>Loading element here</div>
      )}
    </Grid>
  );
}

export default MessagesList;
