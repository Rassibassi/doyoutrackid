import BananaFace from "../BananaFace/BananaFace";

import styles from "./Error.module.scss";

interface IErrorProps {
  className?: string;
  title: string;
  body: string;
}

const Error = ({ className, title, body }: IErrorProps) => {
  const rootStyles = [styles.root];
  if (className) rootStyles.push(className);

  return (
    <div className={rootStyles.join(" ")}>
      <BananaFace className={styles.face} />
      <div className={styles.copy}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.body}>{body}</p>
      </div>
    </div>
  );
};

export default Error;
