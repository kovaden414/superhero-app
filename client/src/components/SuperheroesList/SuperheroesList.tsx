import { Link, useSearchParams } from "react-router-dom";
import styles from "./SuperheroesList.module.scss";
import type { Superhero } from "../../types/Superhero";

type Props = {
  superheroes: Superhero[];
  handleEditButton: (superhero: Superhero) => void;
  deleteSuperhero: (heroNickname: string) => void;
};

export const SuperheroesList: React.FC<Props> = ({
  superheroes,
  handleEditButton,
  deleteSuperhero,
}) => {
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "";

  return (
    <div className={styles.SuperheroesList}>
      {superheroes.slice(+page * 5 - 5, +page * 5).map((superhero) => (
        <div className={styles.SuperheroesList__hero} key={superhero.nickname}>
          <div className={styles.SuperheroesList__heroInfo}>
            <Link to={`/${superhero.nickname}`}>
              <img
                src={
                  superhero.images?.[0]
                    ? `${import.meta.env.VITE_SERVER_URL}${
                        superhero.images[0]
                      }`
                    : "./no-image.png"
                }
                alt="superhero image"
                className={styles.SuperheroesList__heroImage}
              />
            </Link>

            <Link to={`/${superhero.nickname}`} className={styles.SuperheroesList__heroText}>
              <p className={styles.SuperheroesList__heroNickname}>
                {superhero.nickname}
              </p>
            </Link>
          </div>

          <div className={styles.SuperheroesList__heroActions}>
            <Link to={`./${superhero.nickname}`}>
              <button className={styles.SuperheroesList__button}>View</button>
            </Link>
            <button
              className={styles.SuperheroesList__button}
              onClick={() => handleEditButton(superhero)}
            >
              Edit
            </button>
            <button
              className={styles.SuperheroesList__button}
              onClick={() => deleteSuperhero(superhero.nickname)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
