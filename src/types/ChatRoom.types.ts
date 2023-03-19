import FirestoreUser from "./FirestoreUser.types";

export default interface ChatRoom {
  participants: FirestoreUser[];
  admin: FirestoreUser;
  name?: string;
}
