import FirestoreUser from "@/types/FirestoreUser.types";
import { Avatar, Container, Typography } from "@mui/material";

interface props {
  chatRoomName?: string;
  participants: FirestoreUser[];
}

function EndOfInfiniteScrollMessages({ chatRoomName, participants }: props) {
  //come back to this once FireStore users have profile pictures
  if (participants.length === 2) {
    return (
      <Container style={{ marginTop: "1.5em", marginBottom: "1.5em" }}>
        <Avatar sx={{ width: 64, height: 64 }}></Avatar>
        <div>
          <h1 style={{ color: "#e2e2e2" }}></h1>
          <Typography style={{ color: "#9a9999" }}>
            Here is where your connection with *other username* begins.
          </Typography>
        </div>
      </Container>
    );
  } else {
    return (
      <Container style={{ marginTop: "1.5em", marginBottom: "1.5em" }}>
        <Avatar sx={{ width: 64, height: 64 }}></Avatar>
        <div>
          <h1 style={{ color: "#e2e2e2" }}>*username*</h1>
          <Typography style={{ color: "#9a9999" }}>
            Here is where your connection with *other username* begins.
          </Typography>
        </div>
      </Container>
    );
  }
}

export default EndOfInfiniteScrollMessages;
