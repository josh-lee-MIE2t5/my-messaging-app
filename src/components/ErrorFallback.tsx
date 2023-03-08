import ReactFCProps from "@/types/ReactFCProps.types";
import { useEffect } from "react";
export default function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  useEffect(() => {
    console.log(error);
  }, [error]);
  return (
    <body>
      <h2>Something went wrong!</h2>
      <p>Error: {error.message}</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </body>
  );
}
