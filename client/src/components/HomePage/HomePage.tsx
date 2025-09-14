import { useEffect, useMemo, useState } from "react";
import styles from "./HomePage.module.scss";
import * as superheroServise from "../../api/superheroes";
import type { Superhero } from "../../types/Superhero";
import classNames from "classnames";
import { Link, useSearchParams } from "react-router-dom";
import { getSearchWith } from "../../utils/searchHelper";
import { SuperheroesList } from "../SuperheroesList";

export const HomePage = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [superheroes, setSuperheroes] = useState<Superhero[]>([]);
  const [nickname, setNickname] = useState("");
  const [name, setName] = useState("");
  const [origin, setOrigin] = useState("");
  const [superpowers, setSuperpowers] = useState("");
  const [catchPhrase, setCatchPhrase] = useState("");
  const [images, setImages] = useState<(string | File)[]>([]);
  const [isError, setIsError] = useState(false);
  const [heroAlreadyExist, setHeroAlreadyExist] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [oldNickname, setOldNickname] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || "";

  useEffect(() => {
    superheroServise
      .getSuperheroes()
      .then(setSuperheroes)
      .catch(() => setIsError(true));
    
    setSearchParams({ page: '1'})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitButton = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      superheroes.find(
        (hero) =>
          hero.nickname.trim().toLowerCase() === nickname.trim().toLowerCase()
      ) &&
      !isEditing
    ) {
      setHeroAlreadyExist(true);
      return;
    }

    const formData = new FormData();
    formData.append("nickname", nickname);
    formData.append("real_name", name);
    formData.append("origin_description", origin);
    formData.append("superpowers", superpowers);
    formData.append("catch_phrase", catchPhrase);

    images.forEach((file) => {
      formData.append("images", file);
    });

    if (isEditing) {
      updateSuperhero(formData, oldNickname);
    } else {
      createSuperhero(formData);
    }

    clearForm();
  };

  const createSuperhero = (formData: FormData) => {
    superheroServise
      .addSuperhero(formData)
      .then((newSuperhero) => {
        setSuperheroes((currentSuperheroes) => [
          newSuperhero,
          ...currentSuperheroes,
        ]);
      })
      .catch(() => setIsError(true));
  };

  const updateSuperhero = (formData: FormData, oldNickname: string) => {
    superheroServise
      .updateSuperhero(formData, oldNickname)
      .then((updatedHero) =>
        setSuperheroes((prev) =>
          prev.map((hero) =>
            hero.nickname === oldNickname ? updatedHero : hero
          )
        )
      )
      .catch(() => setIsError(true));
  };

  const handleEditButton = (selectedHero: Superhero) => {
    setIsFormVisible(true);
    setNickname(selectedHero.nickname);
    setName(selectedHero.name);
    setOrigin(selectedHero.origin);
    setSuperpowers(selectedHero.superpowers);
    setCatchPhrase(selectedHero.catchPhrase);
    setImages(selectedHero.images);
    setIsEditing(true);
    setOldNickname(selectedHero.nickname);
  };

  const deleteSuperhero = (heroNickname: string) => {
    superheroServise
      .deleteSuperhero(heroNickname)
      .then((updatedHeroes) => setSuperheroes(updatedHeroes))
      .catch(() => setIsError(true));
  };

  const addImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  function clearForm() {
    setIsFormVisible(false);
    setNickname("");
    setName("");
    setOrigin("");
    setSuperpowers("");
    setCatchPhrase("");
    setImages([]);
    setHeroAlreadyExist(false);
    setIsEditing(false);
    setOldNickname("");
  }

  const paginationButtons: number[] = useMemo(
    () =>
      Array.from(
        { length: Math.ceil(superheroes.length / 5) },
        (_, index) => index + 1
      ),
    [superheroes.length]
  );

  const visiblePages = useMemo(() => {
    const pages = paginationButtons;
    const totalPages = pages.length;

    if (totalPages <= 3) {
      return pages;
    }

    if (+page === 1) {
      return pages.slice(0, 3);
    }

    if (+page === totalPages) {
      return pages.slice(totalPages - 3, totalPages);
    }

    return pages.slice(+page - 2, +page + 1);
  }, [paginationButtons, page]);

  return (
    <main className={styles.HomePage}>
      <h1 className={styles.HomePage__title}>Superhero App</h1>

      <div className={styles.HomePage__controls}>
        <h2
          className={styles.HomePage__heroCount}
        >{`All heroes (${superheroes.length})`}</h2>
        <button
          className={styles.HomePage__addButton}
          onClick={() => setIsFormVisible(true)}
        >
          + Add Superhero
        </button>
      </div>

      {superheroes.length === 0 && <p>No heroes yet</p>}

      {isError && (
        <div className={styles.HomePage__error}>Superheroes not found</div>
      )}

      <SuperheroesList
        superheroes={superheroes}
        handleEditButton={handleEditButton}
        deleteSuperhero={deleteSuperhero}
      />

      {superheroes.length > 5 && (
        <div className={styles.HomePage__pagination}>
          <Link
            to={{
              search: getSearchWith(searchParams, {
                page: `${+page > 1 ? +page - 1 : +page}`,
              }),
            }}
          >
            <button
              className={styles.HomePage__paginationButton}
              disabled={page === "1"}
            >
              Prev
            </button>
          </Link>
          {visiblePages.map((buttonNum: number) => (
            <Link
              to={{
                search: getSearchWith(searchParams, {
                  page: `${buttonNum}`,
                }),
              }}
              key={buttonNum}
            >
              <button
                className={classNames(styles.HomePage__paginationButton, {
                  [styles.HomePage__paginationButtonActive]: buttonNum === +page,
                })}
              >
                {`${buttonNum}`}
              </button>
            </Link>
          ))}
          <Link
            to={{
              search: getSearchWith(searchParams, {
                page: `${+page < paginationButtons.length ? +page + 1 : +page}`,
              }),
            }}
          >
            <button
              className={styles.HomePage__paginationButton}
              disabled={page === `${paginationButtons.length}`}
            >
              Next
            </button>
          </Link>
        </div>
      )}

      {isFormVisible && (
        <div className={styles.HomePage__formOverlay}>
          <div className={styles.HomePage__formContainer}>
            <h2 className={styles.HomePage__formTitle}>
              {isEditing ? "Edit Superhero" : "Add New Superhero"}
            </h2>

            <form
              className={styles.HomePage__form}
              onSubmit={(e) => handleSubmitButton(e)}
            >
              <label className={styles.HomePage__formLabel}>
                Nickname:
                <input
                  type="text"
                  required
                  maxLength={50}
                  className={classNames(styles.HomePage__formInput, {
                    [styles.HomePage__formInputError]: heroAlreadyExist,
                  })}
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    setHeroAlreadyExist(false);
                  }}
                />
                {heroAlreadyExist && (
                  <label className={styles.HomePage__formLabelError}>
                    Hero already exist
                  </label>
                )}
              </label>

              <label className={styles.HomePage__formLabel}>
                Name:
                <input
                  type="text"
                  maxLength={50}
                  className={styles.HomePage__formInput}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>

              <label className={styles.HomePage__formLabel}>
                Origin Description:
                <textarea
                  className={styles.HomePage__formInput}
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                />
              </label>

              <label className={styles.HomePage__formLabel}>
                Superpowers:
                <input
                  type="text"
                  className={styles.HomePage__formInput}
                  value={superpowers}
                  onChange={(e) => setSuperpowers(e.target.value)}
                />
              </label>

              <label className={styles.HomePage__formLabel}>
                Catch Phrase:
                <input
                  type="text"
                  className={styles.HomePage__formInput}
                  value={catchPhrase}
                  onChange={(e) => setCatchPhrase(e.target.value)}
                />
              </label>

              <label className={styles.HomePage__fileLabel}>
                Choose Images
                <input
                  type="file"
                  name="images"
                  multiple
                  className={styles.HomePage__fileInputHidden}
                  onChange={(e) => addImages(e)}
                />
              </label>

              <div className={styles.HomePage__formImages}>
                {images.map((img, index) => (
                  <div
                    key={index}
                    className={styles.HomePage__formImageWrapper}
                  >
                    <img
                      src={
                        typeof img === "string"
                          ? `http://localhost:3005${img}`
                          : URL.createObjectURL(img)
                      }
                      alt="superhero"
                      className={styles.HomePage__formImage}
                    />
                    <button
                      type="button"
                      className={styles.HomePage__formImageRemove}
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className={styles.HomePage__formActions}>
                <button type="submit" className={styles.HomePage__formButton}>
                  Save
                </button>
                <button
                  className={styles.HomePage__formButton}
                  onClick={() => clearForm()}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
