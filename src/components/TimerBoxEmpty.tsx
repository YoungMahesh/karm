export default function TimerBoxEmpty() {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">0</h2>
        <p>You don&apos;t have have timers currently !</p>
        <div className="card-actions justify-end">
          <label
            htmlFor="my-drawer-4"
            className="btn-primary btn cursor-pointer"
          >
            Create
          </label>
        </div>
      </div>
    </div>
  );
}
