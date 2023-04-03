import useFriendsList from "@/hooks/useFriendsList";
import { useState } from "react";
import Link from "next/link";
import useChatRooms from "@/hooks/useChatRooms";
function MessageManagement() {
  const [friendListHidden, setFriendListhidden] = useState(true);
  const { onChange, search, friendsDisplay } = useFriendsList();
  const {
    onNameChange,
    chatRoomForm,
    addParticipant,
    removeParticipantInForm,
    makeNewChatRoom,
    myChatRooms,
    onMessageRead,
    fetchOlderChatrooms,
  } = useChatRooms();
  //change to have it where user presses a button and it displays a form to make a new chat room
  return (
    <div>
      <form>
        <input
          type="text"
          onSelect={() => {
            setFriendListhidden(false);
          }}
          onChange={onChange}
          value={search}
        />
      </form>
      <div hidden={friendListHidden}>
        <ul>
          {friendsDisplay.map((u) => (
            <li key={u.user.uid}>
              <Link href={`/profile/${u.friendshipId}`}>{u.user.email}</Link>
              <button
                onClick={() => {
                  if (u.user.uid) addParticipant(u.user.uid);
                }}
              >
                add to Chat Room
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h1>new Chat Room</h1>
        <ul>
          <h3>participants</h3>
          <input
            type="text"
            placeholder="name"
            value={chatRoomForm.name}
            onChange={onNameChange}
          />
          {chatRoomForm.participants.map((p) => (
            <li key={p.uid}>
              {p.email}
              {p.uid !== chatRoomForm.admin.uid && (
                <button
                  onClick={() => {
                    if (p.uid) removeParticipantInForm(p.uid);
                  }}
                >
                  Remove
                </button>
              )}
            </li>
          ))}
          {chatRoomForm.participants.length > 1 && (
            <button
              onClick={() => {
                makeNewChatRoom();
              }}
            >
              Make New Chat Room
            </button>
          )}
        </ul>
      </div>
      <div>
        <h1>ChatRooms</h1>
        <ul>
          map chat Rooms here
          {myChatRooms.map((c) => (
            <li key={c.id}>
              <Link
                href={`/messages/${c.id}`}
                onClick={() => {
                  onMessageRead(c.id);
                }}
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
        <button
          onClick={() => {
            fetchOlderChatrooms();
          }}
        >
          More
        </button>
      </div>
    </div>
  );
}

export default MessageManagement;
