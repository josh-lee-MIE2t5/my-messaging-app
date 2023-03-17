import PendingRequests from "@/components/PendingRequests";
import SearchUserForm from "@/components/SearchUserForm";
import FriendRequestProvider from "@/context/FriendRequestContext";
import nookies from "nookies";
import { GetServerSidePropsContext } from "next";

function FriendRequestsManager() {
  return (
    <FriendRequestProvider>
      <SearchUserForm />
      <PendingRequests />
    </FriendRequestProvider>
  );
}

export default FriendRequestsManager;

export const getServerSideProps = async function (
  context: GetServerSidePropsContext
) {
  const cookies = nookies.get(context);
  if (!cookies.token) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }
  return { props: { token: cookies.token } };
};
