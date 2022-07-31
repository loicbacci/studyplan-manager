import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import ProgrammesList from "./pages/programmes/ProgrammesList";
import IndexPage from "./pages/IndexPage";
import RequireAuth from "./components/RequireAuth";
import MajorsList from "./pages/majors/MajorsList";
import MinorsList from "./pages/minors/MinorsList";
import ProgrammeView from "./pages/programmes/ProgrammeView";
import CategoriesList from "./pages/categories/CategoriesList";

const App = () => {
  return (
    <Layout>
      <RequireAuth>
        <Routes>
          <Route path="/" element={<IndexPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>

          <Route path="/programmes" element={<ProgrammesList/>}/>
          <Route path="/programmes/:programmeId" element={<ProgrammeView />}/>
        </Routes>
      </RequireAuth>
    </Layout>
  );
};

export default App;
