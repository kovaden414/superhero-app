import type { Superhero } from "../types/Superhero";
import { client } from "../utils/fetchClient";

export const getSuperheroes = () => {
  return client.get<Superhero[]>("/");
};

export const getSuperhero = (nicknamePath: string) => {
  return client.get<Superhero>(nicknamePath);
};

export const addSuperhero = (formData: FormData) => {
  return client.post<Superhero>("/", formData);
};

export const updateSuperhero = (formData: FormData, oldNickname: string) => {
  return client.patch<Superhero>(`/${oldNickname}`, formData);
};

export const deleteSuperhero = (nickname: string) => {
  return client.delete<Superhero[]>(`/${nickname}`);
};
