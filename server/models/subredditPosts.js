import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    subreddit: String,
    selftext: String,
    title: String,
    link_flair_text: String,
    edited: Number, // Assuming edited is a timestamp or boolean
    id: { type: String, unique: true },
    url: String,
    ttsCreated: { type: Boolean, default: false },
    videoCreated: { type: Boolean, default: false },
    ttsLink: { type: String, default: null }
}, { timestamps: true });

export default postSchema;