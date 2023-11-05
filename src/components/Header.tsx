/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useAuth, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Bars3Icon } from "@heroicons/react/24/solid";

export default function Header() {
  const { isSignedIn } = useAuth();

  const router = useRouter();

  return (
    <header className="navbar">
      <div className="flex-1 px-2 lg:flex-none">
        <Image
          src={"/logo.svg"}
          width={50}
          height={50}
          alt="Timers"
          className="cursor-pointer"
          onClick={() => router.push("/")}
          priority
        />
      </div>
      <div className="flex flex-1 justify-end px-2">
        {isSignedIn ? (
          <div className="flex items-center">
            <details className="dropdown dropdown-end">
              <summary className="btn m-1">
                <Bars3Icon className="h-8 w-8 cursor-pointer text-blue-600 sm:h-10 sm:w-10" />
              </summary>
              <ul className="menu dropdown-content rounded-box z-[1] w-52 bg-base-100 p-2 shadow">
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/history">History</Link>
                </li>

                <li>
                  <a
                    href="https://github.com/YoungMahesh/timers"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Source Code
                  </a>
                </li>
              </ul>
            </details>
            <UserButton afterSignOutUrl="/" />
          </div>
        ) : null}
      </div>
    </header>
  );
}
