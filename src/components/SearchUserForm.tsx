import { useContext, useEffect, useState } from "react";
import { ChangeEvent } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { AuthContext } from "@/context/AuthContext";
import { FriendRequestContext } from "@/context/FriendRequestContext";

interface firestoreUser {
  email: string;
  uid: string;
}

function SearchUserForm() {
  const [users, setUsers] = useState<firestoreUser[]>([]);
  const [search, setSearch] = useState<string>("");

  const authContext = useContext(AuthContext);
  const friendRequestContext = useContext(FriendRequestContext);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e.currentTarget.value);
  }

  async function fetchMatchingEmail(searchInput: string) {
    const pattern: RegExp = new RegExp(`^${searchInput}`, "i");
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    const temp: firestoreUser[] = [];
    if (searchInput.length !== 0)
      querySnapshot.forEach((u) => {
        if (
          pattern.test(u.data().email) &&
          authContext?.user?.uid !== u.data().uid
        )
          temp.push({ email: u.data().email, uid: u.data().uid });
      });
    setUsers(temp);
  }

  useEffect(() => {
    fetchMatchingEmail(search);
  }, [search]);

  return (
    <>
      <form>
        <input
          type="text"
          placeholder="email"
          name="email"
          value={search}
          onChange={onChange}
        />
      </form>
      <div>
        <h1>users</h1>
        <ul>
          {users.map((u) => (
            <li key={u.uid}>
              {u.email}
              <button
                onClick={() => {
                  friendRequestContext?.makeFriendReq(u.uid);
                  friendRequestContext?.fetchSentReqs();
                }}
              >
                add friend
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default SearchUserForm;
