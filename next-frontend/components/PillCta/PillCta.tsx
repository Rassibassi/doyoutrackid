import { forwardRef } from "react";

import PolyCta, { EPolyAs, TPolyCtaProps } from "../PolyCta/PolyCta";

import styles from "./PillCta.module.scss";

type TPillCtaProps = TPolyCtaProps;

const PillCta = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  TPillCtaProps
>((props, ref) => {
  const rootStyles = [styles.root, styles[props.as || EPolyAs.button]];
  return <PolyCta {...props} ref={ref} className={rootStyles.join(" ")} />;
});

PillCta.displayName = "PillCta";

export default PillCta;
