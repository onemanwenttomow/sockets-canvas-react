const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(
            null,
            req.headers.referer.startsWith("http://localhost:3000") ||
                req.headers.referer.startsWith(
                    "https://react-sockets-draw.herokuapp.com/"
                )
        ),
});

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

let drawer = null;

io.on("connection", (socket) => {
    console.log("connect: ", socket.id);

    if (!drawer) {
        drawer = socket.id;
        socket.emit("isDrawer", true);
    }
    socket.on("drawing", (data) => {
        socket.broadcast.emit("drawing", data);
    });

    socket.on("disconnect", async () => {
        console.log("disconnect", socket.id);
        const ids = await io.allSockets();
        console.log("io.allSockets() is currently:");
        console.log([...ids]);
        drawer = [...ids][0];

        io.to(drawer).emit("isDrawer", true);
    });
});
