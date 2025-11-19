import { useContext, useState } from "react";
import { Link, useLocation } from "react-router";

import "./app-navbar.scss";
import {
  ServicesContext,
  CharsService,
  CharsExternalService,
  bindService,
} from "@/services";

export function AppNavbar() {
  const [loader, setLoader] = useState<string>("genshin");
  const container = useContext(ServicesContext);
  const location = useLocation();

  function onServerLoader(): void {
    setLoader("server");
    // bindService("ICharsService", CharsService);
    container?.unbindSync("ICharsService");
    container?.bind("ICharsService").to(CharsService);
  }

  function onGenshinLoader(): void {
    setLoader("genshin");
    container?.unbindSync("ICharsService");
    container?.bind("ICharsService").to(CharsExternalService);
  }

  return (
    <div className="app-navbar">
      <Link to={"/chars"} className="navbar-item">
        Characters
      </Link>
      <Link to={"/pols"} className="navbar-item">
        Polling
      </Link>

      {location.pathname.match(/\/chars/) ? (
        <div className="navbar-load-select">
          <div
            className={`
              load-label ${loader === "server" ? "selected-load" : ""}
            `}
            onClick={onServerLoader}
          >
            Server
          </div>
          <div
            className={`
              load-label ${loader === "genshin" ? "selected-load" : ""}
            `}
            onClick={onGenshinLoader}
          >
            Genshin
          </div>
        </div>
      ) : null}
      {location.pathname.match(/\/pols/) ? (
        <div id="pol-create" className="navbar-pol-create">
          New Pol
        </div>
      ) : null}
    </div>
  );
}
