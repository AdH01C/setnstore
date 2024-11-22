"use client";

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Provider } from "react-redux";

import { store } from "../store/store";
import { AppProvider } from "./AppContext";
import privateRoutes from "../constants/routes";
import { errorResponseHandler } from "../utils/responseHandler";

export const Providers = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: error => {
        errorResponseHandler(error);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _, __, ___) => {
        // const { mutationKey } = mutation.options;
        errorResponseHandler(error);
      },
    }),
  });

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {privateRoutes.some(route => pathname.includes(route)) ? (
          <AppProvider forceSignin>{children}</AppProvider>
        ) : (
          children
        )}
      </QueryClientProvider>
    </Provider>
  );
};
