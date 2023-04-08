import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ClerkProvider } from "@clerk/nextjs";
import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ClerkProvider {...pageProps}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </ClerkProvider>
  );
};

export default trpc.withTRPC(MyApp);
