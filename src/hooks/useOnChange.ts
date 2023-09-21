import { ChangeEvent } from "react";

function useOnChange() {
  /**
   * @returns Function onChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, setState: Function)
   */
  const onChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setState: Function
  ) => {
    /**
     * @param ChangeEvent<HTMLInputElement | HTMLTextAreaElement> e
     * @param Function setState
     *
     * setState must change the state of astring
     */
    setState((state: React.ComponentState) => {
      return { ...state, [e.target.name]: e.target.value };
    });
  };
  return onChange;
}

export default useOnChange;
