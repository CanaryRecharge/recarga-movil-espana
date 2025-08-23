// auth.js
const axios = require("axios");

async function getReloadlyToken() {
  const res = await axios.post("https://auth.reloadly.com/oauth/token", {
    client_id: process.env.RELOADLY_CLIENT_ID,
    client_secret: process.env.RELOADLY_CLIENT_SECRET,
    grant_type: "client_credentials",
    audience: "https://topups.reloadly.com"
  });
  return res.data.access_token;
}

module.exports = getReloadlyToken;