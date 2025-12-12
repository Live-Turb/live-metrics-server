// api/metrics.js

let lastMetrics = null;

export default async function handler(req, res) {
  // CORS – permite que AI Studio, extensão e seu navegador acessem
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,X-API-Key");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // 🔴 Só checa API KEY para POST (extensão)
  const apiKey = process.env.METRICS_API_KEY;
  const headerKey = req.headers["x-api-key"];
  const isPost = req.method === "POST";

  if (isPost && apiKey && headerKey !== apiKey) {
    res.status(401).json({ ok: false, error: "unauthorized" });
    return;
  }

  if (req.method === "POST") {
    // Extensão manda as métricas pra cá
    lastMetrics = {
      ...req.body,
      _serverReceivedAt: new Date().toISOString(),
    };
    res.status(200).json({ ok: true });
    return;
  }

  if (req.method === "GET") {
    // HUD (e você no navegador) lê a última métrica salva
    if (!lastMetrics) {
      res.status(200).json({ ok: false, reason: "no_data" });
      return;
    }
    res.status(200).json(lastMetrics);
    return;
  }

  res.status(405).json({ ok: false, error: "method_not_allowed" });
}
