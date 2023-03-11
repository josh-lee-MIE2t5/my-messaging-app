import { useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { ChangeEvent } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { AuthContext } from "@/context/context";

interface firestoreUser {
  email: string;
  uid: string;
}

function SearchUserForm() {
  const [users, setUsers] = useState<firestoreUser[]>([]);
  const [search, setSearch] = useState<string>("");
  const authContext = useContext(AuthContext);
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
        <ul>
          {users.map((u) => (
            <li key={u.uid}>{u.email}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default SearchUserForm;
