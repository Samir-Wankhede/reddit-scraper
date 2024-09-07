import express from 'express'
import { getNstorePosts, getPopularSubreddits, getStoredSureddits } from '../controllers/getPostsController.js';

const router = express.Router();
///?t=all&after=t3_100ogg4 https://oauth.reddit.com/r/AmItheAsshole/top/
router.get('/popular',getPopularSubreddits);
router.get('/subreddits',getStoredSureddits);
router.get('/posts',getNstorePosts);

export default router;