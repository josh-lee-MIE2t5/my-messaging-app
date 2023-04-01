import { AuthContext } from "@/context/AuthContext";
import useChatRooms from "@/hooks/useChatRooms";
import useMessages from "@/hooks/useMessages";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

function DirectMessagePage() {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const { chatRoomId } = router.query;

  const { isParticpant } = useChatRooms();
  const {
    readBy,
    SendMessage,
    getChatRoomDetails,
    onMessageChange,
    getOlderMsgs,
    message,
    setMessage,
    messages,
  } = useMessages();

  useEffect(() => {
    if (chatRoomId && authContext?.user && typeof chatRoomId === "string") {
      //confirm user is a participant of the group to be able to enter the chatRoom
      //if the user is no longer a participant redirect user
      const isParticipantPromise = isParticpant(
        authContext.user.uid,
        chatRoomId
      );
      isParticipantPromise.then((p) => {
        p ? getChatRoomDetails() : router.push("/"); //this is only client side guarding look into other options
      });
    }
  }, [chatRoomId, authContext]);

  return (
    <div>
      <ul>
        {messages.map((m, i) => (
          <li key={i}>
            {m.from.email} said {m.text}
          </li>
        ))}
      </ul>
      <p>
        {readBy.length
          ? `read by ${readBy.map((rb, i) => {
              return ` ${rb.email}`;
            })}`
          : "delivered"}
      </p>

      <input type="text" onChange={onMessageChange} value={message.text} />
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
    </div>
  );
}

export default DirectMessagePage;
