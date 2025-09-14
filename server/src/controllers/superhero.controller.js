import { Superhero } from "../models/superhero.js";
import { superheroService } from "../services/superhero.service.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

export const upload = multer({ storage });

const getAllSuperheroes = async (req, res) => {
  const superheroes = await Superhero.findAll();

  res.send(
    superheroes
      .sort((hero1, hero2) => hero2.id - hero1.id)
      .map(superheroService.normalize)
  );
};

const getSuperhero = async (req, res) => {
  const { nickname } = req.params;

  const superhero = await Superhero.findOne({ where: { nickname } });

  if (!superhero) {
    return res.status(404).json({ error: "Superhero not found" });
  }

  res.json(superheroService.normalize(superhero));
};

const createSuperhero = async (req, res) => {
  const { nickname, real_name, origin_description, superpowers, catch_phrase } =
    req.body;

  const images = req.files
    ? req.files.map((file) => `/uploads/${file.filename}`)
    : [];

  const newSuperhero = await Superhero.create({
    nickname,
    real_name,
    origin_description,
    superpowers,
    catch_phrase,
    images,
  });

  res.json(superheroService.normalize(newSuperhero));
};

const deleteSuperhero = async (req, res) => {
  const { nickname } = req.params;
  await Superhero.destroy({ where: { nickname } });

  const superheroes = await Superhero.findAll();
  res.send(
    superheroes
      .sort((hero1, hero2) => hero2.id - hero1.id)
      .map(superheroService.normalize)
  );
};

const updateSuperhero = async (req, res) => {
  const { oldNickname } = req.params;
  const {
    nickname,
    real_name,
    origin_description,
    superpowers,
    catch_phrase,
    images: existingImages,
  } = req.body;

  const newImages = req.files
    ? req.files.map((file) => `/uploads/${file.filename}`)
    : [];

  const finalImages = existingImages
    ? Array.isArray(existingImages)
      ? [...existingImages, ...newImages]
      : [existingImages, ...newImages]
    : newImages;

  await Superhero.update(
    {
      nickname,
      real_name,
      origin_description,
      superpowers,
      catch_phrase,
      images: finalImages,
    },
    { where: { nickname: oldNickname } }
  );

  const updatedSuperhero = await Superhero.findOne({ where: { nickname } });

  if (!updatedSuperhero) {
    return res.status(404).json({ error: "Superhero not found" });
  }

  res.json(superheroService.normalize(updatedSuperhero));
};

export const superheroController = {
  getAllSuperheroes,
  getSuperhero,
  createSuperhero,
  deleteSuperhero,
  updateSuperhero,
};
