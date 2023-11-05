import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { ToastContainer } from "react-toastify";
import "~/styles/globals.css";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import "react-toastify/dist/ReactToastify.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Component className="font-sans" {...pageProps} />
      <ToastContainer />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
