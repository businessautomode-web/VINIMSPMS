# VIN GROUP PMS + IMS — Audit & Meeting Status

Audit date: 26 August 2026 (IST)

## Verified live Google Sheet status

- ERP tabs exist and the schema was initialized.
- Last setup values were written on 21 August 2026 around 14:35 IST.
- Roles: 7 rows; Branches: 1 row; Warehouses: 4 rows.
- Users: 0 rows. A real administrator must be created before login can work.
- Permissions, Products, Raw Materials, Chemicals, Stock Master, Stock In, Stock Out, Production Batches, Inventory Ledger, Audit Log and Sessions currently contain no business-data rows.

## Fixed in this package

- Removed fake timer-based login and connected login to `/api/erp`.
- Removed hard-coded dashboard inventory and production records.
- Added live Google Sheets dashboard loading, manual refresh and 60-second refresh.
- Added visible Last Sync time based on a successful backend response.
- Connected Stock In and Stock Out forms to Google Sheets.
- Stock transactions now update Stock Master and Inventory Ledger together.
- Added insufficient-stock protection and branch checks.
- Fixed nested LockService deadlock during transaction ID generation.
- Added Script Lock and idempotency protection for concurrent saves.
- Added atomic sequence generation inside the transaction lock.
- Added a 15-second server cache for faster dashboard reads; writes invalidate it.
- Connected production batch creation to Google Sheets.
- Added backend permission checks and branch-filtered dashboard results.
- Removed prefilled public demo password.
- Production build and TypeScript checks pass.

## Mandatory deployment before the meeting

1. Replace the Apps Script `Code.gs` with `google-apps-script/Code.gs` from this package.
2. Save, then deploy a **new Apps Script Web App version**. Copy the new `/exec` URL.
3. In Script Properties, confirm `ERP_API_SECRET` is at least 32 random characters.
4. Run once from Apps Script:
   `createFirstAdmin('admin','CHANGE_TO_A_STRONG_PRIVATE_PASSWORD','Sunil Tiwari')`
5. In Vercel Production variables set:
   - `APPS_SCRIPT_URL` = new Apps Script `/exec` URL
   - `ERP_API_SECRET` = exact same secret
6. Upload/commit this updated project to GitHub and redeploy Vercel.
7. Test login, one Stock In, one Stock Out and one Production Batch using test entries. Confirm all related Sheet rows.

Do not share the administrator password or ERP API secret in chat, GitHub or screenshots.

## Still pending for full factory go-live

The current system is meeting-ready for live login, dashboard, Stock In/Out and production-batch creation. These workflows still need implementation and client testing before claiming the entire ERP is complete:

- Full master-data create/edit/delete screens
- BOM scaling and material issue workflow
- Actual consumption, returns and wastage workflow
- Production output, QC, approval and finished-goods posting
- Stock transfer dispatch/receive workflow
- User creation, password reset and permission-management UI
- Date-filtered operational reports and server-generated PDF
- Notification rules, backup scheduling and restore drill
- Formal 3–4 user simultaneous-save test against the deployed Apps Script

Google Sheets is adequate for 3–4 users and moderate daily entries when all writes use these locked backend APIs. Users must not manually edit ledger or Stock Master rows.
