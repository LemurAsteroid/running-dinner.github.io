const CSV_FILE = "dinner_plan.csv";
const ORDER = ["Starter", "Main course", "Dessert"];
let teams = [];

const $ = id => document.getElementById(id);

// Minimal CSV parser (handles quoted fields containing commas)
function parseCSV(text) {
  const rows = [];
  let row = [], f = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; }
      else f += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(f); f = ""; }
    else if (c === "\n") { row.push(f); rows.push(row); row = []; f = ""; }
    else if (c !== "\r") f += c;
  }
  if (f !== "" || row.length) { row.push(f); rows.push(row); }
  const head = rows.shift();
  return rows
    .filter(r => r.length > 1)
    .map(r => Object.fromEntries(head.map((h, i) => [h, (r[i] || "").trim()])));
}

const norm = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/\s+/g, " ");
const partners = name => name.split("&").map(norm);

function findTeam(a, b) {
  const want = [norm(a), norm(b)].sort().join("|");
  return teams.find(t => partners(t.team).sort().join("|") === want);
}

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

function showError(msg) {
  $("result").classList.add("hide");
  $("error").textContent = msg;
  $("error").classList.remove("hide");
}

function habitsLine(habits, comment) {
  const none = !habits || norm(habits) === "none";
  const isAllergy = /allerg/i.test(habits + " " + comment);
  const d = el("div", "line");
  d.append(el("span", isAllergy ? "alert" : "", none ? "No dietary restrictions" : habits));
  return d;
}

function commentLine(comment) {
  return el("div", "line" + (comment ? "" : " sub"), comment || "–");
}

function buildRows(t) {
  return [
    {
      course: t["hosting course"], host: true, address: t["my address"], challenge: t["challenge"],
      guests: [
        [t["guest 1"], t["guest 1 eating habits"], t["guest 1 comments"]],
        [t["guest 2"], t["guest 2 eating habits"], t["guest 2 comments"]]
      ]
    },
    { course: t["visit 1 course"], host: false, who: t["visit 1 host"], address: t["visit 1 address"], contact: t["visit 1 contact"] },
    { course: t["visit 2 course"], host: false, who: t["visit 2 host"], address: t["visit 2 address"], contact: t["visit 2 contact"] }
  ].sort((a, b) => ORDER.indexOf(a.course) - ORDER.indexOf(b.course));
}

function render(t) {
  $("teamName").textContent = t.team;
  const body = $("rows");
  body.replaceChildren();
  buildRows(t).forEach(e => {
    const tr = el("tr");
    const th = el("th", "", e.course);
    th.scope = "row";
    th.append(document.createElement("br"), el("span", "tag" + (e.host ? " host" : ""), e.host ? "You host" : "You visit"));
    const addr = el("td", "", e.address);
    const contact = el("td");
    const habits = el("td");
    const comments = el("td");
    if (e.host) {
      contact.append(el("span", "sub", "–"));
      comments.append(el("span", "sub", e.challenge));
      e.guests.forEach(g => {
        habits.append(habitsLine(g[1], g[2]));
      });
    } else {
      contact.append(el("span", "sub", e.contact));
      habits.append(el("span", "sub", "–"));
      comments.append(el("span", "sub", "–"));
    }
    tr.append(th, addr, contact, habits, comments);
    body.append(tr);
  });
  $("result").classList.remove("hide");
}

$("form").addEventListener("submit", ev => {
  ev.preventDefault();
  const a = $("p1").value, b = $("p2").value;
  const t = findTeam(a, b);
  if (!t) {
    showError(`No team found with partners “${a.trim()}” and “${b.trim()}”. Check the spelling of both names.`);
    return;
  }
  $("error").classList.add("hide");
  render(t);
});

fetch(CSV_FILE)
  .then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
  .then(text => { teams = parseCSV(text); $("submit").disabled = false; })
  .catch(() => showError(`Could not load ${CSV_FILE}. Serve this folder with a local web server (for example "python3 -m http.server") instead of opening index.html directly.`));

  