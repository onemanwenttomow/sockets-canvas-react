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

// let drawer = null;
// let selectedWord = "";

let words = [
    "Aardvark",
    "Albatross",
    "Alligator",
    "Alpaca",
    "Ant",
    "Anteater",
    "Antelope",
    "Ape",
    "Armadillo",
    "Donkey",
    "Baboon",
    "Badger",
    "Barracuda",
    "Bat",
    "Bear",
    "Beaver",
    "Bee",
    "Bison",
    "Boar",
    "Buffalo",
    "Butterfly",
    "Camel",
    "Capybara",
    "Caribou",
    "Cassowary",
    "Cat",
    "Caterpillar",
    "Cattle",
    "Chamois",
    "Cheetah",
    "Chicken",
    "Chimpanzee",
    "Chinchilla",
    "Chough",
    "Clam",
    "Cobra",
    "Cockroach",
    "Cod",
    "Cormorant",
    "Coyote",
    "Crab",
    "Crane",
    "Crocodile",
    "Crow",
    "Curlew",
    "Deer",
    "Dinosaur",
    "Dog",
    "Dogfish",
    "Dolphin",
    "Dotterel",
    "Dove",
    "Dragonfly",
    "Duck",
    "Dugong",
    "Dunlin",
    "Eagle",
    "Echidna",
    "Eel",
    "Eland",
    "Elephant",
    "Elk",
    "Emu",
    "Falcon",
    "Ferret",
    "Finch",
    "Fish",
    "Flamingo",
    "Fly",
    "Fox",
    "Frog",
    "Gaur",
    "Gazelle",
    "Gerbil",
    "Giraffe",
    "Gnat",
    "Gnu",
    "Goat",
    "Goldfinch",
    "Goldfish",
    "Goose",
    "Gorilla",
    "Goshawk",
    "Grasshopper",
    "Grouse",
    "Guanaco",
    "Gull",
    "Hamster",
    "Hare",
    "Hawk",
    "Hedgehog",
    "Heron",
    "Herring",
    "Hippopotamus",
    "Hornet",
    "Horse",
    "Human",
    "Hummingbird",
    "Hyena",
    "Ibex",
    "Ibis",
    "Jackal",
    "Jaguar",
    "Jay",
    "Jellyfish",
    "Kangaroo",
    "Kingfisher",
    "Koala",
    "Kookabura",
    "Kouprey",
    "Kudu",
    "Lapwing",
    "Lark",
    "Lemur",
    "Leopard",
    "Lion",
    "Llama",
    "Lobster",
    "Locust",
    "Loris",
    "Louse",
    "Lyrebird",
    "Magpie",
    "Mallard",
    "Manatee",
    "Mandrill",
    "Mantis",
    "Marten",
    "Meerkat",
    "Mink",
    "Mole",
    "Mongoose",
    "Monkey",
    "Moose",
    "Mosquito",
    "Mouse",
    "Mule",
    "Narwhal",
    "Newt",
    "Nightingale",
    "Octopus",
    "Okapi",
    "Opossum",
    "Oryx",
    "Ostrich",
    "Otter",
    "Owl",
    "Oyster",
    "Panther",
    "Parrot",
    "Partridge",
    "Peafowl",
    "Pelican",
    "Penguin",
    "Pheasant",
    "Pig",
    "Pigeon",
    "Pony",
    "Porcupine",
    "Porpoise",
    "Quail",
    "Quelea",
    "Quetzal",
    "Rabbit",
    "Raccoon",
    "Rail",
    "Ram",
    "Rat",
    "Raven",
    "Red deer",
    "Red panda",
    "Reindeer",
    "Rhinoceros",
    "Rook",
    "Salamander",
    "Salmon",
    "Sand Dollar",
    "Sandpiper",
    "Sardine",
    "Scorpion",
    "Seahorse",
    "Seal",
    "Shark",
    "Sheep",
    "Shrew",
    "Skunk",
    "Snail",
    "Snake",
    "Sparrow",
    "Spider",
    "Spoonbill",
    "Squid",
    "Squirrel",
    "Starling",
    "Stingray",
    "Stinkbug",
    "Stork",
    "Swallow",
    "Swan",
    "Tapir",
    "Tarsier",
    "Termite",
    "Tiger",
    "Toad",
    "Trout",
    "Turkey",
    "Turtle",
    "Viper",
    "Vulture",
    "Wallaby",
    "Walrus",
    "Wasp",
    "Weasel",
    "Whale",
    "Wildcat",
    "Wolf",
    "Wolverine",
    "Wombat",
    "Woodcock",
    "Woodpecker",
    "Worm",
    "Wren",
    "Yak",
    "Zebra",
];

