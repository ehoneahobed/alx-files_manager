#!/usr/bin/node

const { v4 } = require('uuid');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');
const { getAuthzHeader, getToken, pwdHashed } = require('../utils/utils');
const { decodeToken, getCredentials } = require('../utils/utils');

class AuthController {
  static async getConnect(req, res) {
    const authzHeader = getAuthzHeader(req);
    if (!authzHeader) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
      return;
    }
    const token = getToken(authzHeader);
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
      return;
    }
    const decodedToken = decodeToken(token);
    if (!decodedToken) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
      return;
    }
    const { email, password } = getCredentials(decodedToken);
    const user = await dbClient.getUser(email);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
      return;
    }
    if (user.password !== pwdHashed(password)) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
      return;
    }
    const accessToken = v4();
    await redisClient.set(`auth_${accessToken}`, user._id.toString('utf8'), 60 * 60 * 24);
    res.json({ token: accessToken });
    res.end();
  }

  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
      return;
    }
    const id = await redisClient.get(`auth_${token}`);
    if (!id) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
      return;
    }
    const user = await dbClient.getUserById(id);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
      return;
    }
    await redisClient.del(`auth_${token}`);
    res.status(204).end();
  }

  static async getMe(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
      return;
    }
    const id = await redisClient.get(`auth_${token}`);
    if (!id) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
      return;
    }
    const user = await dbClient.getUserById(id);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
      return;
    }
    res.json({ id: user._id, email: user.email }).end();
  }
}

module.exports = AuthController;
