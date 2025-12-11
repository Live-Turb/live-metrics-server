// api/metrics.js

let lastMetrics = null;

export default async function handler(req, res) {
  // CORS – permite que o AI Studio e a extensão chamem esse endpoint
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,X-API-Key");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Checagem simples de API Key (opcional, mas recomendado)
  const apiKey = process.env.METRICS_API_KEY;
  const headerKey = req.headers["x-api-key"];

  if (apiKey && headerKey !== apiKey) {
    res.status(401).json({ ok: false, error: "unauthorized" });
    return;
  }

  if (req.method === "POST") {
    // Extensão vai mandar as métricas aqui
    lastMetrics = {
      ...req.body,
      _serverReceivedAt: new Date().toISOString(),
    };
    res.status(200).json({ ok: true });
    return;
  }

  if (req.method === "GET") {
    // Sua plataforma (HUD) vai ler as métricas daqui
    if (!lastMetrics) {
      res.status(200).json({ ok: false, reason: "no_data" });
      return;
    }
    res.status(200).json(lastMetrics);
    return;
  }

  res.status(405).json({ ok: false, error: "method_not_allowed" });
}
