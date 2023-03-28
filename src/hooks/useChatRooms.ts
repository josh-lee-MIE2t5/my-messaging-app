import { ChangeEvent, useContext, useEffect, useState } from "react";
import ChatRoom from "@/types/ChatRoom.types";
import { AuthContext } from "@/context/AuthContext";
import {
  collection,
  getDocs,
  where,
  query,
  addDoc,
  orderBy,
  doc,
  arrayUnion,
  updateDoc,
  onSnapshot,
  limit,
  QuerySnapshot,
  QueryDocumentSnapshot,
  startAfter,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { isEqual } from "lodash";

function useChatRooms() {
  interface ChatRoomListType extends ChatRoom {
    id: string;
  }

  const chatRoomRef = collection(db, "chatRoom");
  const authContext = useContext(AuthContext);

  const [snapShot, setSnapshot] = useState<QuerySnapshot | null>(null);

  const [startAfterDoc, setStartAfterDoc] = useState<
    QueryDocumentSnapshot | undefined
  >(undefined);

  const [chatRoomForm, setChatRoomForm] = useState<ChatRoom>({
    name: "",
    participants: [
      { email: authContext?.user?.email, uid: authContext?.user?.uid },
    ],
    admin: {
      email: authContext?.user?.email,
      uid: authContext?.user?.uid,
    },
    readBy: [],
    dateLastSent: new Date(),
    type: "directMsg",
  });
  const [myChatRooms, setMyChatRooms] = useState<ChatRoomListType[]>([]);

  const chunkSize = 2;

  useEffect(() => {
    chatRoomListener();
  }, []);

  useEffect(() => {
    snapShot?.docChanges().forEach((change) => {
      if (change.type === "added") {
        const existingCr = myChatRooms.find((cr) => cr.id === change.doc.id);
        if (existingCr) {
          setMyChatRooms((prevState) => [
            {
              name: change.doc.data().name,
              participants: change.doc.data().participants,
              admin: change.doc.data().admin,
              id: change.doc.id,
              readBy: change.doc.data().readBy,
              dateLastSent: change.doc.data().dateLastSent,
              type: change.doc.data().type,
              mostRecentMsg: change.doc.data().mostRecentMsg,
            },
            ...prevState.filter((cr) => cr.id !== change.doc.id),
          ]);
        } else {
          setMyChatRooms((prevState) => {
            return [
              ...prevState,
              {
                name: change.doc.data().name,
                participants: change.doc.data().participants,
                admin: change.doc.data().admin,
                id: change.doc.id,
                readBy: change.doc.data().readBy,
                dateLastSent: change.doc.data().dateLastSent,
                type: change.doc.data().type,
                mostRecentMsg: change.doc.data().mostRecentMsg,
              },
            ];
          });
        }
      } else if (change.type === "modified") {
        console.log(change.doc.data());
        //IMPORTANT these are not actual "Date" types they are objects
        const newDate = change.doc.data().dateLastSent;
        const oldDate = myChatRooms.find(
          (c) => c.id === change.doc.id
        )?.dateLastSent;
        if (!isEqual(oldDate, newDate))
          //only change order when the change involves a new msg sent
          setMyChatRooms((prevState) => [
            {
              name: change.doc.data().name,
              participants: change.doc.data().participants,
              admin: change.doc.data().admin,
              id: change.doc.id,
              readBy: change.doc.data().readBy,
              dateLastSent: change.doc.data().dateLastSent,
              type: change.doc.data().type,
              mostRecentMsg: change.doc.data().mostRecentMsg,
            },
            ...prevState.filter((c) => c.id !== change.doc.id),
          ]);
      }
      if (!myChatRooms.length)
        setStartAfterDoc(snapShot.docs[snapShot.docs.length - 1]);
    });
  }, [snapShot]);

  async function addParticipant(uid: string) {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const userSnapshot = await getDocs(q);
    if (userSnapshot.size === 1)
      userSnapshot.forEach((u) => {
        setChatRoomForm((prevState) => ({
          ...prevState,
          participants: [
            ...prevState.participants,
            {
              email: u.data().email,
              uid: u.data().uid,
            },
          ],
        }));
      });
  }

  async function chatRoomListener() {
    const unsubscribe = onSnapshot(
      query(
        chatRoomRef,
        where("participants", "array-contains", {
          email: authContext?.user?.email,
          uid: authContext?.user?.uid,
        }),
        orderBy("dateLastSent", "desc"),
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

  async function fetchOlderChatrooms() {
    if (startAfterDoc) {
      console.log("infinite scroll activated... fetching older chatrooms");
      const q = query(
        chatRoomRef,
        where("participants", "array-contains", {
          email: authContext?.user?.email,
          uid: authContext?.user?.uid,
        }),
        orderBy("dateLastSent", "desc"),
        limit(chunkSize),
        startAfter(startAfterDoc)
      );

      const nextBatchSnapshot = await getDocs(q);
      nextBatchSnapshot.forEach((cr) => {
        if (cr.exists())
          setMyChatRooms((prevState) => [
            ...prevState,
            {
              name: cr.data().name,
              participants: cr.data().participants,
              admin: cr.data().admin,
              id: cr.id,
              readBy: cr.data().readBy,
              dateLastSent: cr.data().dateLastSent,
              type: cr.data().type,
              mostRecentMsg: cr.data().mostRecentMsg,
            },
          ]);
      });
      setStartAfterDoc(
        nextBatchSnapshot.docs[nextBatchSnapshot.docs.length - 1]
      );
    }
  }

  function removeParticipantInForm(uid: string) {
    setChatRoomForm((prevState) => ({
      ...prevState,
      participants: prevState.participants.filter((p) => p.uid !== uid),
    }));
  }

  async function makeNewChatRoom() {
    if (
      !myChatRooms.some(
        (c) =>
          c.participants.length === chatRoomForm.participants.length &&
          c.participants.every((p) =>
            chatRoomForm.participants.some((cfp) => cfp.uid === p.uid)
          )
      )
    )
      await addDoc(chatRoomRef, chatRoomForm);
  }

  function onNameChange(e: ChangeEvent<HTMLInputElement>) {
    setChatRoomForm((prevState) => ({
      ...prevState,
      name: e.target.value,
    }));
  }
  async function onOpen(chatroomId: string) {
    await updateDoc(doc(db, "chatRoom", chatroomId), {
      readBy: arrayUnion({
        email: authContext?.user?.email,
        uid: authContext?.user?.uid,
      }),
    });
  }
  return {
    onNameChange,
    chatRoomForm,
    addParticipant,
    removeParticipantInForm,
    makeNewChatRoom,
    myChatRooms,
    onOpen,
    fetchOlderChatrooms,
  };
}

export default useChatRooms;
