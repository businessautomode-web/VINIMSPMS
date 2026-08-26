# VIN GROUP PMS + IMS — Final Update

## Completed in this build

- Live Google Sheets login, dashboard, Stock In, Stock Out and Production Batch
- Inventory and Production shown as separate IMS/PMS sections
- Real master-data list, add, edit and deactivate/delete actions
- Real user list, add, edit and delete/deactivate actions
- Password hashing, session closure after user deletion, duplicate username protection
- Backend role/branch/permission checks and Super Admin protection
- Settings connection status, spreadsheet name, clickable Sheet URL, server time and last data update
- Company name, colour, email, phone and logo controls
- SystemMaster Automations branding on every page with clickable website, phone and email
- Auto refresh, dashboard cache, transaction locking and duplicate-save protection
- Responsive desktop/mobile UI

## Full replace

- `app/page.tsx`
- `app/globals.css`
- `google-apps-script/Code.gs`

## Mandatory deployment order

1. Replace Apps Script `Code.gs`, save, and deploy a **New version** of the existing Web App.
2. Upload the extracted project contents to the GitHub repository root and commit.
3. Keep the existing Vercel environment variables unless the Web App URL changed.
4. Redeploy Vercel without old build cache.
5. Hard refresh and complete `TESTING_CHECKLIST.md`.

## Scope note

Requested administration, master and settings controls are functional. Advanced production execution—BOM auto-issue, consumption/return, QC output approval, scrap and automatic finished-stock posting—is the next implementation phase. The current PMS creates and tracks production batches safely.
