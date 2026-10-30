# Step4Progress Ascend: Android app (plus the web version)

The Android app is your student portal wrapped as a real app (Capacitor). The website keeps working as before. iPhone/App Store is left out for now; iPhone users use the website.

**What was and was not tested**
- Tested here: the changed portal (purchases, voice, back button, account deletion), the new server code and SQL.
- NOT possible here: compiling the app, or talking to Google or RevenueCat. The build runs on GitHub (free). The real purchase flow can only be proven with Google test accounts (Step 7).

## Quickest way to get an installable app (no accounts, no secrets)
1. Create the GitHub repo `student-portal-app` and upload the unzipped project (Step 2).
2. Actions tab > "Android test APK" > Run workflow. After ~5 minutes download `step4progress-test-apk` (a zip containing `app-debug.apk`).
3. Send the APK to an Android phone and open it (allow "install unknown apps" when asked).
It works like the real app (login, lessons, mocks, Spark voice). Buying plans is switched off in this test build.

## Costs
Google Play developer account $25 once. RevenueCat free until $2,500 monthly revenue, then 1%. Google commission 15% on the first $1M a year (small-business rate, check current terms), otherwise 30%. GitHub builds free.
Personal Play accounts made after Nov 2023 must run a **closed test with 12 testers for 14 days** before production. Start finding testers early.

## Step 1. Supabase (project jfrtleleblsphyztyhaf)
1. SQL editor: run `0025_store_billing_and_delete.sql` (and 0022, 0023, 0024 if not done).
2. Edge functions:
   - `store-webhook`: **Verify JWT OFF**. Secret `STORE_WEBHOOK_SECRET` = long random text (30+ characters). Keep a copy.
   - `delete-my-account`: Verify JWT ON.
   - Replace `send-custom-otp` and `verify-custom-otp` with the new files (Verify JWT stays OFF for these two).
3. Reviewer login (Google reviewers cannot receive SMS): secrets `REVIEW_PHONE` (digits only, a number you invent, e.g. `919999900000`) and `REVIEW_OTP` (6 digits). Give them only to Google, and delete both secrets after approval.

## Step 2. GitHub
- Repo `student-portal` (main): replace `index.html` with the new `student-portal-index.html`; add `privacy.html` and `terms.html` (from the `legal` folder). Check the contact email in them.
- New repo `student-portal-app`: upload the unzipped project (no node_modules). The workflow fetches the latest portal page from `student-portal` on every build (that repo must be public).

## Step 3. RevenueCat
1. Create project "Step4Progress Ascend", add an **Android app**, package `com.step4progress.ascend`. Copy the **public SDK key** (starts `goog_`).
2. Link a Google service-account JSON (RevenueCat's screens walk you through it).
3. Add products `s4p_continue`, `s4p_starter`, `s4p_plus`, `s4p_pro` (after creating them in Play, Step 4). No entitlements or offerings needed.
4. Integrations > Webhooks: URL `https://jfrtleleblsphyztyhaf.supabase.co/functions/v1/store-webhook`, Authorization header `Bearer <STORE_WEBHOOK_SECRET>`. Press "Send test".

## Step 4. Google Play Console
1. Create the app "Step4Progress Ascend": free, category Education.
2. Store listing (text below), screenshots, privacy policy URL (`https://step4progress2025-byte.github.io/student-portal/privacy.html`), and the Data safety form: collects phone number, name, app activity and user content (text answers); used for app functionality; encrypted in transit; account deletion available in the app (Profile > Delete my account) and at the privacy page.
3. Make the signing key and GitHub secrets (Step 6), run the Android workflow, upload the `.aab` to **Internal testing**; add your own account as a tester.
4. Monetise > In-app products: create 4 products, IDs exactly `s4p_continue`, `s4p_starter`, `s4p_plus`, `s4p_pro`, prices ₹99 / ₹200 / ₹500 / ₹1000. Activate them.
5. Personal account: closed test with 12 testers for 14 days, then apply for production.

## Step 5. (Apple: skipped for now.)

## Step 6. GitHub secrets (repo student-portal-app > Settings > Secrets and variables > Actions)
`RC_ANDROID_KEY`, `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`.
Make the signing key once (any computer with Java):
`keytool -genkeypair -v -keystore release.keystore -alias s4p -keyalg RSA -keysize 2048 -validity 10000`
then `base64 -w0 release.keystore` for the BASE64 secret. **Back up the keystore and passwords somewhere safe; losing them means you cannot update the app.** Keep Play App Signing enabled.
Run: Actions tab > "Android build" > Run workflow. Raise the version code every upload (1, 2, 3...).

## Step 7. Test purchases
Play Console > Settings > License testing: add your Google account. Install from the Internal testing link and buy a plan (no charge). Credits should appear in about 30 seconds and a row appears in `store_purchases`. If not, RevenueCat > Customer > Events shows whether the webhook was sent and the server's answer.

## Review notes to paste
> Step4Progress Ascend is an exam-preparation and study-abroad app. Lessons are free. Plans (one-time purchases of mock-test credits) are sold through Google Play billing. Sign in with a phone number and one-time code. For review, use phone <REVIEW_PHONE> and code <REVIEW_OTP>. Account deletion: Profile > Delete my account. The speaking partner uses the microphone for IELTS speaking practice; typing is always available. AI feedback is practice estimates, not official exam results.

## Listing text
**Name:** Step4Progress Ascend. **Short (80):** IELTS mocks, free lessons and an AI speaking partner for study abroad.
**Full:** Step4Progress Ascend helps you prepare for IELTS and for studying abroad. All lessons, vocabulary and practice are free. Try a full mock test free, then unlock more with simple one-time plans. Practise speaking with Spark, an AI partner that talks with you, corrects you and runs a full IELTS speaking exam. Get estimated bands for Writing and Speaking with clear feedback. Plan your visa and university applications with built-in guides. Scores and feedback are practice estimates, not official exam results.
**Screenshots:** 4-6 phone screenshots (dashboard, lesson, mock, Spark chat, results, plans), at least 1080x1920.

## Things to know
- Voice input uses the phone's own speech service (Google's, on nearly all phones). Test on two phones.
- Inside the app the "contact us to pay" flow is replaced by Play billing, as Google requires. The website still uses the manual flow.
- iPhone users: website only (voice input is weakest in Safari; typing works).
- Later: email OTP for UK/Pakistan/Bangladesh numbers, and a web payment gateway.
