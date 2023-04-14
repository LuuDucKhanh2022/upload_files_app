// Initiate and connect to the Redis client
const redis = require("redis");

const redisClient = redis.createClient({ url: "redis://localhost:6379" });
const enableRedisClient = async () => {
  redisClient.on("error", (error) => console.error(`Ups : ${error}`));
  await redisClient.connect();
};

module.exports = enableRedisClient;
