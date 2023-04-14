const axios = require("axios");

async function fetchApiUsingRedis(redisClient, cacheKey, endpoint) {
  // const cacheKey = `FILES`;

  // First attempt to retrieve data from the cache
  try {
    const cachedResult = await redisClient.get(cacheKey);
    if (cachedResult) {
      console.log("Data from cache.");
      return cachedResult;
    } else {
      console.log(" not have cachedResult");
    }
  } catch (error) {
    console.error("Something happened to Redis", error);
  }

  // If the cache is empty or we fail reading it, default back to the API
  const apiResponse = await axios(endpoint);
  console.log("Data requested from the files API.");
  // console.log(apiResponse);

  // Finally, if you got any results, save the data back to the cache
  if (apiResponse.data.success === true) {
    try {
      await redisClient.set(cacheKey, JSON.stringify(apiResponse.data), {
        EX: 15, //expired tiem
      });
    } catch (error) {
      console.error("Something happened to Redis", error);
    }
  }

  return apiResponse.data;
}

module.exports = fetchApiUsingRedis;
