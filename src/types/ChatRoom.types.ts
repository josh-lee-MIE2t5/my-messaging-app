import FirestoreUser from "./FirestoreUser.types";
import Message from "./Message.types";

export default interface ChatRoom {
  participants: FirestoreUser[];
  admin: FirestoreUser;
  name?: string;
  readBy: FirestoreUser[];
  dateLastSent?: Date;
  type: "directMsg" | "groupchat";
  mostRecentMsg?: Message;
}
