// @ts-nocheck
import cookie from "cookie";
import { ApiError } from "../utils/ApiError.js";
import { decryptWithJwt } from "../utils/encryption.js";
import { NotificationEventEnum } from "../config/index.js";

const initializeSocketIO = (io) => {
  return io.on("connection", async (socket) => {
    try {
      console.log("🔗 New socket connection attempt...");
      
      // parse the cookies from the handshake headers (This is only possible if client has `withCredentials: true`)
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
      console.log("cookies: -------------------->", cookies);

      let token = cookies?.accessToken; // get the accessToken
      console.log("token from cookies: -------------------->", token);

      if (!token) {
        // If there is no access token in cookies. Check inside the handshake auth
        token = socket.handshake.auth?.token;
        console.log("token from handshake auth: -------------------->", token);
      }

      if (!token) {
        // Token is required for the socket to work
        console.log("❌ No token provided in socket connection");
        throw new ApiError(401, "Un-authorized handshake. Token is missing");
      }

      const user = decryptWithJwt(token); // verify the token and get the decoded object
      console.log("✅ Token verified successfully for user:", user);

      socket.user = user; // mount the user object to the socket

      // We are creating a room with user id so that if user is joined but does not have any active chat going on.
      // still we want to emit some socket events to the user.
      // so that the client can catch the event and show the notifications.
      socket.join(user.clientCode);
      socket.emit(NotificationEventEnum.CONNECTED_EVENT, { 
        message: "Connected successfully", 
        user: user,
        timestamp: new Date().toISOString()
      }); // emit the connected event so that client is aware
      console.log("User connected 🗼. userId: ", user.clientCode);

      // Send welcome message with user data
      socket.emit("userConnected", {
        client_code: user.clientCode,
        username: user.username,
        connectedAt: new Date().toISOString()
      });

      socket.on(NotificationEventEnum.DISCONNECT_EVENT, () => {
        console.log("user has disconnected 🚫. userId: " + socket.user?.client_code);
        if (socket.user?.client_code) {
          socket.leave(socket.user.clientCode);
        }
      });

      // Handle custom events
      socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`User ${user.clientCode} joined room: ${roomId}`);
      });

      socket.on("leaveRoom", (roomId) => {
        socket.leave(roomId);
        console.log(`User ${user.clientCode} left room: ${roomId}`);
      });
    } catch (error) {
      console.log("❌ Socket connection error:", error.message);
      socket.emit(
        NotificationEventEnum.SOCKET_ERROR_EVENT,
        {
          error: error?.message || "Something went wrong while connecting to the socket.",
          timestamp: new Date().toISOString()
        }
      );
      // Disconnect the socket on error
      socket.disconnect();
    }
  });
};

const emitSocketEvent = (req, roomId, event, payload) => {
  console.log(`🚀 Emitting event: ${event} to room: ${roomId}`, payload);
  
  try {
    const io = req.app.get("io");
    if (!io) {
      console.error("❌ Socket.IO instance not found");
      return;
    }
    
    io.in(roomId).emit(event, {
      ...payload,
      timestamp: new Date().toISOString(),
      room: roomId
    });
    
    console.log(`✅ Event ${event} emitted successfully to room ${roomId}`);
  } catch (error) {
    console.error(`❌ Failed to emit event ${event} to room ${roomId}:`, error.message);
  }
};

// Function to emit to specific user
const emitToUser = (req, clientCode, event, payload) => {
  console.log(`👤 Emitting to user: ${clientCode}, event: ${event}`);
  emitSocketEvent(req, clientCode, event, payload);
};

// Function to emit to all connected users
const emitToAll = (req, event, payload) => {
  console.log(`📢 Broadcasting event: ${event}`);
  try {
    const io = req.app.get("io");
    if (!io) {
      console.error("❌ Socket.IO instance not found");
      return;
    }
    
    io.emit(event, {
      ...payload,
      timestamp: new Date().toISOString()
    });
    
    console.log(`✅ Broadcast ${event} sent successfully`);
  } catch (error) {
    console.error(`❌ Failed to broadcast event ${event}:`, error.message);
  }
};

export { initializeSocketIO, emitSocketEvent, emitToUser, emitToAll };
