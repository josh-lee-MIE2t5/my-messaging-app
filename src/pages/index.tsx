import Head from "next/head";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/context";
import useSignOut from "@/hooks/useSignOut";
import useSignIn from "@/hooks/useSignIn";
import useOnChange from "@/hooks/useOnChange";
import SearchUserForm from "@/components/SearchUserForm";

export default function Home() {
  const user = useContext(AuthContext);
  const signOut = useSignOut();
  const onChange = useOnChange();

  interface formDetailsInterface {
    email: string;
    password: string;
  }
  const [formDetails, setFormDetails] = useState<formDetailsInterface>({
    email: "",
    password: "",
  });
  const { signInUserEmail, signInWithGoogle } = useSignIn();
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
            <button onClick={signOut}>logout</button>
            <SearchUserForm />
          </>
        ) : (
          <form>
            <input
              type="email"
              name="email"
              onChange={(e) => {
                onChange(e, setFormDetails);
              }}
              value={formDetails.email}
            />
            <input
              type="password"
              name="password"
              onChange={(e) => {
                onChange(e, setFormDetails);
              }}
              value={formDetails.password}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                signInUserEmail(formDetails.email, formDetails.password);
              }}
            >
              sign in
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                signInWithGoogle();
              }}
            >
              Sign in with google
            </button>
          </form>
        )}
      </main>
    </>
  );
}
