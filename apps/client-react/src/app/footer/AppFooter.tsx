import { useEffect, useRef } from "react";

import "./app-footer.scss";
import badge from "@/assets/badge.png";

export function AppFooter() {
  const badgeElement = useRef<HTMLImageElement>(null);

  useEffect(() => {
    badgeElement.current!.src = badge;
  }, []);

  return (
    <div className="footer">
      <div className="motto">
        Gloria in Excelsis <span className="stella">Stella Caesa</span>!
      </div>
      <img className="badge" ref={badgeElement} alt="Flare Wing" />
    </div>
  );
}
