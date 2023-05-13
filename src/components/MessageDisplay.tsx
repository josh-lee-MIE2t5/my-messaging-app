import FirestoreUser from "@/types/FirestoreUser.types";
import { Box, Typography } from "@mui/material";
import styles from "../styles/MessageDisplay.module.css";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

interface Props {
  fromOfMsgJustBefore?: FirestoreUser | null;
  from: FirestoreUser;
  text: string;
  date?: Date;
}

function MessageDisplay({ text, from, fromOfMsgJustBefore, date }: Props) {
  //conditonally render avatar pic depending on the fromMsgJustBefore and from (lookathowdiscord did their ui)
  //make styles slightly different depending on whether auth user sent the message (you will need authContext)
  const authContext = useContext(AuthContext);
  return (
    <Box
      className={
        authContext?.user?.uid === from?.uid
          ? styles.MessageWrapperFromYou
          : styles.MessageWrapperFromOther
      }
    >
      {from.uid !== fromOfMsgJustBefore?.uid && (
        <Typography className={styles.sentFromIndicator}>
          {from.email}
        </Typography>
      )}
      <Typography
        className={
          authContext?.user?.uid === from?.uid
            ? styles.TextFromYou
            : styles.TextSentFromOther
        }
      >
        {text}
      </Typography>
    </Box>
  );
}

export default MessageDisplay;
