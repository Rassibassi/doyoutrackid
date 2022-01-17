import styles from "./Footer.module.scss";

interface IFooterProps {
  className: string;
}

const Footer = ({ className }: IFooterProps) => {
  const rootStyles = [styles.root];
  if (className) rootStyles.push(className);

  return (
    <footer className={rootStyles.join(" ")}>
      <p className={styles.copy}>
        <a
          target="_blank"
          href="https://github.com/Rassibassi"
          rel="noreferrer"
        >
          Rassibassi
        </a>{" "}
        X{" "}
        <a target="_blank" href="mailto:erinjrimmer@gmail.com" rel="noreferrer">
          Erin Rimmer
        </a>{" "}
        X{" "}
        <a
          target="_blank"
          href="mailto:jack@jackhkmatthews.com"
          rel="noreferrer"
        >
          jackhkmatthews
        </a>{" "}
        -{" "}
        <a
          href="https://github.com/Rassibassi/doyoutrackid"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </p>
    </footer>
  );
};

export default Footer;
