# INFT Site – Setup (Cloudflare Pages, free)
1. Telegram: @BotFather → /newbot → copy BOT TOKEN. Send any message to your bot, then open
   https://api.telegram.org/bot<TOKEN>/getUpdates → copy "chat":{"id":...} (CHAT ID). (For a group: add bot to group.)
2. Upload this folder to GitHub (or Cloudflare Pages → Upload assets).
3. Cloudflare Pages → Settings → Variables: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID.
4. Open /register.html → submit a test. Photo + PDF + team info arrive in Telegram with time and IP.
Editor: /editor.html (protect with Cloudflare Access so only admins can open it).
New template: add an entry to TPL in editor.html.

## Netlify (alternative)
Use `netlify/functions/*` + `netlify.toml`. Env vars: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, ADMIN_PASSWORD.
Local test: `npx netlify dev`.
