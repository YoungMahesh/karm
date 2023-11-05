/* eslint-disable react-hooks/exhaustive-deps */
import { api } from "~/utils/api";
import { useEffect } from "react";
import { type NextPage } from "next";
import TimersList from "../components/TimersList";
import Layout from "../components/Layout";
import PlusButton from "../components/PlusButton";

import { useAuth } from "@clerk/nextjs";
import Loading from "../components/Loading";
// import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  const { refetch } = api.profile.get.useQuery(undefined, { enabled: false });

  useEffect(() => {
    // calling this to register new userId in databae in case of sign-up
    if (isSignedIn) void refetch();
  }, [isSignedIn]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) void router.push("/sign-in");
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) return <Loading />;
  return (
    <Layout title="Timers">
      {isSignedIn ? (
        <>
          <TimersList />
          <PlusButton />
        </>
      ) : (
        <div></div>
      )}
    </Layout>
  );
};

export default Home;
