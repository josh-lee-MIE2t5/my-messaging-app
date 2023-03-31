import { useContext, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { AuthContext } from "@/context/AuthContext";
import FriendRequest from "@/types/FriendRequest.types";
import { useErrorHandler } from "react-error-boundary";

function useFriendRequest() {
  /**
   * returns an object of states and functions
   *    {sentFriendRequests, fetchSentReqs, recievedFriendRequests, fetchRecievedReqs, makeFriendReq};
   *
   * IMPORTANT: make sure to put functions in useEffect correctly otherwise infinite fetches will be made
   */
  //note: next steps for this feature is to include cloud firestore-trigger functions for real time updates accross all client sides
  const collectionRef = collection(db, "friendRequests");

  const [sentFriendRequests, setSentFriendRequests] = useState<FriendRequest[]>(
    []
  );
  const [recievedFriendRequests, setRecievedFriendRequests] = useState<
    FriendRequest[]
  >([]);
  const errorhandler = useErrorHandler();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (authContext?.user) {
      fetchFriendRequests();
      fetchFriendRequests(false);
    }
  }, [authContext]);

  async function fetchFriendRequests(gettingReqSent: boolean = true) {
    console.log("fetch made gettingReqSent=", gettingReqSent);
    if (authContext?.user) {
      const conditional = gettingReqSent
        ? where("sentBy", "==", authContext.user.uid)
        : where("sentTo", "==", authContext.user.uid);
      const q = query(collectionRef, conditional);
      const querySnapshot = await getDocs(q);
      const temp: FriendRequest[] = [];
      querySnapshot.forEach((f) => {
        temp.push({
          sentBy: f.data().sentBy,
          sentTo: f.data().sentTo,
          date: f.data().date,
          id: f.id,
        });
      });
      gettingReqSent
        ? setSentFriendRequests(temp)
        : setRecievedFriendRequests(temp);
    }
  }

  async function makeFriendReq(toUser: string) {
    let doesNotExist: boolean = true;
    sentFriendRequests.forEach((f) => {
      if (f.sentBy === authContext?.user?.uid) doesNotExist = false;
    });
    recievedFriendRequests.forEach((f) => {
      if (f.sentTo === authContext?.user?.uid) doesNotExist = false;
    });
    if (doesNotExist) {
      await addDoc(collectionRef, {
        sentBy: authContext?.user?.uid,
        sentTo: toUser,
        date: new Date(),
      });
    }
  }

  async function deleteRequest(reqId: string, deletingSent: boolean = true) {
    try {
      const dbRef = await getDoc(doc(db, "friendRequests", reqId));
      await deleteDoc(dbRef.ref);
      fetchFriendRequests(deletingSent);
    } catch (error) {
      errorhandler(error);
    }
  }

  async function acceptRequest(reqId: string) {
    try {
      const friendReqRef = await getDoc(doc(db, "friendRequests", reqId));
      const collectionRef = collection(db, "friendships");
      if (friendReqRef.exists()) {
        const data = {
          participants: [
            friendReqRef.data().sentBy,
            friendReqRef.data().sentTo,
          ],
        };
        await addDoc(collectionRef, data);
        deleteRequest(reqId, false);
      } else {
        throw new Error("Failed to accept friend request");
      }
    } catch (error) {
      errorhandler(error);
    }
  }

  return {
    sentFriendRequests,
    fetchSentReqs: fetchFriendRequests,
    recievedFriendRequests,
    fetchRecievedReqs: () => {
      fetchFriendRequests(false);
    },
    makeFriendReq,
    cancelFriendRequest: (reqId: string) => {
      deleteRequest(reqId);
    },
    acceptRequest,
    denyFriendRequest: (reqId: string) => {
      deleteRequest(reqId, false);
    },
  };
}

export default useFriendRequest;
