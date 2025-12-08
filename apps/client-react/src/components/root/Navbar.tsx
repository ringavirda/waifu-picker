import { Link, NavLink } from "react-router";

import styles from "./root.module.css";
import logo from "../../assets/logo.png";

export function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link className={styles["navlink-logo"]} to={"/"}>
        <img src={logo} alt="Logo" className="mr-2 h-20 w-20" />
        Waifu Picker
      </Link>
      <div className={styles.spacer}></div>
      <NavLink
        className={({ isActive }) =>
          isActive ? styles.navlink + " " + styles.active : styles.navlink
        }
        to="/chars"
      >
        Characters
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? styles.navlink + " " + styles.active : styles.navlink
        }
        to="/polls"
      >
        Polling
      </NavLink>
    </nav>
  );
}
