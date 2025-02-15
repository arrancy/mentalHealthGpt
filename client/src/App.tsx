import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { LandingPage } from "./pages/LandingPage";
import { Dashboard } from "./pages/Dashboard";
import { RecoilRoot } from "recoil";

function App() {
  return (
    <>
      <BrowserRouter>
        <RecoilRoot>
          <Routes>
            <Route path="/" element={<LandingPage></LandingPage>}></Route>
            <Route path="/signin" element={<Signin></Signin>}></Route>
            <Route path="/signup" element={<Signup></Signup>}></Route>
            <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
          </Routes>
        </RecoilRoot>
      </BrowserRouter>
    </>
  );
}

export default App;
