import FirestoreUser from "@/types/FirestoreUser.types";
import { Typography } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import styles from "../styles/MessageDisplay.module.css";
import { MutableRefObject, useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";

interface Props {
  fromOfMsgJustBefore?: FirestoreUser | null;
  from: FirestoreUser;
  text: string;
  date: any; //try to fix this later
  dateOfMsgJustBefore?: any;
}

interface dateObject {
  seconds: number;
  nanoseconds: number;
}
function MessageDisplay({
  text,
  from,
  fromOfMsgJustBefore,
  date,
  dateOfMsgJustBefore,
}: Props) {
  //conditonally render avatar pic depending on the fromMsgJustBefore and from (lookathowdiscord did their ui)
  //make styles slightly different depending on whether auth user sent the message (you will need authContext)
  const daysOfTheWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednseday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const authContext = useContext(AuthContext);
  const [showotherOptions, setshowOtherOptions] = useState(false);
  const secondsSinceLastMsg = dateOfMsgJustBefore
    ? date.seconds - dateOfMsgJustBefore.seconds
    : 0;
  const dateForDividerDisplay =
    secondsSinceLastMsg >= 1800 ? new Date(date.seconds * 1000) : null;
  return (
    <div
      className={
        authContext?.user?.uid === from?.uid
          ? styles.MessageWrapperFromYou
          : styles.MessageWrapperFromOther
      }
    >
      {dateForDividerDisplay && (
        <span style={{ width: "100%", color: "grey" }}>
          <Typography textAlign="center">
            {((Date.now() - dateForDividerDisplay.getTime()) / 1000 <= 172800
              ? daysOfTheWeek[dateForDividerDisplay.getDay()]
              : dateForDividerDisplay.toLocaleDateString()) +
              " " +
              dateForDividerDisplay.toLocaleTimeString()}
          </Typography>
        </span>
      )}
      <div>
        {from.uid !== fromOfMsgJustBefore?.uid && (
          <Typography
            style={{
              textAlign: authContext?.user?.uid === from?.uid ? "end" : "start",
              padding: "0.25em",
            }}
            className={styles.sentFromIndicator}
          >
            {from.email}
          </Typography>
        )}
        <div
          style={{
            display: "flex",
            flexDirection:
              authContext?.user?.uid === from?.uid ? "row-reverse" : "row",
            alignItems: "center",
          }}
          onMouseEnter={() => {
            setshowOtherOptions(true);
          }}
          onMouseLeave={() => {
            setshowOtherOptions(false);
          }}
        >
          <Typography
            className={
              authContext?.user?.uid === from?.uid
                ? styles.TextFromYou
                : styles.TextSentFromOther
            }
          >
            {text}
          </Typography>
          {showotherOptions && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft:
                  authContext?.user?.uid === from?.uid ? "0" : "0.5em",
                marginRight:
                  authContext?.user?.uid === from?.uid ? "0.5em" : "0",
              }}
            >
              <MoreHorizIcon />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageDisplay;
