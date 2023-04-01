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
  getDoc,
  DocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { isEqual } from "lodash";
import { useErrorHandler } from "react-error-boundary";

function useChatRooms() {
  interface ChatRoomListType extends ChatRoom {
    id: string;
  }

  const handleError = useErrorHandler();
  const chatRoomRef = collection(db, "chatRoom");
  const authContext = useContext(AuthContext);

  const [snapShot, setSnapshot] = useState<QuerySnapshot | null>(null);
  const [chatroomDocByID, setChatroomDocByID] =
    useState<DocumentSnapshot<DocumentData> | null>(null);

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
    if (authContext?.user) chatRoomListener();
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
    //NOTE check if user is already in the form participants and when the size of the participants array changes to greater than 2 people make it into a groupchat type
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
        setChatRoomForm((prevState) => ({
          ...prevState,
          type: prevState.participants.length > 2 ? "groupchat" : "directMsg",
        }));
      });
  }

  function chatRoomListener() {
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

  function chatRoomListenerByID(chatroomID: string) {
    const unsubscribe = onSnapshot(
      doc(db, "chatRoom", chatroomID),
      { includeMetadataChanges: true },
      (doc) => {
        if (doc.exists()) {
          setChatroomDocByID(doc);
        } else {
          handleError(
            new Error(`chatroom of ID: ${chatroomID} does not exist`)
          );
        }
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
    setChatRoomForm((prevState) => ({
      ...prevState,
      type: prevState.participants.length > 2 ? "groupchat" : "directMsg",
    }));
  }

  async function makeNewChatRoom() {
    const q = query(
      chatRoomRef,
      where("participants", "array-contains-any", chatRoomForm.participants),
      where("type", "==", chatRoomForm.type)
    );
    const chatroomSnapshot = await getDocs(q);
    chatroomSnapshot.docs.some(
      (c) =>
        c.data().participants.length === chatRoomForm.participants.length &&
        c
          .data()
          .participants.every((p: { uid: string }) =>
            chatRoomForm.participants.some((cfp) => cfp.uid === p.uid)
          ) &&
        c.data().type === chatRoomForm.type
    )
      ? console.log("chatroom already exists")
      : await addDoc(chatRoomRef, chatRoomForm);
  }

  async function findChatRoom() {
    //find chatrooms and friendships
    // search should prioritize chatroom name, then participants and then friendships
    // return friendships that match the same search string but only if they are not in any of the chatrooms of typedirectmessage
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

  function isParticpant(
    userID: string,
    chatRoomId: string
  ): Promise<DocumentSnapshot<DocumentData>> {
    const ref = doc(db, "chatRoom", chatRoomId);
    let out = getDoc(ref)
      .then(
        (chatroom) =>
          chatroom.exists() &&
          chatroom
            .get("participants")
            .some((p: { uid: string }) => p.uid === userID)
      )
      .catch((e) => {
        handleError(e);
      });
    return out;
  }

  return {
    chatRoomListenerByID,
    chatroomDocByID,
    setChatroomDocByID,
    isParticpant,
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
