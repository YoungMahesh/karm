import Head from "next/head";
import Header from "../components/Header";
import CreateTimer from "../components/CreateTimer";
import { type ReactElement } from "react";

const Layout = ({
  children,
  title,
}: {
  children: ReactElement;
  title: string;
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="google-site-verification"
          content="E2Obl_Qx1sRRwNoccLsBR6yaeQa3yJBTUSIJacrdmJY"
        />
        <link rel="icon" href="/logo.svg" />
      </Head>

      <main className="drawer font-sans">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content">
          <Header />
          {children}
        </div>

        <CreateTimer />
      </main>
    </>
  );
};

export default Layout;
