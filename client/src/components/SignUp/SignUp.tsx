import { useMutation } from "@tanstack/react-query";
import { SignUpMutationOutput, ErrorMessage } from "./types.js";
import { Button } from "../ui/button.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { googleAuth, userSignUp } from "./SignUpApi.js";
import { GoogleLogin } from "@react-oauth/google";
import { Input } from "../ui/input.js";
import { Label } from "../ui/label.js";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const [validated, setValidated] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: userSignUp,
    networkMode: "always",
    onSuccess: (data: SignUpMutationOutput) => {
      localStorage.setItem("token", data.signup.token);
      localStorage.setItem("userId", data.signup.id);
      navigate("/project");
    },
    onError: (error: ErrorMessage) => {
      if (error.response.errors[0].extensions.code === 422) {
        setError(error.response.errors[0].message);
      } else {
        setError("Network Error");
      }
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: googleAuth,
    onSuccess: (data) => {
      localStorage.setItem("token", data.loginWithGoogle.token);
      localStorage.setItem("userId", data.loginWithGoogle.id);
      navigate("/project");
    },
    onError: (error: ErrorMessage) => {
      if (error.response.errors[0].extensions.code === 422) {
        setError(error.response.errors[0].message);
      } else {
        setError("Network Error");
      }
    },
  });

  return (
    <>
      <div className="container flex justify-center mt-9">
        <form
          onSubmit={(e) => {
            //setValidated(true);
            e.preventDefault();

            mutation.mutate({ name: name, email: email, password: password });
          }}
          className="flex flex-col  w-96 border border-gray-200 rounded-md shadow-md p-4"
        >
          <h1 className="  text-5xl text-bold mb-7 flex justify-center">
            Signup
          </h1>
          <p>{mutation.isError ? error : " "}</p>
          <div className=" mb-5">
            <Label className="  block mb-2 text-lg">Name</Label>
            <Input
              required
              type="text"
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div className=" mb-5">
            <Label className="  block mb-2 text-lg">Email address</Label>
            <Input
              required
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className=" mb-5">
            <Label className="  block mb-2 text-lg">Password</Label>
            <Input
              required
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <Button
            variant="default"
            type="submit"
            className="mb-5"
            disabled={mutation.isLoading}
          >
            Submit
          </Button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <GoogleLogin
              theme="filled_black"
              onSuccess={(response) => {
                const token = response.credential || "";
                googleLoginMutation.mutate(token);
              }}
            ></GoogleLogin>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignUp;
