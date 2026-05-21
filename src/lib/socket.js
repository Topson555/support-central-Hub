import { io } from "socket.io-client";

// In your local setup, you might need to point this to your backend URL
// e.g., const SOCKET_URL = "http://localhost:5000";
// For portability, we use an empty string or process.env variable
const SOCKET_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';

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
