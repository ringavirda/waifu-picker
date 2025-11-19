import { useEffect, useState } from "react";
import { StatusService } from "@wp/common";

import { HomeCard, HomePrincess } from "@/pages/home";
import { useService } from "@/services";

export function HomePage() {
  const status = useService(StatusService);
  const [server, setServer] = useState<boolean>(false);

  useEffect(() => {
    status.isServerAlive().then(setServer).catch(console.error);
  }, []);

  return (
    <>
      <HomeCard />
      <HomePrincess server={server} />
    </>
  );
}
