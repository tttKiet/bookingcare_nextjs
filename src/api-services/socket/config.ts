import { io, Socket } from "socket.io-client";

const socket: Socket = io(
  process.env.NEXT_PUBLIC_URL_BACKEND || "http://127.0.0.1:8080",
  {
    transports: ["websocket"],
  }
);

export default socket;
