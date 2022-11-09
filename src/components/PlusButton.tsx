import { useSession } from "next-auth/react";

const PlusButton = () => {
  const { data } = useSession();

  return (
    <div>
      {data?.user ? (
        <div className="fixed right-5 bottom-5 md:right-16 md:bottom-16 lg:right-20 lg:bottom-20">
          <label
            htmlFor="my-drawer-4"
            className="drawer-button btn-primary btn text-3xl"
          >
            +
          </label>
        </div>
      ) : null}
    </div>
  );
};

export default PlusButton;
