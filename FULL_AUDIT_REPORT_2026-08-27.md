# VIN GROUP PMS + IMS — Full Audit Report

## Business alignment

The system is aligned to VIN GROUP's plastic and rubber additives business, including masterbatch, plastic compounding, recycling, films, HDPE/PP fabrics, pipes, injection moulding, rotational moulding, rubber processing and wire/cable applications.

Recommended traceability chain:

`Product Category → Product / Grade → Recipe & BOM Version → Raw Material / Chemical Lot → Production Batch → Consumption & Waste → QC Output → Approval → Finished Stock → Branch / Warehouse`

## Audit corrections included

- Removed unintended mixed Hindi/English text from the operational interface.
- Added a language-selected English/Hindi User Guide; each selected view displays one language only.
- Fixed the Settings health-check request loop.
- Fixed company-logo saving by storing the image as a Drive asset and only its URL in Settings.
- Added clear backend error messages for permission, workflow, consumption, logo, duplicate-user and Trash cases.
- Added VIN-aligned product categories and applications.
- Added a real role permission matrix for View, Create, Edit, Delete, Approve, Export and Print.
- Added 15-day Trash, deletion history, restore and automatic expiry purge.
- Added an in-system Support section and standalone `/guide` page.
- Added SystemMaster contact links: Sunil Tiwari, phone, email and website.

## Inventory control policy

- Opening balance: use `IMS → Stock In` with Source = `Opening Stock`.
- Purchase / return / adjustment-in: use Stock In with a clear source and reference.
- Issue / dispatch / adjustment-out: use Stock Out with purpose and remarks.
- Posted stock transactions and ledgers are audit records; they should not be silently overwritten or physically deleted. Corrections must be posted as controlled opposite movements so quantity history remains explainable.
- Master data and users can be edited or moved to Trash when the assigned role has the relevant permission.

## Mandatory deployment migration

After replacing `Code.gs`, run `setupERP()` once before deploying the new Apps Script version. This safely adds the new `Trash` and `Product_Categories` sheets and preserves existing data.

## Validation completed

- Next.js production build
- TypeScript build
- Apps Script JavaScript syntax
- ZIP integrity
- Operational-interface mixed-language scan
- Secret/password string scan

## Live acceptance test

Complete `FINAL_ACCEPTANCE_CHECKLIST.md` on the deployed Vercel environment and connected Google Sheet before client sign-off.
