/** Shree Mahadhyuti Industries LLP PMS + Dual Inventory — Google Sheets API connector. */
const ERP_VERSION = "2.0.0";
const SHEETS = {
  Settings: ["Key", "Value", "Updated_At", "Updated_By"],
  Users: [
    "User_ID",
    "Name",
    "Username",
    "Password_Hash",
    "Salt",
    "Role_ID",
    "Branch_ID",
    "Warehouse_ID",
    "Email",
    "Phone",
    "Status",
    "Created_At",
    "Updated_At",
  ],
  Roles: ["Role_ID", "Role_Name", "Status"],
  Permissions: [
    "Role_ID",
    "Module",
    "Can_View",
    "Can_Create",
    "Can_Edit",
    "Can_Delete",
    "Can_Approve",
    "Can_Export",
    "Can_Print",
  ],
  Branches: [
    "Branch_ID",
    "Branch_Name",
    "Branch_Code",
    "Address",
    "City",
    "State",
    "GST_No",
    "Contact_Person",
    "Phone",
    "Status",
    "Created_At",
  ],
  Warehouses: [
    "Warehouse_ID",
    "Branch_ID",
    "Warehouse_Name",
    "Warehouse_Type",
    "Location",
    "Manager",
    "Status",
  ],
  Product_Categories: ["Category_ID", "Category_Name", "Application", "Status"],
  Products: [
    "Product_ID",
    "Product_Name",
    "Category",
    "Product_Code",
    "SKU",
    "Unit",
    "Standard_Batch_Size",
    "Reorder_Level",
    "Description",
    "Status",
    "Created_At",
    "Created_By",
  ],
  Raw_Materials: [
    "Material_ID",
    "Material_Name",
    "Category",
    "Material_Code",
    "Unit",
    "Opening_Stock",
    "Minimum_Stock",
    "Maximum_Stock",
    "Default_Warehouse",
    "Supplier_ID",
    "Rate",
    "Status",
  ],
  Chemicals: [
    "Chemical_ID",
    "Chemical_Name",
    "Chemical_Code",
    "Unit",
    "Opening_Stock",
    "Minimum_Level",
    "Batch_No",
    "Expiry_Date",
    "Supplier_ID",
    "Rate",
    "Storage_Location",
    "Status",
  ],
  Units: ["Unit_ID", "Unit_Name", "Symbol", "Decimals", "Status"],
  Suppliers: [
    "Supplier_ID",
    "Supplier_Name",
    "GST_No",
    "Contact_Person",
    "Phone",
    "Email",
    "Address",
    "Status",
  ],
  Customers: [
    "Customer_ID",
    "Customer_Name",
    "GST_No",
    "Contact_Person",
    "Phone",
    "Email",
    "Address",
    "Status",
  ],
  Purchase_Orders: [
    "PO_ID",
    "PO_Date",
    "Vendor_ID",
    "Delivery_Unit_ID",
    "Expected_Date",
    "Status",
    "Total_Amount",
    "Remarks",
    "Created_By",
    "Created_At",
    "Approved_By",
    "Approved_At",
  ],
  PO_Items: [
    "PO_Item_ID",
    "PO_ID",
    "Material_ID",
    "Material_Name",
    "Ordered_Qty",
    "UOM",
    "Rate",
    "Amount",
    "Received_Qty",
    "Pending_Qty",
    "Status",
  ],
  PO_Receipts: [
    "Receipt_ID",
    "PO_ID",
    "Receipt_Date",
    "Vendor_ID",
    "Unit_ID",
    "Warehouse_ID",
    "Material_ID",
    "Material_Name",
    "Received_Qty",
    "Accepted_Qty",
    "Rejected_Qty",
    "UOM",
    "Lot_No",
    "Invoice_No",
    "Rate",
    "Remarks",
    "Received_By",
    "Created_At",
    "Idempotency_Key",
  ],
  Stock_Master: [
    "Stock_ID",
    "Branch_ID",
    "Warehouse_ID",
    "Item_Type",
    "Item_ID",
    "Item_Name",
    "Quantity",
    "Unit",
    "Average_Rate",
    "Stock_Value",
    "Minimum_Level",
    "Maximum_Level",
    "Reorder_Qty",
    "Updated_At",
  ],
  Stock_In: [
    "Transaction_ID",
    "Date",
    "Branch_ID",
    "Warehouse_ID",
    "Item_Type",
    "Item_ID",
    "Quantity",
    "Unit",
    "Source",
    "Supplier_ID",
    "Invoice_No",
    "Lot_No",
    "Rate",
    "Amount",
    "Remarks",
    "Created_By",
    "Created_At",
    "Idempotency_Key",
    "Status",
  ],
  Stock_Out: [
    "Transaction_ID",
    "Date",
    "Branch_ID",
    "Warehouse_ID",
    "Item_Type",
    "Item_ID",
    "Quantity",
    "Unit",
    "Destination",
    "Purpose",
    "Department",
    "Production_ID",
    "Approved_By",
    "Remarks",
    "Created_By",
    "Created_At",
    "Idempotency_Key",
    "Status",
  ],
  Stock_Transfer: [
    "Transfer_ID",
    "Date",
    "From_Branch",
    "From_Warehouse",
    "To_Branch",
    "To_Warehouse",
    "Item_Type",
    "Item_ID",
    "Quantity",
    "Unit",
    "Status",
    "Dispatched_By",
    "Received_By",
    "Dispatch_Date",
    "Receive_Date",
    "Remarks",
    "Created_At",
  ],
  Production_Batches: [
    "Production_ID",
    "Batch_ID",
    "Date",
    "Branch_ID",
    "Warehouse_ID",
    "Line",
    "Machine",
    "Shift",
    "Product_ID",
    "Planned_Qty",
    "Recipe_ID",
    "Supervisor",
    "Operators",
    "Start_Time",
    "End_Time",
    "Remarks",
    "Status",
    "Created_By",
    "Created_At",
    "Updated_At",
  ],
  Production_Input: [
    "Input_ID",
    "Production_ID",
    "Batch_ID",
    "Item_Type",
    "Item_ID",
    "Required_Qty",
    "Available_Qty",
    "Issued_Qty",
    "Consumed_Qty",
    "Returned_Qty",
    "Waste_Qty",
    "Unit",
    "Lot_No",
    "Warehouse_ID",
    "Variance",
    "Variance_Percent",
    "Created_By",
    "Created_At",
  ],
  Production_Output: [
    "Output_ID",
    "Production_ID",
    "Batch_ID",
    "Product_ID",
    "Planned_Qty",
    "Actual_Qty",
    "Good_Qty",
    "Rejected_Qty",
    "Rework_Qty",
    "Scrap_Qty",
    "Total_Input",
    "Process_Loss",
    "Yield_Percent",
    "Scrap_Percent",
    "Efficiency_Percent",
    "Remarks",
    "Status",
    "Created_By",
    "Created_At",
  ],
  Production_Scrap: [
    "Scrap_ID",
    "Production_ID",
    "Batch_ID",
    "Date",
    "Product_ID",
    "Material_ID",
    "Scrap_Type",
    "Quantity",
    "Unit",
    "Reason",
    "Operator",
    "Machine",
    "Branch_ID",
    "Warehouse_ID",
    "Remarks",
    "Created_At",
  ],
  Recipes_BOM: [
    "Recipe_ID",
    "Product_ID",
    "Standard_Production_Qty",
    "Material_Type",
    "Material_ID",
    "Standard_Qty",
    "Unit",
    "Percentage",
    "Tolerance",
    "Version",
    "Effective_From",
    "Status",
  ],
  Inventory_Ledger: [
    "Transaction_ID",
    "Date",
    "Time",
    "Transaction_Type",
    "Reference_ID",
    "Branch_ID",
    "Warehouse_ID",
    "Item_Type",
    "Item_ID",
    "Item_Name",
    "Opening_Qty",
    "In_Qty",
    "Out_Qty",
    "Closing_Qty",
    "Rate",
    "Value",
    "User_ID",
    "Remarks",
    "Idempotency_Key",
  ],
  Production_Ledger: [
    "Entry_ID",
    "Timestamp",
    "Production_ID",
    "Batch_ID",
    "Action",
    "Quantity",
    "Unit",
    "User_ID",
    "Remarks",
  ],
  User_Activity: [
    "Activity_ID",
    "Timestamp",
    "User_ID",
    "Module",
    "Action",
    "Record_ID",
    "Old_Value",
    "New_Value",
    "Branch_ID",
  ],
  Login_History: [
    "Login_ID",
    "Login_At",
    "User_ID",
    "Device",
    "Success",
    "Message",
    "Logout_At",
  ],
  Audit_Log: [
    "Audit_ID",
    "Timestamp",
    "User_ID",
    "Module",
    "Action",
    "Record_ID",
    "Old_Value",
    "New_Value",
    "Branch_ID",
    "IP_Info",
  ],
  Trash: [
    "Trash_ID",
    "Deleted_At",
    "Purge_After",
    "Sheet_Name",
    "Record_ID",
    "Record_JSON",
    "Deleted_By",
    "Branch_ID",
    "Reason",
    "Status",
    "Restored_At",
    "Restored_By",
  ],
  Notifications: [
    "Notification_ID",
    "Timestamp",
    "Type",
    "Title",
    "Message",
    "User_ID",
    "Branch_ID",
    "Read",
    "Reference_ID",
  ],
  Report_Config: [
    "Report_ID",
    "Report_Name",
    "Enabled",
    "Default_Columns",
    "Updated_At",
  ],
  Sessions: [
    "Session_ID",
    "User_ID",
    "Role_ID",
    "Branch_ID",
    "Permissions_JSON",
    "Expires_At",
    "Created_At",
    "Status",
  ],
  Sequences: ["Prefix", "Date_Key", "Last_Number"],
};
function setupERP() {
  const ss = SpreadsheetApp.getActive();
  Object.keys(SHEETS).forEach((name) => ensureSheet_(ss, name, SHEETS[name]));
  seedCore_(ss);
  seedVinCategories_(ss);
  PropertiesService.getScriptProperties().setProperty(
    "SPREADSHEET_ID",
    ss.getId(),
  );
  return "ERP setup completed safely. Existing data was preserved.";
}
function ensureSheet_(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0)
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
  else {
    const existing = sh
      .getRange(1, 1, 1, Math.max(sh.getLastColumn(), 1))
      .getValues()[0];
    headers.forEach((h) => {
      if (existing.indexOf(h) < 0) {
        sh.getRange(1, sh.getLastColumn() + 1).setValue(h);
        existing.push(h);
      }
    });
  }
  sh.setFrozenRows(1);
  sh.getRange(1, 1, 1, sh.getLastColumn())
    .setBackground("#0b2a4a")
    .setFontColor("#ffffff")
    .setFontWeight("bold");
  if (!sh.getFilter() && sh.getLastColumn())
    sh.getRange(
      1,
      1,
      Math.max(sh.getLastRow(), 1),
      sh.getLastColumn(),
    ).createFilter();
  sh.autoResizeColumns(1, Math.min(sh.getLastColumn(), 12));
}
function seedCore_(ss) {
  const settings = ss.getSheetByName("Settings");
  if (settings.getLastRow() < 2)
    [
      ["COMPANY_NAME", "Shree Mahadhyuti Industries LLP"],
      ["PARENT_COMPANY", "VIN Group"],
      ["PRIMARY_COLOR", "#0b2a4a"],
      ["ALLOW_NEGATIVE_STOCK", "FALSE"],
      ["CURRENCY", "INR"],
      ["QTY_DECIMALS", "3"],
      ["SESSION_MINUTES", "30"],
      ["SYSTEM_VERSION", ERP_VERSION],
    ].forEach((r) => settings.appendRow([r[0], r[1], new Date(), "SYSTEM"]));
  const roles = ss.getSheetByName("Roles");
  if (roles.getLastRow() < 2)
    [
      ["ROL-001", "Super Admin", "Active"],
      ["ROL-002", "Admin", "Active"],
      ["ROL-003", "Production Manager", "Active"],
      ["ROL-004", "Production Operator", "Active"],
      ["ROL-005", "Inventory Manager", "Active"],
      ["ROL-006", "Stock Operator", "Active"],
      ["ROL-007", "Viewer", "Active"],
    ].forEach((r) => roles.appendRow(r));
  const branches = ss.getSheetByName("Branches");
  if (branches.getLastRow() < 2)
    [
      ["UNT-001", "Unit 1", "UNIT-1"],
      ["UNT-002", "Unit 2", "UNIT-2"],
      ["UNT-003", "Unit 3", "UNIT-3"],
      ["UNT-004", "Unit 4 - Central Receiving", "UNIT-4"],
    ].forEach((u) =>
      branches.appendRow([
        u[0],
        u[1],
        u[2],
        "",
        "",
        "",
        "",
        "",
        "",
        "Active",
        new Date(),
      ]),
    );
  const wh = ss.getSheetByName("Warehouses");
  if (wh.getLastRow() < 2)
    [
      [
        "WH-U1-RM",
        "UNT-001",
        "Unit 1 Raw Material Store",
        "Raw Material",
        "",
        "",
        "Active",
      ],
      [
        "WH-U1-FG",
        "UNT-001",
        "Unit 1 Finished Goods",
        "Finished Goods",
        "",
        "",
        "Active",
      ],
      [
        "WH-U2-RM",
        "UNT-002",
        "Unit 2 Raw Material Store",
        "Raw Material",
        "",
        "",
        "Active",
      ],
      [
        "WH-U2-FG",
        "UNT-002",
        "Unit 2 Finished Goods",
        "Finished Goods",
        "",
        "",
        "Active",
      ],
      [
        "WH-U3-RM",
        "UNT-003",
        "Unit 3 Raw Material Store",
        "Raw Material",
        "",
        "",
        "Active",
      ],
      [
        "WH-U3-FG",
        "UNT-003",
        "Unit 3 Finished Goods",
        "Finished Goods",
        "",
        "",
        "Active",
      ],
      [
        "WH-U4-RM",
        "UNT-004",
        "Unit 4 Central Receiving Store",
        "Raw Material",
        "",
        "",
        "Active",
      ],
      [
        "WH-U4-FG",
        "UNT-004",
        "Unit 4 Finished Goods",
        "Finished Goods",
        "",
        "",
        "Active",
      ],
      ["WH-SCRAP", "UNT-004", "Central Scrap Store", "Scrap", "", "", "Active"],
    ].forEach((r) => wh.appendRow(r));
}
function seedVinCategories_(ss) {
  const sh = ss.getSheetByName("Product_Categories");
  if (!sh || sh.getLastRow() > 1) return;
  [
    [
      "CAT-001",
      "Film Manufacturing",
      "Plastic films and processing additives",
      "Active",
    ],
    [
      "CAT-002",
      "HDPE / PP Laminated Fabrics",
      "Woven and laminated applications",
      "Active",
    ],
    ["CAT-003", "HDPE Pipes", "Pipe additives and compounds", "Active"],
    [
      "CAT-004",
      "Injection Moulding",
      "Injection-moulding additives and compounds",
      "Active",
    ],
    [
      "CAT-005",
      "Masterbatch",
      "Black, colour and functional masterbatch",
      "Active",
    ],
    [
      "CAT-006",
      "Plastic Compounding",
      "Speciality compounds and performance additives",
      "Active",
    ],
    [
      "CAT-007",
      "Plastic Recycling",
      "Recycling and property-restoration additives",
      "Active",
    ],
    [
      "CAT-008",
      "Rigid PVC / uPVC Pipes",
      "PVC processing and performance additives",
      "Active",
    ],
    [
      "CAT-009",
      "Rotational Moulding",
      "Rotomoulding additives and compounds",
      "Active",
    ],
    ["CAT-010", "Rubber Processing", "Rubber processing additives", "Active"],
    [
      "CAT-011",
      "Tarpaulin / PP Strap / PP Sutli",
      "Polyolefin conversion applications",
      "Active",
    ],
    [
      "CAT-012",
      "Transparent Films",
      "Clarity and film-performance additives",
      "Active",
    ],
    ["CAT-013", "Wire & Cable", "Cable compounds and additives", "Active"],
  ].forEach((r) => sh.appendRow(r));
}
function createFirstAdmin(username, password, name) {
  if (!username || !password || password.length < 8)
    throw new Error("Use a username and password of at least 8 characters.");
  const sh = db_().getSheetByName("Users");
  if (sh.getLastRow() > 1)
    throw new Error("Users already exist. Create further users from Admin.");
  const salt = Utilities.getUuid(),
    hash = hash_(password, salt);
  sh.appendRow([
    "USR-0001",
    name || "Super Admin",
    username,
    hash,
    salt,
    "ROL-001",
    "UNT-004",
    "",
    "",
    "",
    "Active",
    new Date(),
    new Date(),
  ]);
  return "First administrator created. Do not share this password.";
}
function doGet() {
  return json_({
    ok: true,
    service: "Shree Mahadhyuti Industries LLP PMS + Dual IMS",
    parentCompany: "VIN Group",
    version: ERP_VERSION,
  });
}
function doPost(e) {
  try {
    const p = JSON.parse((e.postData && e.postData.contents) || "{}");
    verifySecret_(p.secret);
    if (p.action === "health") return json_(systemInfo_(p));
    if (p.action === "login") return json_(login_(p));
    if (p.action === "logout") return json_(logout_(p));
    if (p.action === "list") return json_(list_(p));
    if (p.action === "append") return json_(append_(p));
    if (p.action === "dashboard") return json_(dashboard_(p));
    if (p.action === "createBatch") return json_(createBatch_(p));
    if (p.action === "batchDetail") return json_(batchDetail_(p));
    if (p.action === "issueMaterials") return json_(issueMaterials_(p));
    if (p.action === "saveConsumption") return json_(saveConsumption_(p));
    if (p.action === "saveOutput") return json_(saveOutput_(p));
    if (p.action === "approveBatch") return json_(approveBatch_(p));
    if (p.action === "createTransfer") return json_(createTransfer_(p));
    if (p.action === "receiveTransfer") return json_(receiveTransfer_(p));
    if (p.action === "createPO") return json_(createPO_(p));
    if (p.action === "receivePO") return json_(receivePO_(p));
    if (p.action === "systemInfo") return json_(systemInfo_(p));
    if (p.action === "saveMaster") return json_(saveMaster_(p));
    if (p.action === "deleteMaster") return json_(deleteMaster_(p));
    if (p.action === "saveUser") return json_(saveUser_(p));
    if (p.action === "deleteUser") return json_(deleteUser_(p));
    if (p.action === "savePermissions") return json_(savePermissions_(p));
    if (p.action === "saveSettings") return json_(saveSettings_(p));
    if (p.action === "listTrash") return json_(listTrash_(p));
    if (p.action === "restoreTrash") return json_(restoreTrash_(p));
    if (p.action === "purgeTrash") return json_(purgeTrash_(p));
    throw new Error("Unsupported request.");
  } catch (err) {
    logError_(err);
    return json_({ ok: false, message: userMessage_(err) });
  }
}
function verifySecret_(secret) {
  const expected =
    PropertiesService.getScriptProperties().getProperty("ERP_API_SECRET");
  if (!expected) throw new Error("CONFIG_SECRET");
  if (!safeEqual_(String(secret || ""), expected))
    throw new Error("ACCESS_DENIED");
}
function login_(p) {
  const rows = objects_("Users"),
    u = rows.find(
      (x) =>
        String(x.Username).toLowerCase() ===
        String(p.username || "").toLowerCase(),
    );
  if (
    !u ||
    u.Status !== "Active" ||
    hash_(String(p.password || ""), u.Salt) !== u.Password_Hash
  ) {
    append_unsafe_("Login_History", [
      id_("LOG"),
      new Date(),
      u ? u.User_ID : "UNKNOWN",
      p.device || "",
      false,
      "Invalid credentials",
      "",
    ]);
    throw new Error("INVALID_LOGIN");
  }
  const sid = Utilities.getUuid(),
    mins = Number(getSetting_("SESSION_MINUTES") || 30),
    exp = new Date(Date.now() + mins * 60000);
  append_unsafe_("Sessions", [
    sid,
    u.User_ID,
    u.Role_ID,
    u.Branch_ID,
    "{}",
    exp,
    new Date(),
    "Active",
  ]);
  append_unsafe_("Login_History", [
    id_("LOG"),
    new Date(),
    u.User_ID,
    p.device || "",
    true,
    "Success",
    "",
  ]);
  return {
    ok: true,
    session: sid,
    user: { id: u.User_ID, name: u.Name, role: u.Role_ID, branch: u.Branch_ID },
    expiresAt: exp,
  };
}
function logout_(p) {
  const sh = db_().getSheetByName("Sessions"),
    rows = sh.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++)
    if (rows[i][0] === p.session) {
      sh.getRange(i + 1, 8).setValue("Closed");
      break;
    }
  return { ok: true };
}
function requireSession_(sid) {
  const s = objects_("Sessions").find(
    (x) => x.Session_ID === sid && x.Status === "Active",
  );
  if (!s || new Date(s.Expires_At).getTime() < Date.now())
    throw new Error("SESSION_EXPIRED");
  return s;
}
function list_(p) {
  const s = requireSession_(p.session);
  const allowed = Object.keys(SHEETS);
  if (allowed.indexOf(p.sheet) < 0) throw new Error("INVALID_MODULE");
  authorize_(s, p.sheet, "View");
  const rows = objects_(p.sheet),
    limit = Math.min(Math.max(Number(p.limit || 100), 1), 500),
    offset = Math.max(Number(p.offset || 0), 0);
  return {
    ok: true,
    rows: rows.slice(offset, offset + limit),
    total: rows.length,
    serverTime: new Date().toISOString(),
    userId: s.User_ID,
  };
}
function append_(p) {
  const s = requireSession_(p.session);
  authorize_(s, "Inventory", "Create");
  if (!p.idempotencyKey) throw new Error("MISSING_IDEMPOTENCY");
  if (["Stock_In", "Stock_Out"].indexOf(p.sheet) < 0)
    throw new Error("INVALID_MODULE");
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const ledger = db_()
      .getSheetByName("Inventory_Ledger")
      .getDataRange()
      .getValues();
    if (ledger.some((r) => r.indexOf(p.idempotencyKey) >= 0))
      return {
        ok: true,
        duplicate: true,
        message: "Transaction already saved.",
        serverTime: new Date().toISOString(),
      };
    const sh = db_().getSheetByName(p.sheet),
      headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0],
      record = p.record || {},
      qty = Number(record.Quantity || 0);
    if (
      !record.Branch_ID ||
      !record.Warehouse_ID ||
      !record.Item_Type ||
      !record.Item_ID ||
      !Number.isFinite(qty) ||
      qty <= 0
    )
      throw new Error("INVALID_TRANSACTION");
    if (
      p.sheet === "Stock_Out" &&
      String(record.Item_Type) === "Finished Goods" &&
      !record.Destination
    )
      throw new Error("CUSTOMER_REQUIRED");
    if (
      s.Role_ID !== "ROL-001" &&
      String(record.Branch_ID) !== String(s.Branch_ID)
    )
      throw new Error("ACCESS_DENIED");
    record.Transaction_ID = record.Transaction_ID || idUnlocked_("STK");
    record.Date = new Date();
    record.Created_By = s.User_ID;
    record.Created_At = new Date();
    record.Idempotency_Key = p.idempotencyKey;
    record.Status = record.Status || "Posted";
    const movement = updateStockMaster_(
      record,
      p.sheet === "Stock_In" ? qty : -qty,
    );
    sh.getRange(sh.getLastRow() + 1, 1, 1, headers.length).setValues([
      headers.map((h) => (record[h] === undefined ? "" : record[h])),
    ]);
    writeLedger_(
      record,
      p.sheet === "Stock_In" ? "Stock In" : "Stock Out",
      movement.opening,
      movement.closing,
    );
    audit_(
      s.User_ID,
      "Inventory",
      "Create",
      record.Transaction_ID,
      record.Branch_ID,
    );
    CacheService.getScriptCache().remove("ERP_DASHBOARD");
    return {
      ok: true,
      id: record.Transaction_ID,
      message: "Transaction saved and inventory updated.",
      serverTime: new Date().toISOString(),
      closingQty: movement.closing,
    };
  } finally {
    lock.releaseLock();
  }
}
function updateStockMaster_(r, delta) {
  const sh = db_().getSheetByName("Stock_Master"),
    v = sh.getDataRange().getValues(),
    headers = v[0],
    idx = Object.fromEntries(headers.map((h, i) => [h, i]));
  let row = 0;
  for (let i = 1; i < v.length; i++)
    if (
      String(v[i][idx.Branch_ID]) === String(r.Branch_ID) &&
      String(v[i][idx.Warehouse_ID]) === String(r.Warehouse_ID) &&
      String(v[i][idx.Item_Type]) === String(r.Item_Type) &&
      String(v[i][idx.Item_ID]) === String(r.Item_ID)
    ) {
      row = i + 1;
      break;
    }
  const opening = row
      ? Number(sh.getRange(row, idx.Quantity + 1).getValue() || 0)
      : 0,
    closing = opening + delta;
  if (
    closing < 0 &&
    String(getSetting_("ALLOW_NEGATIVE_STOCK")).toUpperCase() !== "TRUE"
  )
    throw new Error("INSUFFICIENT_STOCK");
  const rate = Number(r.Rate || 0),
    material =
      String(r.Item_Type) === "Raw Material"
        ? objects_("Raw_Materials").find(
            (x) => String(x.Material_ID) === String(r.Item_ID),
          )
        : null,
    minimum = Number(
      r.Minimum_Level !== undefined
        ? r.Minimum_Level
        : (material ? material.Minimum_Stock : 0) || 0,
    ),
    maximum = Number(
      r.Maximum_Level !== undefined
        ? r.Maximum_Level
        : (material ? material.Maximum_Stock : 0) || 0,
    ),
    reorder = Number(
      r.Reorder_Qty !== undefined
        ? r.Reorder_Qty
        : Math.max(0, maximum - closing),
    );
  if (row) {
    sh.getRange(row, idx.Quantity + 1).setValue(closing);
    sh.getRange(row, idx.Updated_At + 1).setValue(new Date());
    if (rate > 0) {
      sh.getRange(row, idx.Average_Rate + 1).setValue(rate);
      sh.getRange(row, idx.Stock_Value + 1).setValue(closing * rate);
    }
    if (idx.Minimum_Level >= 0)
      sh.getRange(row, idx.Minimum_Level + 1).setValue(minimum);
    if (idx.Maximum_Level >= 0)
      sh.getRange(row, idx.Maximum_Level + 1).setValue(maximum);
    if (idx.Reorder_Qty >= 0)
      sh.getRange(row, idx.Reorder_Qty + 1).setValue(reorder);
  } else {
    const rec = {
      Stock_ID: idUnlocked_("BAL"),
      Branch_ID: r.Branch_ID,
      Warehouse_ID: r.Warehouse_ID,
      Item_Type: r.Item_Type,
      Item_ID: r.Item_ID,
      Item_Name: r.Item_Name || r.Item_ID,
      Quantity: closing,
      Unit: r.Unit || "",
      Average_Rate: rate,
      Stock_Value: closing * rate,
      Minimum_Level: minimum,
      Maximum_Level: maximum,
      Reorder_Qty: reorder,
      Updated_At: new Date(),
    };
    sh.getRange(sh.getLastRow() + 1, 1, 1, headers.length).setValues([
      headers.map((h) => (rec[h] === undefined ? "" : rec[h])),
    ]);
  }
  return { opening: opening, closing: closing };
}
function writeLedger_(r, type, opening, closing) {
  const qty = Number(r.Quantity || 0),
    out = type === "Stock Out" ? qty : 0,
    input = type === "Stock In" ? qty : 0;
  append_unsafe_("Inventory_Ledger", [
    r.Transaction_ID,
    new Date(),
    Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "HH:mm:ss"),
    type,
    r.Transaction_ID,
    r.Branch_ID,
    r.Warehouse_ID,
    r.Item_Type,
    r.Item_ID,
    r.Item_Name || "",
    opening,
    input,
    out,
    closing,
    r.Rate || 0,
    (r.Rate || 0) * qty,
    r.Created_By,
    r.Remarks || "",
    r.Idempotency_Key,
  ]);
}
function dashboard_(p) {
  const s = requireSession_(p.session);
  authorize_(s, "Dashboard", "View");
  const cache = CacheService.getScriptCache(),
    cached = cache.get("ERP_DASHBOARD");
  let raw = cached
    ? JSON.parse(cached)
    : {
        stock: objects_("Stock_Master"),
        batches: objects_("Production_Batches").slice(-50).reverse(),
        notifications: objects_("Notifications").slice(-50).reverse(),
      };
  if (!cached) cache.put("ERP_DASHBOARD", JSON.stringify(raw), 15);
  const all = s.Role_ID === "ROL-001",
    branch = String(s.Branch_ID || "");
  return {
    ok: true,
    stock: all
      ? raw.stock
      : raw.stock.filter((x) => String(x.Branch_ID) === branch),
    batches: (all
      ? raw.batches
      : raw.batches.filter((x) => String(x.Branch_ID) === branch)
    ).slice(0, 20),
    notifications: (all
      ? raw.notifications
      : raw.notifications.filter(
          (x) => !x.Branch_ID || String(x.Branch_ID) === branch,
        )
    ).slice(0, 20),
    serverTime: new Date().toISOString(),
    cached: !!cached,
  };
}
function createBatch_(p) {
  const s = requireSession_(p.session);
  authorize_(s, "Production", "Create");
  if (!p.idempotencyKey) throw new Error("MISSING_IDEMPOTENCY");
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = db_().getSheetByName("Production_Batches"),
      log = db_()
        .getSheetByName("Production_Ledger")
        .getDataRange()
        .getValues();
    if (log.some((r) => r.indexOf(p.idempotencyKey) >= 0))
      return {
        ok: true,
        duplicate: true,
        message: "Production batch already saved.",
      };
    const r = p.record || {},
      planned = Number(r.Planned_Qty || 0);
    if (!r.Product_ID || !r.Branch_ID || !r.Warehouse_ID || planned <= 0)
      throw new Error("INVALID_TRANSACTION");
    if (s.Role_ID !== "ROL-001" && String(r.Branch_ID) !== String(s.Branch_ID))
      throw new Error("ACCESS_DENIED");
    r.Production_ID = idUnlocked_("PROD");
    r.Batch_ID = idUnlocked_("BAT");
    r.Date = r.Date || new Date();
    r.Status = "Created";
    r.Created_By = s.User_ID;
    r.Created_At = new Date();
    r.Updated_At = new Date();
    const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    sh.getRange(sh.getLastRow() + 1, 1, 1, headers.length).setValues([
      headers.map((h) => (r[h] === undefined ? "" : r[h])),
    ]);
    append_unsafe_("Production_Ledger", [
      Utilities.getUuid(),
      new Date(),
      r.Production_ID,
      r.Batch_ID,
      "Batch Created",
      planned,
      r.Unit || "",
      s.User_ID,
      (r.Remarks || "") + " [KEY:" + p.idempotencyKey + "]",
    ]);
    audit_(s.User_ID, "Production", "Create", r.Production_ID, r.Branch_ID);
    CacheService.getScriptCache().remove("ERP_DASHBOARD");
    return {
      ok: true,
      id: r.Production_ID,
      batchId: r.Batch_ID,
      message: "Production batch created.",
      serverTime: new Date().toISOString(),
    };
  } finally {
    lock.releaseLock();
  }
}
function findBatch_(id) {
  const rows = objects_("Production_Batches"),
    batch = rows.find(
      (x) =>
        String(x.Production_ID) === String(id) ||
        String(x.Batch_ID) === String(id),
    );
  if (!batch) throw new Error("RECORD_NOT_FOUND");
  return batch;
}
function setBatchStatus_(id, status, user) {
  const sh = db_().getSheetByName("Production_Batches"),
    v = sh.getDataRange().getValues(),
    h = v[0],
    pi = h.indexOf("Production_ID"),
    bi = h.indexOf("Batch_ID"),
    si = h.indexOf("Status"),
    ui = h.indexOf("Updated_At");
  for (let i = 1; i < v.length; i++)
    if (String(v[i][pi]) === String(id) || String(v[i][bi]) === String(id)) {
      sh.getRange(i + 1, si + 1).setValue(status);
      if (ui >= 0) sh.getRange(i + 1, ui + 1).setValue(new Date());
      append_unsafe_("Production_Ledger", [
        Utilities.getUuid(),
        new Date(),
        v[i][pi],
        v[i][bi],
        status,
        "",
        "",
        user,
        "",
      ]);
      return;
    }
  throw new Error("RECORD_NOT_FOUND");
}
function batchDetail_(p) {
  const s = requireSession_(p.session);
  authorize_(s, "Production", "View");
  const b = findBatch_(p.id);
  if (!isSuper_(s) && String(b.Branch_ID) !== String(s.Branch_ID))
    throw new Error("ACCESS_DENIED");
  const bom = objects_("Recipes_BOM")
    .filter(
      (x) =>
        x.Status === "Active" &&
        (String(x.Recipe_ID) === String(b.Recipe_ID) ||
          String(x.Product_ID) === String(b.Product_ID)),
    )
    .map((x) => {
      const base = Number(x.Standard_Production_Qty || 1),
        required =
          (Number(x.Standard_Qty || 0) * Number(b.Planned_Qty || 0)) / base,
        stock = objects_("Stock_Master").find(
          (q) =>
            String(q.Branch_ID) === String(b.Branch_ID) &&
            String(q.Warehouse_ID) === String(b.Warehouse_ID) &&
            String(q.Item_ID) === String(x.Material_ID),
        );
      return {
        ...x,
        Required_Qty: required,
        Available_Qty: Number(stock ? stock.Quantity : 0),
      };
    });
  return {
    ok: true,
    batch: b,
    bom: bom,
    inputs: objects_("Production_Input").filter(
      (x) => String(x.Production_ID) === String(b.Production_ID),
    ),
    outputs: objects_("Production_Output").filter(
      (x) => String(x.Production_ID) === String(b.Production_ID),
    ),
    scrap: objects_("Production_Scrap").filter(
      (x) => String(x.Production_ID) === String(b.Production_ID),
    ),
    serverTime: new Date().toISOString(),
  };
}
function issueMaterials_(p) {
  const s = requireSession_(p.session);
  authorize_(s, "Production", "Edit");
  const b = findBatch_(p.id);
  if (!["Created", "Material Shortage"].includes(String(b.Status)))
    throw new Error("INVALID_STATUS");
  const items = p.items || [];
  if (!items.length) throw new Error("INVALID_TRANSACTION");
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    items.forEach((x) => {
      const qty = Number(x.Issued_Qty || x.Required_Qty || 0);
      if (qty <= 0) throw new Error("INVALID_TRANSACTION");
      const movement = updateStockMaster_(
        {
          Branch_ID: b.Branch_ID,
          Warehouse_ID: x.Warehouse_ID || b.Warehouse_ID,
          Item_Type: x.Material_Type || "Raw Material",
          Item_ID: x.Material_ID,
          Item_Name: x.Material_Name || x.Material_ID,
          Quantity: qty,
          Unit: x.Unit || "KG",
          Rate: 0,
          Created_By: s.User_ID,
          Remarks: "Issued to " + b.Batch_ID,
          Idempotency_Key: p.idempotencyKey || Utilities.getUuid(),
        },
        -qty,
      );
      append_unsafe_("Production_Input", [
        idUnlocked_("PIN"),
        b.Production_ID,
        b.Batch_ID,
        x.Material_Type || "Raw Material",
        x.Material_ID,
        Number(x.Required_Qty || qty),
        Number(x.Available_Qty || movement.opening),
        qty,
        0,
        0,
        0,
        x.Unit || "KG",
        x.Lot_No || "",
        x.Warehouse_ID || b.Warehouse_ID,
        qty - Number(x.Required_Qty || qty),
        Number(x.Required_Qty || qty)
          ? ((qty - Number(x.Required_Qty || qty)) * 100) /
            Number(x.Required_Qty || qty)
          : 0,
        s.User_ID,
        new Date(),
      ]);
      writeLedger_(
        {
          Transaction_ID: idUnlocked_("ISS"),
          Branch_ID: b.Branch_ID,
          Warehouse_ID: x.Warehouse_ID || b.Warehouse_ID,
          Item_Type: x.Material_Type || "Raw Material",
          Item_ID: x.Material_ID,
          Item_Name: x.Material_Name || x.Material_ID,
          Quantity: qty,
          Unit: x.Unit || "KG",
          Rate: 0,
          Created_By: s.User_ID,
          Remarks: "Production issue " + b.Batch_ID,
          Idempotency_Key: p.idempotencyKey || "",
        },
        "Stock Out",
        movement.opening,
        movement.closing,
      );
    });
    setBatchStatus_(b.Production_ID, "Material Issued", s.User_ID);
    CacheService.getScriptCache().remove("ERP_DASHBOARD");
    return {
      ok: true,
      message: "Materials issued and inventory reduced.",
      serverTime: new Date().toISOString(),
    };
  } finally {
    lock.releaseLock();
  }
}
function saveConsumption_(p) {
  const s = requireSession_(p.session);
  authorize_(s, "Production", "Edit");
  const b = findBatch_(p.id);
  if (!["Material Issued", "In Process"].includes(String(b.Status)))
    throw new Error("INVALID_STATUS");
  const sh = db_().getSheetByName("Production_Input"),
    v = sh.getDataRange().getValues(),
    h = v[0],
    idx = Object.fromEntries(h.map((x, i) => [x, i])),
    items = p.items || [],
    lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    items.forEach((x) => {
      for (let i = 1; i < v.length; i++)
        if (String(v[i][idx.Input_ID]) === String(x.Input_ID)) {
          const issued = Number(v[i][idx.Issued_Qty] || 0),
            cons = Number(x.Consumed_Qty || 0),
            ret = Number(x.Returned_Qty || 0),
            waste = Number(x.Waste_Qty || 0);
          if (
            cons < 0 ||
            ret < 0 ||
            waste < 0 ||
            cons + ret + waste > issued + 0.0001
          )
            throw new Error("INVALID_CONSUMPTION");
          sh.getRange(i + 1, idx.Consumed_Qty + 1).setValue(cons);
          sh.getRange(i + 1, idx.Returned_Qty + 1).setValue(ret);
          sh.getRange(i + 1, idx.Waste_Qty + 1).setValue(waste);
          sh.getRange(i + 1, idx.Variance + 1).setValue(
            cons - Number(v[i][idx.Required_Qty] || 0),
          );
          if (ret > 0) {
            const movement = updateStockMaster_(
              {
                Branch_ID: b.Branch_ID,
                Warehouse_ID: v[i][idx.Warehouse_ID],
                Item_Type: v[i][idx.Item_Type],
                Item_ID: v[i][idx.Item_ID],
                Item_Name: v[i][idx.Item_ID],
                Quantity: ret,
                Unit: v[i][idx.Unit],
                Rate: 0,
                Created_By: s.User_ID,
                Remarks: "Return from " + b.Batch_ID,
                Idempotency_Key: Utilities.getUuid(),
              },
              ret,
            );
            writeLedger_(
              {
                Transaction_ID: idUnlocked_("RET"),
                Branch_ID: b.Branch_ID,
                Warehouse_ID: v[i][idx.Warehouse_ID],
                Item_Type: v[i][idx.Item_Type],
                Item_ID: v[i][idx.Item_ID],
                Item_Name: v[i][idx.Item_ID],
                Quantity: ret,
                Unit: v[i][idx.Unit],
                Rate: 0,
                Created_By: s.User_ID,
                Remarks: "Production return " + b.Batch_ID,
                Idempotency_Key: "",
              },
              "Stock In",
              movement.opening,
              movement.closing,
            );
          }
          if (waste > 0)
            append_unsafe_("Production_Scrap", [
              idUnlocked_("SCR"),
              b.Production_ID,
              b.Batch_ID,
              new Date(),
              b.Product_ID,
              v[i][idx.Item_ID],
              "Process Waste",
              waste,
              v[i][idx.Unit],
              "Production consumption",
              s.User_ID,
              b.Machine,
              b.Branch_ID,
              "WH-SCRAP",
              "",
              new Date(),
            ]);
          break;
        }
    });
    setBatchStatus_(b.Production_ID, "In Process", s.User_ID);
    return { ok: true, message: "Consumption, return and waste saved." };
  } finally {
    lock.releaseLock();
  }
}
function saveOutput_(p) {
  const s = requireSession_(p.session);
  authorize_(s, "Production", "Edit");
  const b = findBatch_(p.id),
    r = p.record || {},
    good = Number(r.Good_Qty || 0),
    rej = Number(r.Rejected_Qty || 0),
    rework = Number(r.Rework_Qty || 0),
    scrap = Number(r.Scrap_Qty || 0),
    actual = good + rej + rework + scrap,
    totalInput = objects_("Production_Input")
      .filter((x) => String(x.Production_ID) === String(b.Production_ID))
      .reduce((a, x) => a + Number(x.Consumed_Qty || 0), 0);
  if (good < 0 || actual <= 0) throw new Error("INVALID_TRANSACTION");
  const existing = objects_("Production_Output").find(
    (x) => String(x.Production_ID) === String(b.Production_ID),
  );
  if (
    existing &&
    ["Pending Approval", "Approved"].includes(String(existing.Status))
  )
    throw new Error("INVALID_STATUS");
  append_unsafe_("Production_Output", [
    idUnlocked_("OUT"),
    b.Production_ID,
    b.Batch_ID,
    b.Product_ID,
    b.Planned_Qty,
    actual,
    good,
    rej,
    rework,
    scrap,
    totalInput,
    totalInput - actual,
    totalInput ? (good * 100) / totalInput : 0,
    actual ? (scrap * 100) / actual : 0,
    Number(b.Planned_Qty) ? (good * 100) / Number(b.Planned_Qty) : 0,
    r.Remarks || "",
    "Pending Approval",
    s.User_ID,
    new Date(),
  ]);
  if (scrap > 0)
    append_unsafe_("Production_Scrap", [
      idUnlocked_("SCR"),
      b.Production_ID,
      b.Batch_ID,
      new Date(),
      b.Product_ID,
      "",
      "Output Scrap",
      scrap,
      r.Unit || "KG",
      r.Scrap_Reason || "",
      s.User_ID,
      b.Machine,
      b.Branch_ID,
      "WH-SCRAP",
      r.Remarks || "",
      new Date(),
    ]);
  setBatchStatus_(b.Production_ID, "Pending Approval", s.User_ID);
  return { ok: true, message: "Output and QC saved for approval." };
}
function approveBatch_(p) {
  const s = requireSession_(p.session);
  authorize_(s, "Production", "Approve");
  const b = findBatch_(p.id);
  if (String(b.Status) !== "Pending Approval")
    throw new Error("INVALID_STATUS");
  const out = objects_("Production_Output")
    .filter((x) => String(x.Production_ID) === String(b.Production_ID))
    .slice(-1)[0];
  if (!out) throw new Error("RECORD_NOT_FOUND");
  const lock = LockService.getScriptLock();
  const finishedWarehouse =
    p.finishedWarehouse ||
    {
      "UNT-001": "WH-U1-FG",
      "UNT-002": "WH-U2-FG",
      "UNT-003": "WH-U3-FG",
      "UNT-004": "WH-U4-FG",
    }[String(b.Branch_ID)] ||
    "WH-U4-FG";
  lock.waitLock(30000);
  try {
    const movement = updateStockMaster_(
      {
        Branch_ID: b.Branch_ID,
        Warehouse_ID: finishedWarehouse,
        Item_Type: "Finished Goods",
        Item_ID: b.Product_ID,
        Item_Name: b.Product_ID,
        Quantity: Number(out.Good_Qty || 0),
        Unit: "KG",
        Rate: 0,
        Created_By: s.User_ID,
        Remarks: "Approved output " + b.Batch_ID,
        Idempotency_Key: p.idempotencyKey || Utilities.getUuid(),
      },
      Number(out.Good_Qty || 0),
    );
    writeLedger_(
      {
        Transaction_ID: idUnlocked_("FG"),
        Branch_ID: b.Branch_ID,
        Warehouse_ID: finishedWarehouse,
        Item_Type: "Finished Goods",
        Item_ID: b.Product_ID,
        Item_Name: b.Product_ID,
        Quantity: Number(out.Good_Qty || 0),
        Unit: "KG",
        Rate: 0,
        Created_By: s.User_ID,
        Remarks: "Approved production " + b.Batch_ID,
        Idempotency_Key: p.idempotencyKey || "",
      },
      "Stock In",
      movement.opening,
      movement.closing,
    );
    updateRecordField_(
      "Production_Output",
      "Production_ID",
      b.Production_ID,
      "Status",
      "Approved",
    );
    setBatchStatus_(b.Production_ID, "Approved", s.User_ID);
    CacheService.getScriptCache().remove("ERP_DASHBOARD");
    return { ok: true, message: "Batch approved and finished stock posted." };
  } finally {
    lock.releaseLock();
  }
}
function createTransfer_(p) {
  const s = requireSession_(p.session);
  authorize_(s, "Inventory", "Create");
  const r = p.record || {},
    qty = Number(r.Quantity || 0);
  if (
    !r.From_Branch ||
    !r.From_Warehouse ||
    !r.To_Branch ||
    !r.To_Warehouse ||
    !r.Item_ID ||
    qty <= 0
  )
    throw new Error("INVALID_TRANSACTION");
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const id = idUnlocked_("TRF"),
      movement = updateStockMaster_(
        {
          Branch_ID: r.From_Branch,
          Warehouse_ID: r.From_Warehouse,
          Item_Type: r.Item_Type || "Raw Material",
          Item_ID: r.Item_ID,
          Item_Name: r.Item_Name || r.Item_ID,
          Quantity: qty,
          Unit: r.Unit || "KG",
          Rate: 0,
          Created_By: s.User_ID,
          Remarks: "Transfer " + id,
          Idempotency_Key: p.idempotencyKey || "",
        },
        -qty,
      );
    append_unsafe_("Stock_Transfer", [
      id,
      new Date(),
      r.From_Branch,
      r.From_Warehouse,
      r.To_Branch,
      r.To_Warehouse,
      r.Item_Type || "Raw Material",
      r.Item_ID,
      qty,
      r.Unit || "KG",
      "In Transit",
      s.User_ID,
      "",
      new Date(),
      "",
      r.Remarks || "",
      new Date(),
    ]);
    writeLedger_(
      {
        Transaction_ID: id,
        Branch_ID: r.From_Branch,
        Warehouse_ID: r.From_Warehouse,
        Item_Type: r.Item_Type || "Raw Material",
        Item_ID: r.Item_ID,
        Item_Name: r.Item_Name || r.Item_ID,
        Quantity: qty,
        Unit: r.Unit || "KG",
        Rate: 0,
        Created_By: s.User_ID,
        Remarks: "Transfer dispatch " + id,
        Idempotency_Key: p.idempotencyKey || "",
      },
      "Stock Out",
      movement.opening,
      movement.closing,
    );
    return {
      ok: true,
      id: id,
      message: "Transfer dispatched and source stock reduced.",
    };
  } finally {
    lock.releaseLock();
  }
}
function receiveTransfer_(p) {
  const s = requireSession_(p.session);
  authorize_(s, "Inventory", "Edit");
  const tr = objects_("Stock_Transfer").find(
    (x) => String(x.Transfer_ID) === String(p.id),
  );
  if (!tr || String(tr.Status) !== "In Transit")
    throw new Error("INVALID_STATUS");
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const movement = updateStockMaster_(
      {
        Branch_ID: tr.To_Branch,
        Warehouse_ID: tr.To_Warehouse,
        Item_Type: tr.Item_Type,
        Item_ID: tr.Item_ID,
        Item_Name: tr.Item_ID,
        Quantity: Number(tr.Quantity),
        Unit: tr.Unit,
        Rate: 0,
        Created_By: s.User_ID,
        Remarks: "Transfer received " + tr.Transfer_ID,
        Idempotency_Key: p.idempotencyKey || "",
      },
      Number(tr.Quantity),
    );
    updateRecordField_(
      "Stock_Transfer",
      "Transfer_ID",
      tr.Transfer_ID,
      "Status",
      "Received",
    );
    updateRecordField_(
      "Stock_Transfer",
      "Transfer_ID",
      tr.Transfer_ID,
      "Received_By",
      s.User_ID,
    );
    updateRecordField_(
      "Stock_Transfer",
      "Transfer_ID",
      tr.Transfer_ID,
      "Receive_Date",
      new Date(),
    );
    writeLedger_(
      {
        Transaction_ID: tr.Transfer_ID,
        Branch_ID: tr.To_Branch,
        Warehouse_ID: tr.To_Warehouse,
        Item_Type: tr.Item_Type,
        Item_ID: tr.Item_ID,
        Item_Name: tr.Item_ID,
        Quantity: Number(tr.Quantity),
        Unit: tr.Unit,
        Rate: 0,
        Created_By: s.User_ID,
        Remarks: "Transfer receive " + tr.Transfer_ID,
        Idempotency_Key: p.idempotencyKey || "",
      },
      "Stock In",
      movement.opening,
      movement.closing,
    );
    return {
      ok: true,
      message: "Transfer received and destination stock increased.",
    };
  } finally {
    lock.releaseLock();
  }
}

