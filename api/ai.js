export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  var apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing GROQ_API_KEY" });
  }

  var prompt = (req.body && req.body.prompt) || "";
  var tokens = (req.body && req.body.tokens) || 1500;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Invalid prompt" });
  }

  var maxTokens = Number(tokens);
  if (!Number.isFinite(maxTokens) || maxTokens <= 0) {
    maxTokens = 1500;
  }
  maxTokens = Math.min(Math.floor(maxTokens), 4000);

  var model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  try {
    var upstream = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + apiKey,
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: "user", content: prompt }],
          max_tokens: maxTokens,
          temperature: 0.4,
        }),
      },
    );

    var payload = await upstream.json().catch(function () {
      return {};
    });

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: "Groq request failed",
        details: payload,
      });
    }

    var choice = payload && payload.choices && payload.choices[0];
    var content = choice && choice.message && choice.message.content;

    var text = "";
    if (typeof content === "string") {
      text = content;
    } else if (Array.isArray(content)) {
      text = content
        .map(function (part) {
          return part && typeof part.text === "string" ? part.text : "";
        })
        .join("");
    }

    return res.status(200).json({ text: text });
  } catch (error) {
    return res.status(500).json({
      error: "Server error while calling Groq",
      details: error && error.message ? error.message : String(error),
    });
  }
}
