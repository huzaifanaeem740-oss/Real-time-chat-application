const io = require("socket.io")(8000, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const users = {};

io.on("connection", socket => {

    // New user joined
    socket.on("new-user-joined", name => {
        users[socket.id] = name;

        socket.broadcast.emit("user-joined", name);
    });

    // Receive message
    socket.on("send", message => {
        socket.broadcast.emit("receive", {
            message: message,
            name: users[socket.id]
        });
    });

    // User disconnected
    socket.on("disconnect", () => {
        if (users[socket.id]) {
            socket.broadcast.emit("left", users[socket.id]);
            delete users[socket.id];
        }
    });
});