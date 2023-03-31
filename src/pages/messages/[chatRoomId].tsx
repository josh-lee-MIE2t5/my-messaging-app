import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase/firebase";
import useChatRooms from "@/hooks/useChatRooms";
import Message from "@/types/Message.types";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  startAfter,
  updateDoc,
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

  const { isParticpant } = useChatRooms();

  const [startAfterDoc, setStartAfterDoc] = useState<
    QueryDocumentSnapshot | undefined
  >(undefined);

  const [snapShot, setSnapshot] = useState<QuerySnapshot | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  const messagesCollectionRef = collection(db, "messages");

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

  useEffect(() => {
    if (chatRoomId) {
      messageListener();
    }
  }, [chatRoomId]);

  useEffect(() => {
    snapShot?.docChanges().forEach((change) => {
      if (change.type === "added") {
        //call onOpen hook
        setMessages((prevState) => {
          return messages.length
            ? [
                ...prevState,
                {
                  chatRoomId: change.doc.data().chatRoomId,
                  date: change.doc.data().date,
                  from: change.doc.data().from,
                  to: change.doc.data().to,
                  text: change.doc.data().text,
                  readBy: change.doc.data().readBy,
                },
              ]
            : [
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
    });
    if (!messages.length)
      setStartAfterDoc(snapShot?.docs[snapShot.docs.length - 1]);
  }, [snapShot]);

  async function getOlderMsgs() {
    //implement state for loading for a loading css animation
    if (startAfterDoc) {
      console.log("fetching older msgs");
      const q = query(
        messagesCollectionRef,
        where("chatRoomId", "==", chatRoomId),
        orderBy("date", "desc"),
        limit(15),
        startAfter(startAfterDoc)
      );
      const nextBatchSnapshot = await getDocs(q);
      nextBatchSnapshot.forEach((m) => {
        if (m.exists()) {
          setMessages((prevState) => [
            {
              chatRoomId: m.data().chatRoomId,
              date: m.data().date,
              from: m.data().from,
              to: m.data().to,
              text: m.data().text,
              readBy: m.data().readBy,
            },
            ...prevState,
          ]);
        }
      });
      setStartAfterDoc(
        nextBatchSnapshot.docs[nextBatchSnapshot.docs.length - 1]
      );
    }
  }

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

  async function SendMessage(roomId: string) {
    setMessage((prevState) => ({ ...prevState, date: new Date() }));
    await addDoc(messagesCollectionRef, message);
    if (chatRoomId)
      await updateDoc(doc(db, "chatRoom", roomId), {
        dateLastSent: message.date,
        mostRecentMsg: message,
        readBy: [
          { email: authContext?.user?.email, uid: authContext?.user?.uid },
        ],
      });
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
