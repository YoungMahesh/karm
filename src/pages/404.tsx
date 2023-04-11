/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function FourHundred() {
  const router = useRouter();
  useEffect(() => {
    router.push("/");
  }, []);
  return <></>;
}
