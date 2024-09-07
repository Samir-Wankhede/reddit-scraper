import express from 'express';
import mongoose from 'mongoose';
import { getAccessTokenFromPost } from './utils/authController.js';
import route from './routes/routes.js'
import {config} from './utils/config.js';
import { configDotenv } from 'dotenv';

configDotenv();

const app = express();

app.use(express.json());
app.use(async (req,res,next)=>{
    console.log(req.method+" "+req.path);
    if (!config.authToken) {
        try {
            config.authToken = await getAccessTokenFromPost(process.env.refresh_token);
        } catch (error) {
            console.error("Error fetching authToken:", error);
            return res.status(500).json({ error: "Failed to get authToken" });
        }
    }
    next();
})

mongoose.connect(process.env.MONGO_URI,{
    dbName:'Posts'
})
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Connected to DB and listening on port ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log(err);
});


app.use('/',route);
