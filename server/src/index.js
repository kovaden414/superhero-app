'use strict';

import express from 'express';
import 'dotenv/config';
import { superheroRouter } from './routes/superhero.route.js';
import cors from 'cors';

const PORT = process.env.PORT || 3005;

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_HOST,
    credentials: true,
  }),
);

app.use("/uploads", express.static("uploads"));

app.use(superheroRouter);

app.listen(PORT, () => {
  console.log('server is running');
});
