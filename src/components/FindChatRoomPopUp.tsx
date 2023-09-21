import { FindChatRoomPopUpContext } from "@/context/FindChatRoomPopUpContext";
import { useContext, useEffect } from "react";
import styles from "../styles/FindChatRoomPopUp.module.css";
import { Grid } from "@mui/material";

function FindChatRoomPopUp() {
  const findChatRoomPopupContext = useContext(FindChatRoomPopUpContext);
  return findChatRoomPopupContext !== undefined ? (
    <Grid item xs={2} md={4} lg={3} className={styles.chatroomListHolder}>
      <input
        value={findChatRoomPopupContext.query}
        onChange={(event) => {
          findChatRoomPopupContext.onQueryChange(event);
        }}
        type="text"
        name=""
        id="userSearch"
        autoFocus
      />
      <button
        onClick={(e) => {
          findChatRoomPopupContext.toggle();
        }}
      >
        X
      </button>
    </Grid>
  ) : (
    <></>
  );
}

export default FindChatRoomPopUp;
