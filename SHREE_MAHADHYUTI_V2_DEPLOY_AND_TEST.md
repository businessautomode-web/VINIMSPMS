# Shree Mahadhyuti Industries LLP - PMS + Dual Inventory V2

Parent company: VIN Group

## Deployment

1. Replace the GitHub repository root with all files from this package.
2. Replace the complete Google Apps Script with `google-apps-script/Code.gs`.
3. Save and run `setupERP()` once. Existing rows are preserved; new PO sheets and stock-level columns are added.
4. Deploy a New Version of the existing Apps Script Web App.
5. Keep the same Web App URL when it has not changed.
6. Redeploy Vercel without build cache and hard-refresh the browser.

## New sheets/columns

- `Purchase_Orders`
- `PO_Items`
- `PO_Receipts`
- Stock Master: `Maximum_Level`, `Reorder_Qty`
- Units seeded as UNT-001, UNT-002, UNT-003 and UNT-004.
- Unit 4 is the default central vendor-receiving unit.

## Required live test

1. Add one Vendor and one Raw Material. Confirm IDs are auto-generated.
2. Enter minimum and maximum stock levels.
3. Create a PO for delivery to Unit 4.
4. Receive a partial quantity against the PO and verify Unit 4 raw-material stock.
5. Receive the remaining PO quantity and verify PO status.
6. Dispatch material from Unit 4 to Unit 1 and confirm it remains In Transit.
7. Receive the transfer in Unit 1 and verify both unit balances.
8. Create a Finished Product and active BOM rows.
9. Create a Unit 1 production batch; calculate and issue BOM material.
10. Verify raw-material stock is reduced only in Unit 1.
11. Record consumption, return, waste/scrap and output/QC.
12. Approve the batch and verify Finished Goods stock in Unit 1.
13. Post Finished Goods Stock Out with Customer and remarks.
14. Verify timestamp, unit, UOM, quantity, customer and history in ledgers/reports.
15. Test report filters: date range, one unit, all units combined, raw material and finished goods.

## Stock colour meaning

- Red - Critical: quantity at or below minimum level.
- Orange - Reorder Soon or Overstock.
- Green - Healthy stock between operating limits.

## Control rules

- Transaction timestamp is server-generated and cannot be edited.
- Finished-goods dispatch requires a customer.
- PO receipt cannot exceed pending PO quantity.
- Transfer reduces source stock at dispatch and increases destination only at receipt.
- BOM issue reduces raw material in the production unit.
- Finished goods increase only after production approval.
- Posted ledger entries are corrected through controlled reversal, not silent editing.
