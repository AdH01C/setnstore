"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./hooks/useAuth";

export default function Page() {
  const router = useRouter();
  const { isFetching, identity } = useAuth({ forceRefetch: false });
  const addTrailingSlash = (url: string) => url.replace(/\/?$/, "/");

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
      {identity ? (
        <div>
          <h1>Welcome, {identity.firstName}</h1>
          <button onClick={() => router.push("/dashboard")}>
            Go to dashboard
          </button>
        </div>
      ) : (
        <div>
          <h1>Not authenticated</h1>
          <button
            onClick={() =>
              router.push(process.env.NEXT_PUBLIC_AUTH_ENDPOINT + "/login")
            }
          >
            Sign in
          </button>
        </div>
      )}
      <div>
        <a href={addTrailingSlash(process.env.NEXT_PUBLIC_AUTH_ENDPOINT ?? "") + "logout_unified"}
        >
          Logout
        </a>
      </div>
    </>
  );
  // const session = await getServerSession(options);

  // if (session) {
  //   redirect("/dashboard");
  // }

  // return (
  //   <Layout style={{ minHeight: "100vh" }}>
  //     <Content className="flex flex-col gap-4 items-center justify-center">
  //       <LoginForm />
  //     </Content>
  //     <Footer className="text-center">
  //       Inquisico ©{new Date().getFullYear()} Created by Adrians Worker
  //     </Footer>
  //   </Layout>
  // );
}
