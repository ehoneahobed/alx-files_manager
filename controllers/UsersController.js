const sha1 = require("sha1");
const { ObjectId } = require("mongodb");
const dbClient = require("../utils/db");
const redisClient = require("../utils/redis");

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) {
      res.status(400).json({ error: "Missing email" });
    }
    if (!password) {
      res.status(400).json({ error: "Missing password" });
    }

    const hashPwd = sha1(password);

    try {
      const collection = dbClient.db.collection("users");
      const user1 = await collection.findOne({ email });

      if (user1) {
        res.status(400).json({ error: "Already exist" });
      } else {
        collection.insertOne({ email, password: hashPwd });
        const newUser = await collection.findOne(
          { email },
          { projection: { email: 1 } }
        );
        res.status(201).json({ id: newUser._id, email: newUser.email });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Server error" });
    }
  }

  static async getMe(request, res) {
    try {
      const userToken = request.header("X-Token");
      const authKey = `auth_${userToken}`;

      const userID = await redisClient.get(authKey);
      console.log("USER KEY GET ME", userID);
      if (!userID) {
        res.status(401).json({ error: "Unauthorized" });
      }
      const user = await dbClient.getUser({ _id: ObjectId(userID) });

      res.json({ id: user._id, email: user.email });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Server error" });
    }
  }
}

export default UsersController;
