# Gaussian Splatting Research Seminar

A public meeting archive with a GitHub-backed editor.

## Publish

1. Commit and push the changes in this folder.
2. Open [repository Pages settings](https://github.com/GaussianSplats/GaussianSplats/settings/pages).
3. Under **Build and deployment**, select **Deploy from a branch**. Select `main` and `/(root)`, then **Save**.
4. Once GitHub finishes deploying, open [the website](https://gaussiansplats.github.io/GaussianSplats/).

The repository owner, name and branch are already set in `config.js`. The editor needs the following one-time sign-in setup.

## Enable the editor

1. Create a GitHub OAuth App in [GitHub Developer Settings](https://github.com/settings/developers):
   - **Application name:** Gaussian Splats Editor
   - **Homepage URL:** `https://gaussiansplats.github.io/GaussianSplats/`
   - **Authorization callback URL:** `https://gaussiansplats.github.io/GaussianSplats/editor.html`
2. Register the app. Copy its **Client ID** and generate a **Client secret**. Keep the secret private.
3. Create a free [Cloudflare account](https://dash.cloudflare.com/). Under **Workers & Pages**, create a Worker. Replace its code with the contents of `oauth-worker/worker.js` and deploy it.
4. In the Worker's **Settings → Variables and Secrets**, add:
   - `SITE_ORIGIN`: `https://gaussiansplats.github.io` (text)
   - `GITHUB_CLIENT_ID`: the Client ID from step 2 (text)
   - `GITHUB_CLIENT_SECRET`: the Client secret from step 2 (**secret**)
5. Deploy the Worker again if prompted. Copy its `https://…workers.dev` URL.
6. In `config.js`, set `githubClientId` to the Client ID and `oauthWorkerUrl` to the Worker URL. **Never put the client secret in the repository.** Commit and push the changes.
7. Give the other editor write access in [repository access settings](https://github.com/GaussianSplats/GaussianSplats/settings/access). Both editors can then open **Editor** on the site and sign in with GitHub.

The OAuth app requests `public_repo` access, which covers public repositories the signing-in account can write to. GitHub may ask for authorization or sign-in again when a session expires.

## Calendar and files

The editor can create a prefilled Google Calendar event. Choose the group calendar, add guests and save in Google Calendar. Changes do not sync automatically: update both the calendar and the website when a meeting changes.

Optionally, add the group's public calendar URL as `googleCalendarUrl` in `config.js`. Upload large recordings to Drive or another file host and add links in the editor. Set file permissions in that service; the public website cannot change them. Everything saved in this repository, including URLs and notes, is public.

## Local preview

Run `python3 -m http.server 8000` and open `http://localhost:8000/`. GitHub sign-in only works at the configured callback URL.
