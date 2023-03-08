import { Auth, signInWithEmailAndPassword } from "firebase/auth";
import React, { ChangeEvent, useState } from "react";
import useSignUp from "@/hooks/useSignUp";
import useOnChange from "@/hooks/useOnChange";
function SignUpPage() {
  const signUp = useSignUp();
  const onChange = useOnChange();
  interface formDetailsInterface {
    email: string;
    password: string;
  }
  const [formDetails, setFormDetails] = useState<formDetailsInterface>({
    email: "",
    password: "",
  });

  return (
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
          signUp(formDetails.email, formDetails.password);
        }}
      >
        sign up
      </button>
    </form>
  );
}

export default SignUpPage;
