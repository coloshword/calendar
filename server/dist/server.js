"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("./auth");
const path_1 = __importDefault(require("path"));
const uri = "mongodb+srv://Cluster92290:dawg123123123@cluster92290.vr1l9yv.mongodb.net/?retryWrites=true&w=majority";
const app = (0, express_1.default)();
const port = process.env.PORT || 3500;
const saltRounds = 5;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const client = new mongodb_1.MongoClient(uri, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
/** run the server */
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Attempting to connect to MongoDB...");
        try {
            yield client.connect();
            yield client.db("admin").command({ ping: 1 });
            console.log("successfully connected to mongodb");
            console.log(port);
            app.listen(port, () => {
                console.log(`server listening on port ${port}`);
            });
        }
        catch (_a) {
            yield client.close();
        }
    });
}
run().catch(error => {
    console.error("Error starting the server:", error);
    process.exit(1);
});
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.path}`);
    next();
});
// serve
app.get("/auth-endpoint", auth_1.authMiddleware, (request, response) => {
    response.json({ msg: "authorized users only" });
});
//post: register
app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const events = [];
        const notes = {};
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        const newUser = { email, hashedPassword, events, notes };
        const userCollection = client.db('lightCalendar').collection('Users');
        const result = yield userCollection.insertOne(newUser);
        const userId = result.insertedId; // userID is returned upon successful user creaition
        // successful, also do a login with a token
        if (userId) {
            const token = jsonwebtoken_1.default.sign({
                userId: userId,
                userEmail: email,
            }, "RANDOM-TOKEN", { expiresIn: "24h" });
            res.status(201).json({ msg: "Registration successful", email: email, token: token });
        }
    }
    catch (error) {
        console.error("Failed to register user " + error);
        res.send(error);
    }
}));
//post: login
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const usersCollection = client.db('lightCalendar').collection('Users');
    var user = yield usersCollection.findOne({ email: email });
    if (!user) {
        res.status(404).json({ msg: "There is no account associated with this email" });
    }
    else {
        bcrypt_1.default.compare(password, user.hashedPassword, function (err, result) {
            if (err) {
                throw err;
            }
            else if (result) {
                if (user) {
                    const token = jsonwebtoken_1.default.sign({
                        userId: user._id,
                        userEmail: user.email
                    }, "RANDOM-TOKEN", { expiresIn: "24h" });
                    res.status(200).json({ msg: "Successful login", email: user.email, token: token });
                }
                else {
                    console.log("unknown db error, user not found");
                }
            }
            else {
                res.status(400).json({ msg: "Password is incorrect" });
            }
        });
    }
}));
app.post('/add-event', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { title, date, start, end, descript, eventColor } = req.body;
    const userId = req.user.userId;
    try {
        const eventCollection = client.db('lightCalendar').collection('Events');
        console.log("these lights will inspire you!");
        const { insertedId: eventId } = yield eventCollection.insertOne({
            userId,
            title,
            date,
            start,
            end,
            descript,
            eventColor
        });
        const userCollection = client.db('lightCalendar').collection('Users');
        yield userCollection.updateOne({ _id: new mongodb_1.ObjectId(userId) }, { $push: { events: eventId } });
        res.status(201).json({ message: "Event added successfully" });
    }
    catch (error) {
        console.error("Failed to add event:", error);
        res.status(500).json({ message: "Failed to add event" });
    }
}));
app.get('/get-events', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.user.userId;
    try {
        const db = client.db("lightCalendar");
        const usersCollection = db.collection("Users");
        const user = yield usersCollection.findOne({ _id: new mongodb_1.ObjectId(userId) });
        if (user) {
            const eventsCollection = db.collection("Events");
            console.log("Get events accessed  " + user);
            const events = yield eventsCollection.find({
                _id: { $in: user.events.map((eventId) => new mongodb_1.ObjectId(eventId)) }
            }).toArray();
            res.status(201).json({ events: events });
        }
    }
    catch (error) {
        console.error("Failed to get events:", error);
        res.status(500).json({ message: "Failed to get events" });
    }
}));
/** update-note endpoint: updates the note object for a given user  */
app.post('/update-note', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized access of notes" });
    }
    const noteObj = req.body;
    const userId = req.user.userId;
    // get user from the userId 
    if (noteObj) {
        try {
            const userCollection = client.db('lightCalendar').collection('Users');
            let update = yield userCollection.updateOne({ _id: new mongodb_1.ObjectId(userId) }, { $set: { notes: noteObj } });
            if (update.modifiedCount == 1)
                res.status(200).json({ message: "note added successfully" });
            else
                res.status(404).json({ message: "User not found when updating note" });
        }
        catch (error) {
            res.status(500).json({ message: error });
        }
    }
}));
/** get-note endpoint: gets the node object for a given user to be loaded into client */
app.get('/get-note', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized access of user notes" });
    }
    const userId = req.user.userId;
    try {
        const db = client.db("lightCalendar");
        const usersCollection = db.collection("Users");
        const user = yield usersCollection.findOne({ _id: new mongodb_1.ObjectId(userId) });
        if (user) {
            res.status(200).json({ message: user.notes });
        }
        else {
            // user not found
            res.status(404).json({ message: "Could not find user in db when getting note" });
        }
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
}));
app.use(express_1.default.static(path_1.default.join(__dirname, '../../client/build')));
app.get('*', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, '../../client', 'build', 'index.html'));
});
