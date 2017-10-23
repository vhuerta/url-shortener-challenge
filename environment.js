module.exports = {
  domain: {
    host: process.env.DOMAIN_HOST,
    protocol: process.env.DOMAIN_PROTOCOL,
  },
  Mongo: {
    URL: process.env.MONGO_URL,
  }
};
