import { forwardRef } from "react";

import styles from "./NavItem.module.scss";

const NavItem = forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>((props, ref) => {
  const rootStyles = [styles.root];
  return <a {...props} ref={ref} className={rootStyles.join(" ")} />;
});

NavItem.displayName = "NavItem";

export default NavItem;
