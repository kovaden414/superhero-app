import 'dotenv/config';
import { Superhero } from './src/models/superhero.js';
import { client } from './src/utils/db.js';

client.sync({ force: true });
