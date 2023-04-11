import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { trpc } from "../utils/trpc";
import "../styles/globals.css";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default trpc.withTRPC(MyApp);
