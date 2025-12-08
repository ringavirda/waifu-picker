import type { Observable } from "rxjs";
import { useObservableState } from "observable-hooks";
import type { PrincessImage } from "@/app/services";
import { ErrorCard } from "../common";

import placeholder from "@/assets/princess-placeholder.png";

type PrincessImageProps = {
  className?: string;
  princess$: Observable<PrincessImage>;
};

export function PrincessImage({ className, princess$ }: PrincessImageProps) {
  const princess = useObservableState<PrincessImage>(princess$);

  if (princess?.isLoading) {
    return (
      <div className="flex w-full items-center justify-center">
        <img
          className={`${className} animate-pulse object-fill`}
          src={placeholder}
          alt="Loading princess..."
        />
      </div>
    );
  }

  if (princess?.error) {
    return (
      <div className="flex w-full items-center justify-center">
        <ErrorCard message={`${princess.error}`} />
      </div>
    );
  }

  if (!princess?.url) {
    return <></>;
  }

  return (
    <div className="from=0 to-100 flex w-full items-center justify-center transition-opacity">
      <img className={className} src={princess?.url} alt="Princess Character" />
    </div>
  );
}
