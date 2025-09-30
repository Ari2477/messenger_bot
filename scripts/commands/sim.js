const axios = require("axios");
const endpoint = "https://simsimi-api-pro.onrender.com/sim?query=";
const key = "a650beda66094d58b3e5c84b664420e8f2e65edd";

let lastBotReplies = new Set();

module.exports = {
  config: {
    name: "sim",
    version: "1.5",
    author: "Ari",
    role: 0,
    shortDescription: {
      en: "Simsimi auto chat + command"
    },
    longDescription: {
      en: "Makipag usap kay Simsimi via command o reply mode."
    },
    category: "fun",
  },

  onStart: async function ({ api, event, args }) {
    const q = args.join(" ");
    if (!q) return api.sendMessage("Ano?", event.threadID, event.messageID);
    return sendSimSimi(api, event, q);
  },

  onChat: async function ({ api, event }) {
    if (!event.messageReply) return;
    if (lastBotReplies.has(event.messageReply.messageID)) {
      return sendSimSimi(api, event, event.body);
    }
  }
};

async function sendSimSimi(api, event, text) {
  try {
    const { data } = await axios.get(`${endpoint}${encodeURIComponent(text)}&apikey=${key}`);

    api.sendMessage(data.respond, event.threadID, (err, info) => {
      if (!err) {
        lastBotReplies.add(info.messageID);
        if (lastBotReplies.size > 100) {
          lastBotReplies.delete([...lastBotReplies][0]);
        }
      }
    }, event.messageID);
  } catch (e) {
    console.error(e);
    api.sendMessage("❌ Error fetching Simsimi's response.", event.threadID, event.messageID);
  }
}
