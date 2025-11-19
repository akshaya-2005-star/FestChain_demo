// ==========================================================
// FestChain — Full app.js (A → Z) — Ready to paste & run
// - Uses uploaded ABI path: /mnt/data/DOC-20251031-WA0109..
// - Falls back to embedded ABI (your provided ABI)
// - Connects to Ganache at http://127.0.0.1:7545
// - Exposes helpers: setActiveAccount, createEvent, registerForEvent, voteFor, markPresent, loadEvents
// - Defensive checks, explicit gas, and clear console diagnostics
// ==========================================================

// ---------------- CONFIG ----------------
const RPC_URL = "http://127.0.0.1:7545";
const ABI_URL = "C:/Users/Akshu/Downloads/festchain_demo (1)"; // uploaded file path (tooling will transform to URL)
const CONTRACT_ADDRESS = "0xB87DCA7Ca07C2B7087D022e62eD3BE95ba8BB105"; // your contract address

// Create web3 instance (assumes web3 lib is already loaded in index.html)
const web3 = new Web3(RPC_URL);

// ---------------- EMBEDDED ABI (fallback) ----------------
// This is the ABI you previously provided — used if ABI_URL fetch fails.
const EMBEDDED_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_title", "type": "string" },
      { "internalType": "string", "name": "_date", "type": "string" },
      { "internalType": "uint256", "name": "_capacity", "type": "uint256" }
    ],
    "name": "createEvent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "uint256", "name": "eventId", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "title", "type": "string" }
    ],
    "name": "EventCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "uint256", "name": "eventId", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "attendee", "type": "address" }
    ],
    "name": "MarkedPresent",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_eventId", "type": "uint256" },
      { "internalType": "address", "name": "_attendee", "type": "address" }
    ],
    "name": "markPresent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "uint256", "name": "eventId", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "attendee", "type": "address" }
    ],
    "name": "Registered",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_eventId", "type": "uint256" }
    ],
    "name": "registerForEvent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_eventId", "type": "uint256" }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "uint256", "name": "eventId", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "voter", "type": "address" }
    ],
    "name": "Voted",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "eventCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "events",
    "outputs": [
      { "internalType": "string", "name": "title", "type": "string" },
      { "internalType": "string", "name": "date", "type": "string" },
      { "internalType": "uint256", "name": "capacity", "type": "uint256" },
      { "internalType": "uint256", "name": "registeredCount", "type": "uint256" },
      { "internalType": "uint256", "name": "voteCount", "type": "uint256" },
      { "internalType": "bool", "name": "active", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_eventId", "type": "uint256" }],
    "name": "getEvent",
    "outputs": [
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "string", "name": "", "type": "string" },
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "bool", "name": "", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "address", "name": "", "type": "address" }],
    "name": "present",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "address", "name": "", "type": "address" }],
    "name": "registered",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "address", "name": "", "type": "address" }],
    "name": "voted",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  }
];

// ---------------- Globals ----------------
let contract = null;
let accounts = [];
let currentAccountIndex = 0;

// ---------------- Utility: safe HTML escape ----------------
function escapeHtml(str) {
  if (str === null || typeof str === "undefined") return "";
  return String(str).replace(/[&<>"'`=\/]/g, function (s) {
    return {
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;',
      "'": '&#39;', '/': '&#x2F;', '`': '&#x60;', '=': '&#x3D;'
    }[s];
  });
}

// ---------------- Load ABI helper ----------------
async function loadAbiFromUrl(url) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Fetch failed: " + res.status);
    const json = await res.json();
    console.log("ABI fetched from", url);
    return json;
  } catch (e) {
    console.warn("ABI fetch failed for", url, ":", e && e.message ? e.message : e);
    return null;
  }
}

// ---------------- Initialize contract & accounts ----------------
async function initializeContract() {
  // Attempt to load ABI from uploaded path first
  let abi = await loadAbiFromUrl(ABI_URL);
  if (!abi) {
    console.log("Using embedded ABI fallback.");
    abi = EMBEDDED_ABI;
  }

  // create contract instance
  try {
    contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
    console.log("Contract instance created at", CONTRACT_ADDRESS);
  } catch (e) {
    console.error("Failed to create contract instance:", e);
    throw e;
  }

  // load accounts
  try {
    accounts = await web3.eth.getAccounts();
    console.log("Node accounts loaded:", accounts);
  } catch (e) {
    console.error("Failed to load accounts:", e);
    accounts = [];
  }

  if (!accounts || accounts.length === 0) {
    console.warn("Warning: No accounts found. Make sure Ganache is running at " + RPC_URL);
  }
}

// ---------------- Account helper ----------------
function setActiveAccount(index) {
  if (!accounts || accounts.length === 0) {
    console.warn("No accounts available.");
    return;
  }
  if (index < 0 || index >= accounts.length) {
    console.error("Invalid account index:", index);
    return;
  }
  currentAccountIndex = index;
  console.log("Active account set to index", index, "address:", accounts[index]);
  const acctInfo = document.getElementById("accountInfo");
  if (acctInfo) acctInfo.innerText = "Active account: " + accounts[index];
}

