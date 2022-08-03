import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import ProgrammesList from "./pages/programmes/ProgrammesList";
import IndexPage from "./pages/IndexPage";
import RequireAuth from "./components/RequireAuth";
import ProgrammeView from "./pages/programmes/ProgrammeView";
import PlansList from "./pages/plans/PlansList";
import PlanView from "./pages/plans/PlanView";

const App = () => {
  return (
    <Layout>
      <RequireAuth>
        <Routes>
          <Route path="/" element={<IndexPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>

          <Route path="/programmes" element={<ProgrammesList/>}/>
          <Route path="/programmes/:programmeId" element={<ProgrammeView />}/>

          <Route path="/plans" element={<PlansList/>}/>
          <Route path="/plans/:planId" element={<PlanView />}/>
        </Routes>
      </RequireAuth>
    </Layout>
  );
};

export default App;
