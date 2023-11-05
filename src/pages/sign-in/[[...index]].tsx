import { SignIn } from "@clerk/nextjs";
import Layout from "~/components/Layout";

const SignInPage = () => (
  <Layout title="Sign In | Timers">
    <div className="mt-8 flex justify-center">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        afterSignInUrl="/"
      />
    </div>
  </Layout>
);

export default SignInPage;
