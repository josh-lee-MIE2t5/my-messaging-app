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
import { ReactElement, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import useMessages from "@/hooks/useMessages";
import MessageDisplay from "./MessageDisplay";
import MessageTextField from "./MessageTextField";
import InfinitScroll from "react-infinite-scroll-component";
import EndOfInfiniteScrollMessages from "./EndOfInfiniteScrollMessages";
import NavigationControl from "./NavigationControl";

function MessagesList({ atRoot }: { atRoot: boolean }) {
  const authContext = useContext(AuthContext);
  const { myChatRooms, isParticpant, removeUser, onMessageRead } =
    useChatRooms();
  const router = useRouter();
  const { chatRoomId } = router.query;
  const {
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
    hasMore,
  } = useMessages();

  //come back to this it is used for admin to kick users
  const [userList, setUserList] = useState<ReactElement<any, any> | undefined>(
    undefined
  );

  //state to track which chatroom is opened
  const [selectedChatroom, setSelectedChatroom] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (
      authContext?.user &&
      typeof chatRoomId === "string" &&
      admin &&
      messages.length &&
      messages[0].id
    ) {
      //confirm user is a participant of the group to be able to enter the chatRoom
      //if the user is no longer a participant redirect user
      setSelectedChatroom(chatRoomId);
      if (admin.uid === authContext.user.uid)
        setUserList(
          <ul>
            {message.to.map((p) => (
              <li key={p.uid}>
                {p.email}
                <button
                  onClick={(e) => {
                    typeof p.uid === "string" &&
                      removeUser(message.chatRoomId, p.uid);
                  }}
                  key={p.uid}
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
  }, [chatRoomId, authContext, admin, messages]);

  //with state defined for what is the selected room if it's id is equal to one of these then pass in
  //true for it's prop "isSelected"
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
        isSelected={c.id === selectedChatroom}
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
          <Grid item xs={2} md={4} lg={3} className={styles.chatroomListHolder}>
            <NavigationControl />
            <List>{listOfChatRooms}</List>
          </Grid>
          {atRoot ? (
            <Grid
              item
              className={styles.chatroomSection}
              xs={10}
              md={8}
              lg={9}
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
                <Button style={{ marginTop: "8px" }}>Send a Message</Button>
              </div>
            </Grid>
          ) : (
            <Grid item xs={10} md={8} lg={9} className={styles.chatroomSection}>
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
              <InfinitScroll
                className={styles.messagesHolderForChatroomOpen}
                inverse={true}
                height={"75vh"}
                dataLength={messages.length}
                next={getOlderMsgs}
                hasMore={hasMore}
                loader={<h3>loading ...</h3>}
                endMessage={
                  message ? (
                    <EndOfInfiniteScrollMessages
                      participants={message.to
                        .slice()
                        .concat(message.from)
                        .sort()}
                    />
                  ) : (
                    <p>messages not defined</p>
                  )
                }
              >
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
                    i === 0 ? (
                      <div id={m.id} key={m.id}>
                        <MessageDisplay
                          key={m.id}
                          text={m.text}
                          from={m.from}
                          date={m.date}
                        />
                      </div>
                    ) : (
                      <div id={m.id} key={m.id}>
                        <MessageDisplay
                          key={m.id}
                          text={m.text}
                          from={m.from}
                          fromOfMsgJustBefore={messages[i - 1].from}
                          date={m.date}
                          dateOfMsgJustBefore={messages[i - 1].date}
                        />
                      </div>
                    )
                  )}
                </ul>
              </InfinitScroll>
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
