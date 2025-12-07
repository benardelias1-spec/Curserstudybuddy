# Aura Build Public API & Component Reference

_Last verified: 07 Dec 2025. Source data extracted from https://www.aura.build and its shipped SPA bundle (`/assets/index-DEv0E2eT.js`)._

## 1. Platform Overview
- Aura Build is an AI landing-page builder that lets users generate, edit, and export responsive sites without coding. The SPA surfaces tooling for prompt-based layout generation, template browsing, newsletter automation, billing, and media asset management.
- The production frontend is hosted on Netlify and talks to a Supabase backend (`hoirqrkdgbmvpwutwuwj.supabase.co`) plus third-party APIs (Stripe, Unsplash, Figma, Iconify, etc.).
- All authenticated calls rely on Supabase auth sessions managed in-browser (`Ve.auth.getSession()` inside the bundle). Keep Supabase access tokens short-lived (~1 hr) and refresh before calling protected endpoints.

## 2. Authentication & Session Handling
- **Supabase session retrieval**: `const { data: { session } } = await supabase.auth.getSession();`
- **Authorization header**: `Authorization: Bearer <session.access_token>` is required for every protected Aura Edge Function (newsletter + billing). Missing/expired tokens raise `authentication_error` which the UI maps to “Please sign in again to continue with checkout.”
- **Attribution data helper** `Knt(searchParams)` persists referral / UTM codes and is passed through billing payloads so downstream automations can tag purchases correctly.

## 3. Billing & Payment APIs (Stripe via Supabase Edge Functions)
| Endpoint | Purpose | Auth | Happy-path response |
| --- | --- | --- | --- |
| `POST /functions/v1//stripe-create-checkout` | Create a subscription checkout session based on plan + interval. | Supabase session token | `{ url: "https://checkout.stripe.com/..." }` |
| `POST /functions/v1//stripe-create-payment-checkout` | Create a one-time credit/top-up checkout for predefined packs. | Supabase session token | `{ url: "https://checkout.stripe.com/..." }` |
| `POST /functions/v1//stripe-create-portal` | Generate a Stripe customer portal URL so users can manage subscriptions. | Supabase session token | `{ url: "https://billing.stripe.com/..." }` |
| `POST /functions/v1//stripe-get-session` | Look up a checkout session after redirect success to confirm payment state, plan, amount, etc. | Supabase session token | `CheckoutSession` JSON from Stripe |

### 3.1 Subscription Checkout (`stripe-create-checkout`)
- **Request body** (see `ln.BILLING.SUBSCRIPTION_CHECKOUT_STARTED` analytics payload):
  ```json
  {
    "userId": "uuid",
    "lookupKey": "<plan>_<interval>",
    "successUrl": "https://www.aura.build/payment/success?session_id={CHECKOUT_SESSION_ID}",
    "cancelUrl": "https://www.aura.build/pricing?checkout=canceled",
    "promoCode": "optional",
    "coupon": "optional",
    "attributionData": {
      "referral_code": "...",
      "utm_source": "...",
      "coupon_code": "..."
    }
  }
  ```
- **Behavior**: UI caches `checkout_data` in `sessionStorage` (plan, interval, amount, attribution) so the `/payment/success` page can restore context after Stripe redirect.
- **Errors**: The helper `Jat(error)` maps Stripe / backend codes to user-friendly text (e.g., `subscription_active_error`, `price_not_found_error`, `internal_server_error`). Bubble these up to your UX to stay consistent with aura.build messaging.
- **Example**:
  ```bash
  curl -X POST \
    https://hoirqrkdgbmvpwutwuwj.supabase.co/functions/v1//stripe-create-checkout \
    -H "Authorization: Bearer $SUPABASE_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "userId": "2a8a...",
      "lookupKey": "pro_monthly",
      "successUrl": "https://www.aura.build/payment/success?session_id={CHECKOUT_SESSION_ID}",
      "cancelUrl": "https://www.aura.build/pricing?checkout=canceled",
      "promoCode": null,
      "coupon": null,
      "attributionData": {"utm_source": "pricing_page"}
    }'
  ```

### 3.2 One-time Purchase Checkout (`stripe-create-payment-checkout`)
- **Use cases**: Purchasing additional AI credits or downloadable items exposed on `/pricing` or in-editor upgrade modals.
- **Request body**:
  ```json
  {
    "userId": "uuid",
    "items": [
      { "lookupKey": "200_credits", "type": "credits", "units": 200 }
    ],
    "successUrl": "https://www.aura.build/payment/success?session_id={CHECKOUT_SESSION_ID}",
    "cancelUrl": "https://www.aura.build/pricing?checkout=canceled",
    "couponCode": null,
    "attributionData": {"source": "credits_modal"}
  }
  ```
