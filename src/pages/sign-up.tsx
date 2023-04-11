import { SignUp } from "@clerk/nextjs";
import Layout from "../components/Layout";

const SignUpPage = () => (
  <Layout title="Timers">
    <div className="mt-8 flex justify-center">
      <SignUp path="/sign-up" routing="path" signInUrl="/" />
    </div>
  </Layout>
);

export default SignUpPage;
