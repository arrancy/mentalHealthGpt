import { RecoilRoot } from "recoil";
import { ChatListSection } from "../components/ChatListSection";
import { ChatSection } from "../components/ChatSection";
import { useEffect, useState } from "react";
import { amIAuthorized } from "../amIauthorized";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../components/Loadingspinner";
import { SidebarToggleButton } from "../components/SidebarToggleButton";
export function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const executeAmIAuthorized = async () => {
      try {
        const amIAuthenticated = await amIAuthorized();
        if (amIAuthenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          navigate("/signin");
        }
      } catch (error) {
        if (error instanceof Error) {
          setIsAuthenticated(false);
          navigate("/signin");
        } else {
          setIsAuthenticated(false);
          navigate("/signin");
        }
      }
    };
    executeAmIAuthorized();
  }, [navigate]);
  return isAuthenticated === null ? (
    <LoadingSpinner></LoadingSpinner>
  ) : isAuthenticated === true ? (
    <>
      <div className="flex justify-evenly h-screen w-screen">
        <RecoilRoot>
          <SidebarToggleButton></SidebarToggleButton>

          <ChatListSection></ChatListSection>
          <ChatSection></ChatSection>
        </RecoilRoot>
      </div>
    </>
  ) : isAuthenticated === false ? (
    <div>unauthorised</div>
  ) : (
    ""
  );
}
