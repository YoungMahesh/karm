import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import logo from "../../public/logo.svg";
import { Bars3Icon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";

export default function Header() {
  const { isSignedIn, userId } = useAuth();

  const profile = trpc.profile.get.useQuery();
  const router = useRouter();

  return (
    <header className="navbar ">
      <div className="flex-1 px-2 lg:flex-none">
        <Image
          src={logo}
          width={50}
          alt="Timers"
          className="cursor-pointer"
          onClick={() => router.push("/")}
          priority
        />
      </div>
      <div className="flex flex-1 justify-end px-2">
        <div className="flex items-stretch">
          {isSignedIn ? (
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
          ) : null}

          {isSignedIn ? <UserButton /> : null}
        </div>
      </div>
    </header>
  );
}
