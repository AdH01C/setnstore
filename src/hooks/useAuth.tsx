import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { fetchUserInit } from "@/store/actions/userActions";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addTrailingSlash } from "@/utils/common";

type useAuthProps = {
  forceRefetch?: boolean;
  forceSignin?: boolean;
};

export function useAuth({ forceRefetch = false, forceSignin = false }: useAuthProps = {}) {
  const isRefetched = useRef<boolean>(false);
  const router = useRouter();
  const { isFetching, dataFetched, isError, error, identity } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  const refetch = (options: Omit<useAuthProps, "forceRefetch"> = { forceSignin: false }) =>
    void dispatch(fetchUserInit({ isRedirect: options.forceSignin as boolean }));

  useEffect(() => {
    if (!isFetching && !dataFetched) {
      //init if hasn't fetched
      void dispatch(fetchUserInit({ isRedirect: forceSignin }));
    } else if (!isFetching && dataFetched && !identity && forceSignin) {
      //if data is fetched but no information
      void router.push(new URL("login", addTrailingSlash(process.env.NEXT_PUBLIC_AUTH_ENDPOINT ?? "")).toString());
    } else if (!isFetching && dataFetched && forceRefetch && !isRefetched.current) {
      //if data is fetched but still want to refetch to get latest info
      isRefetched.current = true;
      void dispatch(fetchUserInit({ isRedirect: forceSignin }));
    }
  }, [isFetching, dataFetched, identity]);

  return {
    identity,
    isFetching,
    dataFetched,
    isError,
    error,
    refetch,
  };
}
