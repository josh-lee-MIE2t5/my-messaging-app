import Head from "next/head";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import useSignOut from "@/hooks/useSignOut";
import MessageManagement from "@/components/MessageManagement";
import Login from "@/components/Login";
import MessagesList from "@/components/MessagesList";

export default function Home() {
  const user = useContext(AuthContext);
  const signOut = useSignOut();
  // conditionally redirect based on whether you are logged in or not
  return (
    <>
      <Head>
        <title>my-messaging-app</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        {user?.user ? (
          <>
            <MessagesList atRoot={true} />
          </>
        ) : (
          <Login />
        )}
      </main>
    </>
  );
}
