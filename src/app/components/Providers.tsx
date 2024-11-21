"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Provider } from "react-redux";

import { store } from "../store/store";
import { AppProvider } from "./AppContext";
import privateRoutes from "../constants/routes";

export const Providers = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const queryClient = new QueryClient();

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
