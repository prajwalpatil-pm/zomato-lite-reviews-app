# Going live

The app is built, committed to git (branch `main`), and the build passes. What's
left creates resources under **your** GitHub and Vercel accounts, so you run these
steps with your own tokens. In this Claude Code session you can prefix any command
with `!` to run it, e.g. `! git push -u origin main`.

Your tokens are in the learner-guide doc:
- **GitHub PAT** (starts `github_pat_...`)
- **Vercel token** (starts `vcp_...`)
- **Neon `DATABASE_URL`** (starts `postgresql://...`) — already in your local `.env`

---

## Path A — GitHub + Vercel (matches the guide)

**1. Create an empty GitHub repo.** On github.com: **New repository** → name it
`zomato-lite` → **Private** → do **not** add a README/.gitignore → Create.

**2. Push your code.** From the project folder:
```bash
cd /c/Users/prajwal.patil/claude/zomato-lite
git remote add origin https://github.com/<your-username>/zomato-lite.git
git push -u origin main
```
When git asks for a password, paste your **GitHub PAT** (not your account password).

**3. Import into Vercel.** Go to https://vercel.com/new → import the `zomato-lite`
repo. Framework auto-detects as Next.js.

**4. Add the database secret _before_ deploying.** In the import screen, open
**Environment Variables** and add:
- Name: `DATABASE_URL`
- Value: the exact string from your local `.env`

> If you skip step 4, the build still succeeds and the site still breaks at runtime
> with a "DATABASE_URL is not set" error. Everyone hits this once — it's the lesson,
> not a failure.

**5. Deploy.** Click **Deploy**, wait for the build, then open the URL on your phone.

---

## Path B — Vercel CLI only (fastest, no GitHub)

From the project folder, substituting your Vercel token:
```bash
cd /c/Users/prajwal.patil/claude/zomato-lite

# link (creates a Vercel project named "zomato-lite")
npx vercel link --yes --token=YOUR_VERCEL_TOKEN

# add the DB secret for production (paste the Neon URL when prompted)
npx vercel env add DATABASE_URL production --token=YOUR_VERCEL_TOKEN

# deploy to production
npx vercel deploy --prod --yes --token=YOUR_VERCEL_TOKEN
```
The last command prints your live URL.

---

## Prove it's real (break it on purpose, against production)

```bash
curl -X POST https://<your-live-url>/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"restaurantId":1,"rating":500,"comment":"hacked"}'
# -> 400 {"error":"Rating must be a whole number between 1 and 5."}
```
No star was clicked, no button pressed — and the backend still refuses it. That's why
the star picker was never protection on its own.
