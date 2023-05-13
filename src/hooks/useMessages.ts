import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase/firebase";
import useChatRooms from "@/hooks/useChatRooms";
import FirestoreUser from "@/types/FirestoreUser.types";
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

function useMessages() {
  const chunkSize = 15;

  const [readBy, setReadBy] = useState<FirestoreUser[]>([]);

  const { chatRoomListenerByID, onMessageRead, chatroomDocByID } =
    useChatRooms();
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
  const [startAfterDoc, setStartAfterDoc] = useState<
    QueryDocumentSnapshot | undefined
  >(undefined);

  const [snapShot, setSnapshot] = useState<QuerySnapshot | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  const messagesCollectionRef = collection(db, "messages");

  const [admin, setAdmin] = useState<FirestoreUser | undefined>(undefined);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (chatRoomId && typeof chatRoomId === "string") {
      chatRoomListenerByID(chatRoomId);
      messageListener();
    }
  }, [chatRoomId]);

  useEffect(() => {
    if (chatroomDocByID?.exists()) {
      setReadBy(chatroomDocByID.data().readBy);
      setAdmin({
        email: chatroomDocByID.data().admin.email,
        uid: chatroomDocByID.data().admin.uid,
      });
    }
  }, [chatroomDocByID]);

  useEffect(() => {
    snapShot?.docChanges().forEach((change) => {
      if (change.type === "added") {
        if (typeof chatRoomId === "string") onMessageRead(chatRoomId);
        if (!messages.length) setLoading(true);
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
        setLoading(false);
      }
    });
    if (!messages.length)
      setStartAfterDoc(snapShot?.docs[snapShot.docs.length - 1]);
  }, [snapShot]);

  async function getOlderMsgs() {
    //implement state for loading for a loading css animation
    setLoading(true);
    if (startAfterDoc) {
      console.log("fetching older msgs");
      const q = query(
        messagesCollectionRef,
        where("chatRoomId", "==", chatRoomId),
        orderBy("date", "desc"),
        limit(chunkSize),
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
    setLoading(false);
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
    if (chatRoomId)
      await updateDoc(doc(db, "chatRoom", roomId), {
        dateLastSent: message.date,
        mostRecentMsg: message,
        readBy: [
          { email: authContext?.user?.email, uid: authContext?.user?.uid },
        ],
      });
    await addDoc(messagesCollectionRef, message);
  }

  function messageListener() {
    const unsubscribe = onSnapshot(
      query(
        messagesCollectionRef,
        where("chatRoomId", "==", chatRoomId),
        orderBy("date", "desc"),
        limit(chunkSize)
      ),
      (querySnapshot) => {
        setSnapshot(querySnapshot);
      }
    );
    return () => {
      unsubscribe();
    };
  }
  return {
    loading,
    admin,
    readBy,
    setReadBy,
    SendMessage,
    getChatRoomDetails,
    onMessageChange,
    getOlderMsgs,
    messages,
    message,
    setMessage,
    setMessages,
  };
}

export default useMessages;
