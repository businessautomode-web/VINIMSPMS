# VIN GROUP ERP — Go-Live Testing Checklist

> Run after both Apps Script New Version deployment and Vercel redeployment.

- [ ] Settings shows **Connected & Live**, spreadsheet name, Sheet link, last connection and last data update
- [ ] Add, edit and deactivate one Product master; verify `Products` sheet
- [ ] Add, edit and delete one test user; verify deleted-user login is denied
- [ ] Upload a small company logo and save the company profile
- [ ] Test SystemMaster website, phone and email links on desktop and mobile

## Access
- [ ] Correct login works; wrong password and inactive user are rejected
- [ ] Session expiry works
- [ ] Roles show only allowed menus
- [ ] Direct unauthorized backend action is rejected

## Masters and inventory
- [ ] Duplicate item code is rejected
- [ ] Branch/warehouse mapping and decimal quantities work
- [ ] BOM totals and percentages are correct
- [ ] Stock In/Out update the ledger
- [ ] Insufficient stock and duplicate submission are rejected
- [ ] Transfer dispatch/receipt affect correct stores
- [ ] Low-stock alert appears at minimum level

## Production
- [ ] Batch IDs are unique and BOM scales to planned quantity
- [ ] Issue reduces stock and return adds it back
- [ ] Consumption and waste balance
- [ ] Approved output increases finished goods
- [ ] Scrap, yield and variance formulas are correct

## Reports and devices
- [ ] Filters and CSV export work
- [ ] A4 PDF has header, totals, footer and no cutoff
- [ ] Audit report shows sensitive edits
- [ ] Test Chrome, Edge, Android Chrome and iPhone Safari
- [ ] Slow connections show clear feedback

Do not go live until all critical tests pass using a copy of real company data.
