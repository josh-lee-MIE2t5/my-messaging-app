import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/context";
import { ErrorBoundary, withErrorBoundary } from "react-error-boundary";
import Error from "@/components/ErrorFallback";

const myErrorHandler = (error: Error, info: { componentStack: string }) => {
  // Do something with the error
  console.log(error);
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ErrorBoundary
        FallbackComponent={Error}
        onError={myErrorHandler}
        onReset={() => {}}
      >
        <Component {...pageProps} />
      </ErrorBoundary>
    </AuthProvider>
  );
}
