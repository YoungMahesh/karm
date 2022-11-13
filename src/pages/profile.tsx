import { type NextPage } from "next";
import Head from "next/head";
import AuthShowcase from "../components/Header";
import { useSession } from "next-auth/react";
import ProfileBox from "../components/ProfileBox";

const Home: NextPage = () => {
  const { data } = useSession();

  return (
    <>
      <Head>
        <title>Profile | Timers</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <AuthShowcase />
        {data?.user ? (
          <ProfileBox />
        ) : (
          <p className="text-center">Sign In to View your Profile</p>
        )}
      </main>
    </>
  );
};

export default Home;
