import { useEffect } from "react";
import { useContext } from "react";
import { FriendRequestContext } from "@/context/FriendRequestContext";

function PendingRequests() {
  const friendRequestContext = useContext(FriendRequestContext);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        minWidth: "25vw",
      }}
    >
      <div>
        <h1>incoming requests</h1>
        <ul>
          {friendRequestContext?.recievedFriendRequests.map((r) => (
            <li key={r.id}>
              {r.id}
              <button
                onClick={() => {
                  friendRequestContext.acceptRequest(r.id);
                }}
              >
                Accept
              </button>
              <button
                onClick={() => {
                  friendRequestContext.denyFriendRequest(r.id);
                }}
              >
                Reject
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h1>sent requests</h1>
        <ul>
          {friendRequestContext?.sentFriendRequests.map((r) => (
            <li key={r.id}>
              {r.id}
              <button
                onClick={() => {
                  friendRequestContext?.cancelFriendRequest(r.id);
                }}
              >
                Cancel
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PendingRequests;
