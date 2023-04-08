import { type NextPage } from "next";
import TimersList from "../components/TimersList";
import Layout from "../components/Layout";
import PlusButton from "../components/PlusButton";
import { useSession } from "next-auth/react";
import { useAuth } from "@clerk/nextjs";
import Notify from "../components/Nofity";
import Loading from "../components/Loading";
import { SignIn } from "@clerk/nextjs";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { isSignedIn, userId } = useAuth();
  const { data } = trpc.profile.get.useQuery();

  const session = useSession();

  if (session.status === "loading") return <Loading />;

  return (
    <Layout title="Timers">
      {/* {session.data?.user ? (
        <>
          <TimersList />
          <PlusButton />
        </>
      ) : (
        <Notify>Sign In to Manage your timers</Notify>
      )} */}
      <div>
        <p></p>
        <>
          {isSignedIn ? (
            <>
              <p>You are signed in with id: {userId} </p>
              <TimersList />
              <PlusButton />
            </>
          ) : (
            <SignIn path="/" routing="path" signUpUrl="/sign-up" />
          )}
        </>
      </div>
    </Layout>
  );
};

export default Home;
