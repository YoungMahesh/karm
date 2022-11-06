import { useEffect, useState } from "react";
import { trpc } from "../utils/trpc";

export default function ProfileBox() {
  const { data, isLoading, refetch } = trpc.profile.getProfile.useQuery();
  const updateN = trpc.profile.updateName.useMutation();
  const deleteA = trpc.profile.deleteAccount.useMutation();
  const [name1, setName1] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (data && data.name) {
      setName1(data.name);
    }
  }, [data]);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p className="text-align">Failed to fetch data</p>;

  const updateName = async () => {
    console.log("updating name");
    setIsUpdating(true);
    await updateN.mutateAsync({ name: name1 });
    refetch();
    alert("updated name");
    setIsUpdating(false);
  };

  const deleteAccount = async () => {
    setIsDeleting(true);
    await deleteA.mutateAsync();
    setIsDeleting(false);
    alert("You account deleted successfully");
    window.location.href = "/";
  };

  return (
    <div className="mt-16 flex w-screen justify-center">
      <div className="form-control">
        <label className="input-group">
          <span>Name</span>
          <input
            type="text"
            placeholder="info@site.com"
            className="input-bordered input"
            value={name1}
            onChange={(e) => setName1(e.target.value)}
          />
        </label>
        <label className="input-group">
          <span>Email</span>
          <input
            type="text"
            className="input-bordered input"
            disabled
            value={data.email!}
          />
        </label>
        {isUpdating ? (
          <button className="loading btn" />
        ) : (
          <button onClick={updateName} className="btn">
            Update Profile
          </button>
        )}

        {isDeleting ? (
          <button className="btn-error loading btn mt-4" />
        ) : (
          <button className="btn-error btn mt-4" onClick={deleteAccount}>
            Delete Account
          </button>
        )}
      </div>
    </div>
  );
}
