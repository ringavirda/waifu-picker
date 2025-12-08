import { useState } from "react";
import { ConfigOptionIds, useService } from "@/app";
import { CacheService, ConfigService, StaticConfig } from "@wp/common";
import { SwitchButton } from "../common";

import styles from "./root.module.css";
import fallenBadge from "../../assets/badge.png";

export function Footer() {
  const cache = useService(CacheService);
  const config = useService(ConfigService);

  const [cacheActive, setCacheActive] = useState(
    StaticConfig.isCachePersistenceEnabled(),
  );

  return (
    <footer className={styles.footer}>
      <div className="flex items-center md:border-r-2 md:border-gray-200/60">
        <span className="text-lg">0005 5E</span>
        <img src={fallenBadge} alt="Fallen Badge" className="inline h-10" />
        <span className="text-lg md:mr-4">@fallenstar</span>
      </div>
      <div className="grow lg:hidden" />
      <div className="flex items-center gap-2 pl-4 text-lg">
        Cache:
        <SwitchButton
          textLeft="On"
          textRight="Off"
          handleLeft={() => {
            cache.enablePersistence(window.sessionStorage);
            setCacheActive(true);
            config.setOption(ConfigOptionIds.cachePersistence, true);
          }}
          handleRight={() => {
            cache.disablePersistence();
            setCacheActive(false);
            config.setOption(ConfigOptionIds.cachePersistence, false);
          }}
          activeLeft={cacheActive}
          activeRight={!cacheActive}
          disabled={false}
        />
      </div>
      <div
        className={`${styles.spacer} hidden h-8 border-l-0 border-gray-200/60 lg:inline`}
      ></div>
      <span className="hidden lg:inline">
        Gloria in Excelsis{" "}
        <span className="text-primary italic">Stella Caesa!</span>
      </span>
    </footer>
  );
}
