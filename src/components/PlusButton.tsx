import { useSession } from "next-auth/react";
import { PlusIcon } from "@heroicons/react/24/solid";

const PlusButton = () => {
  const { data } = useSession();

  return (
    <div>
      {data?.user ? (
        <div className="fixed right-5 bottom-5 md:right-16 md:bottom-16 lg:right-20 lg:bottom-20">
          <label htmlFor="my-drawer-4">
            <PlusIcon className="h-8 w-8 cursor-pointer text-blue-600 sm:h-10 sm:w-10" />
          </label>
        </div>
      ) : null}
    </div>
  );
};

export default PlusButton;
