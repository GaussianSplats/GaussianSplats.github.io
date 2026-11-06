# Gaussian Splatting Research Seminar

A static, responsive public archive with a GitHub-backed editor. All meeting data and links in this public repository are public. Upload recordings and transcripts to a service such as Google Drive and set sharing there; the website cannot change or enforce those permissions.

## What happens

- Add a meeting in the editor with its start, end and IANA time zone. The next unfinished meeting shows on the home page; after its end time it automatically becomes a past meeting. If none remains, the site says so. If the time changes, edit the record too.
- Search past meetings by paper, presenter or notes; filter by month or presenter. You can edit or delete any existing meeting in the editor.
- The editor's **Create Google Calendar event** opens a prefilled event; select the group calendar, add guests and save it in Google Calendar. It is a separate step and does not sync edits back to the site. A visitor's **Add to calendar** button creates their own copy, not an invitation. Add a group calendar URL in `config.js` if desired.
- The two editors sign in with GitHub; only repository writers can save. Sign-in lasts for the current browser tab; closing it signs you out locally. GitHub's authorization may remain active until revoked in GitHub settings. The editor uses GitHub's `public_repo` OAuth scope, which gives the OAuth app access to public repositories the authorizing user can write to, not only this repository. Use a GitHub App if you need repository-limited permissions.

## 1. Publish the site for free

1. Create a **public** repository named `reading-group` in your GitHub account or a free GitHub organization. Add the other editor as a collaborator, or grant them write access through the organization. They must accept the invitation.
2. Upload the contents of this folder, including `index.html`, `editor.html`, `data`, and all other files, to the repository's root on `main`. Do not upload a containing `seminar-site` folder instead.
3. In `config.js`, set `owner` to your GitHub username or organization, `repo` to `reading-group`, and `branch` to `main`. Leave the other fields empty until the steps below. Commit the changes.
4. In the repository go to **Settings → Pages → Build and deployment**. Select **Deploy from a branch**, choose `main` and `/(root)`, and save. When deployed, the address appears there: normally `https://OWNER.github.io/reading-group/`. The public archive works now, but editing needs the next steps.

## 2. Set up GitHub sign-in (one-time)

GitHub Pages is static and cannot exchange an OAuth code securely by itself. This setup uses GitHub and a small Cloudflare Worker. Both editors use their existing GitHub accounts; Cloudflare is used by the owner only to host the code exchange. The worker sends GitHub the temporary sign-in code and returns an access token to the editor; it does not store the token.

1. Note your exact site origin, for example `https://OWNER.github.io`, and editor URL, for example `https://OWNER.github.io/reading-group/editor.html`.
2. In GitHub open **Settings → Developer settings → OAuth Apps → New OAuth App**. Give it a name, use your site URL as Homepage URL, and set **Authorization callback URL** to your exact editor URL. Register it, note its Client ID, and generate a client secret. Keep the secret private; never commit it to GitHub. The OAuth app can be owned by your account or an organization.
3. Create a free Cloudflare account, open **Workers & Pages**, create a Worker, and deploy any starter. Open the Worker editor and replace its code with `oauth-worker/worker.js`; deploy it.
4. Under the Worker's **Settings → Variables and Secrets**, add text variables `SITE_ORIGIN` (e.g. `https://OWNER.github.io`, no trailing slash) and `GITHUB_CLIENT_ID` (the Client ID). Add `GITHUB_CLIENT_SECRET` as a **secret**, containing the GitHub client secret. Deploy/redeploy as prompted. Copy the Worker URL, `https://...workers.dev`.
5. In your GitHub repository edit `config.js`: set `githubClientId` and `oauthWorkerUrl` to those values. Commit. After Pages updates, open **Editor**, choose **Continue with GitHub**, and authorize the app. The other editor must do the same once and have repository write access. They can then add and edit meetings.

GitHub may ask for authentication or authorization again when sessions expire. If saving reports a conflict, reload the editor, sign in if needed, and reapply the change; this avoids silently overwriting another editor's work.

## 3. Google Calendar and files

Create a dedicated Google Calendar and choose its sharing settings. If you want all visitors to open it, make that calendar public and copy its public URL from **Settings and sharing → Integrate calendar** into `googleCalendarUrl` in `config.js`. Do not make a personal calendar public accidentally. Editors can create the event via the editor's button, choose this calendar, and invite people there. The meeting list on this website is edited separately: Google Calendar changes do not sync to the site.

Store large videos outside GitHub. If you want public playback, set the file's sharing to allow public viewing. For a restricted file, set its sharing in Drive and give viewers access there. A public link on this website may reveal the file URL even when the file itself is restricted.

## Local preview

Run `python3 -m http.server 8000` in this directory and visit `http://localhost:8000/`. The public archive works locally. GitHub OAuth is tied to the configured callback URL and should be tested on the deployed site. No package installation or build is needed.
