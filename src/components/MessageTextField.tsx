import { Typography } from "@mui/material";
import { useRouter } from "next/router";
import styles from "../styles/MessageTextField.module.css";
import Message from "@/types/Message.types";

interface Props {
  SendMessage: Function;
  onMessageChange: Function;
  message: Message;
  setMessage: Function;
}

function MessageTextField({
  SendMessage,
  onMessageChange,
  message,
  setMessage,
}: Props) {
  const router = useRouter();
  const { chatRoomId } = router.query;

  return (
    <div className={styles.msgSendingControls}>
      <textarea
        onInput={(element) => {
          element.currentTarget.style.height = "10px";
          element.currentTarget.style.height =
            element.currentTarget.scrollHeight + "px";
        }}
        onKeyDown={(e) => {
          if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();
            if (typeof chatRoomId === "string" && message.text.length)
              SendMessage(chatRoomId);
            setMessage((prevState: Message) => ({ ...prevState, text: "" }));
          }
        }}
        onChange={(e) => {
          onMessageChange(e);
        }}
        value={message.text}
        className={styles.msgTxtInput}
        placeholder="Message"
        rows={1}
      />

      {message.text.length ? (
        <button
          className={styles.sendBtn}
          onClick={() => {
            if (typeof chatRoomId === "string" && message.text.length)
              SendMessage(chatRoomId);
            setMessage((prevState: Message) => ({ ...prevState, text: "" }));
          }}
        >
          <Typography>Send</Typography>
        </button>
      ) : (
        <>
          <div>Put icon for image here</div>
        </>
      )}
    </div>
  );
}

export default MessageTextField;
