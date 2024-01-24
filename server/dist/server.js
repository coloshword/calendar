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
const uri = "mongodb+srv://Cluster92290:dawg123123123@cluster92290.vr1l9yv.mongodb.net/?retryWrites=true&w=majority";
const app = (0, express_1.default)();
const port = 3500;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const client = new mongodb_1.MongoClient(uri, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            yield client.db("admin").command({ ping: 1 });
            console.log("successfully connected to mongodb");
            app.listen(port, () => {
                console.log(`server listening on port ${port}`);
            });
        }
        catch (_a) {
            yield client.close();
        }
    });
}
// this endpoint works 
app.get('/record/wow', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json({ 'hello': 'world' });
    }
    catch (error) {
        console.error('Error fetching questions by user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
//post: register
app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
    }
    catch (error) {
        console.error("Failed to register user " + error);
    }
}));
run().catch(console.dir);
