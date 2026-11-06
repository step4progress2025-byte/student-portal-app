# iPhone app (iOS)

The iPhone app is built on GitHub on a Mac runner. Android and iPhone both wrap the same portal and pull the newest `index.html` (and the premium mock audio) from the `student-portal` repo on every build.

## 1. Check it compiles (free, no Apple account)
Actions > "iOS build" > Run workflow > mode `simulator`. Download `ios-simulator-app` (only runs in Xcode's simulator on a Mac; it cannot be installed on a real iPhone).

## 2. Real iPhones (needs Apple Developer Program, $99/year)
1. developer.apple.com: enroll, then create the App ID `com.step4progress.ascend` (enable In-App Purchase).
2. Create an **Apple Distribution** certificate, export as .p12 with a password.
3. Create an **App Store** provisioning profile for that App ID and certificate.
4. appstoreconnect.apple.com: create the app "Step4Progress Ascend" (bundle ID above). Users and Access > Integrations > create an API key (App Manager), download the .p8.
5. RevenueCat: add an **iOS app**, copy the `appl_` public key; create the same four products in App Store Connect (`s4p_continue`, `s4p_starter`, `s4p_plus`, `s4p_pro`).
6. GitHub secrets (repo settings > Secrets > Actions), base64 on one line (`base64 -w0 file`):
   `IOS_CERT_P12_BASE64`, `IOS_CERT_PASSWORD`, `IOS_PROFILE_BASE64`, `APPLE_TEAM_ID`, `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_P8_BASE64`, `RC_IOS_KEY`.
7. Actions > "iOS build" > mode `testflight`, build number 1 (raise each upload). Then add testers in TestFlight.

Note: Apple rejects apps that only wrap a website unless they feel like an app; the in-app purchases (Apple billing, required for plans) and Spark voice help here. Not yet tested on a real device.
