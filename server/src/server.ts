import express, { Express, Request, Response, Application } from 'express';

const app: Application = express();
const port: number = 8000;

app.listen(port, () => {
    console.log("listening on port 8000")
})