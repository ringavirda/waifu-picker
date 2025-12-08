import { useMemo } from "react";
import { GenshinApi, PrincessService, ServiceIds, useService } from "@/app";
import { PrincessImage } from "./PrincessImage";

export function PrincessSection() {
  const { useGetCharacterByIdQuery } = useService<GenshinApi>(
    ServiceIds.ICharsApi,
  ).endpoints;
  const princessService = useService(PrincessService);

  const princessPath = useMemo(
    () => princessService.getRandomPrincessPath(),
    [princessService],
  );
  const princessId = princessPath.split("/")[0];

  const princess$ = princessService.fetchPrincessImage(princessPath);
  const princessData = useGetCharacterByIdQuery(princessId);

  return (
    <div className="items-center gap-4 p-4 pb-0 md:col-span-2 md:grid md:grid-cols-[1fr_2fr] lg:max-w-2/3">
      {!princessData.isLoading && (
        <>
          <div className="from-primary/60 flex max-h-fit flex-col justify-center rounded-l-2xl bg-linear-to-r to-gray-200/0 p-4 font-bold">
            <span className="text-primary mr-2 mb-2 ml-4 block text-4xl font-bold italic text-shadow-md text-shadow-purple-100">
              {princessData.data?.name}
            </span>
            <span className="text-xl font-normal italic">
              {princessData.data?.description}
            </span>
          </div>
          <PrincessImage
            className="max-h-[800px] object-scale-down"
            princess$={princess$}
          />
        </>
      )}
    </div>
  );
}
