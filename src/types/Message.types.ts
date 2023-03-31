import FirestoreUser from "./FirestoreUser.types";

export default interface Message {
  chatRoomId: string;
  date: Date;
  from: FirestoreUser;
  to: FirestoreUser[];
  text: string;
  readBy: FirestoreUser[];
}
