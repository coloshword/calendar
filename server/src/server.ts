import { MongoClient, ServerApiVersion } from 'mongodb';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';

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
})

run().catch(console.dir);