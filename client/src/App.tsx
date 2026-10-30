import ServicePage from "./pages/ServicePage";
import Home from "./pages/Home";

const servicePaths = new Set([
  "/services/glass",
  "/services/interior-decor",
  "/services/woodwork",
  "/services/aluminum",
]);

export default function App() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  if (servicePaths.has(path)) return <ServicePage path={path} />;
  return <Home initialAdminOpen={path === "/admin"} />;
}
