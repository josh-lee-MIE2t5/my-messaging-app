import { ChangeEvent } from "react";

function useOnChange() {
  const onChange = (e: ChangeEvent<HTMLInputElement>, setState: Function) => {
    setState((state: React.ComponentState) => {
      return { ...state, [e.target.name]: e.target.value };
    });
  };
  return onChange;
}

export default useOnChange;
