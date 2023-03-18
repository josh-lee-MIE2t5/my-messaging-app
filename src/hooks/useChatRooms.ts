import { ChangeEvent, useContext, useEffect, useState } from "react";
import ChatRoom from "@/types/ChatRoom.types";
import { AuthContext } from "@/context/AuthContext";
import { collection, getDocs, where, query, addDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

function useChatRooms() {
  interface ChatRoomListType extends ChatRoom {
    id: string;
  }

  const chatRoomRef = collection(db, "chatRoom");
  const authContext = useContext(AuthContext);

  const [chatRoomForm, setChatRoomForm] = useState<ChatRoom>({
    name: "",
    participants: [
      { email: authContext?.user?.email, uid: authContext?.user?.uid },
    ],
    admin: {
      email: authContext?.user?.email,
      uid: authContext?.user?.uid,
    },
  });
  const [myChatRooms, setMyChatRooms] = useState<ChatRoomListType[]>([]);

  useEffect(() => {
    fetchChatRooms();
  }, []);

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

  function removeParticipantInForm(uid: string) {
    setChatRoomForm((prevState) => ({
      ...prevState,
      participants: prevState.participants.filter((p) => p.uid !== uid),
    }));
  }

  async function makeNewChatRoom() {
    //add logic to see if chat room with all participants already exists before creating
    await addDoc(chatRoomRef, chatRoomForm);
  }

  async function fetchChatRooms() {
    console.log("getting chat rooms");
    const q = query(
      chatRoomRef,
      where("participants", "array-contains", {
        email: authContext?.user?.email,
        uid: authContext?.user?.uid,
      })
    );
    const chatRoomSnapshot = await getDocs(q);
    const temp: ChatRoomListType[] = [];
    chatRoomSnapshot.forEach((c) => {
      temp.push({
        name: c.data().name,
        participants: c.data().participants,
        admin: c.data().admin,
        id: c.id,
      });
    });
    setMyChatRooms(temp);
  }

  function onNameChange(e: ChangeEvent<HTMLInputElement>) {
    setChatRoomForm((prevState) => ({
      ...prevState,
      name: e.target.value,
    }));
  }
  return {
    onNameChange,
    chatRoomForm,
    addParticipant,
    removeParticipantInForm,
    makeNewChatRoom,
    myChatRooms,
  };
}

export default useChatRooms;
