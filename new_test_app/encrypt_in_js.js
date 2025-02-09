// const crypto = require('crypto');
import crypto from 'crypto';

import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

// require('dotenv').config(); // Load environment variables from .env file

//const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY // Replace with a strong secret key
const ENCRYPTION_SALT = process.env.ENCRYPTION_SALT

function encrypt(data, password, salt) {
  const key = crypto.pbkdf2Sync(password, salt, 10000, 32, 'sha256');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  // Convert data to a Buffer before updating
  const dataBuffer = Buffer.from(data, 'utf8'); // or 'ascii', 'latin1', etc. as needed

  let encrypted = cipher.update(dataBuffer); // No need for encoding here
  encrypted = Buffer.concat([encrypted, cipher.final()]); // Concatenate Buffers

  const authTag = cipher.getAuthTag();

  return {
    ciphertext: Buffer.concat([iv, encrypted, authTag]).toString('base64'),
    salt: salt.toString('base64'),
  };
}

//const password = 'mysecretpassword'; // Replace with a strong password!
//const salt = crypto.randomBytes(16); // get it from env
const data = 'This is some data to encrypt.';

const encryptedData = encrypt(data, SECRET_KEY, ENCRYPTION_SALT);
console.log(encryptedData);