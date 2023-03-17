import useFriendsList from "@/hooks/useFriendsList";
import { useState } from "react";

function MessageManagement() {
  const [friendListHidden, setFriendListhidden] = useState(true);
  const { onChange, search, friendsDisplay } = useFriendsList();

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
          onChange={onChange}
          value={search}
        />
        <div hidden={friendListHidden}>
          <ul>
            {friendsDisplay.map((u) => (
              <li key={u.uid}>{u.email}</li>
            ))}
          </ul>
        </div>
      </form>
    </div>
  );
}

export default MessageManagement;
