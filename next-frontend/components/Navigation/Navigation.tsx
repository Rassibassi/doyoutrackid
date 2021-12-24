import Link from "next/link";
import { useState } from "react";

const Navigation = () => {
  const [toggle, setToggle] = useState(false);
  const untoggle = () => {
    setToggle(false);
  };
  return (
    <nav className="navbar is-link">
      <div className="navbar-brand">
        <button
          onClick={() => {
            setToggle(!toggle);
          }}
          className="navbar-burger"
          data-target="navMenu"
          aria-label="menu"
          aria-expanded="false"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>
      <div id="navMenu" className={`navbar-menu${toggle ? " is-active" : ""}`}>
        <div className="navbar-start">
          <Link href="/">
            <a className="navbar-item" onClick={untoggle}>
              Today
            </a>
          </Link>
          <Link href="/archive">
            <a className="navbar-item" onClick={untoggle}>
              Archive
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
