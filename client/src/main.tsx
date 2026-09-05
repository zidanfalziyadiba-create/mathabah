import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Analytics is optional. Builds without these variables must remain clean and
// must not request a literal "%VITE_*%" placeholder URL.
const analyticsEndpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT?.replace(/\/+$/, "");
const analyticsWebsiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;
if (analyticsEndpoint && analyticsWebsiteId) {
  const analyticsScript = document.createElement("script");
  analyticsScript.defer = true;
  analyticsScript.src = `${analyticsEndpoint}/umami`;
  analyticsScript.dataset.websiteId = analyticsWebsiteId;
  document.head.appendChild(analyticsScript);
}

createRoot(document.getElementById("root")!).render(<App />);
