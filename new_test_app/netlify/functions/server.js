import express from 'express';
import serverless from 'serverless-http';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors'; // Enable Cross-Origin Resource Sharing
import dotenv from 'dotenv'; // Load environment variables from .env file
dotenv.config(); // Load environment variables from .env file


import { userRouter } from './routes/userRoutes.js';
import { prayerRouter } from './routes/prayerRoutes.js';
import { providerRouter } from './routes/providerRoutes.js';

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key'; // Replace with a strong secret key
const MONGODB_URI = process.env.MONGODB_URI ; // Replace with your MongoDB URI
const ENCRYPTION_SALT = process.env.ENCRYPTION_SALT || 'sdfsdklfksldfksl'

// MongoDB Connection
mongoose.connect(MONGODB_URI, {
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.error('MongoDB Connection Error:', err));


const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Essential for parsing JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // For form data (if needed)

app.use('/api/auth', userRouter);
app.use('/api/prayer', prayerRouter);
app.use('/api/provider', providerRouter);


// import { fetchIslamicFinderData } from './helpers/helper_func.js';
// API route
// app.get("/api/test", (req, res) => {
//   // const api_data = fetchIslamicFinderData();
//   // console.log(api_data)
//   res.json({ message: "Hello from Express on Netlify!" });
// });

// API route
app.get("/api/get-timezone", (req, res) => {
  const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log(currentTimeZone); 
  res.json({ message: "Hello from Express on Netlify!", currentTimeZone: currentTimeZone });
});








// function encrypt(data, password, salt) {
//   const key = crypto.pbkdf2Sync(password, salt, 10000, 32, 'sha256');
//   const iv = crypto.randomBytes(16);
//   const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

//   // Convert data to a Buffer before updating
//   const dataBuffer = Buffer.from(data, 'utf8'); // or 'ascii', 'latin1', etc. as needed

//   let encrypted = cipher.update(dataBuffer); // No need for encoding here
//   encrypted = Buffer.concat([encrypted, cipher.final()]); // Concatenate Buffers

//   const authTag = cipher.getAuthTag();

//   return Buffer.concat([iv, encrypted, authTag]).toString('base64')
//   // return {
//   //   ciphertext: Buffer.concat([iv, encrypted, authTag]).toString('base64'),
//   //   salt: salt.toString('base64'),
//   // };
// }

// import { fetchIslamicFinderData } from './helpers/helper_func.js';

// const api_data = await fetchIslamicFinderData();
// console.log(api_data.results.Fajr)



export const handler = serverless(app);
