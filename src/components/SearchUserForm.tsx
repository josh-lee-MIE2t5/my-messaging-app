import { useContext, useState } from "react";
import { AuthContext } from "@/context/context";
import { User } from "firebase/auth";
import useOnChange from "@/hooks/useOnChange";
import { ChangeEvent } from "react";
import authClient from "@/firebase/firebase";
import { getAuth } from "firebase/auth";
function SearchUserForm() {
  const [users, setUsers] = useState<User[]>([]);

  const getUsers = async (e: ChangeEvent<HTMLInputElement>) => {};

  return (
    <form>
      <input type="text" placeholder="email" name="email" onChange={getUsers} />
    </form>
  );
}

export default SearchUserForm;
