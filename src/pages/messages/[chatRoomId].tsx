import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase/firebase";
import Message from "@/types/Message.types";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
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
    readBy: [],
  });

  const [snapShot, setSnapshot] = useState<QuerySnapshot | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  const messagesCollectionRef = collection(db, "messages");

  useEffect(() => {
    if (chatRoomId && authContext?.user) {
      getChatRoomDetails();
    }
  }, [chatRoomId, authContext]);

  useEffect(() => {
    if (chatRoomId) {
      messageListener();
    }
  }, [chatRoomId]);

  useEffect(() => {
    if (messages.length) {
      snapShot?.docChanges().forEach((change) => {
        if (change.type === "added") {
          setMessages((prevState) => {
            return [
              ...prevState,
              {
                chatRoomId: change.doc.data().chatRoomId,
                date: change.doc.data().date,
                from: change.doc.data().from,
                to: change.doc.data().to,
                text: change.doc.data().text,
                readBy: change.doc.data().readBy,
              },
            ];
          });
        }
        if (change.type === "modified") {
          console.log("message Modified");
        }
      });
    } else {
      snapShot?.docChanges().forEach((change) => {
        if (change.type === "added") {
          setMessages((prevState) => {
            return [
              {
                chatRoomId: change.doc.data().chatRoomId,
                date: change.doc.data().date,
                from: change.doc.data().from,
                to: change.doc.data().to,
                text: change.doc.data().text,
                readBy: change.doc.data().readBy,
              },
              ...prevState,
            ];
          });
        }
        if (change.type === "modified") {
          console.log("message Modified");
        }
      });
    }
  }, [snapShot]);

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
    const unsubscribe = onSnapshot(
      query(
        messagesCollectionRef,
        where("chatRoomId", "==", chatRoomId),
        orderBy("date", "desc"),
        limit(15)
      ),
      (querySnapshot) => {
        setSnapshot(querySnapshot);
      }
    );
    return () => {
      unsubscribe();
    };
  }

  return (
    <div>
      <ul>
        {messages.map((m, i) => (
          <li key={i}>
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
      <button>More</button>
    </div>
  );
}

export default DirectMessagePage;
