import { Avatar, Box, Typography } from "@mui/material";
import Link from "next/link";
import styles from "../styles/ChatRoomListItem.module.css";
import FirestoreUser from "@/types/FirestoreUser.types";

interface Props {
  id: string;
  name: string | undefined;
  mostRecentMsg?: Msg;
  readBy: FirestoreUser[];
  isUnopened: boolean;
}

interface Msg {
  from: FirestoreUser;
  text: string;
}

function ChatRoomListItem({
  readBy,
  id,
  name,
  mostRecentMsg,
  isUnopened,
}: Props) {
  const mostRecentMsgDisplay =
    mostRecentMsg &&
    (mostRecentMsg?.from.username || mostRecentMsg?.from.email) +
      ": " +
      mostRecentMsg?.text;
  return (
    <Box className={styles.chatRoomListItemContainer}>
      <Link
        style={{
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
        }}
        href={`/messages/${id}`}
      >
        <div className={styles.CRLIContentWrapper}>
          <Avatar className={styles.chatRoomAvatar}></Avatar>
          <div className={styles.chatRoomTxtDetails}>
            <Typography className={styles.chatRoomName}>{name}</Typography>
            <Typography className={styles.mostRecentTxt}>
              {mostRecentMsgDisplay}
            </Typography>
          </div>
        </div>
        <div hidden={isUnopened} className={styles.unOpenedIndicator}></div>
      </Link>
    </Box>
  );
}

export default ChatRoomListItem;
