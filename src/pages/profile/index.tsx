import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import nookies from "nookies";

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
  return { props: { token: cookies.token } }; //later fetch all friendships with user uid
};

function Profile({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const authContext = useContext(AuthContext);
  authContext?.user?.getIdTokenResult().then((t) => {
    console.log("from context:", t);
  });
  console.log("from props: ", token);
  return (
    <div>
      you are looking at the dashboard for user {authContext?.user?.email}
    </div>
  );
}

export default Profile;
