import { MetaFunction } from "@remix-run/node";
import { Button } from "react-aria-components";

export const meta: MetaFunction = () => {
  return [{ title: "Sign in | Purity ✨" }];
};

export default function SignIn() {
  return (
    <div>
      <div>Sign In route</div>
      <Button className="btn btn-primary">Click me</Button>
    </div>
  );
}
