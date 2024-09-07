import mongoose from "mongoose";
const Schema = mongoose.Schema;

const list = new Schema({
    subreddit: String,
    more: Boolean
},{
    collection: 'Subreddits'
})

export default mongoose.model("Subreddit",list,"Subreddits");