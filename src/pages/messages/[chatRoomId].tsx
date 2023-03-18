import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase/firebase";
import FirestoreUser from "@/types/FirestoreUser.types";
import Message from "@/types/Message.types";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { ChangeEvent, useContext, useEffect, useState } from "react";

function DirectMessagePage() {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const { isReady } = router;
  const { chatRoomId } = router.query;
  const [message, setMessage] = useState<Message>({
    from: { email: authContext?.user?.email, uid: authContext?.user?.uid },
    to: [],
    date: new Date(),
    text: "",
    chatRoomId: "",
    read: false,
  });

  const [messages, setMessages] = useState<Message[]>([]);

  const messagesCollectionRef = collection(db, "messages");

  useEffect(() => {
    if (chatRoomId) getMessages();
  }, [chatRoomId]);

  useEffect(() => {
    if (isReady)
      if (
        typeof chatRoomId === "string" &&
        typeof authContext?.user?.uid === "string"
      ) {
        setMessage((prevState) => ({ ...prevState, chatRoomId }));
        getParticipants(chatRoomId);
      }
  }, [isReady, authContext?.user?.uid]);

  function onMessageChange(e: ChangeEvent<HTMLInputElement>) {
    setMessage((prevState) => ({
      ...prevState,
      date: new Date(),
      text: e.target.value,
    }));
  }

  async function getParticipants(chatRoomId: string) {
    // const friendshipSnap = await getDocs(query(collection(db, "friendships")));
    // let toUserIds: string[] = [];
    // if (friendshipSnap.exists()) {
    //   toUserId = friendshipSnap
    //     .data()
    //     .participants.find((id: string) => id !== authContext?.user?.uid);
    //   const toUserSnap = await getDocs(
    //     query(collection(db, "users"), where("uid", "==", toUserId))
    //   );
    //   if (toUserSnap.size) {
    //     toUserSnap.forEach((u) => {
    //       if (u.data().uid === toUserId)
    //         setMessage((prevState) => ({
    //           ...prevState,
    //           to: { email: u.data().email, uid: u.data().uid },
    //           from: {
    //             email: authContext?.user?.email,
    //             uid: authContext?.user?.uid,
    //           },
    //         }));
    //     });
    //   }
    // } else {
    //   console.log("friendship does not exist");
    // }
  }

  async function SendMessage() {
    await addDoc(messagesCollectionRef, message);
  }

  async function getMessages() {
    const conditional = where("chatRoomId", "==", chatRoomId);
    const q = query(messagesCollectionRef, conditional, orderBy("date"));
    const messagesSnapshot = await getDocs(q);
    const temp: Message[] = [];
    messagesSnapshot.forEach((m) => {
      temp.push({
        chatRoomId: m.data().chatRoomId,
        date: m.data().date,
        from: m.data().from,
        to: m.data().to,
        text: m.data().text,
        read: m.data().read,
      });
    });
    setMessages(temp);
  }

  return (
    <div>
      <ul>
        {messages.map((m) => (
          <li>
            {m.from.email} said {m.text}
          </li>
        ))}
      </ul>
      <input type="text" onChange={onMessageChange} value={message.text} />
      <button
        onClick={(e) => {
          SendMessage();
          setMessage((prevState) => ({ ...prevState, text: "" }));
        }}
      >
        Send
      </button>
    </div>
  );
}

export default DirectMessagePage;
