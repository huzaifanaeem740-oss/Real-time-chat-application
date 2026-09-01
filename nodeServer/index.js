const { Server } = require("socket.io");

const port = process.env.PORT || 8000;

const io = new Server(port, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const users = {};

io.on("connection", socket => {
    socket.on("new-user-joined", name => {
        users[socket.id] = name;
        socket.broadcast.emit("user-joined", name);
    });

    socket.on("send", message => {
        socket.broadcast.emit("receive", {
            message: message,
            name: users[socket.id]
        });
    });

    socket.on("disconnect", () => {
        if (users[socket.id]) {
            socket.broadcast.emit("left", users[socket.id]);
            delete users[socket.id];
        }
    });
});

console.log(`Server running on port ${port}`);

