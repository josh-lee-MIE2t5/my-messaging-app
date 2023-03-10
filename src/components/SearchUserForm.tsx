import { useState } from "react";
import { User } from "firebase/auth";
import { ChangeEvent } from "react";

function SearchUserForm() {
  const [users, setUsers] = useState<User[]>([]);

  return (
    <form>
      <input type="text" placeholder="email" name="email" />
    </form>
  );
}

export default SearchUserForm;
