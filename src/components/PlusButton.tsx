import { PlusIcon } from "@heroicons/react/24/solid";
import { useAuth } from "@clerk/nextjs";

const PlusButton = () => {
  const { isSignedIn } = useAuth();

  return (
    <div>
      {isSignedIn ? (
        <div className="fixed bottom-5 right-5 md:bottom-16 md:right-16 lg:bottom-20 lg:right-20">
          <label htmlFor="my-drawer-4">
            <PlusIcon className="h-8 w-8 cursor-pointer text-blue-600 sm:h-10 sm:w-10" />
          </label>
        </div>
      ) : null}
    </div>
  );
};

export default PlusButton;
