import axios from 'axios';
async function getAccessTokenFromPost(token) {
    try {
        const client_id = process.env.REDUSERNAME;
        const client_secret = process.env.REDSECRET;
        const response = await axios.post('https://www.reddit.com/api/v1/access_token', 
            new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: token
            }),
            {
                auth: {
                    username: client_id,
                    password: client_secret
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error.response ? error.response.data : error.message);
        throw error;
    }
}

export {
    getAccessTokenFromPost,
}