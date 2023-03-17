import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { ChangeEvent, useContext, useState } from "react";
import FirestoreUser from "@/types/FirestoreUser.types";

function useEmailSearchForUsers() {
  /**
   * object returning the following
   *
   * search: the html input element string
   * NOTE: search needs to be in useEffect dependencies
   *
   * users: the list of users returned on the search
   *
   * onChange: method to be passed into the input onChange
   *
   * inputChangeListener: method meant to be put into useEffect callback
   *
   * what useEffect should look like...
   * useEffect(()=>{
   * inputChangeListener()
   * ...
   * },[search, ...])
   */
  const authContext = useContext(AuthContext);
  const [users, setUsers] = useState<FirestoreUser[]>([]);
  const [search, setSearch] = useState<string>("");

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e.currentTarget.value);
  }

  async function fetchMatchingEmail(searchInput: string) {
    const pattern: RegExp = new RegExp(`^${searchInput}`, "i");
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    const temp: FirestoreUser[] = [];
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

  function inputChangeListener() {
    if (search.length >= 3) fetchMatchingEmail(search);
  }
  return { search, users, onChange, inputChangeListener };
}

export default useEmailSearchForUsers;
