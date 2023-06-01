const redis = require("redis");
const { promisify } = require("util");

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.client.on("error", (error) => {
      console.log(error);
    });
    this.connected = false;
    this.client.on("connect", () => {
      this.connected = true;
    });
  }

  isAlive() {
    return this.connected;
  }

  async get(key) {
    const result = promisify(this.client.get).bind(this.client);
    const value = await result(key);
    return value;
  }

  async set(key, value, duration) {
    this.client.setex(key, duration, value);
  }

  async del(key) {
    this.client.del(key);
  }
}

const redisClient = new RedisClient();

export default redisClient;
