import { useState, useContext, useEffect } from "react";
import { db } from "@/firebase/firebase";
import { getDocs, collection, where } from "firebase/firestore";
import useEmailSearch from "@/hooks/useEmailSearchForUsers";
import Friendship from "@/types/Friendship.types";
import FirestoreUser from "@/types/FirestoreUser.types";

function MessageManagement() {
  const [friendListHidden, setFriendListhidden] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [friendsList, setFirendsList] = useState<FirestoreUser[]>([]);

  useEffect(() => {}, []);

  return (
    <div>
      <form>
        <input
          type="text"
          onSelect={() => {
            setFriendListhidden(false);
          }}
          onBlur={() => {
            setFriendListhidden(true);
          }}
          onChange={(e) => {}}
        />
        <div hidden={friendListHidden}>
          <ul></ul>
        </div>
      </form>
    </div>
  );
}

export default MessageManagement;
