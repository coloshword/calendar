import { MongoClient, ServerApiVersion } from 'mongodb';
import express from 'express';
import cors from 'cors';

const uri = "mongodb+srv://Cluster92290:dawg123123123@cluster92290.vr1l9yv.mongodb.net/?retryWrites=true&w=majority";
const app = express();
const port = 3000;
app.use(cors());



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

// this endpoint works 
app.get('/record/wow', async (req, res) => {
    try {
        res.json({'hello': 'world'});
    } catch (error) {
        console.error('Error fetching questions by user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


run().catch(console.dir);