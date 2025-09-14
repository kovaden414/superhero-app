function normalize({
  nickname,
  real_name,
  origin_description,
  superpowers,
  catch_phrase,
  images,
}) {
  return {
    nickname,
    name: real_name,
    origin: origin_description,
    superpowers,
    catchPhrase: catch_phrase,
    images,
  };
}

export const superheroService = {
  normalize,
};
