import { useLocation } from "react-router-dom";
import styles from "./SuperheroDetails.module.scss";
import { useEffect, useState } from "react";
import * as superheroServise from "../../api/superheroes";
import type { Superhero } from "../../types/Superhero";

export const SuperheroDetails = () => {
  const location = useLocation();
  const [superhero, setSuperhero] = useState<Superhero | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleImageCount, setVisibleImageCount] = useState(2);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    superheroServise.getSuperhero(location.pathname).then(setSuperhero)
      .catch(() => setIsError(true));
  }, [location]);

  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;
      if (width >= 768 && width < 1024) {
        setVisibleImageCount(3);
      } else if (width >= 1024) {
        setVisibleImageCount(4);
      } else {
        setVisibleImageCount(2);
      }
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const images = superhero?.images || [];
  const totalImages = images.length;

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev > 0 ? prev - 1 : totalImages - visibleImageCount
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev < totalImages - visibleImageCount ? prev + 1 : 0
    );
  };

  const visibleImages = images.slice(
    currentIndex,
    currentIndex + visibleImageCount
  );

  return (
    <div className={styles.SuperheroDetails}>
      <h1 className={styles.SuperheroDetails__title}>Superhero App</h1>
      <button
        className={styles.SuperheroDetails__backButton}
        onClick={() => window.history.back()}
      >
        ← Back to list
      </button>

      {isError && (
        <div className={styles.SuperheroDetails__error}>Superheroes not found</div>
      )}

      <div className={styles.SuperheroDetails__hero} key={superhero?.nickname}>
        <div className={styles.SuperheroDetails__heroContent}>
          <img
            src={
              superhero?.images?.[0]
                ? `http://localhost:3005${superhero?.images[0]}`
                : "./no-image.png"
            }
            alt="superhero image"
            className={styles.SuperheroDetails__heroIcon}
          />

          <div className={styles.SuperheroDetails__heroNames}>
            <p className={styles.SuperheroDetails__heroText}>
              {superhero?.nickname}
            </p>
            <p className={styles.SuperheroDetails__heroText}>
              Name:
              <br />
              {superhero?.name || "-"}
            </p>
          </div>
        </div>

        <div className={styles.SuperheroDetails__heroInfo}>
          <p className={styles.SuperheroDetails__heroText}>
            Superpowers:
            <br />
            {superhero?.superpowers || "-"}
          </p>
          <p className={styles.SuperheroDetails__heroText}>
            Catch phrase:
            <br />
            {superhero?.catchPhrase || "-"}
          </p>
          <p className={styles.SuperheroDetails__heroText}>
            Origin description:
            <br />
            {superhero?.origin || "-"}
          </p>
        </div>

        {images.length > 1 && (
          <div className={styles.SuperheroDetails__heroImagesWrapper}>
            {images.length > visibleImageCount && (
              <button
                className={styles.SuperheroDetails__heroSwipeButton}
                onClick={handlePrev}
              >
                {"<"}
              </button>
            )}
            <div className={styles.SuperheroDetails__heroImages}>
              {visibleImages.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:3005${image}`}
                  alt="superhero image"
                  className={styles.SuperheroDetails__heroImage}
                />
              ))}
            </div>
            {images.length > visibleImageCount && (
              <button
                className={styles.SuperheroDetails__heroSwipeButton}
                onClick={handleNext}
              >
                {">"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
