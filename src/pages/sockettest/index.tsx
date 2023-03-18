import { ChangeEvent, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

function SocketTest() {
  const [input, setInput] = useState<string>("");
  let socket: Socket;
  useEffect(() => {
    socketInitializer();
  }, [input]);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
    socket.emit("input-change", e.target.value);
  }

  async function socketInitializer() {
    await fetch("/api/socket");
    socket = io();
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("update-input", (msg) => {
      setInput(msg);
    });
  }

  return (
    <div>
      <input type="text" value={input} onChange={onChange} />
    </div>
  );
}

export default SocketTest;
