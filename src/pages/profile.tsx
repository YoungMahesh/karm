import { type NextPage } from "next";
// import Head from "next/head";
// import AuthShowcase from "../components/Header";
// import { useSession } from "next-auth/react";
// import ProfileBox from "../components/ProfileBox";
import Layout from "../components/Layout";

const Home: NextPage = () => {
  // const { data } = useSession();

  return (
    <Layout title="Profile | Timers">
      {/* {data?.user ? (
        <ProfileBox />
      ) : (
        <p className="text-center">Sign In to View your Profile</p>
      )} */}
    </Layout>
  );
};

export default Home;
