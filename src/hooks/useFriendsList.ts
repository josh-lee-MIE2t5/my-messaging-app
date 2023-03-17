import { useState, useContext, useEffect, ChangeEvent } from "react";
import { db } from "@/firebase/firebase";
import { getDocs, collection, where, query } from "firebase/firestore";
import Friendship from "@/types/Friendship.types";
import FirestoreUser from "@/types/FirestoreUser.types";
import { AuthContext } from "@/context/AuthContext";

function useFriendsList() {
  const authContext = useContext(AuthContext);
  const [search, setSearch] = useState<string>("");
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [friendsList, setFriendsList] = useState<FirestoreUser[]>([]);
  const [friendsDisplay, setFriendsDisplay] = useState<FirestoreUser[]>([]);

  const friendshipsRef = collection(db, "friendships");
  const userRef = collection(db, "users");

  useEffect(() => {
    filterFriends();
  }, [search]);

  useEffect(() => {
    getFriendships();
  }, []);

  useEffect(() => {
    getFriendsList();
  }, [friendships]);

  async function getFriendships() {
    console.log("getting Friendships");
    const q = query(
      friendshipsRef,
      where("participants", "array-contains", authContext?.user?.uid)
    );
    const querySnapShot = await getDocs(q);
    const temp: Friendship[] = [];
    querySnapShot.forEach((f) => {
      temp.push({ id: f.id, participants: f.data().participants });
    });
    setFriendships(temp);
  }

  async function getFriendsList() {
    const friendsIds: string[] = [];
    friendships.forEach((f) => {
      if (authContext?.user?.uid !== undefined) {
        friendsIds.push(
          f.participants[f.participants.indexOf(authContext?.user?.uid) ? 0 : 1]
        );
      }
    });
    if (friendsIds.length) {
      console.log("fetching friend users");
      const q = query(userRef, where("uid", "in", friendsIds));
      const querySnapShot = await getDocs(q);
      const tempUserArr: FirestoreUser[] = [];
      querySnapShot.forEach((u) => {
        tempUserArr.push({ email: u.data().email, uid: u.data().uid });
      });
      setFriendsList(tempUserArr);
    }
  }

  function filterFriends() {
    const filteredFriends: FirestoreUser[] = [];
    const pattern: RegExp = new RegExp(`^${search}`, "i");
    if (search.length >= 3) {
      friendsList.forEach((f) => {
        if (pattern.test(f.email)) filteredFriends.push(f);
      });
    }
    setFriendsDisplay(filteredFriends);
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }
  return { onChange, search, friendsDisplay };
}

export default useFriendsList;
