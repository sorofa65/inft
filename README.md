# INFT Site

## Netlify (main)
1. Repo/folder Netlify-te deploy korun. `netlify.toml` already ache: build = `npm run build`, publish = `dist`.
2. Env vars: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, ADMIN_PASSWORD.
3. Build-e `build.mjs` cholbe: site -> `dist/`, npm lib `@imgly/background-removal` bundle (`dist/assets/bg.js`) ar model file `dist/assets/bg-data/` (nijer host theke, CDN lage na).
   Bundle fail hole card.html automatic CDN fallback use kore.
4. Local test: `npm install && npm run dev`.

NOTE: Netlify "drag & drop" deploy-e build cholena; Git ba `npx netlify deploy --build --prod` use korun.

## Cloudflare Pages (alternative)
Build command `npm run build`, output dir `dist`. `functions/api/*` use hoy. Variables: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID.

## Telegram
@BotFather -> /newbot -> token. Bot-ke message pathan, `https://api.telegram.org/bot<TOKEN>/getUpdates` theke chat id nin.

Editor: /editor.html (admin only).

## Photo upload (home page -> Telegram channel)
- Visitor 📷 section-e ৫টি পর্যন্ত ছবি দেয়, নাম ঐচ্ছিক। ছবি browser-এই ছোট (max 1920px) হয়ে `/api/photo`-তে যায়, সেখান থেকে Telegram-এ।
- Channel-এ পাঠাতে: bot-কে channel-এর **Admin** বানান (Post messages permission)।
  Env var `TELEGRAM_PHOTO_CHAT_ID` = channel id (যেমন `-100xxxxxxxxxx`) বা public channel হলে `@channelusername`.
  না দিলে `TELEGRAM_CHAT_ID`-তে যাবে (registration-এর জায়গায়)।
- Netlify body limit ~6MB, তাই client মোট ~5MB-এর মধ্যে রাখে।
