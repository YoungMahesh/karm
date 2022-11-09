import { type NextPage } from "next";
import TimersList from "../components/TimersList";
import Layout from "../components/Layout";
import PlusButton from "../components/PlusButton";

const Home: NextPage = () => {
  return (
    <Layout title="Timer">
      <TimersList />
      <PlusButton />
    </Layout>
  );
};

export default Home;
