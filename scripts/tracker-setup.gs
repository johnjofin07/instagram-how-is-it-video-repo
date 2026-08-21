// One-time setup for the "How's It — Episode Tracker" Google Sheet.
// Paste into the sheet's Extensions → Apps Script, run setupTracker() once,
// authorize when asked. Rebuilds the tab with checkboxes, dropdowns,
// conditional colors, and an onEdit that auto-fills status/date when both
// platform checkboxes are ticked.
//
// Optional CLI updates (so Claude can update rows without touching your
// formatting): set TOKEN below to a long random string, then Deploy → New
// deployment → Web app → execute as Me → access: Anyone → copy the URL.
// Rows can then be updated with:
//   curl -sL -d '{"token":"...","ep":"007","set":{"YT posted":true,"YT link":"https://..."}}' <url>

const SHEET_NAME = "Tracker";
const TOKEN = "CHANGE-ME-to-a-long-random-string";

const HEADERS = [
  "Ep", "Slug", "Title", "Pillar", "Style mode", "Runtime (s)", "Status",
  "Produced", "QA", "YT posted", "IG posted", "Published",
  "YT link", "IG link", "YT views", "IG views",
  "YT avg % viewed", "IG avg watch (s)", "Retention notes",
];

const STATUSES = ["idea", "scripted", "built", "voiced", "produced", "QA pending", "ready", "published", "superseded"];
const PILLARS = ["Tech system", "Everyday machine"];
const MODES = ["default", "zack-style"];

const ROWS = [
  ["001", "001-netflix", "How Netflix Works", "Tech system", "default", 89, "superseded", "2026-08-17", true, false, false, "", "", "", "", "", "", "", "superseded by 004 — keep unpublished"],
  ["002", "002-google-maps-traffic", "Google Maps Traffic", "Tech system", "default", 107, "published", "2026-08-17", true, false, true, "2026-08-18", "", "", "", "", "", "", "5s cliff; avg watch 8s; survivors past ~10s finish (source of retention rules)"],
  ["003", "003-air-fryer", "Air Fryer", "Everyday machine", "default", 89, "produced", "2026-08-19", false, false, false, "", "", "", "", "", "", "", "v2 hook re-record spliced at 8.63s"],
  ["004", "004-netflix-delivery", "Netflix Is a Delivery Company", "Tech system", "default", 94, "ready", "2026-08-19", false, false, false, "", "", "", "", "", "", "", "retention remake of 001; claim on screen at 0.3s"],
  ["005", "005-undersea-cables", "Undersea Cables", "Tech system", "default", 56.2, "ready", "2026-08-20", false, false, false, "", "", "", "", "", "", "", "first sub-60 episode"],
  ["006", "006-black-box", "Engineers Try to Destroy the Black Box", "Everyday machine", "default", 59.2, "ready", "2026-08-20", false, false, false, "", "", "", "", "", "", "", ""],
  ["007", "007-ai-watermark", "Anthropic Is Watermarking Your Text", "Tech system", "default", 90.9, "ready", "2026-08-21", false, false, false, "", "", "", "", "", "", "", "news peg Aug 2 — SHIP FIRST; over 60s by design"],
  ["008", "008-microwave", "Your Microwave Has Cold Spots", "Everyday machine", "default", 65.7, "QA pending", "2026-08-21", false, false, false, "", "", "", "", "", "", "", "65.7s — over sub-60 target; lightning-led title being considered"],
  ["009", "009-noise-cancel", "Silence, Manufactured", "Everyday machine", "default", 62.9, "ready", "2026-08-21", false, false, false, "", "", "", "", "", "", "", "literal-silence pattern interrupt"],
  ["010", "010-elevator", "The Close Button In Your Elevator Is a Dummy", "Everyday machine", "default", 67, "ready", "2026-08-21", false, false, false, "", "", "", "", "", "", "", ""],
];

const MAX_ROWS = 200; // formatting/validation applied down to here

