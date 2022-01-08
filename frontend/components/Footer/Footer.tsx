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
        Rassibassi X Erin Rimmer X jackhkmatthews -{" "}
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
