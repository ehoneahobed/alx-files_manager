const sha1 = require('sha1');
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

import { v4 as uuidv4 } from 'uuid';

class AuthController {
  static async getConnect (req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
      const email = auth[0];
      const pass = sha1(auth[1]);

      const user = await dbClient.getUser({ email });

      if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
      }

      if (pass !== user.password) {
        res.status(401).json({ error: 'Unauthorized' });
      }

      const token = uuidv4();
      const key = `auth_${token}`;
      const duration = (60 * 60 * 24);
      await redisClient.set(key, user._id.toString(), duration);

      res.status(200).json({ token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async getDisconnect (req, res) {
    try {
      const userToken = req.header('X-Token');

      const userKey = await redisClient.get(`auth_${userToken}`);

      if (!userKey) {
        res.status(401).json({ error: 'Unauthorized' });
      }
      await redisClient.del(`auth_${userToken}`);
      res.status(204).send('Disconnected');
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

export default AuthController;