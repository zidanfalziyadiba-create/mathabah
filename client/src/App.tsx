import { useEffect } from "react";
import ServicePage from "./pages/ServicePage";
import Home from "./pages/Home";

const servicePaths = new Set([
  "/services/glass",
  "/services/interior-decor",
  "/services/woodwork",
  "/services/aluminum",
]);

function AnalyticsBeacon({ path, disabled }: { path: string; disabled: boolean }) {
  useEffect(() => {
    if (disabled) return;

    let sessionId = "";
    try {
      const stored = sessionStorage.getItem("mathabah_analytics_session_v1");
      sessionId = stored && /^[0-9a-f-]{36}$/i.test(stored) ? stored : crypto.randomUUID();
      sessionStorage.setItem("mathabah_analytics_session_v1", sessionId);
    } catch {
      sessionId = crypto.randomUUID();
    }

    const send = (event: "page_view" | "heartbeat", keepalive = false) => {
      if (event === "heartbeat" && document.visibilityState !== "visible") return;
      void fetch("/api/analytics/event", {
        method: "POST",
        credentials: "same-origin",
        keepalive,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event, sessionId }),
      }).catch(() => {});
    };

    send("page_view", true);
    const timer = window.setInterval(() => send("heartbeat"), 60_000);
    const onVisibility = () => {
      if (document.visibilityState === "visible") send("heartbeat");
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [disabled, path]);

  return null;
}

export default function App() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  const page = path === "/admin"
    ? <Home initialAdminOpen />
    : servicePaths.has(path)
      ? <ServicePage path={path} />
      : <Home />;

  return <><AnalyticsBeacon path={path} disabled={path === "/admin"} />{page}</>;
}