const rooms = {
    1: {
        drawer: null,
        selectedWord: "",
        words: words.slice(),
    },
    2: {
        drawer: null,
        selectedWord: "",
        words: words.slice(),
    },
    3: {
        drawer: null,
        selectedWord: "",
        words: words.slice(),
    },
    4: {
        drawer: null,
        selectedWord: "",
        words: words.slice(),
    },
};

function getNewWord(room) {
    const [newWord] = rooms[room].words.splice(
        Math.floor(Math.random() * words.length),
        1
    );
    return newWord;
}

let users = {};
function getRoom(socket) {
    return users.id;
    // return [...socket.rooms][0];
}

function getNewDrawer(io, room, socket) {
    const clients = io.sockets.adapter.rooms.get(room);
    const ids = [...clients];
    if (ids.length <= 1) {
        return;
    }
    const [newId] = ids.filter((id) => id !== socket.id);
    return newId;
}

io.on("connection", async (socket) => {
    // console.log("connect: ", socket.id);
    // console.log("drawer: ", drawer);
    const idsSet = await io.allSockets();
    const ids = [...idsSet];
    // console.log("ids: ", ids);

    io.emit("numberOfPlayers", ids.length);

    // if (!drawer) {
    //     drawer = socket.id;
    //     selectedWord = getNewWord();
    //     // console.log("emmiting the drawer...", socket.id);
    //     // console.log("ids.length: ", ids.length);
    //     socket.emit("isDrawer", selectedWord);
    // } else {
    //     // console.log("ids.length: ", ids.length);
    //     socket.emit("isDrawer", "");
    // }

    socket.on("joinedRoom", (room) => {
        console.log("JOINED ROOM");
        const clients = io.sockets.adapter.rooms.get(room);
        console.log("clients: ", clients);
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
        users.id = room;
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
        const numClients = clients ? clients.size : 0;
        io.to(room).emit("numberOfPlayers", numClients);
    });

    socket.on("drawing", (data) => {
        console.log("*****************");
        console.log("DRAWING");
        console.log("*****************");
        const room = getRoom(socket, io);
        console.log("room: ", room);
        socket.broadcast.to(room).emit("drawing", data);
    });

    socket.on("drawDot", (data) => {
        console.log("*****************");
        console.log("DRAW DOT");
        console.log("*****************");
        const room = getRoom(socket, io);
        console.log("room: ", room);
        socket.broadcast.to(room).emit("drawDot", data);
    });

    socket.on("newWord", async () => {
        console.log("*****************");
        console.log("NEW WORD");
        console.log("*****************");
        const room = getRoom(socket, io);
        const newWord = getNewWord();
        rooms[room].selectedWord = newWord;
        socket.emit("isDrawer", newWord);
    });

    socket.on("guess", (data) => {
        const room = getRoom(socket, io);
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
        const room = getRoom(socket, io);
        io.to(room).emit("clearCanvas");

        const newId = getNewDrawer(io, room, socket);
        rooms[room].drawer = newId;

        await io.to(room).emit("isDrawer", "");

        const newWord = getNewWord(room);
        rooms[room].selectedWord = newWord;
        io.to(newId).emit("isDrawer", newWord);
        io.to(room).emit("correctGuess", "");
    });

    socket.on("disconnecting", async () => {
        console.log("disconnecting", socket.id);
        console.log("console.log(socket.rooms): ", socket.rooms);
        for (let i = 1; i <= 4; i++) {
            const room = i.toString();
            console.log("socket.rooms.has(room): ", socket.rooms.has(room));
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
        delete users.id;
    });
});
