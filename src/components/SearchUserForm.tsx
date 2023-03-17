import { useContext, useEffect } from "react";
import { FriendRequestContext } from "@/context/FriendRequestContext";
import useEmailSearchForUsers from "@/hooks/useEmailSearchForUsers";

function SearchUserForm() {
  const { users, search, onChange, inputChangeListener } =
    useEmailSearchForUsers();
  const friendRequestContext = useContext(FriendRequestContext);

  useEffect(() => {
    inputChangeListener();
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
