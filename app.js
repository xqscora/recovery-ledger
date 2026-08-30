const state = { entries: [], currentId: null };
const $ = (id) => document.getElementById(id);

function makeEntry(name, dueHours, effort, dependency) {
  return { id: crypto.randomUUID(), name, dueHours, effort, dependency, status: "planned", createdAt: new Date() };
}

function dependencyLabel(value) {
  return { none: "No dependency", data: "Needs one data point", approval: "Needs someone else's reply" }[value];
}

function dependencyAction(value) {
  return { none: "No external handoff is required.", data: "Start by collecting one clearly named data point.", approval: "Start by drafting the request for the pending reply." }[value];
}

function render() {
  const timeline = $("timeline");
  $("stateCount").textContent = `${state.entries.length} ${state.entries.length === 1 ? "state" : "states"}`;
  timeline.replaceChildren();
  if (!state.entries.length) {
    const empty = document.createElement("div");
    empty.className = "ledger-empty";
    empty.textContent = "Add one commitment to see its recovery path.";
    timeline.append(empty);
  }
  for (const entry of state.entries) {
    const row = document.createElement("article");
    row.className = "entry";
    row.dataset.state = entry.status;
    const dot = document.createElement("span");
    dot.className = "dot";
    const body = document.createElement("div");
    const title = document.createElement("div");
    title.className = "entry-title";
    title.textContent = entry.name;
    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = `${entry.effort} min effort · due in ${entry.dueHours}h · ${dependencyLabel(entry.dependency)}`;
    body.append(title, meta);
    const badge = document.createElement("span");
    badge.className = `state ${entry.status}`;
    badge.textContent = entry.status === "recoverable" ? "recoverable" : entry.status;
    row.append(dot, body, badge);
    timeline.append(row);
  }
  updateRecovery();
}

function updateRecovery() {
  const entry = state.entries.find((item) => item.id === state.currentId) || state.entries.at(-1);
  const available = Number($("availableTime").value);
  $("timeOutput").value = `${available} min`;
  if (!entry) {
    $("recoveryCard").innerHTML = "<strong>No active commitment</strong><p>Add a task, then test what changes when time becomes scarce.</p>";
    $("assumptionText").textContent = "The demo needs a commitment before it can recompute a next action.";
    $("markMissedBtn").disabled = true;
    return;
  }
  $("markMissedBtn").disabled = entry.status === "recoverable";
  const slice = Math.min(available, entry.effort);
  const remaining = Math.max(entry.effort - slice, 0);
  const action = entry.status === "planned" ? `Reserve ${slice} minutes for ${entry.name.toLowerCase()}.` : remaining ? `Do the smallest ${slice}-minute slice of ${entry.name.toLowerCase()}, then reassess.` : `Complete ${entry.name.toLowerCase()} in one focused ${slice}-minute block.`;
  $("recoveryCard").innerHTML = `<strong>${action}</strong><p>${remaining ? `${remaining} minutes remain after this slice.` : "This constraint leaves a feasible next step."} ${dependencyAction(entry.dependency)}</p>`;
  $("assumptionText").textContent = `Available time changed to ${available} minutes; effort and dependency stayed visible. The plan recalculates without judging the missed state.`;
}

$("taskForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const entry = makeEntry($("taskName").value.trim(), Number($("dueHours").value), Number($("effort").value), $("dependency").value);
  state.entries.push(entry);
  state.currentId = entry.id;
  render();
});

$("markMissedBtn").addEventListener("click", () => {
  const entry = state.entries.find((item) => item.id === state.currentId) || state.entries.at(-1);
  if (!entry) return;
  entry.status = "recoverable";
  render();
});

$("availableTime").addEventListener("input", updateRecovery);
$("resetBtn").addEventListener("click", () => { state.entries.length = 0; state.currentId = null; render(); });

const initial = makeEntry("Map one household waste stream", 2, 35, "data");
state.entries.push(initial);
state.currentId = initial.id;
render();
