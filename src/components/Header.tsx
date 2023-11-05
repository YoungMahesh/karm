/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useAuth, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Bars3Icon } from "@heroicons/react/24/solid";
// import logo from "../../public/logo.svg";

export default function Header() {
  const { isSignedIn } = useAuth();

  const router = useRouter();

  return (
    <header className="navbar ">
      <div className="flex-1 px-2 lg:flex-none">
        <Image
          src={'/logo.svg'}
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
            <div className="dropdown-end dropdown">
              <label tabIndex={0} className="btn-ghost rounded-btn btn">
                <Bars3Icon className="h-8 w-8 cursor-pointer text-blue-600 sm:h-10 sm:w-10" />
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu rounded-box mt-4 w-52 bg-base-100 p-2 shadow"
              >
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
            </div>
            <UserButton />
          </div>
        ) : null}
      </div>
    </header>
  );
}
