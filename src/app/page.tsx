 "use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function Page() {
  const router = useRouter();
  const { isFetching, identity } = useAuth({ forceRefetch: false });

  useEffect(() => {
    console.log("Identity", identity);
  });

  // Handle redirection based on authentication state
  useEffect(() => {
    if (identity !== null) {
      // Redirect to dashboard if authenticated
      router.push("/dashboard");
    }
  }, []);

  if (isFetching) {
    return <div>Loading...</div>; // Show a loading state while fetching
  }

  return (
    <>
    {
      identity ? (
        <div>
          <h1>Welcome, {identity.firstName}</h1>
          <button onClick={() => router.push("/dashboard")}>Go to dashboard</button>
        </div>
      ) : (
        <div>
          <h1>Not authenticated</h1>
          <button onClick={() => router.push(process.env.NEXT_PUBLIC_AUTH_ENDPOINT + "/login")}>Sign in</button>
        </div>
      )
    }
    </>
  );

  // if (error) {
  //   return (
  //     <div>
  //       <h1>Error</h1>
  //       <button onClick={() => refetch({ forceSignin: true })}>Sign in</button>
  //     </div>
  //   );
  // }

  // return (
  //   <div>
  //     {/* Provide a link to the login endpoint for users */}
  //     <Link href={process.env.NEXT_PUBLIC_AUTH_ENDPOINT + "/login"}>
  //       Login
  //     </Link>
  //   </div>
  // );
}
