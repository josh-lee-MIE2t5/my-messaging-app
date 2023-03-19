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
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { ChangeEvent, useContext, useEffect, useState } from "react";

function DirectMessagePage() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

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
    if (chatRoomId && authContext?.user) {
      getChatRoomDetails();
      //getMessages();
    }
  }, [chatRoomId, authContext]);

  useEffect(() => {
    if (chatRoomId) {
      return messageListener();
    }
  }, [chatRoomId]);

  function onMessageChange(e: ChangeEvent<HTMLInputElement>) {
    setMessage((prevState) => ({
      ...prevState,
      date: new Date(),
      text: e.target.value,
    }));
  }

  async function getChatRoomDetails() {
    if (typeof chatRoomId === "string" && authContext?.user) {
      const chatRoomSnapshot = await getDoc(doc(db, "chatRoom", chatRoomId));
      if (chatRoomSnapshot.exists())
        setMessage((prevState) => ({
          ...prevState,
          chatRoomId,
          to: chatRoomSnapshot
            .data()
            .participants.filter(
              (p: { uid: string }) => p.uid !== authContext?.user?.uid
            ),
          from: {
            email: authContext?.user?.email,
            uid: authContext?.user?.uid,
          },
        }));
    }
  }

  async function SendMessage() {
    setMessage((prevState) => ({ ...prevState, date: new Date() }));
    await addDoc(messagesCollectionRef, message);
  }

  function messageListener() {
    const q = query(
      messagesCollectionRef,
      where("chatRoomId", "==", chatRoomId),
      orderBy("date")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("messages fetched");
      const temp: Message[] = [];
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          change.doc.data();
          setMessages((prevState) => [
            ...prevState,
            {
              chatRoomId: change.doc.data().chatRoomId,
              date: change.doc.data().date,
              from: change.doc.data().from,
              to: change.doc.data().to,
              text: change.doc.data().text,
              read: change.doc.data().read,
            },
          ]);
        }
      });
    });
    return () => {
      unsubscribe();
    };
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
