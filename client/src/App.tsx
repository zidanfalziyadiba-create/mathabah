import ServicePage from "./pages/ServicePage";
import Home from "./pages/Home";

const servicePaths = new Set([
  "/services/glass",
  "/services/interior-decor",
  "/services/woodwork",
  "/services/aluminum",
  "/services/stone-marble",
]);

export default function App() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  return servicePaths.has(path) ? <ServicePage path={path} /> : <Home />;
}
