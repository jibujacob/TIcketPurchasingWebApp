import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
declare global {
    var signin: (id?:string) => string[];
  }

let mongo :any;

jest.mock("../nats-wrapper");
beforeAll(async () =>{
    jest.clearAllMocks();
    process.env.JWT_KEY= "jwtSecret";
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();
    for(let collection of collections){
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.signin = (id?: string) => {
    const payload = {
        id : id || new mongoose.Types.ObjectId().toHexString(),
        email : "jibu@abc.com"
    }

    const token = jwt.sign(payload,process.env.JWT_KEY!)
    const session = {jwt:token}
    const sessionJSON = JSON.stringify(session);
    const base64 = Buffer.from(sessionJSON).toString("base64");

    return [`session=${base64}`];
}
