# StudyForge

Have an A.I assistant help you acheive your goals. Just set your targeted result and let the A.I do its work on making sure you acheive that wanted mark!

## AI Backend (Groq via Vercel Serverless Function)

All AI requests are proxied through a Vercel serverless function at /api/ai.

The frontend never calls Groq directly and never stores the API key.

### Required environment variables

- GROQ_API_KEY: Your Groq API key (required)
- GROQ_MODEL: Groq model name (optional, defaults to llama-3.3-70b-versatile)

### Vercel setup

1. In your Vercel project settings, open Environment Variables.
2. Add GROQ_API_KEY with your Groq key value.
3. Optionally add GROQ_MODEL if you want a model other than the default.
4. Redeploy so the function picks up the variables.
