interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const response = await env.ASSETS.fetch(request);
    const path = new URL(request.url).pathname.replace(/\/$/, "") || "/";
    const metadata: Record<string, { title: string; description: string }> = {
      "/services/glass": {
        title: "أعمال الزجاج والسيكوريت وكبائن الشاور في الرياض والسعودية",
        description: "تنفيذ الواجهات الزجاجية وزجاج السيكوريت، كبائن الشاور، قواطع الدبل جلاس، الدرابزينات وأعمال الاستركشر في الرياض.",
      },
      "/services/interior-decor": {
        title: "تصميم وتنفيذ الديكور الداخلي في الرياض | مؤسسة مثابة",
        description: "حلول الديكور الداخلي والخارجي للمنازل والمكاتب والمساحات التجارية في الرياض، من دراسة الاستخدام واختيار الخامات إلى التنفيذ.",
      },
      "/services/woodwork": {
        title: "أعمال النجارة والديكورات الخشبية في الرياض | مؤسسة مثابة",
        description: "تنفيذ أعمال النجارة والديكورات الخشبية والدواليب والكسوات والأثاث المخصص في الرياض.",
      },
      "/services/aluminum": {
        title: "أعمال الألمنيوم والواجهات الخارجية في الرياض | مؤسسة مثابة",
        description: "حلول الألمنيوم للنوافذ والأبواب والواجهات والتكسيات الخارجية والكلادينج في الرياض.",
      },
    };
    const service = metadata[path];
    if (!service || !response.headers.get("content-type")?.includes("text/html")) return response;
    const html = await response.text();
    const canonical = `https://mathabahksa.com${path}`;
    const updated = html
      .replace(/<title>[^<]*<\/title>/, `<title>${service.title}</title>`)
      .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${service.description}" />`)
      .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`)
      .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${service.title}" />`)
      .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${service.description}" />`)
      .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
      .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${service.title}" />`)
      .replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${service.description}" />`);
    return new Response(updated, { headers: response.headers });
  },
};
