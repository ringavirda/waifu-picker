import { Link, NavLink, Outlet } from "react-router";

import styles from "./app.module.css";
import logo from "../assets/logo.png";

export function AppLayout() {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <nav className={styles.navbar}>
          <Link className={styles.navlinkLogo} to={"/"}>
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
        <main className="grow">
          <Outlet />
        </main>
        <footer className={styles.footer}>
          Gloria in Excelsis Stella Caesa!
        </footer>
      </div>
    </>
  );
}
