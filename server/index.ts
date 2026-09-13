import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://mathabahksa.com/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://mathabahksa.com/services/glass</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://mathabahksa.com/services/interior-decor</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://mathabahksa.com/services/woodwork</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://mathabahksa.com/services/aluminum</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
</urlset>`;

async function startServer() {
  const app = express();
  const server = createServer(app);

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.disable("x-powered-by");

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.get("/sitemap.xml", (_req, res) => {
    res.type("application/xml").set("Cache-Control", "public, max-age=3600").send(sitemap);
  });

  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain").set("Cache-Control", "public, max-age=3600").send(
      "User-agent: *\nAllow: /\nSitemap: https://mathabahksa.com/sitemap.xml\n",
    );
  });

  app.use(
    express.static(staticPath, {
      setHeaders: (res, filePath) => {
        if (filePath.includes(`${path.sep}assets${path.sep}`) || /\.(?:css|js|woff2?|png|jpe?g|webp|avif|svg|ico)$/i.test(filePath)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      },
    }),
  );

  app.get("*", (_req, res) => {
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = Number(process.env.PORT) || 3000;

  server.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${port}/`);
  });
}

startServer().catch(console.error);
