import { MongoClient, ServerApiVersion } from 'mongodb';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {authMiddleware} from './auth'

const uri = "mongodb+srv://Cluster92290:dawg123123123@cluster92290.vr1l9yv.mongodb.net/?retryWrites=true&w=majority";
const app = express();
const port = 3500;
const saltRounds = 5;
app.use(cors());
app.use(express.json());


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

        app.listen(port, () => {   
            console.log(`server listening on port ${port}`);
        })
    } catch {
        await client.close();
    }
}

// auth endpoint protection 
app.get("/auth-endpoint", authMiddleware, (request, response) => {
    response.json({msg: "authorized users only"});
});

//post: register
app.post('/register', async (req, res) => {
    try {
        const {email, password} = req.body;
        const events: string[] = [];
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = { email, hashedPassword, events };
        const userCollection = client.db('lightCalendar').collection('Users');
        const result = await userCollection.insertOne(newUser);
        console.log(result);
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

run().catch(error => {
    console.error("Error starting the server:", error);
    process.exit(1); // Exit the process with an error code
});
