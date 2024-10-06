import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import LearnAbout from "./Pages/Learn About";
import Project from "./Pages/Project";

function AppRoutes() {
  return (
    <BrowserRouter basename="/orrery-nasa">
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/LearnAbout" element={<LearnAbout />}>
          {" "}
        </Route>
        <Route path="/Project" element={<Project />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
export default AppRoutes;