function createPO_(p) {
  const s = requireSession_(p.session);
  authorize_(s, "Inventory", "Create");
  const r = p.record || {},
    items = p.items || [];
  if (!r.Vendor_ID || !r.Delivery_Unit_ID || !items.length)
    throw new Error("INVALID_TRANSACTION");
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const po = idUnlocked_("PO"),
      now = new Date();
    let total = 0;
    items.forEach((x) => {
      const q = Number(x.Ordered_Qty || 0),
        rate = Number(x.Rate || 0);
      if (!x.Material_ID || q <= 0) throw new Error("INVALID_TRANSACTION");
      total += q * rate;
      append_unsafe_("PO_Items", [
        idUnlocked_("POI"),
        po,
        x.Material_ID,
        x.Material_Name || x.Material_ID,
        q,
        x.UOM || "KG",
        rate,
        q * rate,
        0,
        q,
        "Open",
      ]);
    });
    append_unsafe_("Purchase_Orders", [
      po,
      r.PO_Date || now,
      r.Vendor_ID,
      r.Delivery_Unit_ID,
      r.Expected_Date || "",
      "Open",
      total,
      r.Remarks || "",
      s.User_ID,
      now,
      "",
      "",
    ]);
    audit_(s.User_ID, "Inventory", "Create PO", po, r.Delivery_Unit_ID);
    return {
      ok: true,
      id: po,
      message: "Purchase order created with auto-generated PO number.",
    };
  } finally {
    lock.releaseLock();
  }
}

