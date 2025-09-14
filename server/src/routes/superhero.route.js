import express from 'express';
import { superheroController, upload } from '../controllers/superhero.controller.js';
import { catchError } from '../utils/catchError.js';

export const superheroRouter = new express.Router();

superheroRouter.get('/', catchError(superheroController.getAllSuperheroes));
superheroRouter.get('/:nickname', catchError(superheroController.getSuperhero));
superheroRouter.post('/', upload.array('images'), catchError(superheroController.createSuperhero));
superheroRouter.delete('/:nickname', catchError(superheroController.deleteSuperhero));
superheroRouter.patch('/:oldNickname', upload.array('images'), catchError(superheroController.updateSuperhero));
