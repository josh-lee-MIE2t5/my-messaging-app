import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthContext, AuthProvider } from "@/context/AuthContext";
import { ErrorBoundary, withErrorBoundary } from "react-error-boundary";
import Error from "@/components/ErrorFallback";
import { AlertProvider } from "@/context/AlertContext";
import { useContext } from "react";
import SideNav from "@/components/SideNav";
const myErrorHandler = (error: Error, info: { componentStack: string }) => {
  // Do something with the error
  console.log(error);
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <AlertProvider>
        <ErrorBoundary
          FallbackComponent={Error}
          onError={myErrorHandler}
          onReset={() => {}}
        >
          <SideNav>
            <Component {...pageProps} />
          </SideNav>
        </ErrorBoundary>
      </AlertProvider>
    </AuthProvider>
  );
}
