# Production Phase Consolidated Update

## Implemented

- Production lifecycle: Created → Material Issued → In Process → Pending Approval → Approved
- Active BOM requirement calculation based on planned quantity
- Live warehouse availability validation before issue
- Atomic material issue with stock and inventory-ledger posting
- Actual consumption, material return, process waste and variance capture
- Returned quantity automatically added back to inventory
- Waste and output scrap recorded in `Production_Scrap`
- Output/QC: good, rejected, rework, scrap, process loss, yield and efficiency
- Approval-gated finished-goods posting; repeat approval is blocked
- Transfer dispatch/receive backend with in-transit state and both-side ledger posting
- Multi-user locking and status-transition validation across production operations

## Required master setup before first live batch

For every product, add active `Recipes_BOM` rows containing:

- `Recipe_ID`
- `Product_ID`
- `Standard_Production_Qty`
- `Material_Type`
- `Material_ID`
- `Standard_Qty`
- `Unit`
- `Version`
- `Status = Active`

The BOM calculator scales `Standard_Qty` automatically for the batch's planned quantity.

## Deployment

1. Full-replace `google-apps-script/Code.gs` and deploy an Apps Script New Version.
2. Upload the full extracted repository contents to GitHub and commit.
3. Redeploy Vercel, hard-refresh, then run the production test below.

## Mandatory production test

1. Create Product, Raw Material and active BOM rows.
2. Stock In enough material to the issue warehouse.
3. Create a production batch using the BOM Recipe ID.
4. Calculate and issue BOM materials.
5. Save consumption/return/waste.
6. Save Output & QC.
7. Approve batch and verify `WH-003` finished stock plus both ledgers.
