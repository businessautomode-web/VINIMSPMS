# VIN GROUP PMS + IMS

Professional Production Management System (PMS) and Inventory Management System (IMS), developed by **System Master**.

## Included

- Responsive login, Admin dashboard and mobile layout
- PMS production batches, BOM/recipe, issue, consumption, output and scrap structure
- IMS branch/warehouse stock, Stock In/Out/Transfer and ledger structure
- Users, roles, permissions, sessions and audit sheets
- A4 Print/PDF and filtered CSV reports
- Editable company name, logo URL and theme colour
- Google Sheets auto-setup with 30+ linked sheets
- LockService, idempotency checks and user-friendly errors
- Secure Vercel server proxy for Google Apps Script

## Live data status

This version uses `/api/erp` for real login, dashboard refresh, Stock In/Out and production batch creation. It does not use a prefilled demo password or hard-coded dashboard data. See `MEETING_READY_STATUS.md` before deployment.

## Local run

1. Run: npm install
2. Run: npm run dev
3. Open the local URL shown in the terminal.

## One-time Google Sheet setup

1. Create a blank Google Sheet named **VIN GROUP ERP DATABASE**.
2. Open **Extensions → Apps Script**.
3. Copy google-apps-script/Code.gs into Apps Script Code.gs.
4. In **Project Settings → Script properties**, add ERP_API_SECRET with a long random value (minimum 32 characters).
5. Run setupERP() once and approve permissions.
6. Run createFirstAdmin('admin','YourStrongPassword','Sunil Tiwari') once after changing the password.
7. Do not run seedDemoData() on a live company sheet. It is demo-only.
8. Choose **Deploy → New deployment → Web app**.
9. Execute as **Me**, access **Anyone**, then deploy.
10. Copy the /exec URL.

setupERP() can safely run again. It adds missing sheets/columns and does not delete existing data.

## GitHub and Vercel deployment

1. Extract this ZIP and create an empty GitHub repository such as vin-group-pms-ims.
2. Upload all extracted files and folders. Never upload a .env file.
3. In Vercel choose **Add New → Project** and import the repository.
4. Vercel should detect **Next.js**.
5. Add Environment Variables:
   - APPS_SCRIPT_URL = the Apps Script /exec URL
   - ERP_API_SECRET = exactly the same Script Properties secret
6. Add both variables to Production, Preview and Development.
7. Deploy. Redeploy after changing any variable.

The integration secret stays on the server and is not exposed in browser code.

## Admin one-time setup order

1. Company profile: name, logo URL, address, GST, phone, email and theme colour.
2. Branches and warehouses.
3. Units, suppliers and customers.
4. Raw materials and chemicals with minimum stock and rates.
5. Finished products.
6. BOM/Recipe for every product with tolerance.
7. Machines, lines and shifts.
8. Roles, permissions and users.
9. Opening stock using controlled Stock In entries.
10. Verify Live Stock, test one full production batch, generate a report and create the first backup.

## Production workflow

1. Create Production Batch and choose product, planned quantity and BOM.
2. Review calculated material requirements.
3. Issue material; Inventory Ledger reduces stock.
4. Enter actual consumption, return and waste.
5. Enter good output, rejection, rework and scrap.
6. Manager approves output.
7. Finished goods increase and scrap is recorded.
8. Review yield, variance, efficiency and batch report.

## User guide

- Confirm the active branch before saving.
- Use only menus assigned by the Admin.
- Do not refresh while Save is processing.
- If “Transaction already saved” appears, verify the ledger instead of entering it again.
- Never use fake Stock In to bypass insufficient stock.
- On mobile, use the menu button and a stable connection.
- If the session expires, sign in again and recheck unsaved form data.

## Reports

- **Export PDF / Print:** choose Save as PDF, A4 and enable background graphics.
- **Download CSV:** exports visible filtered rows.
- Use Landscape for wide tables or hide unnecessary columns.

## Troubleshooting

| Message | Resolution |
|---|---|
| Integration setup incomplete | Check both Vercel environment variables and redeploy. |
| Unable to connect | Verify Apps Script deployment and its /exec URL. |
| Incorrect login | Check Users sheet status or reset via Admin. |
| Session expired | Sign in again. Default timeout is 30 minutes. |
| Insufficient stock | Verify branch, warehouse, item and pending transfers. |
| Duplicate transaction | Earlier save succeeded; verify the ledger. |

Never expose ERP_API_SECRET, commit .env, or manually delete ledger rows. Use Cancel/Void with an audit trail.

## Important go-live note

This package contains a polished working demonstration frontend plus a production-oriented Google Sheets connector and schema. Before factory go-live, connect each entry screen to /api/erp, test every role and workflow on a copy of real data, and obtain client sign-off. Google Sheets is suitable for a controlled lightweight deployment; very high transaction volume should later use PostgreSQL/Supabase.

## System Master

Sunil Tiwari  
connect@systemmaster.in  
+91 90279 65956  
https://www.systemmaster.in/
