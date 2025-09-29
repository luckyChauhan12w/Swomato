import app from "./src/app.js";  // adjust path if needed
import http from "http";
import { Server } from "socket.io";
import { socketHandler } from "./socket.js";
import connectDb from "./src/db/db.js";

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
        methods: ['POST', 'GET']
    }
});
app.set("io", io);

socketHandler(io);

const port = process.env.PORT;

server.listen(port, () => {
    connectDb();
    console.log(`Server running on port ${port}`);
});
