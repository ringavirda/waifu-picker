import { useEffect, useState } from "react";
import { Link } from "react-router";

import "./app-header.scss";

import { useService, ICharsService } from "@/services";

export function AppHeader() {
  const api = useService<ICharsService>("ICharsService");
  const [chars, setChars] = useState<Array<string>>([]);

  useEffect(() => {
    const fetchList = async () => {
      const list = await api.fetchCharacterList();
      setChars(list);
    };

    fetchList().catch(console.error);
  }, []);

  return (
    <div className="header">
      <Link to={"/"} className="title">
        My Waifu Picker
      </Link>
      <div className="waifu-list-wrapper">
        <div className="waifu-list-desc">
          Here is the list of all currently available waifus!
        </div>
        <div className="waifu-list">{chars.join(", ")}</div>
      </div>
    </div>
  );
}