- **Response**: `{ "url": "https://checkout.stripe.com/pay/cs_test_..." }`.
- **Failure analytics**: Emits `ln.BILLING.PURCHASE_CHECKOUT_FAILED` with `error_code` so product analytics stay aligned.

### 3.3 Customer Portal (`stripe-create-portal`)
- Inputs: `{ "returnUrl": "https://www.aura.build/account/billing" }`.
- Returns Stripe-hosted customer-portal URL. Used behind the “Manage subscription” button in profile settings.

### 3.4 Checkout Session Retrieval (`stripe-get-session`)
- Call immediately after redirect success, passing `{ "sessionId": "cs_test_a1b2" }`.
- Response contains subscription or payment status; UI uses this to show receipt details and unlock entitlements.

## 4. Newsletter Automation APIs
| Endpoint | Description | Auth |
| --- | --- | --- |
| `GET /functions/v1//newsletter-get-automation-sequences` | Returns active onboarding/pro-upgrade sequences with attached template metadata. | Supabase session |
| `GET/POST/PUT/DELETE /functions/v1//newsletter-templates-manager` | CRUD for newsletter templates (HTML, category, active status). | Supabase session |
| `POST /functions/v1//newsletter-update-automation-sequence` | Re-point a sequence step to a different template with the correct delay window. | Supabase session |

### 4.1 Automation Sequences (`newsletter-get-automation-sequences`)
- Response shape (simplified):
  ```json
  {
    "sequences": [
      {
        "id": "uuid",
        "trigger_event": "new_signup",
        "sequence_data": [
          { "delay_hours": 0, "template_name": "welcome_immediate" },
          { "delay_hours": 72, "template_name": "day_3_tips" }
        ]
      }
    ]
  }
  ```
- Frontend maps these to the five predefined steps exposed in the UI (`I8e` array) so marketing can see coverage for: Welcome, Day 3 Tips, Day 7 Features, Day 28 Check-in, and Pro Upgrade Welcome.

### 4.2 Template Manager (`newsletter-templates-manager`)
- **GET**: Returns `{ count, templates: [ { id, name, subject, html_template, category, is_active, created_at, created_by } ] }`.
- **POST**: Create/duplicate via `{ "template": { name, subject, html_template, category, description, is_active, created_by } }`.
- **PUT**: Update existing template by sending `{ "template": { ...fields, id } }`.
- **DELETE**: `{ "id": "template_id" }` removes the template and closes any preview modal currently opened in the UI.
- Required fields validated client-side: `name`, `subject`, `html_template`. Errors bubble through toast notifications like “Failed to create template”.

### 4.3 Updating Automation Steps (`newsletter-update-automation-sequence`)
- Request body:`{ "sequence_id": "uuid", "step_delay_hours": 72, "new_template_name": "Day 3 Feature Highlights" }`.
- Delay-hour guardrails are hard-coded per step (0, 72, 168, 672) to keep spacing consistent with the UX copy shown on aura.build/learn.
- Success updates the local `I8e` map so the UI instantly shows the newly assigned template card.

## 5. Asset Intelligence API (`auto-fill-asset-metadata`)
- **Endpoint**: `POST https://hoirqrkdgbmvpwutwuwj.supabase.co/functions/v1/auto-fill-asset-metadata`
- **Auth**: Uses the published Supabase anon key embedded in the SPA (`Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`).
- **Payload**:
  ```json
  {
    "imageData": "data:image/jpeg;base64,..." ,
    "mimeType": "image/jpeg"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "metadata": {
      "title": "Minimalist workspace",
      "description": "Curated copy",
      "keywords": ["workspace", "pastel"],
      "suggestedResolution": "16:9",
      "colors": ["#0E1116", "#F4F4F5"]
    }
  }
  ```
- Typical flow (as seen in the asset uploader component):
  1. User drags images into the editor (`cr` loop).
  2. Frontend compresses the file (`kt(file)`).
  3. Calls `auto-fill-asset-metadata` for AI tags.
  4. Uploads the original assets to Supabase Storage (`/storage/v1/object/public/assets/...`).
  5. Saves an asset record combining AI metadata and upload response.

