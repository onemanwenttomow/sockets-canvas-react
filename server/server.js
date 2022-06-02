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

const words = require("./words.json");
const numberOfRooms = 4;
let rooms = {};

for (let i = 1; i <= numberOfRooms; i++) {
    console.log("i", i);
    rooms[i] = { drawer: null, selectedWord: "", words: words.slice() };
}

function getNewWord(room) {
    const [newWord] = rooms[room].words.splice(
        Math.floor(Math.random() * rooms[room].words.length - 1),
        1
    );
    return newWord;
}

let users = {};
function getRoom(socket) {
    return users[socket.id];
}

function getNewDrawer(io, room, socket) {
    const clients = io.sockets.adapter.rooms.get(room);
    const ids = [...clients];
    if (ids.length <= 1) {
        return;
    }
    const possibleNewDrawers = ids.filter((id) => id !== socket.id);
    console.log("socket.id: ", socket.id);
    console.log("possibleNewDrawers: ", possibleNewDrawers);
    let newId;

    // TODO look at the random selection code...
    if (possibleNewDrawers.length === 1) {
        newId = possibleNewDrawers[0];
    } else {
        newId =
            possibleNewDrawers[
                Math.abs(
                    Math.floor(Math.random() * possibleNewDrawers.length - 1)
                )
            ];
    }
    console.log("newId: ", newId);
    return newId;
}

io.on("connection", async (socket) => {
    let roomCount = {};
    Object.values(users).forEach((el) =>
        el in roomCount ? roomCount[el]++ : (roomCount[el] = 1)
    );
    console.log("rooms: ", roomCount);
    io.emit("rooms", roomCount);
    console.log("users: ", users);

    socket.on("joinedRoom", (room) => {
        console.log("JOINED ROOM");
        const clients = io.sockets.adapter.rooms.get(room);
        console.log("clients: ", clients);
        const numClients = clients ? clients.size : 0;
        io.to(room).emit("numberOfPlayers", numClients);
        if (clients) {
            const ids = [...clients];
            if (ids.includes(socket.id)) {
                console.log("already in room");
                return;
            }
        }

        // join room
        // TODO set the drawer if no drawer already assigned...
        socket.join(room);
        users[socket.id] = room;
        console.log("users: ", users);
        console.log("rooms[room].drawer: ", rooms[room].drawer);
        if (!rooms[room].drawer) {
            rooms[room].drawer = socket.id;
            rooms[room].selectedWord = getNewWord(room);
            console.log("rooms[room].selectedWord: ", rooms[room].selectedWord);
            // console.log("emmiting the drawer...", socket.id);
            // console.log("ids.length: ", ids.length);
            socket.emit("isDrawer", rooms[room].selectedWord);
        } else {
            // console.log("ids.length: ", ids.length);
            socket.emit("isDrawer", "");
        }
    });

    socket.on("drawing", (data) => {
        console.log("*****************");
        console.log("DRAWING");
        console.log("*****************");
        const room = getRoom(socket);
        console.log("room: ", room);
        socket.broadcast.to(room).emit("drawing", data);
    });

    socket.on("drawDot", (data) => {
        console.log("*****************");
        console.log("DRAW DOT");
        console.log("*****************");
        const room = getRoom(socket);
        console.log("room: ", room);
        socket.broadcast.to(room).emit("drawDot", data);
    });

    socket.on("newWord", async () => {
        console.log("*****************");
        console.log("NEW WORD");
        console.log("*****************");
        const room = getRoom(socket);
        const newWord = getNewWord(room);
        rooms[room].selectedWord = newWord;
        socket.emit("isDrawer", newWord);
    });

    socket.on("guess", (data) => {
        const room = getRoom(socket);
        const selectedWord = rooms[room].selectedWord;
        if (data.toLowerCase() === selectedWord.toLowerCase()) {
            console.log("MATCH!");
            io.to(room).emit("correctGuess", data);
        } else {
            io.to(room).emit("wrongGuess", data);
        }
    });

    socket.on("nextPlayer", async () => {
        console.log("NEXT PLAYER");
        const room = getRoom(socket);
        io.to(room).emit("clearCanvas");

        const newId = getNewDrawer(io, room, socket);
        rooms[room].drawer = newId;

        await io.to(room).emit("isDrawer", "");

        const newWord = getNewWord(room);
        console.log("newWord: ", newWord);
        rooms[room].selectedWord = newWord;
        await io.to(newId).emit("isDrawer", newWord);
        await io.to(room).emit("correctGuess", "");
    });

    socket.on("disconnecting", async () => {
        for (let i = 1; i <= 4; i++) {
            const room = i.toString();
            if (socket.rooms.has(room)) {
                if (rooms[room].drawer === socket.id) {
                    const newId = getNewDrawer(io, room, socket);
                    rooms[room].drawer = newId;

                    await io.to(room).emit("isDrawer", "");

                    const newWord = getNewWord(room);
                    rooms[room].selectedWord = newWord;
                    io.to(newId).emit("isDrawer", newWord);
                    io.to(room).emit("correctGuess", "");
                }
            }
        }
    });

    socket.on("disconnect", async () => {
        console.log("disconnect", socket.id);
        for (let i = 1; i <= 4; i++) {
            const room = i.toString();
            const clients = io.sockets.adapter.rooms.get(room);
            const numClients = clients ? clients.size : 0;
            io.to(room).emit("numberOfPlayers", numClients);
        }
        delete users[socket.id];
    });
});
