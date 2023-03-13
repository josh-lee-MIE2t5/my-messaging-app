import FriendRequest from "@/types/FriendRequest.types";
import { createContext } from "react";
import ReactFCProps from "@/types/ReactFCProps.types";
import useFriendRequest from "@/hooks/useFriendRequests";

export interface FriendRequestCTXType {
  sentFriendRequests: FriendRequest[];
  fetchSentReqs: Function;
  recievedFriendRequests: FriendRequest[];
  fetchRecievedReqs: Function;
  makeFriendReq: Function;
  cancelFriendRequest: Function;
  denyFriendRequest: Function;
  acceptRequest: Function;
}

export const FriendRequestContext = createContext<
  FriendRequestCTXType | undefined
>(undefined);

export default function FriendRequestProvider({ children }: ReactFCProps) {
  return (
    <FriendRequestContext.Provider value={{ ...useFriendRequest() }}>
      {children}
    </FriendRequestContext.Provider>
  );
}