// ---------------- Contract operations ----------------
async function createEvent(title, date, capacity) {
  if (!contract) { console.error("Contract not initialized"); return; }
  if (!accounts || accounts.length === 0) { console.error("No accounts available"); return; }
  const from = accounts[currentAccountIndex];
  console.log("createEvent() from", from, { title, date, capacity });

  try {
    const receipt = await contract.methods.createEvent(title, date, capacity)
      .send({ from, gas: 3000000, gasPrice: web3.utils.toWei('1','gwei') });
    console.log("createEvent receipt:", receipt);
    await loadEvents();
  } catch (err) {
    console.error("createEvent error:", err && err.message ? err.message : err);
    // diagnostics
    try { console.log("contract admin:", await contract.methods.admin().call()); } catch (_) {}
    try { console.log("on-chain code prefix:", (await web3.eth.getCode(CONTRACT_ADDRESS)).slice(0, 60)); } catch (_) {}
  }
}

async function registerForEvent(eventId) {
  if (!contract) { console.error("Contract not initialized"); return; }
  const from = accounts[currentAccountIndex];
  try {
    const receipt = await contract.methods.registerForEvent(eventId)
      .send({ from, gas: 3000000, gasPrice: web3.utils.toWei('1','gwei') });
    console.log("registerForEvent receipt:", receipt);
    await loadEvents();
  } catch (err) {
    console.error("registerForEvent error:", err && err.message ? err.message : err);
  }
}

async function voteFor(eventId) {
  if (!contract) { console.error("Contract not initialized"); return; }
  const from = accounts[currentAccountIndex];
  try {
    const receipt = await contract.methods.vote(eventId)
      .send({ from, gas: 3000000, gasPrice: web3.utils.toWei('1','gwei') });
    console.log("voteFor receipt:", receipt);
    await loadEvents();
  } catch (err) {
    console.error("voteFor error:", err && err.message ? err.message : err);
  }
}

async function markPresent(eventId, attendeeAddress) {
  if (!contract) { console.error("Contract not initialized"); return; }
  const from = accounts[currentAccountIndex];
  try {
    const receipt = await contract.methods.markPresent(eventId, attendeeAddress)
      .send({ from, gas: 3000000, gasPrice: web3.utils.toWei('1','gwei') });
    console.log("markPresent receipt:", receipt);
    await loadEvents();
  } catch (err) {
    console.error("markPresent error:", err && err.message ? err.message : err);
  }
}

// ---------------- Read & Render ----------------
async function loadEvents() {
  if (!contract) { console.log("loadEvents: contract not ready"); return; }

  // verify contract bytecode exists at address
  try {
    const code = await web3.eth.getCode(CONTRACT_ADDRESS);
    if (!code || code === "0x") {
      console.error("No bytecode found at contract address:", CONTRACT_ADDRESS);
      const listDiv = document.getElementById("eventsList");
      if (listDiv) listDiv.innerHTML = "<i>No contract deployed at configured address.</i>";
      return;
    }
  } catch (e) {
    console.error("Error checking bytecode:", e);
    return;
  }

  // fetch event count
  let count;
  try {
    const raw = await contract.methods.eventCount().call();
    count = Number(raw);
  } catch (e) {
    console.error("Error reading eventCount():", e);
    return;
  }

  console.log("loadEvents: eventCount =", count);
  const listDiv = document.getElementById("eventsList");
  if (!listDiv) {
    console.warn("No DOM element with id 'eventsList' found. Skipping render.");
    return;
  }
  listDiv.innerHTML = "";

  for (let i = 0; i < count; i++) {
    try {
      const ev = await contract.methods.getEvent(i).call();
      // ev array: [title, date, capacity, registeredCount, voteCount, active]
      const title = ev[0];
      const date = ev[1];
      const capacity = Number(ev[2]);
      const registeredCount = Number(ev[3]);
      const voteCount = Number(ev[4]);
      const active = ev[5];

      const card = document.createElement("div");
      card.className = "card";
      card.style.margin = "8px";
      card.style.padding = "8px";
      card.style.border = "1px solid #ddd";
      card.innerHTML = `
        <div style="max-width:70%;">
          <strong>${escapeHtml(title)}</strong><br/>
          <small>${escapeHtml(date)}</small><br/>
          Capacity: ${registeredCount} / ${capacity} <br/>
          Votes: ${voteCount} <br/>
          Active: ${active}
        </div>
        <div style="text-align:right;">
          <button onclick="registerForEvent(${i})">Register</button>
          <button onclick="voteFor(${i})" style="margin-left:6px;">Vote</button>
        </div>
      `;
      listDiv.appendChild(card);
    } catch (e) {
      console.error("Error reading event", i, e);
    }
  }
}

// ---------------- Expose helpers to window ----------------
function exposeHelpers() {
  window.setActiveAccount = setActiveAccount;
  window.createEvent = createEvent;
  window.registerForEvent = registerForEvent;
  window.voteFor = voteFor;
  window.markPresent = markPresent;
  window.loadEvents = loadEvents;
  window.accounts = accounts; // may update after init
}

// ---------------- Init ----------------
async function init() {
  try {
    console.log("FestChain app starting. RPC:", RPC_URL, "Contract:", CONTRACT_ADDRESS);
    await initializeContract();
    exposeHelpers();

    // set a default active account if available
    if (accounts && accounts.length > 0) {
      currentAccountIndex = 0;
      const acctInfo = document.getElementById("accountInfo");
      if (acctInfo) acctInfo.innerText = "Active account: " + accounts[0];
    }

    // initial render
    await loadEvents();

    // auto-refresh to keep UI in sync during demo
    setInterval(() => {
      loadEvents().catch(() => {});
    }, 2500);

    console.log("Init complete. Helpers available: setActiveAccount, createEvent, registerForEvent, voteFor, markPresent, loadEvents");
  } catch (err) {
    console.error("Init failed:", err && err.message ? err.message : err);
  }
}

// Kick off when page loads
window.addEventListener("load", init);