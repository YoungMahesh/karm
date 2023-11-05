import { SignUp } from "@clerk/nextjs";
import Layout from "~/components/Layout";

const SignUpPage = () => (
  <Layout title="Sign Up | Timers">
    <div className="mt-8 flex justify-center">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        afterSignUpUrl="/"
      />
    </div>
  </Layout>
);

export default SignUpPage;