function setupTracker() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.getSheets()[0];
    sh.setName(SHEET_NAME);
  }
  sh.clear();
  sh.clearConditionalFormatRules();
  sh.getDataValidations(); // no-op read; validations cleared with clear()

  const nCols = HEADERS.length;

  // Ep column stays text so 001 keeps its zeros
  sh.getRange(1, 1, MAX_ROWS, 1).setNumberFormat("@");

  sh.getRange(1, 1, 1, nCols).setValues([HEADERS])
    .setFontWeight("bold").setFontColor("#ffffff").setBackground("#1f2937")
    .setVerticalAlignment("middle");
  sh.setRowHeight(1, 36);
  sh.setFrozenRows(1);
  sh.setFrozenColumns(3);

  sh.getRange(2, 1, ROWS.length, nCols).setValues(ROWS);

  const col = (name) => HEADERS.indexOf(name) + 1;

  // Checkboxes
  for (const c of ["QA", "YT posted", "IG posted"]) {
    sh.getRange(2, col(c), MAX_ROWS - 1, 1).insertCheckboxes();
  }

  // Dropdowns
  const dv = (values) => SpreadsheetApp.newDataValidation().requireValueInList(values, true).setAllowInvalid(false).build();
  sh.getRange(2, col("Status"), MAX_ROWS - 1, 1).setDataValidation(dv(STATUSES));
  sh.getRange(2, col("Pillar"), MAX_ROWS - 1, 1).setDataValidation(dv(PILLARS));
  sh.getRange(2, col("Style mode"), MAX_ROWS - 1, 1).setDataValidation(dv(MODES));

  // Number formats
  sh.getRange(2, col("Runtime (s)"), MAX_ROWS - 1, 1).setNumberFormat("0.0");
  sh.getRange(2, col("YT views"), MAX_ROWS - 1, 2).setNumberFormat("#,##0");
  sh.getRange(2, col("YT avg % viewed"), MAX_ROWS - 1, 1).setNumberFormat("0.0%");
  sh.getRange(2, col("IG avg watch (s)"), MAX_ROWS - 1, 1).setNumberFormat("0.0");
  sh.getRange(2, col("Produced"), MAX_ROWS - 1, 1).setNumberFormat("yyyy-mm-dd");
  sh.getRange(2, col("Published"), MAX_ROWS - 1, 1).setNumberFormat("yyyy-mm-dd");

  // Column widths
  const widths = { "Ep": 45, "Slug": 170, "Title": 280, "Pillar": 130, "Style mode": 100, "Runtime (s)": 85, "Status": 110, "Produced": 100, "QA": 45, "YT posted": 80, "IG posted": 80, "Published": 100, "YT link": 160, "IG link": 160, "YT views": 90, "IG views": 90, "YT avg % viewed": 110, "IG avg watch (s)": 110, "Retention notes": 420 };
  HEADERS.forEach((h, i) => sh.setColumnWidth(i + 1, widths[h] || 100));
  sh.getRange(2, col("Retention notes"), MAX_ROWS - 1, 1).setWrap(true);

  // Conditional colors
  const rules = [];
  const statusRange = sh.getRange(2, col("Status"), MAX_ROWS - 1, 1);
  const chip = (text, bg, fg) =>
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo(text)
      .setBackground(bg).setFontColor(fg).setRanges([statusRange]).build();
  rules.push(chip("published", "#d9ead3", "#274e13"));
  rules.push(chip("ready", "#cfe2f3", "#1c4587"));
  rules.push(chip("QA pending", "#fff2cc", "#7f6000"));
  rules.push(chip("superseded", "#efefef", "#999999"));
  // whole row goes green-tinted once posted on both platforms
  const rowRange = sh.getRange(2, 1, MAX_ROWS - 1, nCols);
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND($J2=TRUE,$K2=TRUE)')
    .setBackground("#f0f9f0").setRanges([rowRange]).build());
  sh.setConditionalFormatRules(rules);

  if (sh.getMaxColumns() > nCols) sh.deleteColumns(nCols + 1, sh.getMaxColumns() - nCols);
}

// Ticking both platform checkboxes marks the episode published and stamps
// today's date (if Published is empty). Runs automatically on edit.
function onEdit(e) {
  const sh = e.range.getSheet();
  if (sh.getName() !== SHEET_NAME || e.range.getRow() < 2) return;
  const c = e.range.getColumn();
  const yt = HEADERS.indexOf("YT posted") + 1;
  const ig = HEADERS.indexOf("IG posted") + 1;
  if (c !== yt && c !== ig) return;
  const row = e.range.getRow();
  if (sh.getRange(row, yt).getValue() === true && sh.getRange(row, ig).getValue() === true) {
    const statusCell = sh.getRange(row, HEADERS.indexOf("Status") + 1);
    if (statusCell.getValue() !== "published") statusCell.setValue("published");
    const pubCell = sh.getRange(row, HEADERS.indexOf("Published") + 1);
    if (!pubCell.getValue()) pubCell.setValue(Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd"));
  }
}

// Optional web app so rows can be updated from the CLI without breaking
// formatting. POST JSON: {"token": "...", "ep": "007", "set": {"YT posted": true}}
// Matches the row by Ep or Slug; column keys must match HEADERS exactly.
function doPost(e) {
  const out = (obj) => ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return out({ ok: false, error: "bad json" }); }
  if (TOKEN === "CHANGE-ME-to-a-long-random-string" || body.token !== TOKEN) return out({ ok: false, error: "bad token" });
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sh.getDataRange().getValues();
  const key = String(body.ep || body.slug || "");
  let rowIdx = -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === key || String(data[i][1]) === key) { rowIdx = i + 1; break; }
  }
  if (rowIdx === -1) {
    if (!body.append) return out({ ok: false, error: `no row for "${key}" (pass "append": true to add)` });
    rowIdx = data.length + 1;
    sh.getRange(rowIdx, 1).setNumberFormat("@").setValue(key);
  }
  const updated = [];
  for (const [name, value] of Object.entries(body.set || {})) {
    const c = HEADERS.indexOf(name) + 1;
    if (c === 0) return out({ ok: false, error: `unknown column "${name}"` });
    sh.getRange(rowIdx, c).setValue(value);
    updated.push(name);
  }
  return out({ ok: true, row: rowIdx, updated });
}
