import { Suspense, use } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { Spinner } from "./Spinner";
import { ErrorCard } from "./ErrorCard";

type ImageProps = {
  srcPromise: Promise<string>;
  alt?: string;
};

export function Image({ srcPromise, alt }: ImageProps) {
  throw srcPromise;
  const src = use(srcPromise);
  return (
    <>
      <ErrorBoundary fallback={<ErrorCard message="Failed to load image." />}>
        <Suspense fallback={<Spinner />}>
          <img src={src} alt={alt ?? "Image"} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
