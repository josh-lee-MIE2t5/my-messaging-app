import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/AuthContext";
import { ErrorBoundary } from "react-error-boundary";
import Error from "@/components/ErrorFallback";
import { AlertProvider } from "@/context/AlertContext";
import FindChatRoomPopUp from "@/components/FindChatRoomPopUp";
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
          <Component {...pageProps} />
        </ErrorBoundary>
      </AlertProvider>
    </AuthProvider>
  );
}
