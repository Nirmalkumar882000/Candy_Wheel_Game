import { createContext } from "react";
import io, { Socket } from "socket.io-client";

export const socket = io(import.meta.env.VITE_BASE_URL, {
	transports: ["websocket"],
	autoConnect: false,
});
export const SocketContext = createContext<Socket>(socket);
