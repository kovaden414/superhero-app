import { DataTypes, STRING } from 'sequelize';
import { client } from '../utils/db.js';

export const Superhero = client.define('superhero', {
  nickname: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  real_name: {
    type: DataTypes.STRING,
  },
  origin_description: {
    type: DataTypes.STRING,
  },
  superpowers: {
    type: DataTypes.STRING,
  },
  catch_phrase: {
    type: DataTypes.STRING,
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
});
