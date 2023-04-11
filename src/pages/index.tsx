import { type NextPage } from "next";
import TimersList from "../components/TimersList";
import Layout from "../components/Layout";
import PlusButton from "../components/PlusButton";
import { useSession } from "next-auth/react";
import { useAuth } from "@clerk/nextjs";
import Loading from "../components/Loading";
import { SignIn } from "@clerk/nextjs";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { isSignedIn } = useAuth();
  const { data } = trpc.profile.get.useQuery();

  const session = useSession();

  if (session.status === "loading") return <Loading />;

  return (
    <Layout title="Timers">
      {isSignedIn ? (
        <>
          <TimersList />
          <PlusButton />
        </>
      ) : (
        <div className="mt-8 flex justify-center">
          <SignIn path="/" routing="path" signUpUrl="/sign-up" />
        </div>
      )}
    </Layout>
  );
};

export default Home;
