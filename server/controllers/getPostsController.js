import axios from "axios";
import Subreddit from "../models/subreddits.js";
import postSchema from "../models/subredditPosts.js";
import cleanText from "../utils/filterFunction.js";
import { config } from "../utils/config.js";
import mongoose from "mongoose";

const getPopularSubreddits = async (req, res) => {
    try {
        const result = await axios.get(`https://oauth.reddit.com/subreddits/popular?after=${config.afterPopular}`, {
            headers: {
                'Authorization': `Bearer ${config.authToken}`
            }
        });
        console.log(result.data.data.after);
        res.status(200).json(result.data.data.children);
    } catch (err) {
        config.authToken = null;
        console.error(err);
        res.status(err.response?.status || 500).json({ message: "An error occurred. or refreshing auth token, " });
    }
}

const getStoredSureddits = async (req,res) => {
    try{
        const sub_reddit = await Subreddit.find({});
        res.status(200).json(sub_reddit);
    }catch(err){
        console.error(err);
        res.status(err.response?.status || 500).json({ message: "An error occurred in fetching" });
    }
}

const getNstorePosts = async (req, res) => {
    try {
        const subs = await Subreddit.find({ more: null });
        const PopularSubs = await Subreddit.find({ more: true });

        const processPosts = async (subredditObj) => {
            const url = subredditObj.subreddit;
            if (url == undefined){
                return;
            }
            const cnfg = `${url}after`;
            const result = await axios.get(`https://oauth.reddit.com/${url}/top/?t=all&after=${config[cnfg]}`, {
                headers: {
                    'Authorization': `Bearer ${config.authToken}`
                }
            });
            const data = result.data;
            config[cnfg] = data.data.after;
            const children = data.data.children;
            const SubredditModel = mongoose.model(url.split('/')[1], postSchema, url.split('/')[1]);
            for (const child of children) {
                const { subreddit, selftext, title, link_flair_text, edited, id, url } = child.data;
                const text = cleanText(selftext);
                const existingPost = await SubredditModel.findOne({ id });
                if (existingPost) {
                    if (edited && edited !== existingPost.edited) {
                        await SubredditModel.updateOne({ id }, { subreddit, selftext: text, title, link_flair_text, edited, url });
                    }
                } else {
                    const newPost = new SubredditModel({ subreddit, selftext: text, title, link_flair_text, edited, id, url });
                    await newPost.save();
                }
            }
        };
        for (const subredditObj of subs) {
            await processPosts(subredditObj);
        }

        for (const subredditObj of PopularSubs) {
            await processPosts(subredditObj);
            await processPosts(subredditObj);
        }
        res.status(200).json({ status: "Fetched" });
    } catch (err) {
        console.error(err);
        config.authToken = null;
        res.status(err.response?.status || 500).json(err);
    }
};


export {
    getPopularSubreddits,
    getStoredSureddits,
    getNstorePosts
}