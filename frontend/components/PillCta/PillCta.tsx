import { forwardRef } from "react";

import PolyCta, { EPolyAs, TPolyCtaProps } from "../PolyCta/PolyCta";

import styles from "./PillCta.module.scss";

type TPillCtaProps = TPolyCtaProps & {
  isActive?: boolean;
};

const PillCta = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  TPillCtaProps
>(({ isActive, className, ...rest }, ref) => {
  const rootStyles = [styles.root, styles[rest.as || EPolyAs.button]];
  if (className) rootStyles.push(className);
  if (isActive) rootStyles.push(styles.isActive);
  return <PolyCta {...rest} ref={ref} className={rootStyles.join(" ")} />;
});

PillCta.displayName = "PillCta";

export default PillCta;
