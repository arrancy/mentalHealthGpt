import { BigHeading } from "../components/BigHeading";
import { Button } from "../components/Button";
import { FullHeading } from "../components/FullHeading";
import { InputField } from "../components/InputField";
import { SubHeading } from "../components/SubHeading";
import { OauthButton } from "../components/OauthButton";
import { BottomHeading } from "../components/BottomHeading";
import { useEffect, useState } from "react";
import { CenteringWrapper } from "../components/CenteringWrapper";
import { LoadingSpinner } from "../components/Loadingspinner";
import { useNavigate } from "react-router-dom";
import { amIAuthorized } from "../amIauthorized";
interface SignupInput {
  email: string;
  password: string;
  name: string;
}
export function Signup() {
  const [signupInput, setSignupInput] = useState<SignupInput>({
    name: "",

    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const executeAmIAuthorized = async () => {
      try {
        const amIAuthenticated = await amIAuthorized();
        if (!amIAuthenticated) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
          navigate("/dashboard");
        }
      } catch (error) {
        if (error instanceof Error) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(false);
        }
      }
    };
    executeAmIAuthorized();
  }, [navigate]);

  return isAuthenticated === null ? (
    <LoadingSpinner></LoadingSpinner>
  ) : isAuthenticated === false ? (
    <>
      <div className="flex h-screen w-screen items-center justify-center">
        <div
          style={{ backgroundColor: "#E1FFFF" }}
          className="border rounded-lg shadow-lg text-sky-900 p-6"
        >
          <FullHeading>
            <BigHeading label="Sign Up"></BigHeading>
            <SubHeading label="create your account"></SubHeading>
          </FullHeading>
          <InputField
            label="email"
            inputType="text"
            onChange={(event) => {
              setSignupInput({ ...signupInput, email: event.target.value });
            }}
          ></InputField>
          <InputField
            label="password"
            inputType="password"
            onChange={(event) => {
              setSignupInput({ ...signupInput, password: event.target.value });
            }}
          ></InputField>
          <InputField
            label="name"
            inputType="text"
            onChange={(event) => {
              setSignupInput({ ...signupInput, name: event.target.value });
            }}
          ></InputField>
          <CenteringWrapper>
            <Button
              label={isWaiting ? <LoadingSpinner></LoadingSpinner> : "Sign Up"}
              onClick={async () => {
                setIsWaiting(true);
                try {
                  const requestBody = JSON.stringify(signupInput);
                  console.log(signupInput);
                  const response = await fetch(
                    "https://api.helpmymind.tech/user/signup",
                    {
                      method: "POST",
                      body: requestBody,
                      headers: {
                        "Content-Type": "application/json",
                      },
                    }
                  );

                  if (!response.ok) {
                    const data = await response.json();
                    setIsWaiting(false);

                    return setErrorMessage(data.msg);
                  }
                  const data = await response.json();
                  localStorage.setItem("jwt", data.token);
                  setIsWaiting(false);
                  return navigate("/dashboard");
                } catch (error) {
                  if (error instanceof Error) {
                    setIsWaiting(false);

                    setErrorMessage(error.message);
                  } else {
                    setIsWaiting(false);

                    setErrorMessage("an unknown error occured");
                  }
                }
              }}
            ></Button>
          </CenteringWrapper>
          <CenteringWrapper>
            <OauthButton></OauthButton>
          </CenteringWrapper>

          <CenteringWrapper>
            <BottomHeading
              label="Sign in"
              redirectPage="signin"
            ></BottomHeading>
          </CenteringWrapper>
          <div>{errorMessage}</div>
        </div>
      </div>
    </>
  ) : (
    ""
  );
}