function receivePO_(p) {
  const s = requireSession_(p.session);
  authorize_(s, "Inventory", "Create");
  const r = p.record || {},
    qty = Number(r.Accepted_Qty || 0),
    rejected = Number(r.Rejected_Qty || 0);
  if (!r.PO_ID || !r.Material_ID || !r.Unit_ID || !r.Warehouse_ID || qty <= 0)
    throw new Error("INVALID_TRANSACTION");
  const item = objects_("PO_Items").find(
    (x) =>
      String(x.PO_ID) === String(r.PO_ID) &&
      String(x.Material_ID) === String(r.Material_ID),
  );
  if (!item) throw new Error("RECORD_NOT_FOUND");
  const pending = Number(item.Pending_Qty || 0);
  if (qty > pending + 0.0001) throw new Error("RECEIPT_EXCEEDS_PO");
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const receipt = idUnlocked_("GRN"),
      key = p.idempotencyKey || Utilities.getUuid();
    const movement = updateStockMaster_(
      {
        Branch_ID: r.Unit_ID,
        Warehouse_ID: r.Warehouse_ID,
        Item_Type: "Raw Material",
        Item_ID: r.Material_ID,
        Item_Name: r.Material_Name || r.Material_ID,
        Quantity: qty,
        Unit: r.UOM || item.UOM || "KG",
        Rate: Number(r.Rate || item.Rate || 0),
        Minimum_Level: Number(r.Minimum_Level || 0),
        Maximum_Level: Number(r.Maximum_Level || 0),
        Reorder_Qty: Number(r.Reorder_Qty || 0),
        Created_By: s.User_ID,
        Remarks: "PO receipt " + r.PO_ID,
        Idempotency_Key: key,
      },
      qty,
    );
    append_unsafe_("PO_Receipts", [
      receipt,
      r.PO_ID,
      new Date(),
      r.Vendor_ID || "",
      r.Unit_ID,
      r.Warehouse_ID,
      r.Material_ID,
      r.Material_Name || r.Material_ID,
      qty + rejected,
      qty,
      rejected,
      r.UOM || item.UOM || "KG",
      r.Lot_No || "",
      r.Invoice_No || "",
      Number(r.Rate || item.Rate || 0),
      r.Remarks || "",
      s.User_ID,
      new Date(),
      key,
    ]);
    writeLedger_(
      {
        Transaction_ID: receipt,
        Branch_ID: r.Unit_ID,
        Warehouse_ID: r.Warehouse_ID,
        Item_Type: "Raw Material",
        Item_ID: r.Material_ID,
        Item_Name: r.Material_Name || r.Material_ID,
        Quantity: qty,
        Unit: r.UOM || item.UOM || "KG",
        Rate: Number(r.Rate || item.Rate || 0),
        Created_By: s.User_ID,
        Remarks: "PO receipt " + r.PO_ID,
        Idempotency_Key: key,
      },
      "Stock In",
      movement.opening,
      movement.closing,
    );
    const newReceived = Number(item.Received_Qty || 0) + qty,
      newPending = Math.max(0, Number(item.Ordered_Qty || 0) - newReceived);
    updateRecordField_(
      "PO_Items",
      "PO_Item_ID",
      item.PO_Item_ID,
      "Received_Qty",
      newReceived,
    );
    updateRecordField_(
      "PO_Items",
      "PO_Item_ID",
      item.PO_Item_ID,
      "Pending_Qty",
      newPending,
    );
    updateRecordField_(
      "PO_Items",
      "PO_Item_ID",
      item.PO_Item_ID,
      "Status",
      newPending <= 0 ? "Received" : "Part Received",
    );
    const open = objects_("PO_Items").filter(
      (x) =>
        String(x.PO_ID) === String(r.PO_ID) &&
        String(x.PO_Item_ID) !== String(item.PO_Item_ID) &&
        Number(x.Pending_Qty || 0) > 0,
    );
    updateRecordField_(
      "Purchase_Orders",
      "PO_ID",
      r.PO_ID,
      "Status",
      newPending <= 0 && !open.length ? "Received" : "Part Received",
    );
    CacheService.getScriptCache().remove("ERP_DASHBOARD");
    return {
      ok: true,
      id: receipt,
      closingQty: movement.closing,
      message: "Material received against PO and Unit stock increased.",
    };
  } finally {
    lock.releaseLock();
  }
}
function updateRecordField_(sheet, keyField, key, valueField, value) {
  const sh = db_().getSheetByName(sheet),
    v = sh.getDataRange().getValues(),
    h = v[0],
    ki = h.indexOf(keyField),
    vi = h.indexOf(valueField);
  if (ki < 0 || vi < 0) throw new Error("INVALID_MODULE");
  for (let i = 1; i < v.length; i++)
    if (String(v[i][ki]) === String(key)) {
      sh.getRange(i + 1, vi + 1).setValue(value);
      return;
    }
  throw new Error("RECORD_NOT_FOUND");
}
function authorize_(s, module, action) {
  if (s.Role_ID === "ROL-001") return true;
  const field = "Can_" + action,
    rows = objects_("Permissions"),
    row = rows.find(
      (x) =>
        String(x.Role_ID) === String(s.Role_ID) &&
        (String(x.Module) === String(module) || String(x.Module) === "*"),
    );
  if (!row || !["TRUE", "YES", "1"].includes(String(row[field]).toUpperCase()))
    throw new Error("ACCESS_DENIED");
  return true;
}
function objects_(name) {
  const sh = db_().getSheetByName(name),
    v = sh.getDataRange().getValues();
  if (v.length < 2) return [];
  return v
    .slice(1)
    .filter((r) => r.some((x) => x !== ""))
    .map((r) => Object.fromEntries(v[0].map((h, i) => [h, r[i]])));
}
function db_() {
  const id =
    PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  return id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActive();
}
function id_(prefix) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    return idUnlocked_(prefix);
  } finally {
    lock.releaseLock();
  }
}
function idUnlocked_(prefix) {
  const key = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      "yyyyMMdd",
    ),
    sh = db_().getSheetByName("Sequences"),
    rows = sh.getDataRange().getValues();
  let row = 0,
    n = 0;
  for (let i = 1; i < rows.length; i++)
    if (rows[i][0] === prefix && rows[i][1] === key) {
      row = i + 1;
      n = Number(rows[i][2]);
      break;
    }
  n++;
  if (row) sh.getRange(row, 3).setValue(n);
  else sh.appendRow([prefix, key, n]);
  return prefix + "-" + key + "-" + String(n).padStart(4, "0");
}
function hash_(password, salt) {
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    password + salt,
    Utilities.Charset.UTF_8,
  );
  return bytes
    .map((b) => (b < 0 ? b + 256 : b).toString(16).padStart(2, "0"))
    .join("");
}
function safeEqual_(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
function getSetting_(key) {
  const r = objects_("Settings").find((x) => x.Key === key);
  return r ? r.Value : "";
}
function append_unsafe_(name, row) {
  db_().getSheetByName(name).appendRow(row);
}
function audit_(u, m, a, id, b) {
  append_unsafe_("Audit_Log", [
    Utilities.getUuid(),
    new Date(),
    u,
    m,
    a,
    id,
    "",
    "",
    b,
    "",
  ]);
}
function logError_(e) {
  console.error(e && e.stack ? e.stack : e);
}
function isSuper_(s) {
  return String(s.Role_ID) === "ROL-001";
}
function systemInfo_(p) {
  const ss = db_(),
    now = new Date(),
    settings = objects_("Settings");
  let last = null;
  [
    "Stock_In",
    "Stock_Out",
    "Production_Batches",
    "Users",
    "Settings",
    "Audit_Log",
  ].forEach((n) => {
    const sh = ss.getSheetByName(n);
    if (sh && sh.getLastRow() > 1) {
      const vals = sh
        .getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn())
        .getValues();
      vals.forEach((r) =>
        r.forEach((v) => {
          if (v instanceof Date && (!last || v > last)) last = v;
        }),
      );
    }
  });
  return {
    ok: true,
    message: "Connected",
    company: getSetting_("COMPANY_NAME") || "Shree Mahadhyuti Industries LLP",
    spreadsheetName: ss.getName(),
    spreadsheetUrl: ss.getUrl(),
    version: ERP_VERSION,
    serverTime: now.toISOString(),
    lastDataUpdate: last ? last.toISOString() : "",
    settings: Object.fromEntries(settings.map((x) => [x.Key, x.Value])),
  };
}
function masterConfig_(sheet) {
  const map = {
    Product_Categories: "Category_ID",
    Products: "Product_ID",
    Raw_Materials: "Material_ID",
    Chemicals: "Chemical_ID",
    Units: "Unit_ID",
    Suppliers: "Supplier_ID",
    Customers: "Customer_ID",
    Branches: "Branch_ID",
    Warehouses: "Warehouse_ID",
    Recipes_BOM: "Recipe_ID",
  };
  if (!map[sheet]) throw new Error("INVALID_MODULE");
  return map[sheet];
}
function saveMaster_(p) {
  const s = requireSession_(p.session);
  authorize_(s, "Masters", p.record && p.record._row ? "Edit" : "Create");
  const sheet = String(p.sheet || ""),
    idField = masterConfig_(sheet),
    sh = db_().getSheetByName(sheet),
    headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0],
    r = p.record || {},
    lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    let row = Number(r._row || 0);
    delete r._row;
    if (!r[idField])
      r[idField] = idUnlocked_(
        idField.replace("_ID", "").slice(0, 4).toUpperCase(),
      );
    if (headers.indexOf("Status") >= 0 && !r.Status) r.Status = "Active";
    if (headers.indexOf("Updated_At") >= 0) r.Updated_At = new Date();
    if (headers.indexOf("Created_At") >= 0 && !r.Created_At)
      r.Created_At = new Date();
    const values = headers.map((h) => (r[h] === undefined ? "" : r[h]));
    if (row >= 2) sh.getRange(row, 1, 1, headers.length).setValues([values]);
    else {
      row = sh.getLastRow() + 1;
      sh.getRange(row, 1, 1, headers.length).setValues([values]);
    }
    audit_(
      s.User_ID,
      "Masters",
      p.record && p.record._row ? "Edit" : "Create",
      r[idField],
      s.Branch_ID,
    );
    CacheService.getScriptCache().remove("ERP_DASHBOARD");
    return {
      ok: true,
      id: r[idField],
      message: "Master record saved.",
      row: row,
    };
  } finally {
    lock.releaseLock();
  }
}
function deleteMaster_(p) {
  const s = requireSession_(p.session);
  authorize_(s, "Masters", "Delete");
  const sheet = String(p.sheet || ""),
    idField = masterConfig_(sheet);
  if (["Branches", "Warehouses"].indexOf(sheet) >= 0 && !isSuper_(s))
    throw new Error("ACCESS_DENIED");
  const sh = db_().getSheetByName(sheet),
    rows = objects_(sheet),
    idx = rows.findIndex((x) => String(x[idField]) === String(p.id));
  if (idx < 0) throw new Error("RECORD_NOT_FOUND");
  moveToTrash_(
    sheet,
    idField,
    p.id,
    rows[idx],
    s,
    p.reason || "Deleted from Master Data",
  );
  sh.deleteRow(idx + 2);
  audit_(s.User_ID, "Masters", "Move to Trash", p.id, s.Branch_ID);
  return {
    ok: true,
    message: "Record moved to Trash. It can be restored for 15 days.",
  };
}
function saveUser_(p) {
  const s = requireSession_(p.session);
  if (!isSuper_(s)) throw new Error("ACCESS_DENIED");
  const sh = db_().getSheetByName("Users"),
    headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0],
    r = p.record || {},
    users = objects_("Users"),
    existing = users.find((x) => String(x.User_ID) === String(r.User_ID)),
    duplicate = users.find(
      (x) =>
        String(x.Username).toLowerCase() ===
          String(r.Username || "").toLowerCase() &&
        String(x.User_ID) !== String(r.User_ID || ""),
    );
  if (duplicate) throw new Error("DUPLICATE_USERNAME");
  if (!r.Name || !r.Username || !r.Role_ID || !r.Branch_ID)
    throw new Error("INVALID_TRANSACTION");
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    let row = existing ? users.indexOf(existing) + 2 : 0;
    r.User_ID = r.User_ID || idUnlocked_("USR");
    if (r.Password) {
      if (String(r.Password).length < 8) throw new Error("WEAK_PASSWORD");
      r.Salt = Utilities.getUuid();
      r.Password_Hash = hash_(String(r.Password), r.Salt);
    } else if (existing) {
      r.Salt = existing.Salt;
      r.Password_Hash = existing.Password_Hash;
    } else throw new Error("WEAK_PASSWORD");
    delete r.Password;
    r.Status = r.Status || "Active";
    r.Created_At = existing ? existing.Created_At : new Date();
    r.Updated_At = new Date();
    const values = headers.map((h) => (r[h] === undefined ? "" : r[h]));
    if (row) sh.getRange(row, 1, 1, headers.length).setValues([values]);
    else
      sh.getRange(sh.getLastRow() + 1, 1, 1, headers.length).setValues([
        values,
      ]);
    audit_(
      s.User_ID,
      "Users",
      existing ? "Edit" : "Create",
      r.User_ID,
      r.Branch_ID,
    );
    return { ok: true, id: r.User_ID, message: "User saved successfully." };
  } finally {
    lock.releaseLock();
  }
}
function deleteUser_(p) {
  const s = requireSession_(p.session);
  if (!isSuper_(s)) throw new Error("ACCESS_DENIED");
  if (String(p.id) === String(s.User_ID)) throw new Error("SELF_DELETE");
  const sh = db_().getSheetByName("Users"),
    rows = objects_("Users"),
    i = rows.findIndex((x) => String(x.User_ID) === String(p.id));
  if (i < 0) throw new Error("RECORD_NOT_FOUND");
  moveToTrash_(
    "Users",
    "User_ID",
    p.id,
    rows[i],
    s,
    p.reason || "User access removed",
  );
  sh.deleteRow(i + 2);
  objects_("Sessions")
    .filter((x) => String(x.User_ID) === String(p.id) && x.Status === "Active")
    .forEach((x) => closeSession_(x.Session_ID));
  audit_(s.User_ID, "Users", "Move to Trash", p.id, s.Branch_ID);
  return {
    ok: true,
    message: "User moved to Trash and active sessions were closed.",
  };
}
function closeSession_(id) {
  const sh = db_().getSheetByName("Sessions"),
    v = sh.getDataRange().getValues();
  for (let i = 1; i < v.length; i++)
    if (String(v[i][0]) === String(id))
      sh.getRange(i + 1, 8).setValue("Closed");
}
function savePermissions_(p) {
  const s = requireSession_(p.session);
  if (!isSuper_(s)) throw new Error("ACCESS_DENIED");
  const sh = db_().getSheetByName("Permissions"),
    headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0],
    role = String(p.roleId || "");
  if (role === "ROL-001") throw new Error("ACCESS_DENIED");
  const keep = sh
    .getDataRange()
    .getValues()
    .filter((r, i) => i === 0 || String(r[0]) !== role);
  sh.clearContents();
  sh.getRange(1, 1, keep.length, headers.length).setValues(keep);
  (p.permissions || []).forEach((x) =>
    sh.appendRow(
      headers.map((h) =>
        h === "Role_ID" ? role : x[h] === true ? "TRUE" : x[h] || "FALSE",
      ),
    ),
  );
  audit_(s.User_ID, "Permissions", "Update", role, s.Branch_ID);
  return { ok: true, message: "Role permissions updated." };
}
function saveSettings_(p) {
  const s = requireSession_(p.session);
  if (!isSuper_(s)) throw new Error("ACCESS_DENIED");
  const sh = db_().getSheetByName("Settings"),
    rows = objects_("Settings"),
    headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0],
    settings = p.settings || {};
  if (String(settings.COMPANY_LOGO || "").indexOf("data:image/") === 0)
    settings.COMPANY_LOGO = storeLogo_(String(settings.COMPANY_LOGO));
  Object.keys(settings).forEach((key) => {
    const i = rows.findIndex((x) => String(x.Key) === key),
      rec = [key, String(settings[key]), new Date(), s.User_ID];
    if (i >= 0) sh.getRange(i + 2, 1, 1, headers.length).setValues([rec]);
    else sh.appendRow(rec);
  });
  audit_(s.User_ID, "Settings", "Update", "SYSTEM", s.Branch_ID);
  return {
    ok: true,
    message: "Company settings saved successfully.",
    info: systemInfo_({}),
  };
}
function storeLogo_(dataUrl) {
  const m = dataUrl.match(/^data:(image\/(?:png|jpeg|webp));base64,(.+)$/);
  if (!m) throw new Error("INVALID_LOGO");
  const bytes = Utilities.base64Decode(m[2]);
  if (bytes.length > 500000) throw new Error("LOGO_TOO_LARGE");
  const ext = m[1].split("/")[1].replace("jpeg", "jpg"),
    blob = Utilities.newBlob(
      bytes,
      m[1],
      "VIN_GROUP_LOGO_" + Date.now() + "." + ext,
    ),
    file = DriveApp.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return "https://drive.google.com/uc?export=view&id=" + file.getId();
}
function ensureTrash_() {
  const ss = db_();
  ensureSheet_(ss, "Trash", SHEETS.Trash);
  return ss.getSheetByName("Trash");
}
function moveToTrash_(sheet, keyField, id, record, s, reason) {
  ensureTrash_();
  const now = new Date(),
    purge = new Date(now.getTime() + 15 * 86400000);
  append_unsafe_("Trash", [
    Utilities.getUuid(),
    now,
    purge,
    sheet,
    String(id),
    JSON.stringify(record),
    s.User_ID,
    s.Branch_ID,
    reason || "",
    "Active",
    "",
    "",
  ]);
  return true;
}
function listTrash_(p) {
  const s = requireSession_(p.session);
  if (!isSuper_(s)) authorize_(s, "Trash", "View");
  ensureTrash_();
  purgeExpiredTrash_();
  const rows = objects_("Trash").filter((x) => String(x.Status) === "Active");
  return {
    ok: true,
    rows: isSuper_(s)
      ? rows
      : rows.filter((x) => String(x.Branch_ID) === String(s.Branch_ID)),
    total: rows.length,
    serverTime: new Date().toISOString(),
  };
}
function restoreTrash_(p) {
  const s = requireSession_(p.session);
  authorize_(s, "Trash", "Edit");
  const trash = objects_("Trash"),
    item = trash.find(
      (x) =>
        String(x.Trash_ID) === String(p.id) && String(x.Status) === "Active",
    );
  if (!item) throw new Error("RECORD_NOT_FOUND");
  if (new Date(item.Purge_After).getTime() < Date.now())
    throw new Error("TRASH_EXPIRED");
  const record = JSON.parse(String(item.Record_JSON || "{}")),
    sh = db_().getSheetByName(String(item.Sheet_Name));
  if (!sh) throw new Error("INVALID_MODULE");
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  sh.getRange(sh.getLastRow() + 1, 1, 1, headers.length).setValues([
    headers.map((h) => (record[h] === undefined ? "" : record[h])),
  ]);
  updateRecordField_("Trash", "Trash_ID", item.Trash_ID, "Status", "Restored");
  updateRecordField_(
    "Trash",
    "Trash_ID",
    item.Trash_ID,
    "Restored_At",
    new Date(),
  );
  updateRecordField_(
    "Trash",
    "Trash_ID",
    item.Trash_ID,
    "Restored_By",
    s.User_ID,
  );
  audit_(s.User_ID, "Trash", "Restore", item.Record_ID, s.Branch_ID);
  return { ok: true, message: "Record restored successfully." };
}
function purgeTrash_(p) {
  const s = requireSession_(p.session);
  if (!isSuper_(s)) throw new Error("ACCESS_DENIED");
  const count = purgeExpiredTrash_();
  return {
    ok: true,
    message: count + " expired Trash record(s) permanently deleted.",
    count: count,
  };
}
function purgeExpiredTrash_() {
  const sh = db_().getSheetByName("Trash");
  if (!sh || sh.getLastRow() < 2) return 0;
  const v = sh.getDataRange().getValues(),
    h = v[0],
    pi = h.indexOf("Purge_After"),
    si = h.indexOf("Status");
  let count = 0;
  for (let i = v.length - 1; i >= 1; i--)
    if (
      String(v[i][si]) === "Active" &&
      new Date(v[i][pi]).getTime() < Date.now()
    ) {
      sh.deleteRow(i + 1);
      count++;
    }
  return count;
}
function userMessage_(e) {
  const m = String(e.message || e);
  if (m === "INVALID_LOGIN") return "Username or password is incorrect.";
  if (m === "SESSION_EXPIRED")
    return "Your session has expired. Please sign in again.";
  if (m === "ACCESS_DENIED")
    return "Your role does not have permission for this action.";
  if (m === "CONFIG_SECRET")
    return "Integration setup is incomplete. Contact the administrator.";
  if (m === "INSUFFICIENT_STOCK")
    return "Insufficient stock for this transaction.";
  if (m === "CUSTOMER_REQUIRED")
    return "Select the customer for finished-goods dispatch.";
  if (m === "RECEIPT_EXCEEDS_PO")
    return "Received quantity cannot exceed the pending PO quantity.";
  if (m === "INVALID_TRANSACTION")
    return "Complete all required fields with valid values.";
  if (m === "INVALID_STATUS")
    return "This action is not allowed at the current workflow stage.";
  if (m === "INVALID_CONSUMPTION")
    return "Consumed, returned and waste quantities cannot exceed the issued quantity.";
  if (m === "RECORD_NOT_FOUND")
    return "The requested record was not found or was already removed.";
  if (m === "DUPLICATE_USERNAME") return "This username is already in use.";
  if (m === "WEAK_PASSWORD") return "Use a password of at least 8 characters.";
  if (m === "SELF_DELETE")
    return "You cannot delete your own signed-in account.";
  if (m === "INVALID_LOGO") return "Upload a valid PNG, JPG or WebP logo.";
  if (m === "LOGO_TOO_LARGE") return "The logo must be smaller than 500 KB.";
  if (m === "TRASH_EXPIRED")
    return "This record has passed the 15-day restore period.";
  if (m.indexOf("Lock") >= 0)
    return "Another user is saving data. Wait a moment and try again.";
  return "Unable to complete this request. Retry or contact SystemMaster support.";
}
function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
function seedDemoData() {
  const ss = db_();
  if (ss.getSheetByName("Products").getLastRow() < 2)
    ss.getSheetByName("Products").appendRow([
      "PRD-0001",
      "VIN Plastic Compound A",
      "Plastic Compound",
      "VPC-A",
      "VIN-A",
      "KG",
      1000,
      1000,
      "Demo product",
      "Active",
      new Date(),
      "SYSTEM",
    ]);
  if (ss.getSheetByName("Raw_Materials").getLastRow() < 2)
    ss.getSheetByName("Raw_Materials").appendRow([
      "RM-0001",
      "Plastic Dana",
      "Polymer",
      "PD-01",
      "KG",
      5000,
      1500,
      10000,
      "WH-U4-RM",
      "",
      80,
      "Active",
    ]);
  return "DEMO ONLY data added.";
}
function createBackup() {
  const file = DriveApp.getFileById(db_().getId());
  const copy = file.makeCopy(
    "VIN_GROUP_ERP_BACKUP_" +
      Utilities.formatDate(
        new Date(),
        Session.getScriptTimeZone(),
        "yyyyMMdd_HHmm",
      ),
  );
  return copy.getUrl();
}
