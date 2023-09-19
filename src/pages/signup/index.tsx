import React, { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import SignUpForm from "@/components/SignUpForm";
function SignUpPage() {
  const authContext = useContext(AuthContext);
  const { push } = useRouter();

  useEffect(() => {
    if (authContext?.user) {
      push("/");
    }
  }, [authContext]);
  // replace still loading text with loading icon later which takes up the entire screen
  return authContext?.user ? <p>still loading</p> : <SignUpForm />;
}

export default SignUpPage;
