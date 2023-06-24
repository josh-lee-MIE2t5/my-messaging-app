import { Avatar, Box, Typography } from "@mui/material";
import Link from "next/link";
import styles from "../styles/ChatRoomListItem.module.css";
import FirestoreUser from "@/types/FirestoreUser.types";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import useMediaQuery from "@mui/material/useMediaQuery";

interface Props {
  id: string;
  name: string | undefined;
  mostRecentMsg?: Msg;
  isUnopened: boolean;
}

interface Msg {
  from: FirestoreUser;
  text: string;
}
//change style if this chatroom is the one selected
function ChatRoomListItem({ id, name, mostRecentMsg, isUnopened }: Props) {
  const isMediumScreen = useMediaQuery("(min-width:900px)");
  const authContext = useContext(AuthContext);
  const mostRecentMsgDisplay =
    mostRecentMsg &&
    (mostRecentMsg.from.uid === authContext?.user?.uid
      ? "You"
      : mostRecentMsg?.from.username || mostRecentMsg?.from.email) +
      ": " +
      mostRecentMsg?.text;
  return (
    <Box className={styles.chatRoomListItemContainer}>
      <Link
        style={{
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: isMediumScreen ? "start" : "center",
        }}
        href={`/messages/${id}`}
      >
        <div className={styles.CRLIContentWrapper}>
          <Avatar style={{ marginLeft: isMediumScreen ? "1em" : "0" }}></Avatar>
          {isMediumScreen && (
            <div className={styles.chatRoomTxtDetails}>
              <Typography className={styles.chatRoomName}>{name}</Typography>
              <Typography className={styles.mostRecentTxt}>
                {mostRecentMsgDisplay}
              </Typography>
            </div>
          )}
        </div>
        <div hidden={isUnopened} className={styles.unOpenedIndicator}></div>
      </Link>
    </Box>
  );
}

export default ChatRoomListItem;
