import { BigHeading } from "../components/BigHeading";
import { FullHeading } from "../components/FullHeading";
import { InputField } from "../components/InputField";
import { OauthButton } from "../components/OauthButton";
import { SubHeading } from "../components/SubHeading";
import { Button } from "../components/Button";
import { useEffect, useState } from "react";
import { BottomHeading } from "../components/BottomHeading";
import { CenteringWrapper } from "../components/CenteringWrapper";
import { LoadingSpinner } from "../components/Loadingspinner";
import { useNavigate } from "react-router-dom";
import { ErrorMessage } from "../components/ErrorMessage";
import { amIAuthorized } from "../amIauthorized";

export interface SigninInput {
  email: string;
  password: string;
}

export function Signin() {
  const [signinInput, setSigninInput] = useState<SigninInput>({
    email: "",
    password: "",
  });
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
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
          setErrorMessage(error.message);
          setTimeout(() => {
            setErrorMessage("");
          }, 3000);
        } else {
          setErrorMessage("unknown error occured");
          setTimeout(() => {
            setErrorMessage("");
          }, 3000);
        }
      }
    };
    executeAmIAuthorized();
  }, [navigate]);

  return isAuthenticated === null ? (
    <div className="flex items-center justify-center">
      <LoadingSpinner></LoadingSpinner>
    </div>
  ) : isAuthenticated === false ? (
    <>
      <div className="flex items-center justify-center h-screen w-screen ">
        <div
          style={{ backgroundColor: "#E1FFFF" }}
          className="border rounded-lg shadow-lg text-sky-900 p-6 "
        >
          <FullHeading>
            <BigHeading label="Sign In"></BigHeading>
            <SubHeading label="log in into your account"></SubHeading>
          </FullHeading>
          <InputField
            label="username"
            inputType="text"
            onChange={(event) => {
              setSigninInput({ ...signinInput, email: event.target.value });
            }}
          ></InputField>
          <InputField
            label="password"
            inputType="password"
            onChange={(event) => {
              setSigninInput({ ...signinInput, password: event.target.value });
            }}
          ></InputField>

          <CenteringWrapper>
            <Button
              label={isWaiting ? <LoadingSpinner></LoadingSpinner> : "sign in"}
              onClick={async () => {
                if (!(signinInput.email || signinInput.password)) {
                  return setErrorMessage("incomplete information");
                }
                setIsWaiting(true);
                try {
                  const requestBody = JSON.stringify(signinInput);
                  const response = await fetch(
                    "https://api.helpmymind.tech/user/signin",
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
              label="sign up"
              redirectPage="signup"
            ></BottomHeading>
          </CenteringWrapper>
          <CenteringWrapper>
            <ErrorMessage label={errorMessage}></ErrorMessage>
          </CenteringWrapper>
        </div>
      </div>
    </>
  ) : (
    ""
  );
}
