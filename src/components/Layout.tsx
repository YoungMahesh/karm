import Head from "next/head";
import Header from "../components/Header";
import CreateTimer from "../components/CreateTimer";
import { useSession } from "next-auth/react";

const Layout = ({ children, title }: { children: any; title: string }) => {
  const { data } = useSession();

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/logo.svg" />
      </Head>

      <div className="drawer">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content">
          <Header />
          {children}
        </div>

        <CreateTimer />
      </div>
    </>
  );
};

export default Layout;
