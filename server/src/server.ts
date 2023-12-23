import express, { Express, Request, Response, Application } from 'express';
import cors from 'cors';

const app: Application = express();
const port: number = 8000;
app.use(cors());
app.listen(port, () => {
    console.log("listening on port 8000")
})

app.get('/wow', (req, res) => {
    res.send("connected to server");
});