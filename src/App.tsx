import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import ProgrammesList from "./pages/programmes/ProgrammesList";
import ProgrammePageLoader from "./pages/programmes/ProgrammePage";
import IndexPage from "./pages/IndexPage";
import RequireAuth from "./components/RequireAuth";


const App = () => {
  return (
    <Layout>
      <RequireAuth>
        <Routes>
          <Route path="/" element={<IndexPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/programmes" element={<ProgrammesList/>}/>
          <Route path="/programmes/:programmeId" element={<ProgrammePageLoader/>}/>
        </Routes>
      </RequireAuth>
    </Layout>
  );
};

export default App;
