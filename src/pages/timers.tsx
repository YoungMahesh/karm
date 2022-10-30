import AuthShowcase from "../components/AuthShowcase";
import CreateTimer from "../components/CreateTimer";
import TimersList from "../components/TimersList";

export default function Timers() {
  return (
    <>
      <AuthShowcase />

      <TimersList />
      <CreateTimer />
    </>
  );
}
