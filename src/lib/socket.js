import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000' 
    : 'https://backend-support-hub.onrender.com');

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true
});

export const subscribeToTickets = (callback) => {
  socket.on("ticket:created", (newTicket) => callback({ type: 'CREATED', ticket: newTicket }));
  socket.on("ticket:updated", (updatedTicket) => callback({ type: 'UPDATED', ticket: updatedTicket }));
  socket.on("ticket:deleted", (ticketId) => callback({ type: 'DELETED', ticketId }));

  return () => {
    socket.off("ticket:created");
    socket.off("ticket:updated");
    socket.off("ticket:deleted");
  };
};
