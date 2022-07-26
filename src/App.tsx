import "firebaseui/dist/firebaseui.css";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import { useAuth } from "./firebase/config";
import MetadataPage from "./metadata/MetadataPage";
import CoursesPage from "./pages/CoursesPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn && location.pathname !== "/login") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const App = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Layout loggedIn={isLoggedIn}>
      <RequireAuth>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/metadata" element={<MetadataPage />} />
          <Route path="/courses" element={<CoursesPage />} />
        </Routes>
      </RequireAuth>
    </Layout>
  );

  /*
  if (!isLoggedIn) {
    return (
      <Layout>
        <LoginPage />
      </Layout>
    );
  }

  return (
    <Flex direction="column">
      <Header loggedIn />
      <Container maxW="container.md">
        <MetadataPage />
      </Container>
    </Flex> 
  );*/
};

export default App;
