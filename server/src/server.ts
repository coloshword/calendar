import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {authMiddleware} from './auth'
import path from 'path';


const uri = "mongodb+srv://Cluster92290:dawg123123123@cluster92290.vr1l9yv.mongodb.net/?retryWrites=true&w=majority";
const app = express();
const port = process.env.PORT || 3500
const saltRounds = 5;
app.use(cors());
app.use(express.json());

/**fdas */
/** auth middleware support */
declare module 'express-serve-static-core' {
  interface Request {
    user?: { userId: string; userEmail?: string };
  }
}

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    console.log("Attempting to connect to MongoDB...");
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });

        console.log("successfully connected to mongodb");
        console.log(port);
        app.listen(port, () => {   
            console.log(`server listening on port ${port}`);
        })
    } catch {
        await client.close();
    }
}
// serve
app.use(express.static(path.join(__dirname, '../../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../client', 'build', 'index.html'));
});

// auth endpoint protection 
app.get("/auth-endpoint", authMiddleware, (request, response) => {
    response.json({msg: "authorized users only"});
});

//post: register
app.post('/register', async (req, res) => {
    try {
        const {email, password} = req.body;
        const events: string[] = [];
        const notes: Object = {};
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = { email, hashedPassword, events, notes };
        const userCollection = client.db('lightCalendar').collection('Users');
        const result = await userCollection.insertOne(newUser);
        const userId = result.insertedId; // userID is returned upon successful user creaition
        // successful, also do a login with a token
        if(userId) {
            const token = jwt.sign({
                userId: userId,
                userEmail: email,
                
            }, "RANDOM-TOKEN", { expiresIn: "24h"});
            res.status(201).json({msg: "Registration successful", email: email, token: token})
        }

    } catch(error) {
        console.error("Failed to register user " + error);
        res.send(error);
    }
});

//post: login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const usersCollection = client.db('lightCalendar').collection('Users');
    var user = await usersCollection.findOne({ email: email});
    if(!user) {
        res.status(404).json({msg: "There is no account associated with this email"});
    } else {
        bcrypt.compare(password, user.hashedPassword, function(err, result) {
            if(err) {
                throw err;
            } 
            else if(result) {
                if(user) {
                    const token = jwt.sign({
                        userId: user._id,
                        userEmail: user.email
                    },
                    "RANDOM-TOKEN",
                    { expiresIn: "24h"}
                    );
                    res.status(200).json({ msg: "Successful login", email: user.email, token: token });
                } else {
                    console.log("unknown db error, user not found");
                }
            } else {
                res.status(400).json({ msg: "Password is incorrect" });
            }
        });
    }
})

app.post('/add-event', authMiddleware, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, date, start, end, descript, eventColor } = req.body;
    const userId = req.user.userId;

    try {
        const eventCollection = client.db('lightCalendar').collection('Events');
        const { insertedId: eventId } = await eventCollection.insertOne({
            userId,
            title,
            date,
            start,
            end,
            descript,
            eventColor
        });

        const userCollection = client.db('lightCalendar').collection('Users');
        await userCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $push: { events: eventId } }
        );

        res.status(201).json({ message: "Event added successfully" });
    } catch (error) {
        console.error("Failed to add event:", error);
        res.status(500).json({ message: "Failed to add event" });
    }
});

app.get('/get-events', authMiddleware, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.userId;

    try {
        const db = client.db("lightCalendar");
        const usersCollection = db.collection("Users");
        const user = await usersCollection.findOne({_id: new ObjectId(userId)});
        
        if(user) {
            const eventsCollection = db.collection("Events");
            const events = await eventsCollection.find({
                _id: { $in: user.events.map((eventId: string) => new ObjectId(eventId))}
            }).toArray();
            res.status(201).json({ events : events})
        }
    } catch (error) {
        console.error("Failed to get events:", error);
        res.status(500).json({ message: "Failed to get events" });
    }
});

/** update-note endpoint: updates the note object for a given user  */
app.post('/update-note', authMiddleware, async (req, res) => {
    if(!req.user) {
        return res.status(401).json({ message: "Unauthorized access of notes"});
    }
    const noteObj = req.body;
    const userId = req.user.userId; 
    // get user from the userId 
    if(noteObj) {
        try {
            const userCollection = client.db('lightCalendar').collection('Users');
            let update = await userCollection.updateOne(
                {_id: new ObjectId(userId)},
                { $set: {notes: noteObj}}
            );
            if(update.modifiedCount == 1) res.status(200).json({message: "note added successfully"});
            else res.status(404).json({message: "User not found when updating note"});
        }catch (error) {
            res.status(500).json({message: error});
        }
    }
});

/** get-note endpoint: gets the node object for a given user to be loaded into client */
app.get('/get-note', authMiddleware, async(req, res) => {
    if(!req.user) {
        return res.status(401).json({ message: "Unauthorized access of user notes"});
    }
    const userId = req.user.userId;

    try {
        const db = client.db("lightCalendar");
        const usersCollection = db.collection("Users");
        const user = await usersCollection.findOne({_id: new ObjectId(userId)});

        if(user) {
            res.status(200).json({message: user.notes});
        } else {
            // user not found
            res.status(404).json({message: "Could not find user in db when getting note"});
        }
    }
    catch(error) {
        res.status(500).json({message : error});
    }
});

run().catch(error => {
    console.error("Error starting the server:", error);
    process.exit(1); 
});