## 6. External Content & Design Integrations
| Service | Endpoint(s) | Usage in aura.build |
| --- | --- | --- |
| **Iconify** | `https://api.iconify.design/collection?prefix=<set>`, `.../solar/<icon>.svg`, `.../logos/<slug>.svg`, `.../circle-flags/<code>.svg` | Fetch icon lists during component editing, cache SVG text in-memory for preview, and support themed icon pickers. Function `Yze(prefix)` deduplicates and sorts icons per collection. |
| **Unsplash** | `https://api.unsplash.com/search/photos?query=<q>&per_page=30&orientation=landscape...` with `Authorization: Client-ID f9PDHSXynX_Zsx-jN2jg4FdQaKzAcqkM` | Stock photography picker. Supports color filters (`color` param) and order (`order_by`). Results paginated and appended when infinite scrolling. |
| **Figma** | `GET https://api.figma.com/v1/files/{fileId}/nodes?ids={nodeId}` and `GET .../images/{fileId}?ids={nodeId}&format=jpg` | Lets paid users import specific nodes from the shared Aura UI Kit (`zcEDbckRVq79t3mLoqTOAR`). Requires a user-provided Figma personal access token sent as `X-Figma-Token`. |
| **ipify** | `https://api.ipify.org?format=json` | Captures the visitor IP (`DOt()`) before logging AI chat transcripts (`p6`). Helps dedupe abuse and track geo trends. |
| **Supabase Storage** | `https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/...` | Hosts preview thumbnails for templates/components exposed on `/browse` and `/components`. Public bucket, so you can hotlink in docs. |

## 7. UI Component & Plan Reference
These structures are embedded directly in the SPA bundle and power the content visible on https://www.aura.build/pricing, `/components`, and the automation modal.

### 7.1 Subscription Plans (`ih` array)
| Plan | Price (USD/mo) | Highlights |
| --- | --- | --- |
| Free | $0 | 10 monthly prompts (3 daily), 2 pages/project, personal use. |
| Pro | $20 | 120 prompts (100 + 20 bonus), 100 pages/project, commercial use, HTML & Figma export, Pro templates/components, private share links. |
| Max | $40 | 240 prompts (200 + 40 bonus), access to new features, inherits all Pro perks. |
| Ultra | $100 | 560 prompts (500 + 60 bonus), priority support, everything in Max. |
| Elite | $200 | 1080 prompts (1000 + 80 bonus), all AI models, enterprise/priority support, inherits Ultra. |

### 7.2 Credit Packs (`Zy` array)
| Pack ID | Credits | Price | Notes |
| --- | --- | --- | --- |
| 100_credits | 100 | $20 | Entry pack. |
| 200_credits | 200 | $40 | Marked as popular in UI. |
| 500_credits | 500 | $100 | Best bulk value. |

### 7.3 Automation Steps (`I8e` array)
| Step ID | Display Name | Trigger | Timing | Purpose |
| --- | --- | --- | --- | --- |
| welcome_immediate | Welcome Email | signup | Immediate | Greets new users. |
| day_3_tips | Getting Started Tips | signup | 3 days later | Educates on first tasks. |
| day_7_features | Feature Discovery | signup | 7 days later | Highlights advanced tools. |
| day_28_checkin | Monthly Check-in | signup | 28 days later | Gathers feedback/retention. |
| pro_upgrade_welcome | Pro Welcome | pro_upgrade | Immediate | Onboards upgraded customers. |

## 8. Usage Playbooks Derived from aura.build
1. **Upgrading from pricing page** (`https://www.aura.build/pricing`)
   - User selects a plan tile defined in `ih`.
   - Frontend derives `lookupKey = ${plan}_${interval}` and calls `stripe-create-checkout`.
   - Upon success, browser redirects to Stripe; on return, `/payment/success` calls `stripe-get-session` to confirm.

2. **Purchasing credits from the editor**
   - Editor shows the credit modal (data from `Zy`).
   - Selecting a pack triggers `stripe-create-payment-checkout` with `items` matching pack metadata.
   - Completed sessions store credit grants server-side; UI listens for webhook-driven entitlement updates before closing modal.

3. **Managing onboarding sequences** (`Components > Automations` area)
   - Marketing selects an automation slot (`I8e` entry). If they swap templates:
     1. Template picker loads via `GET newsletter-templates-manager`.
     2. Saving a new HTML template `POST`s to the same endpoint.
     3. `newsletter-update-automation-sequence` links the template to the sequence step with enforced `step_delay_hours`.

4. **Uploading design assets** (`/components` or `/editor` asset drawer)
   - Drag-and-drop kicks off the pipeline described in §5.
   - The published anon key and AI metadata response let you rebuild the same flow in external tooling (e.g., batch asset ingestion scripts).

## 9. Implementation Notes & Best Practices
- **Rate limiting**: Edge functions sit behind Supabase’s default limits. Cache automation/template data client-side and debounce edits to avoid 429s.
- **Error UX parity**: Reuse the `Jat` mapping so your surfaces (CLI, docs, or partner portals) emit the same copy as aura.build. This keeps support expectations aligned with the official site.
- **Token hygiene**: Session tokens are short-lived; refresh via `supabase.auth.refreshSession()` before starting long-running uploads or sequential API calls.
- **Testing**: Use Netlify preview origins (e.g., `beta.aura.build`) for end-to-end tests; all of them point to the same Supabase project so responses stay consistent.

---
Need something not covered here (e.g., AI chat actions, component schema, or Supabase table layouts)? Grab the latest `/assets/index-*.js` from https://www.aura.build and repeat the extraction process described above.
