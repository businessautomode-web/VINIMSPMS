// @ts-nocheck -- dynamic Google Sheet columns are validated by the Apps Script backend.
"use client";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
type View =
  | "overview"
  | "inventory"
  | "production"
  | "reports"
  | "masters"
  | "users"
  | "settings"
  | "trash"
  | "help";
type Stock = {
  code: string;
  item: string;
  type: string;
  branch: string;
  warehouse: string;
  qty: number;
  unit: string;
  min: number;
  max: number;
  reorder: number;
};
type Batch = {
  id: string;
  prodId?: string;
  product: string;
  planned: number;
  actual: number;
  scrap: number;
  status: string;
};
type ApiResult = {
  ok: boolean;
  message?: string;
  session?: string;
  user?: { id: string; name: string; role: string; branch: string };
  expiresAt?: string;
  stock?: Record<string, unknown>[];
  batches?: Record<string, unknown>[];
  rows?: Record<string, unknown>[];
  total?: number;
  serverTime?: string;
  lastDataUpdate?: string;
  spreadsheetName?: string;
  spreadsheetUrl?: string;
  company?: string;
  version?: string;
  settings?: Record<string, string>;
  batchId?: string;
};
async function api(body: Record<string, unknown>): Promise<ApiResult> {
  const r = await fetch("/api/erp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = await r
    .json()
    .catch(() => ({ ok: false, message: "Invalid server response." }));
  if (!r.ok || !data.ok)
    throw new Error(data.message || "Unable to connect to company data.");
  return data;
}
const initialStock: Stock[] = [];
const nav: { id: View; label: string; icon: string }[] = [
  { id: "overview", label: "Admin Dashboard", icon: "▦" },
  { id: "production", label: "PMS · Production", icon: "◫" },
  { id: "inventory", label: "IMS · Inventory", icon: "▤" },
  { id: "masters", label: "Masters", icon: "◇" },
  { id: "reports", label: "Reports", icon: "▥" },
  { id: "users", label: "Users & Access", icon: "◎" },
  { id: "trash", label: "Trash & Audit", icon: "♲" },
  { id: "help", label: "User Guide & Support", icon: "?" },
  { id: "settings", label: "Settings", icon: "⚙" },
];
export default function Home() {
  const [session, setSession] = useState(""),
    [user, setUser] = useState({ id: "", name: "", role: "", branch: "" }),
    [view, setView] = useState<View>("overview"),
    [mobile, setMobile] = useState(false),
    [toast, setToast] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [stock, setStock] = useState(initialStock),
    [batches, setBatches] = useState<Batch[]>([]),
    [query, setQuery] = useState(""),
    [lastSync, setLastSync] = useState("");
  const [company, setCompany] = useState({
    name: "Shree Mahadhyuti Industries LLP",
    primary: "#0b2a4a",
    email: "",
    phone: "",
    logo: "",
  });
  function notify(s: string) {
    setToast(s);
    setTimeout(() => setToast(""), 3500);
  }
  const refresh = useCallback(
    async (sid = session) => {
      if (!sid) return;
      setBusy(true);
      try {
        const d = await api({ action: "dashboard", session: sid });
        setStock(
          (d.stock || []).map((x) => ({
            code: String(x.Item_ID || x.Stock_ID || ""),
            item: String(x.Item_Name || x.Item_ID || ""),
            type: String(x.Item_Type || ""),
            branch: String(x.Branch_ID || ""),
            warehouse: String(x.Warehouse_ID || ""),
            qty: Number(x.Quantity || 0),
            unit: String(x.Unit || ""),
            min: Number(x.Minimum_Level || 0),
            max: Number(x.Maximum_Level || 0),
            reorder: Number(x.Reorder_Qty || 0),
          })),
        );
        setBatches(
          (d.batches || []).map((x) => ({
            id: String(x.Batch_ID || ""),
            product: String(x.Product_ID || ""),
            planned: Number(x.Planned_Qty || 0),
            actual: Number(x.Actual_Qty || 0),
            scrap: Number(x.Scrap_Qty || 0),
            status: String(x.Status || "Created"),
          })),
        );
        setLastSync(d.serverTime || new Date().toISOString());
        setError("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Sync failed.");
      } finally {
        setBusy(false);
      }
    },
    [session],
  );
  useEffect(() => {
    if (!session) return;
    const timer = setInterval(() => refresh(session), 60000);
    return () => clearInterval(timer);
  }, [session, refresh]);
  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    try {
      const d = await api({
        action: "login",
        username: String(f.get("username")),
        password: String(f.get("password")),
        device: navigator.userAgent,
      });
      setSession(d.session || "");
      setUser(d.user || { id: "", name: "", role: "", branch: "" });
      await refresh(d.session || "");
      notify("Login successful · Live Sheet connected");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    try {
      await api({ action: "logout", session });
    } catch {}
    setSession("");
    setStock([]);
    setBatches([]);
  }
  const filtered = useMemo(
    () =>
      stock.filter((x) =>
        (x.item + x.code + x.type + x.branch)
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [stock, query],
  );
  if (!session) return <Login submit={login} busy={busy} error={error} />;
  return (
    <div
      className="shell"
      style={{ "--brand": company.primary } as React.CSSProperties}
    >
      {toast && <div className="toast">✓ {toast}</div>}
      <aside className={mobile ? "sidebar open" : "sidebar"}>
        <div className="brand">
          {company.logo ? (
            <img src={company.logo} alt="Company logo" />
          ) : (
            <div className="brandMark">VG</div>
          )}
          <div>
            <b>{company.name}</b>
            <small>PMS + IMS</small>
          </div>
        </div>
        <div className="branchPill">
          <span>●</span>
          <div>
            <small>Active Unit</small>
            <b>{user.branch || "Assigned unit"}</b>
          </div>
        </div>
        <nav>
          {nav.map((n) => (
            <button
              key={n.id}
              className={view === n.id ? "active" : ""}
              onClick={() => {
                setView(n.id);
                setMobile(false);
              }}
            >
              <span>{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>
        <div className="powered">
          Designed by{" "}
          <a href="https://www.systemmaster.in" target="_blank">
            <b>SystemMaster Automations</b>
          </a>
          <a href="tel:+919027965956">+91 90279 65956</a>
          <a href="mailto:connect@systemmaster.in">connect@systemmaster.in</a>
        </div>
      </aside>
      <main className="main">
        <header>
          <button className="menu" onClick={() => setMobile(!mobile)}>
            ☰
          </button>
          <div>
            <h2>{nav.find((n) => n.id === view)?.label}</h2>
            <p>
              {new Date().toLocaleDateString("en-IN", { dateStyle: "full" })} ·
              Last sync:{" "}
              {lastSync
                ? new Date(lastSync).toLocaleTimeString("en-IN")
                : "Waiting"}
            </p>
          </div>
          <div className="headerActions">
            <button
              className="iconBtn"
              onClick={() => refresh()}
              disabled={busy}
            >
              ↻
            </button>
            <div className="avatar">
              {(user.name || "U")
                .split(" ")
                .map((x) => x[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="user">
              <b>{user.name}</b>
              <small>{user.role}</small>
            </div>
            <button className="logout" onClick={logout}>
              Logout
            </button>
          </div>
        </header>
        {error && (
          <div className="syncError">
            {error} <button onClick={() => refresh()}>Retry</button>
          </div>
        )}
        <section className="content">
          {view === "overview" && (
            <Overview
              go={setView}
              stock={stock}
              batches={batches}
              lastSync={lastSync}
            />
          )}{" "}
          {view === "inventory" && (
            <Inventory
              stock={filtered}
              query={query}
              setQuery={setQuery}
              session={session}
              refresh={refresh}
              notify={notify}
            />
          )}{" "}
          {view === "production" && (
            <Production
              notify={notify}
              session={session}
              batches={batches}
              refresh={refresh}
            />
          )}{" "}
          {view === "reports" && <Reports stock={stock} notify={notify} />}{" "}
          {view === "masters" && <Masters session={session} notify={notify} />}{" "}
          {view === "users" && (
            <Users session={session} currentUser={user.id} notify={notify} />
          )}{" "}
          {view === "trash" && <Trash session={session} notify={notify} />}{" "}
          {view === "help" && <Help />}{" "}
          {view === "settings" && (
            <Settings
              session={session}
              company={company}
              setCompany={setCompany}
              notify={notify}
            />
          )}
        </section>
        <footer className="smFooter">
          <span>SystemMaster Automations</span>
          <a href="https://www.systemmaster.in" target="_blank">
            www.systemmaster.in
          </a>
          <a href="tel:+919027965956">+91 90279 65956</a>
          <a href="mailto:connect@systemmaster.in">connect@systemmaster.in</a>
        </footer>
      </main>
    </div>
  );
}
function Login({
  submit,
  busy,
  error,
}: {
  submit: (e: FormEvent<HTMLFormElement>) => void;
  busy: boolean;
  error: string;
}) {
  return (
    <main className="loginPage">
      <section className="loginPitch">
        <div className="loginLogo">VG</div>
        <p className="eyebrow">MANUFACTURING INTELLIGENCE</p>
        <h1>
          Production and inventory.
          <br />
          <span>One clear system.</span>
        </h1>
        <p>
          Track every kilogram—from raw material issue to finished goods—with
          unit-wise visibility and a complete audit trail.
        </p>
        <div className="loginStats">
          <div>
            <b>100%</b>
            <small>Traceable batches</small>
          </div>
          <div>
            <b>Live</b>
            <small>Unit stock</small>
          </div>
          <div>
            <b>A4</b>
            <small>Management reports</small>
          </div>
        </div>
        <footer>
          Designed & developed by <b>System Master</b>
        </footer>
      </section>
      <section className="loginCard">
        <form onSubmit={submit}>
          <div className="mobileLogo">VG</div>
          <p className="eyebrow">SECURE ERP ACCESS</p>
          <h2>Welcome back</h2>
          <p>Sign in to Shree Mahadhyuti Industries LLP PMS + Dual IMS.</p>
          {error && <div className="formError">{error}</div>}
          <label>
            User ID / Username
            <input name="username" required autoComplete="username" />
          </label>
          <label>
            Password
            <input
              name="password"
              required
              type="password"
              autoComplete="current-password"
            />
          </label>
          <label>
            Unit
            <select defaultValue="Delhi Factory">
              <option>Delhi Factory</option>
              <option>All Units</option>
            </select>
          </label>
          <div className="remember">
            <label>
              <input type="checkbox" defaultChecked /> Remember me
            </label>
          </div>
          <button className="primary" disabled={busy}>
            {busy ? "Connecting securely…" : "Sign in securely →"}
          </button>
          <p className="demoHint">
            Uses your live Google Sheets user account. Contact Admin for
            credentials.
          </p>
        </form>
      </section>
    </main>
  );
}
function Overview({
  go,
  stock,
  batches,
  lastSync,
}: {
  go: (v: View) => void;
  stock: Stock[];
  batches: Batch[];
  lastSync: string;
}) {
  const total = (type: string) =>
      stock.filter((x) => x.type === type).reduce((a, x) => a + x.qty, 0),
    low = stock.filter((x) => x.qty <= x.min).length,
    pending = batches.filter(
      (x) => !["Completed", "Approved"].includes(x.status),
    ).length;
  const k = [
    [
      "Raw Material Stock",
      total("Raw Material").toLocaleString() + " KG",
      "Live Sheet",
      "navy",
    ],
    [
      "Chemical Stock",
      total("Chemical").toLocaleString() + " KG",
      low + " low stock",
      "amber",
    ],
    [
      "Finished Goods",
      total("Finished Goods").toLocaleString() + " KG",
      "Live Sheet",
      "green",
    ],
    [
      "Total Stock",
      stock.reduce((a, x) => a + x.qty, 0).toLocaleString() + " KG",
      stock.length + " items",
      "blue",
    ],
    ["Low Stock", String(low), "Needs attention", "red"],
    ["Pending Batches", String(pending), batches.length + " recent", "purple"],
  ];
  return (
    <>
      <div className="welcome">
        <div>
          <p className="eyebrow">LIVE BUSINESS COMMAND CENTER</p>
          <h1>Shree Mahadhyuti Industries LLP operations.</h1>
          <p>
            {lastSync
              ? "Google Sheets synced at " +
                new Date(lastSync).toLocaleTimeString("en-IN")
              : "Connecting to Google Sheets…"}
          </p>
        </div>
      </div>
      <div className="kpiGrid">
        {k.map((x) => (
          <article className={"kpi " + x[3]} key={x[0]}>
            <small>{x[0]}</small>
            <b>{x[1]}</b>
            <span>{x[2]}</span>
          </article>
        ))}
      </div>
      <div className="twoCol">
        <article className="panel">
          <Title title="Production summary" sub="Recent live batches" />
          <BatchTable batches={batches} />
        </article>
        <article className="panel">
          <Title title="Quick actions" sub="Common factory transactions" />
          <div className="quick">
            {[
              ["＋", "New Production", "production"],
              ["⇥", "Stock In", "inventory"],
              ["⇤", "Stock Out", "inventory"],
              ["⇄", "Transfer", "inventory"],
              ["▤", "Live Stock", "inventory"],
              ["▥", "Reports", "reports"],
            ].map((a) => (
              <button key={a[1]} onClick={() => go(a[2] as View)}>
                <i>{a[0]}</i>
                <b>{a[1]}</b>
              </button>
            ))}
          </div>
          {low > 0 && (
            <div className="alert">
              <i>!</i>
              <div>
                <b>{low} item(s) at or below minimum</b>
                <small>Open live stock for details</small>
              </div>
              <button onClick={() => go("inventory")}>View</button>
            </div>
          )}
        </article>
      </div>
    </>
  );
}
function Title({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="panelTitle">
      <div>
        <h3>{title}</h3>
        <p>{sub}</p>
      </div>
      <button>•••</button>
    </div>
  );
}
function Badge({ status }: { status: string }) {
  return (
    <span className={"badge " + status.toLowerCase().replaceAll(" ", "")}>
      {status}
    </span>
  );
}
function BatchTable({ batches }: { batches: Batch[] }) {
  return (
    <div className="tableWrap">
      <table>
        <thead>
          <tr>
            <th>Batch ID</th>
            <th>Product</th>
            <th>Planned</th>
            <th>Actual</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {batches.length ? (
            batches.map((b) => (
              <tr key={b.id}>
                <td>
                  <b>{b.id}</b>
                </td>
                <td>{b.product}</td>
                <td>{b.planned} KG</td>
                <td>{b.actual ? b.actual + " KG" : "—"}</td>
                <td>
                  <Badge status={b.status} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No production batches saved yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
function Inventory({
  stock,
  query,
  setQuery,
  session,
  refresh,
  notify,
}: {
  stock: Stock[];
  query: string;
  setQuery: (s: string) => void;
  session: string;
  refresh: (sid?: string) => Promise<void>;
  notify: (s: string) => void;
}) {
  const [modal, setModal] = useState(false),
    [saving, setSaving] = useState(false),
    [mode, setMode] = useState<"Stock_In" | "Stock_Out">("Stock_In");
  async function add(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    const f = new FormData(e.currentTarget),
      key = crypto.randomUUID();
    try {
      const d = await api({
        action: "append",
        session,
        sheet: mode,
        idempotencyKey: key,
        record: {
          Branch_ID: String(f.get("branch")),
          Warehouse_ID: String(f.get("warehouse")),
          Item_Type: String(f.get("type")),
          Item_ID: String(f.get("itemId")),
          Item_Name: String(f.get("item")),
          Quantity: Number(f.get("qty")),
          Unit: String(f.get("uom") || "KG"),
          Source: String(f.get("source") || ""),
          Destination: String(f.get("customer") || f.get("source") || ""),
          Purpose: String(f.get("purpose") || ""),
          Rate: Number(f.get("rate") || 0),
          Remarks: String(f.get("remarks") || ""),
        },
      });
      setModal(false);
      notify(d.message || "Transaction saved");
      await refresh();
    } catch (err) {
      notify(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }
  return (
    <>
      <Head
        title="Inventory Management"
        sub="Live unit-wise and warehouse-wise Google Sheet stock"
      >
        <button className="secondary" onClick={() => window.print()}>
          Print
        </button>
        <button
          className="secondary"
          onClick={() => {
            setMode("Stock_Out");
            setModal(true);
          }}
        >
          − Stock Out
        </button>
        <button
          className="primary small"
          onClick={() => {
            setMode("Stock_In");
            setModal(true);
          }}
        >
          ＋ Stock In
        </button>
      </Head>
      <div className="miniKpis">
        <article>
          <small>Total items</small>
          <b>{stock.length}</b>
        </article>
        <article>
          <small>Total stock</small>
          <b>{stock.reduce((a, x) => a + x.qty, 0).toLocaleString()} KG</b>
        </article>
        <article>
          <small>Low stock</small>
          <b>{stock.filter((x) => x.qty <= x.min).length}</b>
        </article>
        <article>
          <small>Data source</small>
          <b>Live Sheet</b>
        </article>
      </div>
      <article className="panel">
        <div className="filters">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search item, code, category…"
          />
          <button className="secondary" onClick={() => refresh()}>
            Refresh
          </button>
        </div>
        <StockTable stock={stock} />
      </article>
      <PurchaseAndTransfer
        session={session}
        refresh={refresh}
        notify={notify}
      />
      {modal && (
        <Modal
          title={mode === "Stock_In" ? "New Stock In" : "New Stock Out"}
          close={() => !saving && setModal(false)}
        >
          <form onSubmit={add} className="formGrid">
            <label>
              Item ID / Code
              <input name="itemId" required placeholder="RM-0001" />
            </label>
            <label>
              Item name
              <input name="item" required />
            </label>
            <label>
              Item type
              <select name="type">
                <option>Raw Material</option>
                <option>Chemical</option>
                <option>Finished Goods</option>
              </select>
            </label>
            <label>
              Unit ID
              <input name="branch" required defaultValue="UNT-004" />
            </label>
            <label>
              Warehouse ID
              <input name="warehouse" required defaultValue="WH-U4-RM" />
            </label>
            <label>
              Quantity
              <input
                name="qty"
                required
                type="number"
                min="0.001"
                step="0.001"
              />
            </label>
            <label>
              UOM
              <select name="uom">
                {uoms.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              Rate
              <input name="rate" type="number" min="0" step="0.01" />
            </label>
            <label>
              Source / Destination
              <input name="source" />
            </label>
            {mode === "Stock_Out" && (
              <>
                <label>
                  Customer ID / Name
                  <input
                    name="customer"
                    placeholder="Required for finished goods sale"
                  />
                </label>
                <label>
                  Purpose
                  <select name="purpose">
                    <option>Customer Sale / Dispatch</option>
                    <option>Production Consumption</option>
                    <option>Adjustment</option>
                    <option>Sample</option>
                  </select>
                </label>
              </>
            )}
            <div className="infoBox wide">
              <b>
                System timestamp is generated automatically and cannot be
                edited.
              </b>
            </div>
            <label className="wide">
              Remarks
              <textarea name="remarks" />
            </label>
            <div className="modalActions wide">
              <button
                type="button"
                className="secondary"
                disabled={saving}
                onClick={() => setModal(false)}
              >
                Cancel
              </button>
              <button className="primary small" disabled={saving}>
                {saving ? "Saving securely…" : "Save & update ledger"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
function PurchaseAndTransfer({
  session,
  refresh,
  notify,
}: {
  session: string;
  refresh: (sid?: string) => Promise<void>;
  notify: (s: string) => void;
}) {
  const [mode, setMode] = useState<
    "" | "po" | "receive" | "transfer" | "transferReceive"
  >("");
  const [saving, setSaving] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setSaving(true);
    try {
      let d: ApiResult;
      if (mode === "po")
        d = await api({
          action: "createPO",
          session,
          record: {
            Vendor_ID: String(f.get("vendor")),
            Delivery_Unit_ID: String(f.get("unit")),
            PO_Date: String(f.get("date")),
            Expected_Date: String(f.get("expected")),
            Remarks: String(f.get("remarks")),
          },
          items: [
            {
              Material_ID: String(f.get("materialId")),
              Material_Name: String(f.get("material")),
              Ordered_Qty: Number(f.get("qty")),
              UOM: String(f.get("uom")),
              Rate: Number(f.get("rate")),
            },
          ],
        });
      else if (mode === "receive")
        d = await api({
          action: "receivePO",
          session,
          idempotencyKey: crypto.randomUUID(),
          record: {
            PO_ID: String(f.get("po")),
            Vendor_ID: String(f.get("vendor")),
            Unit_ID: String(f.get("unit")),
            Warehouse_ID: String(f.get("warehouse")),
            Material_ID: String(f.get("materialId")),
            Material_Name: String(f.get("material")),
            Accepted_Qty: Number(f.get("qty")),
            Rejected_Qty: Number(f.get("rejected") || 0),
            UOM: String(f.get("uom")),
            Lot_No: String(f.get("lot")),
            Invoice_No: String(f.get("invoice")),
            Rate: Number(f.get("rate") || 0),
            Remarks: String(f.get("remarks")),
          },
        });
      else if (mode === "transfer")
        d = await api({
          action: "createTransfer",
          session,
          idempotencyKey: crypto.randomUUID(),
          record: {
            From_Unit: String(f.get("fromUnit")),
            From_Warehouse: String(f.get("fromWarehouse")),
            To_Unit: String(f.get("toUnit")),
            To_Warehouse: String(f.get("toWarehouse")),
            Item_Type: String(f.get("type")),
            Item_ID: String(f.get("materialId")),
            Item_Name: String(f.get("material")),
            Quantity: Number(f.get("qty")),
            Unit: String(f.get("uom")),
            Remarks: String(f.get("remarks")),
          },
        });
      else
        d = await api({
          action: "receiveTransfer",
          session,
          id: String(f.get("transferId")),
          idempotencyKey: crypto.randomUUID(),
        });
      notify(d.message || "Saved successfully");
      setMode("");
      await refresh();
    } catch (x) {
      notify(x instanceof Error ? x.message : "Unable to save");
    } finally {
      setSaving(false);
    }
  }
  return (
    <>
      <article className="panel">
        <Title
          title="Procurement & Unit Transfers"
          sub="Vendor PO → Unit 4 receipt → transfer to Unit 3 / 2 / 1"
        />
        <div className="buttonRow">
          <button className="secondary" onClick={() => setMode("po")}>
            Create Purchase Order
          </button>
          <button className="secondary" onClick={() => setMode("receive")}>
            Receive Against PO
          </button>
          <button className="secondary" onClick={() => setMode("transfer")}>
            Dispatch Unit Transfer
          </button>
          <button
            className="primary small"
            onClick={() => setMode("transferReceive")}
          >
            Receive Transfer
          </button>
        </div>
      </article>
      {mode && (
        <Modal
          title={
            {
              po: "Create Raw Material Purchase Order",
              receive: "Receive Material at Unit 4",
              transfer: "Transfer Stock Between Units",
              transferReceive: "Confirm Unit Transfer Receipt",
            }[mode]
          }
          close={() => setMode("")}
        >
          <form className="formGrid" onSubmit={submit}>
            {mode === "po" && (
              <>
                <label>
                  Vendor ID
                  <input name="vendor" required />
                </label>
                <label>
                  Delivery Unit
                  <input name="unit" defaultValue="UNT-004" required />
                </label>
                <label>
                  PO Date
                  <input name="date" type="date" required />
                </label>
                <label>
                  Expected Date
                  <input name="expected" type="date" />
                </label>
                <label>
                  Raw Material ID
                  <input name="materialId" required />
                </label>
                <label>
                  Material Name
                  <input name="material" required />
                </label>
                <label>
                  Order Quantity
                  <input name="qty" type="number" step="0.001" required />
                </label>
                <label>
                  UOM
                  <select name="uom">
                    {uoms.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Rate
                  <input name="rate" type="number" step="0.01" />
                </label>
              </>
            )}
            {mode === "receive" && (
              <>
                <label>
                  PO Number
                  <input name="po" required />
                </label>
                <label>
                  Vendor ID
                  <input name="vendor" required />
                </label>
                <label>
                  Receiving Unit
                  <input name="unit" defaultValue="UNT-004" required />
                </label>
                <label>
                  Receiving Store
                  <input name="warehouse" defaultValue="WH-U4-RM" required />
                </label>
                <label>
                  Raw Material ID
                  <input name="materialId" required />
                </label>
                <label>
                  Material Name
                  <input name="material" required />
                </label>
                <label>
                  Accepted Quantity
                  <input name="qty" type="number" step="0.001" required />
                </label>
                <label>
                  Rejected Quantity
                  <input
                    name="rejected"
                    type="number"
                    step="0.001"
                    defaultValue="0"
                  />
                </label>
                <label>
                  UOM
                  <select name="uom">
                    {uoms.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Lot Number
                  <input name="lot" />
                </label>
                <label>
                  Invoice Number
                  <input name="invoice" />
                </label>
                <label>
                  Rate
                  <input name="rate" type="number" step="0.01" />
                </label>
              </>
            )}
            {mode === "transfer" && (
              <>
                <label>
                  From Unit
                  <input name="fromUnit" defaultValue="UNT-004" required />
                </label>
                <label>
                  From Store
                  <input
                    name="fromWarehouse"
                    defaultValue="WH-U4-RM"
                    required
                  />
                </label>
                <label>
                  To Unit
                  <input name="toUnit" placeholder="UNT-001" required />
                </label>
                <label>
                  To Store
                  <input name="toWarehouse" placeholder="WH-U1-RM" required />
                </label>
                <label>
                  Item Type
                  <select name="type">
                    <option>Raw Material</option>
                    <option>Finished Goods</option>
                  </select>
                </label>
                <label>
                  Material / Product ID
                  <input name="materialId" required />
                </label>
                <label>
                  Item Name
                  <input name="material" required />
                </label>
                <label>
                  Quantity
                  <input name="qty" type="number" step="0.001" required />
                </label>
                <label>
                  UOM
                  <select name="uom">
                    {uoms.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </label>
              </>
            )}
            {mode === "transferReceive" && (
              <label className="wide">
                Transfer Number
                <input name="transferId" required placeholder="TRF-..." />
              </label>
            )}
            {mode !== "transferReceive" && (
              <label className="wide">
                Remarks
                <textarea name="remarks" />
              </label>
            )}
            <div className="modalActions wide">
              <button
                type="button"
                className="secondary"
                onClick={() => setMode("")}
              >
                Cancel
              </button>
              <button className="primary small" disabled={saving}>
                {saving ? "Saving…" : "Save & Post"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
function StockTable({ stock }: { stock: Stock[] }) {
  return (
    <div className="tableWrap">
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Item</th>
            <th>Type</th>
            <th>Unit / Store</th>
            <th>Current Qty</th>
            <th>Minimum</th>
            <th>Maximum</th>
            <th>Suggested Reorder</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {stock.map((x) => (
            <tr key={x.code}>
              <td>
                <b>{x.code}</b>
              </td>
              <td>{x.item}</td>
              <td>{x.type}</td>
              <td>
                {x.branch}
                <small className="cellSub">{x.warehouse}</small>
              </td>
              <td>
                <b>
                  {x.qty.toLocaleString()} {x.unit}
                </b>
              </td>
              <td>
                {x.min} {x.unit}
              </td>
              <td>
                {x.max || "—"} {x.max ? x.unit : ""}
              </td>
              <td>
                {x.qty <= x.min
                  ? (x.reorder || Math.max(0, x.max - x.qty)).toLocaleString() +
                    " " +
                    x.unit
                  : "—"}
              </td>
              <td>
                <Badge
                  status={
                    x.qty <= x.min
                      ? "Critical"
                      : x.max && x.qty >= x.max
                        ? "Overstock"
                        : x.min && x.qty <= x.min * 1.5
                          ? "Reorder Soon"
                          : "Healthy"
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function Production({
  notify,
  session,
  batches,
  refresh,
}: {
  notify: (s: string) => void;
  session: string;
  batches: Batch[];
  refresh: (sid?: string) => Promise<void>;
}) {
  const [mode, setMode] = useState(""),
    [saving, setSaving] = useState(false),
    [selected, setSelected] = useState<Batch | null>(null),
    [detail, setDetail] = useState<any>({ bom: [], inputs: [], outputs: [] });
  async function open(b: Batch, m: string) {
    setSelected(b);
    setMode(m);
    if (m !== "create") {
      try {
        setDetail(await api({ action: "batchDetail", session, id: b.id }));
      } catch (e) {
        notify(e instanceof Error ? e.message : "Unable to load batch");
      }
    }
  }
  async function create(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const f = new FormData(e.currentTarget);
    try {
      const d = await api({
        action: "createBatch",
        session,
        idempotencyKey: crypto.randomUUID(),
        record: {
          Product_ID: String(f.get("product")),
          Planned_Qty: Number(f.get("qty")),
          Branch_ID: String(f.get("branch")),
          Warehouse_ID: String(f.get("warehouse")),
          Machine: String(f.get("machine")),
          Line: String(f.get("line")),
          Shift: String(f.get("shift")),
          Recipe_ID: String(f.get("recipe")),
          Remarks: String(f.get("remarks") || ""),
          Unit: "KG",
        },
      });
      setMode("");
      notify((d.message || "Batch created") + " " + (d.batchId || ""));
      await refresh();
    } catch (err) {
      notify(err instanceof Error ? err.message : "Unable to create batch");
    } finally {
      setSaving(false);
    }
  }
  async function issue() {
    if (!selected) return;
    setSaving(true);
    try {
      const d = await api({
        action: "issueMaterials",
        session,
        id: selected.id,
        idempotencyKey: crypto.randomUUID(),
        items: (detail.bom || []).map((x: any) => ({
          ...x,
          Issued_Qty: Number(x.Required_Qty),
          Warehouse_ID: detail.batch?.Warehouse_ID,
        })),
      });
      notify(d.message || "Materials issued");
      setMode("");
      refresh();
    } catch (e) {
      notify(e instanceof Error ? e.message : "Issue failed");
    } finally {
      setSaving(false);
    }
  }
  async function consume(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return;
    const f = new FormData(e.currentTarget),
      items = (detail.inputs || []).map((x: any) => ({
        Input_ID: x.Input_ID,
        Consumed_Qty: Number(f.get("c_" + x.Input_ID) || 0),
        Returned_Qty: Number(f.get("r_" + x.Input_ID) || 0),
        Waste_Qty: Number(f.get("w_" + x.Input_ID) || 0),
      }));
    setSaving(true);
    try {
      const d = await api({
        action: "saveConsumption",
        session,
        id: selected.id,
        items,
      });
      notify(d.message || "Consumption saved");
      setMode("");
      refresh();
    } catch (e) {
      notify(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }
  async function output(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return;
    const f = new FormData(e.currentTarget);
    setSaving(true);
    try {
      const d = await api({
        action: "saveOutput",
        session,
        id: selected.id,
        record: {
          Good_Qty: Number(f.get("good")),
          Rejected_Qty: Number(f.get("rejected") || 0),
          Rework_Qty: Number(f.get("rework") || 0),
          Scrap_Qty: Number(f.get("scrap") || 0),
          Scrap_Reason: String(f.get("reason") || ""),
          Remarks: String(f.get("remarks") || ""),
        },
      });
      notify(d.message || "QC saved");
      setMode("");
      refresh();
    } catch (e) {
      notify(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }
  async function approve(b: Batch) {
    if (!confirm("Approve this batch and post finished goods stock?")) return;
    try {
      const d = await api({
        action: "approveBatch",
        session,
        id: b.id,
        idempotencyKey: crypto.randomUUID(),
      });
      notify(d.message || "Approved");
      refresh();
    } catch (e) {
      notify(e instanceof Error ? e.message : "Approval failed");
    }
  }
  return (
    <>
      <Head
        title="PMS · Production Management"
        sub="BOM → Issue → Consumption → QC → Approval → Finished Stock"
      >
        <button className="primary small" onClick={() => setMode("create")}>
          ＋ New Production Batch
        </button>
      </Head>
      <div className="process">
        {[
          "Batch Created",
          "Material Issued",
          "In Process",
          "Output & QC",
          "Approved",
        ].map((x, i) => (
          <div key={x}>
            <i>{i + 1}</i>
            <b>{x}</b>
          </div>
        ))}
      </div>
      <article className="panel">
        <Title
          title="Production batches"
          sub="Select the next permitted action for every batch"
        />
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Batch</th>
                <th>Product</th>
                <th>Planned</th>
                <th>Status</th>
                <th>Next action</th>
              </tr>
            </thead>
            <tbody>
              {batches.length ? (
                batches.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <b>{b.id}</b>
                    </td>
                    <td>{b.product}</td>
                    <td>{b.planned} KG</td>
                    <td>
                      <Badge status={b.status} />
                    </td>
                    <td>
                      {b.status === "Created" && (
                        <button
                          className="linkBtn"
                          onClick={() => open(b, "issue")}
                        >
                          Calculate & Issue BOM
                        </button>
                      )}
                      {b.status === "Material Issued" && (
                        <button
                          className="linkBtn"
                          onClick={() => open(b, "consume")}
                        >
                          Consumption / Return
                        </button>
                      )}
                      {b.status === "In Process" && (
                        <button
                          className="linkBtn"
                          onClick={() => open(b, "output")}
                        >
                          Output & QC
                        </button>
                      )}
                      {b.status === "Pending Approval" && (
                        <button
                          className="primary small"
                          onClick={() => approve(b)}
                        >
                          Approve & Post Stock
                        </button>
                      )}
                      {b.status === "Approved" && <span>✓ Closed</span>}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>No production batches yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>
      {mode === "create" && (
        <Modal
          title="Create Production Batch"
          close={() => !saving && setMode("")}
        >
          <form className="formGrid" onSubmit={create}>
            <label>
              Product ID
              <input name="product" required placeholder="PRD-0001" />
            </label>
            <label>
              Planned quantity (KG)
              <input
                name="qty"
                required
                type="number"
                min="0.001"
                step="0.001"
              />
            </label>
            <label>
              Unit ID
              <input name="branch" required defaultValue="UNT-001" />
            </label>
            <label>
              Issue Warehouse
              <input name="warehouse" required defaultValue="WH-U1-RM" />
            </label>
            <label>
              Machine
              <input name="machine" required placeholder="Mixer 1" />
            </label>
            <label>
              Line
              <input name="line" placeholder="Line 1" />
            </label>
            <label>
              Shift
              <select name="shift">
                <option>Morning</option>
                <option>Evening</option>
                <option>Night</option>
              </select>
            </label>
            <label>
              Recipe / BOM ID
              <input name="recipe" required placeholder="BOM-001" />
            </label>
            <label className="wide">
              Remarks
              <textarea name="remarks" />
            </label>
            <div className="modalActions wide">
              <button
                type="button"
                className="secondary"
                onClick={() => setMode("")}
              >
                Cancel
              </button>
              <button className="primary small" disabled={saving}>
                {saving ? "Creating…" : "Create batch"}
              </button>
            </div>
          </form>
        </Modal>
      )}
      {mode === "issue" && (
        <Modal
          title={"BOM Requirement · " + selected?.id}
          close={() => setMode("")}
        >
          <div className="reportHeader bomPrint">
            <div className="brandMark">SMI</div>
            <div>
              <h2>Shree Mahadhyuti Industries LLP</h2>
              <p>VIN Group · Bill of Materials / Production Issue Sheet</p>
            </div>
            <aside>
              <b>Batch</b>
              <span>{selected?.id}</span>
            </aside>
          </div>
          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Required</th>
                  <th>Available</th>
                  <th>Check</th>
                </tr>
              </thead>
              <tbody>
                {(detail.bom || []).map((x: any) => (
                  <tr key={x.Material_ID}>
                    <td>{x.Material_ID}</td>
                    <td>
                      {Number(x.Required_Qty).toFixed(3)} {x.Unit}
                    </td>
                    <td>{Number(x.Available_Qty).toFixed(3)}</td>
                    <td>
                      <Badge
                        status={
                          Number(x.Available_Qty) >= Number(x.Required_Qty)
                            ? "Available"
                            : "Short"
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!(detail.bom || []).length && (
            <div className="formError">
              No active BOM was found. Add material rows in the Recipes/BOM
              Master first.
            </div>
          )}
          <div className="modalActions">
            <button className="secondary" onClick={() => window.print()}>
              Download BOM PDF / Print
            </button>
            <button className="secondary" onClick={() => setMode("")}>
              Cancel
            </button>
            <button
              className="primary small"
              disabled={
                saving ||
                !(detail.bom || []).length ||
                (detail.bom || []).some(
                  (x: any) => Number(x.Available_Qty) < Number(x.Required_Qty),
                )
              }
              onClick={issue}
            >
              Issue all materials
            </button>
          </div>
        </Modal>
      )}
      {mode === "consume" && (
        <Modal
          title={"Consumption · " + selected?.id}
          close={() => setMode("")}
        >
          <form onSubmit={consume}>
            <div className="tableWrap">
              <table>
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Issued</th>
                    <th>Consumed</th>
                    <th>Returned</th>
                    <th>Waste</th>
                  </tr>
                </thead>
                <tbody>
                  {(detail.inputs || []).map((x: any) => (
                    <tr key={x.Input_ID}>
                      <td>{x.Item_ID}</td>
                      <td>{x.Issued_Qty}</td>
                      <td>
                        <input
                          name={"c_" + x.Input_ID}
                          type="number"
                          step="0.001"
                          defaultValue={x.Issued_Qty}
                        />
                      </td>
                      <td>
                        <input
                          name={"r_" + x.Input_ID}
                          type="number"
                          step="0.001"
                          defaultValue="0"
                        />
                      </td>
                      <td>
                        <input
                          name={"w_" + x.Input_ID}
                          type="number"
                          step="0.001"
                          defaultValue="0"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modalActions">
              <button
                type="button"
                className="secondary"
                onClick={() => setMode("")}
              >
                Cancel
              </button>
              <button className="primary small" disabled={saving}>
                Save & start production
              </button>
            </div>
          </form>
        </Modal>
      )}
      {mode === "output" && (
        <Modal
          title={"Output & QC · " + selected?.id}
          close={() => setMode("")}
        >
          <form className="formGrid" onSubmit={output}>
            <label>
              Good quantity
              <input name="good" required type="number" min="0" step="0.001" />
            </label>
            <label>
              Rejected quantity
              <input
                name="rejected"
                type="number"
                min="0"
                step="0.001"
                defaultValue="0"
              />
            </label>
            <label>
              Rework quantity
              <input
                name="rework"
                type="number"
                min="0"
                step="0.001"
                defaultValue="0"
              />
            </label>
            <label>
              Scrap quantity
              <input
                name="scrap"
                type="number"
                min="0"
                step="0.001"
                defaultValue="0"
              />
            </label>
            <label className="wide">
              Scrap reason
              <input name="reason" />
            </label>
            <label className="wide">
              QC remarks
              <textarea name="remarks" />
            </label>
            <div className="modalActions wide">
              <button
                type="button"
                className="secondary"
                onClick={() => setMode("")}
              >
                Cancel
              </button>
              <button className="primary small" disabled={saving}>
                Submit for approval
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
function Reports({
  stock,
  notify,
}: {
  stock: Stock[];
  notify: (s: string) => void;
}) {
  const [unitFilter, setUnitFilter] = useState("ALL"),
    [typeFilter, setTypeFilter] = useState("ALL"),
    [fromDate, setFromDate] = useState(""),
    [toDate, setToDate] = useState("");
  const units = Array.from(new Set(stock.map((x) => x.branch))).filter(Boolean),
    filtered = stock.filter(
      (x) =>
        (unitFilter === "ALL" || x.branch === unitFilter) &&
        (typeFilter === "ALL" || x.type === typeFilter),
    );
  const unitTotals = units.map((u) => ({
      unit: u,
      qty: stock.filter((x) => x.branch === u).reduce((a, x) => a + x.qty, 0),
    })),
    peak = Math.max(1, ...unitTotals.map((x) => x.qty));
  const list = [
    "Daily Production Report",
    "Batch Production Report",
    "Material Consumption Report",
    "Scrap & Variance Report",
    "Live Stock Report",
    "Inventory Ledger",
    "Stock Transfer Report",
    "User Activity & Audit Log",
    "Purchase Order & Pending Receipt Report",
    "Finished Goods Customer Dispatch Report",
  ];
  function csv() {
    const rows = [
      ["Code", "Item", "Type", "Unit", "Warehouse", "Qty", "Unit"],
      ...filtered.map((x) => [
        x.code,
        x.item,
        x.type,
        x.branch,
        x.warehouse,
        x.qty,
        x.unit,
      ]),
    ];
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], {
        type: "text/csv",
      }),
      a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "SHREE_MAHADHYUTI_Stock_Report.csv";
    a.click();
    notify("Filtered CSV downloaded");
  }
  return (
    <>
      <Head
        title="Reports & Analysis"
        sub="Management-ready A4 reports with applied filters"
      >
        <button className="secondary" onClick={csv}>
          Download CSV
        </button>
        <button className="primary small" onClick={() => window.print()}>
          Export PDF / Print
        </button>
      </Head>
      <div className="reportGrid">
        {list.map((r, i) => (
          <article className="reportCard" key={r}>
            <i>{["▦", "◫", "⇄", "△", "▤", "▥", "⇆", "◎"][i]}</i>
            <div>
              <b>{r}</b>
              <small>PDF · CSV · Print</small>
            </div>
            <button
              onClick={() => {
                notify(r + " prepared");
                setTimeout(() => window.print(), 350);
              }}
            >
              Generate →
            </button>
          </article>
        ))}
      </div>
      <article className="panel">
        <Title
          title="Report Filters"
          sub="Apply date range, unit and inventory type before export"
        />
        <div className="filters">
          <label>
            From
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </label>
          <label>
            To
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </label>
          <label>
            Unit
            <select
              value={unitFilter}
              onChange={(e) => setUnitFilter(e.target.value)}
            >
              <option value="ALL">All Units - Combined</option>
              {units.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </label>
          <label>
            Inventory
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="ALL">Raw + Finished Combined</option>
              <option>Raw Material</option>
              <option>Finished Goods</option>
              <option>Chemical</option>
            </select>
          </label>
        </div>
        <div className="trendChart">
          {unitTotals.map((x) => (
            <div key={x.unit}>
              <span>{x.unit}</span>
              <i style={{ width: `${Math.max(4, (x.qty / peak) * 100)}%` }}></i>
              <b>{x.qty.toLocaleString()}</b>
            </div>
          ))}
        </div>
        <small>
          Unit-wise live stock comparison. Date filters apply to transaction
          reports generated from the ledger.
        </small>
      </article>
      <article className="panel printReport">
        <div className="reportHeader">
          <div className="brandMark">VG</div>
          <div>
            <h2>Shree Mahadhyuti Industries LLP</h2>
            <p>PMS + IMS · Live Stock Report</p>
          </div>
          <aside>
            <b>Report Period</b>
            <span>21 Aug 2026</span>
          </aside>
        </div>
        <div className="reportSummary">
          <div>
            <small>Total Items</small>
            <b>{filtered.length}</b>
          </div>
          <div>
            <small>Total Quantity</small>
            <b>{filtered.reduce((a, x) => a + x.qty, 0).toLocaleString()} KG</b>
          </div>
          <div>
            <small>Low Stock</small>
            <b>{filtered.filter((x) => x.qty <= x.min).length}</b>
          </div>
        </div>
        <StockTable stock={filtered} />
        <footer>
          VIN Group Company · Generated through PMS & Dual IMS · Powered by
          System Master · Sunil Tiwari · www.systemmaster.in
        </footer>
      </article>
    </>
  );
}
type MasterField = {
  key: string;
  label: string;
  type?: string;
  required?: boolean;
  options?: string[];
};
type MasterCfg = {
  sheet: string;
  label: string;
  id: string;
  name: string;
  fields: MasterField[];
  columns: string[];
};
const uoms = [
  "KG",
  "GM",
  "MT",
  "PCS",
  "BAG",
  "DRUM",
  "LTR",
  "MTR",
  "ROLL",
  "BOX",
];
const masters: MasterCfg[] = [
  {
    sheet: "Raw_Materials",
    label: "Raw Materials",
    id: "Material_ID",
    name: "Material_Name",
    columns: [
      "Material_Name",
      "Material_Code",
      "Category",
      "Unit",
      "Minimum_Stock",
      "Maximum_Stock",
      "Supplier_ID",
      "Rate",
      "Status",
    ],
    fields: [
      { key: "Material_Name", label: "Material Name", required: true },
      { key: "Material_Code", label: "Material Code", required: true },
      { key: "Category", label: "Material Category" },
      { key: "Unit", label: "UOM", options: uoms, required: true },
      { key: "Minimum_Stock", label: "Minimum Level", type: "number" },
      { key: "Maximum_Stock", label: "Maximum Level", type: "number" },
      { key: "Supplier_ID", label: "Default Vendor ID" },
      { key: "Rate", label: "Standard Rate", type: "number" },
      { key: "Default_Warehouse", label: "Default Warehouse" },
      { key: "Status", label: "Status", options: ["Active", "Inactive"] },
    ],
  },
  {
    sheet: "Suppliers",
    label: "Vendor Master",
    id: "Supplier_ID",
    name: "Supplier_Name",
    columns: [
      "Supplier_Name",
      "GST_No",
      "Contact_Person",
      "Phone",
      "Email",
      "Status",
    ],
    fields: [
      { key: "Supplier_Name", label: "Vendor Name", required: true },
      { key: "GST_No", label: "GST Number" },
      { key: "Contact_Person", label: "Contact Person" },
      { key: "Phone", label: "Phone" },
      { key: "Email", label: "Email", type: "email" },
      { key: "Address", label: "Address" },
      { key: "Status", label: "Status", options: ["Active", "Inactive"] },
    ],
  },
  {
    sheet: "Products",
    label: "Finished Products",
    id: "Product_ID",
    name: "Product_Name",
    columns: [
      "Product_Name",
      "Product_Code",
      "Category",
      "Unit",
      "Standard_Batch_Size",
      "Reorder_Level",
      "Status",
    ],
    fields: [
      { key: "Product_Name", label: "Finished Product Name", required: true },
      { key: "Product_Code", label: "Product Code", required: true },
      { key: "Category", label: "Category" },
      { key: "SKU", label: "SKU" },
      { key: "Unit", label: "UOM", options: uoms, required: true },
      {
        key: "Standard_Batch_Size",
        label: "Standard Batch Size",
        type: "number",
      },
      { key: "Reorder_Level", label: "Reorder Level", type: "number" },
      { key: "Description", label: "Description" },
      { key: "Status", label: "Status", options: ["Active", "Inactive"] },
    ],
  },
  {
    sheet: "Recipes_BOM",
    label: "Recipes / BOM",
    id: "Recipe_ID",
    name: "Product_ID",
    columns: [
      "Product_ID",
      "Material_Type",
      "Material_ID",
      "Standard_Production_Qty",
      "Standard_Qty",
      "Unit",
      "Version",
      "Status",
    ],
    fields: [
      { key: "Product_ID", label: "Finished Product ID", required: true },
      {
        key: "Standard_Production_Qty",
        label: "Output Quantity",
        type: "number",
        required: true,
      },
      {
        key: "Material_Type",
        label: "Material Type",
        options: ["Raw Material", "Chemical", "Packaging"],
        required: true,
      },
      { key: "Material_ID", label: "Material ID", required: true },
      {
        key: "Standard_Qty",
        label: "Required Quantity",
        type: "number",
        required: true,
      },
      { key: "Unit", label: "UOM", options: uoms, required: true },
      { key: "Tolerance", label: "Tolerance %", type: "number" },
      { key: "Version", label: "BOM Version", required: true },
      { key: "Effective_From", label: "Effective From", type: "date" },
      {
        key: "Status",
        label: "Status",
        options: ["Draft", "Active", "Inactive"],
      },
    ],
  },
  {
    sheet: "Branches",
    label: "Units",
    id: "Branch_ID",
    name: "Branch_Name",
    columns: [
      "Branch_Name",
      "Branch_Code",
      "Address",
      "City",
      "State",
      "GST_No",
      "Status",
    ],
    fields: [
      { key: "Branch_Name", label: "Unit Name", required: true },
      { key: "Branch_Code", label: "Unit Code", required: true },
      { key: "Address", label: "Address" },
      { key: "City", label: "City" },
      { key: "State", label: "State" },
      { key: "GST_No", label: "GST Number" },
      { key: "Contact_Person", label: "Contact Person" },
      { key: "Phone", label: "Phone" },
      { key: "Status", label: "Status", options: ["Active", "Inactive"] },
    ],
  },
  {
    sheet: "Warehouses",
    label: "Unit Stores",
    id: "Warehouse_ID",
    name: "Warehouse_Name",
    columns: [
      "Warehouse_Name",
      "Branch_ID",
      "Warehouse_Type",
      "Location",
      "Manager",
      "Status",
    ],
    fields: [
      { key: "Warehouse_Name", label: "Store Name", required: true },
      { key: "Branch_ID", label: "Unit ID", required: true },
      {
        key: "Warehouse_Type",
        label: "Inventory Type",
        options: ["Raw Material", "Finished Goods", "Scrap", "In Transit"],
        required: true,
      },
      { key: "Location", label: "Location" },
      { key: "Manager", label: "Store Manager" },
      { key: "Status", label: "Status", options: ["Active", "Inactive"] },
    ],
  },
  {
    sheet: "Customers",
    label: "Customer Master",
    id: "Customer_ID",
    name: "Customer_Name",
    columns: [
      "Customer_Name",
      "GST_No",
      "Contact_Person",
      "Phone",
      "Email",
      "Status",
    ],
    fields: [
      { key: "Customer_Name", label: "Customer Name", required: true },
      { key: "GST_No", label: "GST Number" },
      { key: "Contact_Person", label: "Contact Person" },
      { key: "Phone", label: "Phone" },
      { key: "Email", label: "Email", type: "email" },
      { key: "Address", label: "Address" },
      { key: "Status", label: "Status", options: ["Active", "Inactive"] },
    ],
  },
  {
    sheet: "Product_Categories",
    label: "Product Categories",
    id: "Category_ID",
    name: "Category_Name",
    columns: ["Category_Name", "Application", "Status"],
    fields: [
      { key: "Category_Name", label: "Category Name", required: true },
      { key: "Application", label: "Application / Use" },
      { key: "Status", label: "Status", options: ["Active", "Inactive"] },
    ],
  },
  {
    sheet: "Chemicals",
    label: "Chemicals & Additives",
    id: "Chemical_ID",
    name: "Chemical_Name",
    columns: [
      "Chemical_Name",
      "Chemical_Code",
      "Unit",
      "Minimum_Level",
      "Supplier_ID",
      "Rate",
      "Status",
    ],
    fields: [
      {
        key: "Chemical_Name",
        label: "Chemical / Additive Name",
        required: true,
      },
      { key: "Chemical_Code", label: "Code", required: true },
      { key: "Unit", label: "UOM", options: uoms, required: true },
      { key: "Minimum_Level", label: "Minimum Level", type: "number" },
      { key: "Supplier_ID", label: "Vendor ID" },
      { key: "Rate", label: "Rate", type: "number" },
      { key: "Storage_Location", label: "Storage Location" },
      { key: "Status", label: "Status", options: ["Active", "Inactive"] },
    ],
  },
  {
    sheet: "Units",
    label: "UOM Master",
    id: "Unit_ID",
    name: "Unit_Name",
    columns: ["Unit_Name", "Symbol", "Decimals", "Status"],
    fields: [
      { key: "Unit_Name", label: "UOM Name", required: true },
      { key: "Symbol", label: "Symbol", required: true },
      { key: "Decimals", label: "Decimal Places", type: "number" },
      { key: "Status", label: "Status", options: ["Active", "Inactive"] },
    ],
  },
];
function Masters({
  session,
  notify,
}: {
  session: string;
  notify: (s: string) => void;
}) {
  const [sheet, setSheet] = useState("Products"),
    [rows, setRows] = useState<Record<string, unknown>[]>([]),
    [modal, setModal] = useState(false),
    [edit, setEdit] = useState<Record<string, unknown>>({});
  const cfg = masters.find((x) => x.sheet === sheet)!;
  const load = useCallback(async () => {
    try {
      const d = await api({ action: "list", session, sheet, limit: 500 });
      setRows(d.rows || []);
    } catch (e) {
      notify(e instanceof Error ? e.message : "Unable to load master");
    }
  }, [session, sheet, notify]);
  useEffect(() => {
    load();
  }, [load]);
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget),
      record = {
        ...edit,
        ...Object.fromEntries(
          cfg.fields.map((field) => [
            field.key,
            String(f.get(field.key) || ""),
          ]),
        ),
      };
    try {
      const d = await api({ action: "saveMaster", session, sheet, record });
      notify(d.message || "Saved");
      setModal(false);
      setEdit({});
      load();
    } catch (x) {
      notify(x instanceof Error ? x.message : "Save failed");
    }
  }
  async function remove(id: unknown) {
    if (!confirm("Delete/deactivate this master record?")) return;
    try {
      const d = await api({ action: "deleteMaster", session, sheet, id });
      notify(d.message || "Deleted");
      load();
    } catch (x) {
      notify(x instanceof Error ? x.message : "Delete failed");
    }
  }
  return (
    <>
      <Head
        title="Master Data"
        sub="Real Google Sheet master records · Add, edit and deactivate"
      >
        <button
          className="primary small"
          onClick={() => {
            setEdit({});
            setModal(true);
          }}
        >
          ＋ Add Record
        </button>
      </Head>
      <div className="masterTabs">
        {masters.map((x) => (
          <button
            className={sheet === x.sheet ? "active" : ""}
            key={x.sheet}
            onClick={() => setSheet(x.sheet)}
          >
            {x.label}
          </button>
        ))}
      </div>
      <article className="panel">
        <Title
          title={cfg.label}
          sub={rows.length + " live records · IDs are generated automatically"}
        />
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                {cfg.columns.map((c) => (
                  <th key={c}>{c.replaceAll("_", " ")}</th>
                ))}
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length ? (
                rows.map((r, i) => (
                  <tr key={String(r[cfg[2]] || i)}>
                    <td>
                      <b>{String(r[cfg.id] || "—")}</b>
                    </td>
                    {cfg.columns.map((c) => (
                      <td key={c}>
                        {c === "Status" ? (
                          <Badge status={String(r[c] || "Active")} />
                        ) : (
                          String(r[c] || "—")
                        )}
                      </td>
                    ))}
                    <td>
                      <button
                        className="linkBtn"
                        onClick={() => {
                          setEdit({ ...r, _row: i + 2 });
                          setModal(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="dangerBtn"
                        onClick={() => remove(r[cfg.id])}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={cfg.columns.length + 2}>
                    No records yet. Add the first record.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>
      {modal && (
        <Modal
          title={(edit._row ? "Edit " : "Add ") + cfg.label}
          close={() => setModal(false)}
        >
          <form className="formGrid" onSubmit={save}>
            <div className="infoBox wide">
              <b>
                {edit._row
                  ? `ID: ${String(edit[cfg.id])}`
                  : "ID will be generated automatically when saved."}
              </b>
            </div>
            {cfg.fields.map((field) => (
              <label key={field.key}>
                {field.label}
                {field.options ? (
                  <select
                    name={field.key}
                    required={field.required}
                    defaultValue={String(edit[field.key] || field.options[0])}
                  >
                    {field.options.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    name={field.key}
                    type={field.type || "text"}
                    required={field.required}
                    step={field.type === "number" ? "0.001" : undefined}
                    defaultValue={String(edit[field.key] || "")}
                  />
                )}
              </label>
            ))}
            <div className="modalActions wide">
              <button
                type="button"
                className="secondary"
                onClick={() => setModal(false)}
              >
                Cancel
              </button>
              <button className="primary small">Save record</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
function Users({
  session,
  currentUser,
  notify,
}: {
  session: string;
  currentUser: string;
  notify: (s: string) => void;
}) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]),
    [modal, setModal] = useState(false),
    [edit, setEdit] = useState<Record<string, unknown>>({});
  const load = useCallback(async () => {
    try {
      const d = await api({
        action: "list",
        session,
        sheet: "Users",
        limit: 500,
      });
      setRows(d.rows || []);
    } catch (e) {
      notify(e instanceof Error ? e.message : "Unable to load users");
    }
  }, [session, notify]);
  useEffect(() => {
    load();
  }, [load]);
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    try {
      const d = await api({
        action: "saveUser",
        session,
        record: {
          ...edit,
          Name: String(f.get("name")),
          Username: String(f.get("username")),
          Password: String(f.get("password")),
          Role_ID: String(f.get("role")),
          Branch_ID: String(f.get("branch")),
          Email: String(f.get("email")),
          Phone: String(f.get("phone")),
          Status: String(f.get("status")),
        },
      });
      notify(d.message || "User saved");
      setModal(false);
      load();
    } catch (x) {
      notify(x instanceof Error ? x.message : "Save failed");
    }
  }
  async function remove(id: unknown) {
    if (!confirm("This user will lose access immediately. Continue?")) return;
    try {
      const d = await api({ action: "deleteUser", session, id });
      notify(d.message || "User deleted");
      load();
    } catch (x) {
      notify(x instanceof Error ? x.message : "Delete failed");
    }
  }
  return (
    <>
      <Head
        title="Users & Access"
        sub="Live users · Role and unit security enforced by backend"
      >
        <button
          className="primary small"
          onClick={() => {
            setEdit({});
            setModal(true);
          }}
        >
          ＋ Add User
        </button>
      </Head>
      <article className="panel">
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Username</th>
                <th>Role</th>
                <th>Unit</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={String(r.User_ID)}>
                  <td>
                    <b>{String(r.Name)}</b>
                    <small className="cellSub">{String(r.User_ID)}</small>
                  </td>
                  <td>{String(r.Username)}</td>
                  <td>{String(r.Role_ID)}</td>
                  <td>{String(r.Branch_ID)}</td>
                  <td>
                    <Badge status={String(r.Status)} />
                  </td>
                  <td>
                    <button
                      className="linkBtn"
                      onClick={() => {
                        setEdit(r);
                        setModal(true);
                      }}
                    >
                      Edit
                    </button>
                    {String(r.User_ID) !== currentUser && (
                      <button
                        className="dangerBtn"
                        onClick={() => remove(r.User_ID)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
      <div className="infoBox">
        <b>Permission meaning</b>
        <p>
          View = read records · Create = add records · Edit = update records ·
          Delete = move records to Trash · Approve = production approval ·
          Export/Print = reports.
        </p>
      </div>
      <PermissionMatrix session={session} notify={notify} />
      {modal && (
        <Modal
          title={edit.User_ID ? "Edit User" : "Add User"}
          close={() => setModal(false)}
        >
          <form className="formGrid" onSubmit={save}>
            <label>
              Full name
              <input
                name="name"
                required
                defaultValue={String(edit.Name || "")}
              />
            </label>
            <label>
              Username
              <input
                name="username"
                required
                defaultValue={String(edit.Username || "")}
              />
            </label>
            <label>
              Password {edit.User_ID && "(blank = unchanged)"}
              <input
                name="password"
                type="password"
                required={!edit.User_ID}
                minLength={8}
              />
            </label>
            <label>
              Role
              <select
                name="role"
                defaultValue={String(edit.Role_ID || "ROL-007")}
              >
                {[
                  ["ROL-001", "Super Admin"],
                  ["ROL-002", "Admin"],
                  ["ROL-003", "Production Manager"],
                  ["ROL-004", "Production Operator"],
                  ["ROL-005", "Inventory Manager"],
                  ["ROL-006", "Stock Operator"],
                  ["ROL-007", "Viewer"],
                ].map((x) => (
                  <option key={x[0]} value={x[0]}>
                    {x[1]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Unit ID
              <input
                name="branch"
                required
                defaultValue={String(edit.Branch_ID || "UNT-001")}
              />
            </label>
            <label>
              Status
              <select
                name="status"
                defaultValue={String(edit.Status || "Active")}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                defaultValue={String(edit.Email || "")}
              />
            </label>
            <label>
              Phone
              <input name="phone" defaultValue={String(edit.Phone || "")} />
            </label>
            <div className="modalActions wide">
              <button
                type="button"
                className="secondary"
                onClick={() => setModal(false)}
              >
                Cancel
              </button>
              <button className="primary small">Save user</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
function Settings({
  session,
  company,
  setCompany,
  notify,
}: {
  session: string;
  company: {
    name: string;
    primary: string;
    email: string;
    phone: string;
    logo: string;
  };
  setCompany: React.Dispatch<
    React.SetStateAction<{
      name: string;
      primary: string;
      email: string;
      phone: string;
      logo: string;
    }>
  >;
  notify: (s: string) => void;
}) {
  const [info, setInfo] = useState<ApiResult>({ ok: false }),
    [loading, setLoading] = useState(false);
  const check = useCallback(async () => {
    setLoading(true);
    try {
      const d = await api({ action: "systemInfo", session });
      setInfo(d);
      const s = d.settings || {};
      setCompany((c) => ({
        ...c,
        name: s.COMPANY_NAME || d.company || c.name,
        primary: s.PRIMARY_COLOR || c.primary,
        email: s.COMPANY_EMAIL || c.email,
        phone: s.COMPANY_PHONE || c.phone,
        logo: s.COMPANY_LOGO || c.logo,
      }));
      notify("Google Sheet connection verified");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Connection failed");
    } finally {
      setLoading(false);
    }
  }, [session, notify, setCompany]);
  useEffect(() => {
    void check();
  }, [session]);
  async function save() {
    try {
      const d = await api({
        action: "saveSettings",
        session,
        settings: {
          COMPANY_NAME: company.name,
          PRIMARY_COLOR: company.primary,
          COMPANY_EMAIL: company.email,
          COMPANY_PHONE: company.phone,
          COMPANY_LOGO: company.logo,
        },
      });
      notify(d.message || "Settings saved");
      check();
    } catch (e) {
      notify(e instanceof Error ? e.message : "Save failed");
    }
  }
  function logo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500000) {
      notify("Logo must be below 500 KB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      setCompany({ ...company, logo: String(reader.result) });
    reader.readAsDataURL(file);
  }
  return (
    <>
      <Head
        title="Company & System Settings"
        sub="Live connection, branding and operational configuration"
      >
        <button className="secondary" onClick={check}>
          {loading ? "Checking…" : "↻ Test connection"}
        </button>
      </Head>
      <div className="settingsGrid">
        <article className="panel">
          <h3>Company profile & logo</h3>
          <div className="formGrid">
            <label>
              Company name
              <input
                value={company.name}
                onChange={(e) =>
                  setCompany({ ...company, name: e.target.value })
                }
              />
            </label>
            <label>
              Primary colour
              <div className="colorField">
                <input
                  type="color"
                  value={company.primary}
                  onChange={(e) =>
                    setCompany({ ...company, primary: e.target.value })
                  }
                />
                <input
                  value={company.primary}
                  onChange={(e) =>
                    setCompany({ ...company, primary: e.target.value })
                  }
                />
              </div>
            </label>
            <label>
              Email
              <input
                value={company.email}
                onChange={(e) =>
                  setCompany({ ...company, email: e.target.value })
                }
              />
            </label>
            <label>
              Phone
              <input
                value={company.phone}
                onChange={(e) =>
                  setCompany({ ...company, phone: e.target.value })
                }
              />
            </label>
            <label className="wide">
              Upload company logo (PNG/JPG, max 500 KB)
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={logo}
              />
            </label>
            {company.logo && (
              <div className="logoPreview wide">
                <img src={company.logo} alt="Preview" />
                <button
                  className="dangerBtn"
                  onClick={() => setCompany({ ...company, logo: "" })}
                >
                  Remove
                </button>
              </div>
            )}
            <button className="primary small wide" onClick={save}>
              Save company profile
            </button>
          </div>
        </article>
        <article className="panel">
          <h3>Google Sheets integration</h3>
          <div className="connectionStatus">
            <i className={info.ok ? "online" : "offline"}>●</i>
            <div>
              <b>{info.ok ? "Connected & Live" : "Not connected"}</b>
              <small>Secure Vercel → Apps Script → Google Sheet</small>
            </div>
          </div>
          <dl className="systemInfo">
            <div>
              <dt>Spreadsheet</dt>
              <dd>{info.spreadsheetName || "Checking…"}</dd>
            </div>
            <div>
              <dt>Spreadsheet link</dt>
              <dd>
                {info.spreadsheetUrl ? (
                  <a href={info.spreadsheetUrl} target="_blank">
                    Open connected Google Sheet ↗
                  </a>
                ) : (
                  "Not available"
                )}
              </dd>
            </div>
            <div>
              <dt>Web API URL</dt>
              <dd>Configured securely in Vercel · URL hidden</dd>
            </div>
            <div>
              <dt>Last connection</dt>
              <dd>
                {info.serverTime
                  ? new Date(info.serverTime).toLocaleString("en-IN")
                  : "—"}
              </dd>
            </div>
            <div>
              <dt>Last data update</dt>
              <dd>
                {info.lastDataUpdate
                  ? new Date(info.lastDataUpdate).toLocaleString("en-IN")
                  : "No operational entry yet"}
              </dd>
            </div>
            <div>
              <dt>System version</dt>
              <dd>{info.version || "—"}</dd>
            </div>
          </dl>
          <div className="safeNote">
            🔒 The API secret and deployment URL are never exposed in the
            browser.
          </div>
        </article>
      </div>
    </>
  );
}
function PermissionMatrix({
  session,
  notify,
}: {
  session: string;
  notify: (s: string) => void;
}) {
  const [role, setRole] = useState("ROL-007"),
    [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>({});
  const modules = [
    "Dashboard",
    "Inventory",
    "Production",
    "Masters",
    "Reports",
    "Trash",
  ];
  const rights = [
    "View",
    "Create",
    "Edit",
    "Delete",
    "Approve",
    "Export",
    "Print",
  ];
  useEffect(() => {
    void (async () => {
      try {
        const d = await api({
            action: "list",
            session,
            sheet: "Permissions",
            limit: 500,
          }),
          next: Record<string, Record<string, boolean>> = {};
        (d.rows || [])
          .filter((r) => String(r.Role_ID) === role)
          .forEach((r) => {
            next[String(r.Module)] = {};
            rights.forEach(
              (x) =>
                (next[String(r.Module)][x] = ["TRUE", "YES", "1"].includes(
                  String(r["Can_" + x]).toUpperCase(),
                )),
            );
          });
        setMatrix(next);
      } catch (e) {
        notify(e instanceof Error ? e.message : "Unable to load permissions");
      }
    })();
  }, [role, session]);
  function toggle(module: string, right: string) {
    setMatrix((m) => ({
      ...m,
      [module]: { ...(m[module] || {}), [right]: !m[module]?.[right] },
    }));
  }
  async function save() {
    try {
      const permissions = modules.map((module) => ({
        Module: module,
        ...Object.fromEntries(
          rights.map((x) => ["Can_" + x, !!matrix[module]?.[x]]),
        ),
      }));
      const d = await api({
        action: "savePermissions",
        session,
        roleId: role,
        permissions,
      });
      notify(d.message || "Permissions saved");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Permission save failed");
    }
  }
  return (
    <article className="panel permissionPanel">
      <div className="panelTitle">
        <div>
          <h3>Role Permission Matrix</h3>
          <p>Backend-enforced module and action rights</p>
        </div>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="ROL-002">Admin</option>
          <option value="ROL-003">Production Manager</option>
          <option value="ROL-004">Production Operator</option>
          <option value="ROL-005">Inventory Manager</option>
          <option value="ROL-006">Stock Operator</option>
          <option value="ROL-007">Viewer</option>
        </select>
      </div>
      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>Module</th>
              {rights.map((x) => (
                <th key={x}>{x}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modules.map((module) => (
              <tr key={module}>
                <td>
                  <b>{module}</b>
                </td>
                {rights.map((right) => (
                  <td key={right}>
                    <input
                      type="checkbox"
                      checked={!!matrix[module]?.[right]}
                      onChange={() => toggle(module, right)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="buttonRow">
        <button className="primary small" onClick={save}>
          Save role permissions
        </button>
      </div>
    </article>
  );
}
function Trash({
  session,
  notify,
}: {
  session: string;
  notify: (s: string) => void;
}) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]),
    [loading, setLoading] = useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await api({ action: "listTrash", session });
      setRows(d.rows || []);
    } catch (e) {
      notify(e instanceof Error ? e.message : "Unable to load Trash");
    } finally {
      setLoading(false);
    }
  }, [session]);
  useEffect(() => {
    void load();
  }, [session]);
  async function restore(id: unknown) {
    if (!confirm("Restore this record to its original module?")) return;
    try {
      const d = await api({ action: "restoreTrash", session, id });
      notify(d.message || "Record restored");
      load();
    } catch (e) {
      notify(e instanceof Error ? e.message : "Restore failed");
    }
  }
  return (
    <>
      <Head
        title="Trash & Audit"
        sub="Deleted records remain recoverable for 15 days"
      >
        <button className="secondary" onClick={load}>
          {loading ? "Refreshing…" : "↻ Refresh"}
        </button>
      </Head>
      <div className="infoBox">
        <b>Controlled deletion</b>
        <p>
          Every deletion records the module, record ID, user, unit, reason,
          deletion time and permanent-purge date. Restored records retain the
          complete audit trail.
        </p>
      </div>
      <article className="panel">
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Module</th>
                <th>Record</th>
                <th>Deleted by</th>
                <th>Deleted at</th>
                <th>Permanent purge</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.length ? (
                rows.map((r) => (
                  <tr key={String(r.Trash_ID)}>
                    <td>
                      <b>{String(r.Sheet_Name)}</b>
                    </td>
                    <td>{String(r.Record_ID)}</td>
                    <td>
                      {String(r.Deleted_By)}
                      <small className="cellSub">
                        {String(r.Reason || "No reason supplied")}
                      </small>
                    </td>
                    <td>
                      {new Date(String(r.Deleted_At)).toLocaleString("en-IN")}
                    </td>
                    <td>
                      {new Date(String(r.Purge_After)).toLocaleDateString(
                        "en-IN",
                      )}
                    </td>
                    <td>
                      <button
                        className="linkBtn"
                        onClick={() => restore(r.Trash_ID)}
                      >
                        Restore
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>Trash is empty.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>
    </>
  );
}
function Help() {
  const [lang, setLang] = useState<"en" | "hi">("en");
  const en = [
    [
      "1. Initial Setup",
      "Create units, warehouses, units, products, raw materials, chemicals, suppliers and users. Configure role permissions before operational entry.",
    ],
    [
      "2. Opening Stock",
      "Use IMS → Stock In. Select the correct unit, store, item type and item code; enter opening quantity and write “Opening Stock” as the source.",
    ],
    [
      "3. Daily Inventory",
      "Use Stock In for purchases/returns and Stock Out for consumption, dispatch or adjustment. The system updates Stock Master and Inventory Ledger automatically.",
    ],
    [
      "4. Recipe / BOM",
      "Create an active BOM for each product. Define standard production quantity and every material/chemical quantity with unit, version and tolerance.",
    ],
    [
      "5. Production",
      "Create batch → calculate BOM → issue materials → record consumption/return/waste → enter output and QC → manager approval → finished stock posting.",
    ],
    [
      "6. Transfers",
      "Dispatch from the source unit/store and receive at the destination unit. Stock remains In Transit until receipt is confirmed.",
    ],
    [
      "7. Users & Permissions",
      "Grant View, Create, Edit, Delete, Approve, Export and Print separately by role and module. Super Admin controls users and sensitive settings.",
    ],
    [
      "8. Delete & Restore",
      "Delete moves permitted records to Trash. Audit history records who deleted them. Restore within 15 days; expired records are permanently removed.",
    ],
    [
      "9. Reports",
      "Use stock, production, consumption, scrap, variance, transfer and audit reports. Apply filters before PDF/CSV export.",
    ],
    [
      "10. Daily Closing Check",
      "Review pending batches, low stock, in-transit transfers, rejected output, scrap variance and last synchronization before closing the day.",
    ],
  ];
  const hi = [
    [
      "1. प्रारंभिक सेटअप",
      "ब्रांच, वेयरहाउस, यूनिट, प्रोडक्ट, रॉ मटेरियल, केमिकल, सप्लायर और यूज़र बनाएं। काम शुरू करने से पहले रोल परमिशन सेट करें।",
    ],
    [
      "2. ओपनिंग स्टॉक",
      "IMS → Stock In खोलें। सही ब्रांच, वेयरहाउस, आइटम टाइप और कोड चुनें; ओपनिंग मात्रा भरें और Source में “Opening Stock” लिखें।",
    ],
    [
      "3. दैनिक इन्वेंटरी",
      "खरीद या रिटर्न के लिए Stock In और उपयोग, डिस्पैच या एडजस्टमेंट के लिए Stock Out करें। Stock Master और Ledger अपने-आप अपडेट होंगे।",
    ],
    [
      "4. रेसिपी / BOM",
      "हर प्रोडक्ट की Active BOM बनाएं। Standard Production Quantity तथा हर मटेरियल/केमिकल की मात्रा, यूनिट, वर्जन और टॉलरेंस भरें।",
    ],
    [
      "5. प्रोडक्शन",
      "Batch बनाएं → BOM calculate करें → material issue करें → consumption/return/waste भरें → output एवं QC करें → manager approval → finished stock पोस्ट होगा।",
    ],
    [
      "6. स्टॉक ट्रांसफर",
      "Source branch/warehouse से dispatch और destination पर receive करें। Receive होने तक stock In Transit रहेगा।",
    ],
    [
      "7. यूज़र एवं परमिशन",
      "हर role/module के लिए View, Create, Edit, Delete, Approve, Export और Print अलग-अलग दें।",
    ],
    [
      "8. डिलीट एवं रिस्टोर",
      "Delete होने पर record Trash में जाएगा। किसने delete किया इसकी history रहेगी। 15 दिन के भीतर restore कर सकते हैं।",
    ],
    [
      "9. रिपोर्ट",
      "Stock, production, consumption, scrap, variance, transfer और audit reports में filter लगाकर PDF/CSV निकालें।",
    ],
    [
      "10. दैनिक क्लोजिंग",
      "दिन समाप्त करने से पहले pending batches, low stock, in-transit transfers, rejection, scrap variance और last sync check करें।",
    ],
  ];
  return (
    <>
      <Head
        title="User Guide & Support"
        sub="Complete operating guide for Shree Mahadhyuti Industries LLP · VIN Group"
      >
        <div className="languageSwitch">
          <button
            className={lang === "en" ? "active" : ""}
            onClick={() => setLang("en")}
          >
            English
          </button>
          <button
            className={lang === "hi" ? "active" : ""}
            onClick={() => setLang("hi")}
          >
            हिन्दी
          </button>
        </div>
      </Head>
      <div className="guideGrid">
        {(lang === "en" ? en : hi).map((x) => (
          <article className="panel" key={x[0]}>
            <h3>{x[0]}</h3>
            <p>{x[1]}</p>
          </article>
        ))}
      </div>
      <article className="supportCard">
        <div>
          <small>IMPLEMENTATION & TECHNICAL SUPPORT</small>
          <h2>SystemMaster Automations</h2>
          <p>Sunil Tiwari · New Delhi</p>
        </div>
        <div>
          <a href="tel:+919027965956">+91 90279 65956</a>
          <a href="mailto:connect@systemmaster.in">connect@systemmaster.in</a>
          <a href="https://www.systemmaster.in" target="_blank">
            www.systemmaster.in ↗
          </a>
        </div>
      </article>
    </>
  );
}
function Head({
  title,
  sub,
  children,
}: {
  title: string;
  sub: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="pageHead">
      <div>
        <h1>{title}</h1>
        <p>{sub}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}
function Modal({
  title,
  close,
  children,
}: {
  title: string;
  close: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="modalBack"
      onMouseDown={(e) => e.currentTarget === e.target && close()}
    >
      <div className="modal">
        <div className="modalHead">
          <h2>{title}</h2>
          <button onClick={close}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
