#!/usr/bin/node

const sha1 = require('sha1');

export const pwdHashed = (pwd) => sha1(pwd);
export const getAuthzHeader = (req) => {
  const header = req.headers.authorization;
  if (!header) {
    return null;
  }
  return header;
};

export const getToken = (authzHeader) => {
  const tokenType = authzHeader.substring(0, 6);
  if (tokenType !== 'Basic ') {
    return null;
  }
  return authzHeader.substring(6);
};

export const decodeToken = (token) => {
  const decodedToken = Buffer.from(token, 'base64').toString('utf8');
  if (!decodedToken.includes(':')) {
    return null;
  }
  return decodedToken;
};

export const getCredentials = (decodedToken) => {
  const [email, password] = decodedToken.split(':');
  if (!email || !password) {
    return null;
  }
  return { email, password };
};
