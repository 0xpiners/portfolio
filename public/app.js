// ── Loading screen ─────────────────────────────────────
(function () {
  const screen = document.getElementById("loadingScreen");
  const fill   = document.getElementById("lsFill");
  if (!screen || !fill) return;
  requestAnimationFrame(() => requestAnimationFrame(() => { fill.style.width = "100%"; }));
  setTimeout(() => { screen.classList.add("ls-out"); }, 1100);
  setTimeout(() => { screen.remove(); }, 1500);
})();

// ── Tab state ──────────────────────────────────────────
const tabs = [
  { id: 'home',     label: 'Home',     icon: 'computer' },
  { id: 'projects', label: 'Projects', icon: 'vm' },
  { id: 'resume',   label: 'Resume',   icon: 'vm' },
  { id: 'contact',  label: 'Contact',  icon: 'vm' },
  { id: 'ctfs',     label: 'CTFs',     icon: 'vm' },
];
let openTabs = ['home'];
let activeTab = 'home';

function computerIcon() {
  return `<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="2" width="14" height="10" rx="1" stroke="currentColor" stroke-width="1.2"/>
    <rect x="5" y="12" width="6" height="1.2" fill="currentColor"/>
    <rect x="3" y="13.2" width="10" height="1" fill="currentColor"/>
  </svg>`;
}

function vmIcon() {
  return `<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="2" width="11" height="8" rx="1" stroke="currentColor" stroke-width="1.1"/>
    <rect x="3.5" y="10" width="4" height="1" fill="currentColor"/>
    <rect x="9" y="7" width="7" height="7" rx="1" fill="#1a1a1a"/>
    <polygon points="10.5,8.2 10.5,12.8 14.5,10.5" fill="#3cb371"/>
  </svg>`;
}

function renderTabs() {
  const bar = document.getElementById('tabBar');
  bar.innerHTML = openTabs.map(id => {
    const t = tabs.find(x => x.id === id);
    const active = id === activeTab ? 'active' : '';
    const icon = t.icon === 'computer' ? computerIcon() : vmIcon();
    return `<div class="tab ${active}" data-tab="${id}">
      ${icon}
      ${t.label}
      <span class="tab__close" data-close="${id}">&#x2715;</span>
    </div>`;
  }).join('');
}

function switchTab(id) {
  if (!openTabs.includes(id)) openTabs.push(id);
  activeTab = id;
  document.querySelectorAll('.vm-screen').forEach(s => s.classList.remove('active'));
  const screen = document.getElementById('screen-' + id);
  if (screen) screen.classList.add('active');
  document.querySelectorAll('.tree-item[data-tab]').forEach(el => {
    el.classList.toggle('active', el.dataset.tab === id);
  });
  renderTabs();
}

function closeTab(id) {
  openTabs = openTabs.filter(t => t !== id);
  if (activeTab === id) activeTab = openTabs[openTabs.length - 1] || null;
  if (activeTab) switchTab(activeTab);
  else {
    document.querySelectorAll('.vm-screen').forEach(s => s.classList.remove('active'));
    renderTabs();
  }
}

document.getElementById('tabBar').addEventListener('click', e => {
  const closeBtn = e.target.closest('[data-close]');
  if (closeBtn) { closeTab(closeBtn.dataset.close); return; }
  const tab = e.target.closest('[data-tab]');
  if (tab) switchTab(tab.dataset.tab);
});

document.querySelectorAll('.tree-item[data-tab]').forEach(el => {
  el.addEventListener('click', () => switchTab(el.dataset.tab));
});

// ── Background code columns ────────────────────────────
const hexLines = () => {
  const lines = [];
  for (let i = 0; i < 120; i++) {
    let row = '';
    for (let j = 0; j < 8; j++) {
      row += Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase() + ' ';
    }
    lines.push(row.trim());
  }
  return lines.join('\n') + '\n' + lines.join('\n');
};

const codeLines = [
  "def complete_show(self, text, line, arglist, state, begidx, endidx):",
  "    typeList = self.get_manager_types()",
  "    if state == 1:",
  "        return [item",
  "            for item in sorted(typeList)",
  "            if item.upper().startswith(text.upper())]",
  "    elif state == 2:",
  "        if arglist[1] not in typeList:",
  "            return []",
  "        pluginList = self.get_manager(arglist[1]).get_plugin_names()",
  "        return [item for item in pluginList]",
  "    else:",
  "        return []",
  "def help_show(self):",
  "    self.io.print_usage(usage)",
  "def do_show(self, input):",
  "    argc, argv = util.parse_args(input)",
  "    if argc == 0:",
  "        for plugin in self.get_manager():",
  "            self.io.print_plugin_info(plugin)",
  "    else:",
  "        plugin = self.get_manager().get_plugin(argv[1])",
  "        self.io.print_plugin_info(plugin)",
];
const doubled = [...codeLines, ...codeLines].join('\n');

document.querySelectorAll('.vm-bg__col').forEach((col, i) => {
  col.textContent = (i % 3 === 1) ? hexLines() : doubled + '\n' + doubled;
});

// ── Toast ──────────────────────────────────────────────
function toast(msg, duration = 2500) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.getElementById("toastContainer").appendChild(el);
  setTimeout(() => el.remove(), duration);
}

// ── Tab history (for revert button) ────────────────────
const tabHistory = [];
const _origSwitchTab = switchTab;
// eslint-disable-next-line no-func-assign
switchTab = function(id) {
  if (activeTab && activeTab !== id) tabHistory.push(activeTab);
  _origSwitchTab(id);
};

// ── Animation toggle ───────────────────────────────────
let animPaused = false;
function toggleAnimation() {
  animPaused = !animPaused;
  document.querySelectorAll(".vm-bg__col").forEach(col => {
    col.style.animationPlayState = animPaused ? "paused" : "running";
  });
  document.getElementById("btnPause").style.color = animPaused ? "#3cb371" : "#e08c3a";
  toast(animPaused ? "Animation paused" : "Animation resumed");
  closeDropdown();
}

// ── Library toggle ─────────────────────────────────────
let libraryVisible = true;
function toggleLibrary() {
  libraryVisible = !libraryVisible;
  document.querySelector(".library").style.display = libraryVisible ? "" : "none";
  toast(libraryVisible ? "Library shown" : "Library hidden");
  closeDropdown();
}

// ── Copy section link ──────────────────────────────────
function copyLink() {
  const url = window.location.href.split("#")[0] + "#" + (activeTab || "home");
  navigator.clipboard.writeText(url).then(() => toast("Link copied: " + url));
  closeDropdown();
}

// ── Grid view ──────────────────────────────────────────
const screenColors = {
  home:     { bg: "#0d1117", fg: "#4a9eff" },
  projects: { bg: "#0d1a0f", fg: "#3cb371" },
  resume:   { bg: "#130d1a", fg: "#a06eff" },
  ctfs:     { bg: "#1a0d0d", fg: "#e74c3c" },
  contact:  { bg: "#1a100d", fg: "#e08c3a" },
};

function openGridView() {
  if (!document.getElementById("gridOverlay")) {
    const overlay = document.createElement("div");
    overlay.className = "grid-overlay";
    overlay.id = "gridOverlay";
    tabs.forEach(t => {
      const c = screenColors[t.id] || { bg: "#1a1a1a", fg: "#888" };
      const card = document.createElement("div");
      card.className = "grid-card";
      card.style.background = c.bg;
      card.style.color = c.fg;
      card.innerHTML = `<span class="grid-card__label">${t.label}</span>`;
      card.addEventListener("click", () => { closeGridView(); switchTab(t.id); });
      overlay.appendChild(card);
    });
    document.querySelector(".main").appendChild(overlay);
  }
  document.getElementById("gridOverlay").classList.add("open");
  closeDropdown();
}

function closeGridView() {
  const o = document.getElementById("gridOverlay");
  if (o) o.classList.remove("open");
}

// ── Dropdown system ────────────────────────────────────
let activeDropdown = null;

const menuDefs = {
  file: () => [
    { label: "Open Tab", disabled: true },
    ...tabs.map(t => ({ label: "    " + t.label, action: () => { switchTab(t.id); closeDropdown(); } })),
    { sep: true },
    { label: "Close Tab", action: () => { if (activeTab) closeTab(activeTab); closeDropdown(); }, disabled: !activeTab },
    { sep: true },
    { label: "Download Resume", action: () => { switchTab("resume"); toast("Opening Resume..."); closeDropdown(); } },
  ],
  edit: () => [
    { label: "Copy Section Link", shortcut: "Ctrl+L", action: copyLink },
    { label: "Focus Search",      shortcut: "Ctrl+F", action: () => { document.getElementById("librarySearch").focus(); closeDropdown(); } },
  ],
  view: () => [
    { label: "Toggle Library",    shortcut: "Ctrl+B", action: toggleLibrary },
    { label: (animPaused ? "Resume" : "Pause") + " Animation", action: toggleAnimation },
    { sep: true },
    { label: "Grid View", action: openGridView },
  ],
  vm: () => [
    { label: "Power On", disabled: true },
    ...tabs.map(t => ({ label: "    " + t.label, action: () => { switchTab(t.id); closeDropdown(); } })),
    { sep: true },
    { label: "Suspend (Close Tab)",  action: () => { if (activeTab) closeTab(activeTab); closeDropdown(); } },
    { label: "Snapshot (Copy Link)", action: copyLink },
  ],
  tabs: () => openTabs.length
    ? openTabs.map(id => {
        const t = tabs.find(x => x.id === id);
        return { label: t.label, checked: id === activeTab, action: () => { switchTab(id); closeDropdown(); } };
      })
    : [{ label: "No open tabs", disabled: true }],
  help: () => [
    { label: "GitHub",             action: () => { window.open("https://github.com/0xpiners", "_blank"); closeDropdown(); } },
    { label: "LinkedIn",           action: () => { toast("LinkedIn coming soon"); closeDropdown(); } },
    { sep: true },
    { label: "Keyboard Shortcuts", action: () => { showShortcuts(); closeDropdown(); } },
    { sep: true },
    { label: "About 0xpiners",     action: () => { switchTab("home"); closeDropdown(); } },
  ],
};

function closeDropdown() {
  if (activeDropdown) {
    activeDropdown.el.remove();
    activeDropdown.trigger.classList.remove("open");
    activeDropdown = null;
  }
}

function openDropdown(name, trigger) {
  if (activeDropdown) {
    const wasSame = activeDropdown.name === name;
    closeDropdown();
    if (wasSame) return;
  }
  const items = menuDefs[name]();
  const dd = document.createElement("div");
  dd.className = "dropdown";
  items.forEach(item => {
    if (item.sep) {
      dd.appendChild(Object.assign(document.createElement("div"), { className: "dropdown-sep" }));
      return;
    }
    const el = document.createElement("div");
    el.className = "dropdown-item" + (item.disabled ? " disabled" : "") + (item.checked ? " checked" : "");
    el.innerHTML = `<span>${item.label}</span>${item.shortcut ? `<span class="shortcut">${item.shortcut}</span>` : ""}`;
    if (item.action && !item.disabled) el.addEventListener("click", item.action);
    dd.appendChild(el);
  });
  trigger.appendChild(dd);
  trigger.classList.add("open");
  activeDropdown = { name, el: dd, trigger };
}

document.getElementById("toolbarMenu").addEventListener("click", e => {
  const item = e.target.closest("[data-menu]");
  if (item) openDropdown(item.dataset.menu, item);
});

document.addEventListener("click", e => {
  if (activeDropdown && !e.target.closest("[data-menu]")) closeDropdown();
});

// ── Toolbar button actions ─────────────────────────────
document.getElementById("btnPause").addEventListener("click", toggleAnimation);
document.getElementById("btnSnapshot").addEventListener("click", copyLink);
document.getElementById("btnRevert").addEventListener("click", () => {
  const prev = tabHistory.pop();
  if (prev) _origSwitchTab(prev);
  else toast("No previous tab");
});
document.getElementById("btnViewSingle").addEventListener("click", () => { closeGridView(); if (!libraryVisible) toggleLibrary(); });
document.getElementById("btnViewFull").addEventListener("click", () => { closeGridView(); toggleLibrary(); });
document.getElementById("btnViewGrid").addEventListener("click", openGridView);
document.getElementById("btnTerminal").addEventListener("click", () => {
  document.getElementById("termOverlay").classList.add("open");
  document.getElementById("termInput").focus();
});

// ── Keyboard shortcuts ─────────────────────────────────
document.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && e.key === "b") { e.preventDefault(); toggleLibrary(); }
  if ((e.ctrlKey || e.metaKey) && e.key === "f") { e.preventDefault(); document.getElementById("librarySearch").focus(); closeDropdown(); }
  if ((e.ctrlKey || e.metaKey) && e.key === "l") { e.preventDefault(); copyLink(); }
  if ((e.ctrlKey || e.metaKey) && e.key === "w") { e.preventDefault(); if (activeTab) closeTab(activeTab); }
  if (e.key === "Escape") { closeDropdown(); closeGridView(); document.getElementById("termOverlay").classList.remove("open"); }
});

function showShortcuts() {
  toast("Ctrl+B: Toggle library  |  Ctrl+F: Search  |  Ctrl+W: Close tab  |  Ctrl+L: Copy link  |  Esc: Close", 4000);
}

// ── Easter egg terminal ────────────────────────────────
document.getElementById("termClose").addEventListener("click", () => {
  document.getElementById("termOverlay").classList.remove("open");
});

const termCmds = {
  help:     "Available commands: help, whoami, ls, clear, exit",
  whoami:   "piners — security researcher & developer",
  ls:       "home/  projects/  resume/  ctfs/  contact/",
  "ls -la": "drwxr-xr-x  piners  home/\ndrwxr-xr-x  piners  projects/\ndrwxr-xr-x  piners  ctfs/\n-rw-r--r--  piners  resume.pdf",
  pwd:      "/home/piners",
  date:     () => new Date().toString(),
  uname:    "Linux portfolio 5.15.0 #1 SMP x86_64 GNU/Linux",
  clear:    "__clear__",
  exit:     "__exit__",
};

function termPrint(html) {
  const body = document.getElementById("termBody");
  const line = document.createElement("div");
  line.innerHTML = html;
  body.appendChild(line);
  body.scrollTop = body.scrollHeight;
}

document.getElementById("termInput").addEventListener("keydown", e => {
  if (e.key !== "Enter") return;
  const input = e.target.value.trim();
  e.target.value = "";
  termPrint(`<span style="color:#e74c3c">[ piners ~ ]#</span> ${input}`);
  if (!input) return;
  const raw = termCmds[input.toLowerCase()];
  const resp = typeof raw === 'function' ? raw() : raw;
  if (resp === "__clear__") {
    document.getElementById("termBody").innerHTML = "";
  } else if (resp === "__exit__") {
    document.getElementById("termOverlay").classList.remove("open");
  } else if (resp) {
    resp.split("\n").forEach(line => termPrint(`<span style="color:#aaa">${line}</span>`));
  } else {
    termPrint(`<span style="color:#e74c3c">bash: ${input}: command not found</span>`);
  }
});

// ── Library search ─────────────────────────────────────
document.getElementById('librarySearch').addEventListener('input', e => {
  const q = e.target.value.trim().toLowerCase();
  const items = document.querySelectorAll('.tree-item--child');
  let anyVisible = false;
  items.forEach(el => {
    const label = el.textContent.trim().toLowerCase();
    const match = !q || label.includes(q);
    el.style.display = match ? '' : 'none';
    if (match) anyVisible = true;
  });
  const parent = document.querySelector('.tree-item:not(.tree-item--child)');
  if (parent) parent.style.display = anyVisible || !q ? '' : 'none';
});

// ── XP clock ───────────────────────────────────────────
function updateXpClock() {
  const el = document.getElementById("xpClock");
  if (!el) return;
  const now = new Date();
  let h = now.getHours(), m = now.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  el.textContent = h + ":" + String(m).padStart(2, "0") + " " + ampm;
}
updateXpClock();
setInterval(updateXpClock, 10000);

// ── XP Tor Browser: minimize / maximize / drag ────────
(function () {
  const win      = document.getElementById("xpTorBrowser");
  const titlebar = document.getElementById("xpTorTitlebar");
  const taskbtn  = document.getElementById("xpTorTaskbtn");
  if (!win || !taskbtn) return;

  // minimize / restore
  function minimize() { win.style.display = "none"; taskbtn.classList.remove("active"); }
  function restore()  { win.style.display = "";     taskbtn.classList.add("active"); }
  document.getElementById("xpTorMin").addEventListener("click", minimize);
  taskbtn.addEventListener("click", () => win.style.display === "none" ? restore() : minimize());

  // maximize / restore-down — keep a saved windowed position
  let saved = { l: "110px", t: "28px", w: "700px", h: "430px" };
  document.getElementById("xpTorMax").addEventListener("click", () => {
    if (win.classList.contains("xp-maximized")) {
      win.classList.remove("xp-maximized");
      win.style.left = saved.l; win.style.top = saved.t;
      win.style.width = saved.w; win.style.height = saved.h;
    } else {
      saved = {
        l: win.style.left   || "110px", t: win.style.top    || "28px",
        w: win.style.width  || "700px", h: win.style.height || "430px",
      };
      win.classList.add("xp-maximized");
      win.style.left = win.style.top = win.style.width = win.style.height = "";
    }
  });

  // drag — clicking title bar restores from maximized then drags (Windows XP behaviour)
  let dragging = false, ox = 0, oy = 0;
  titlebar.addEventListener("mousedown", e => {
    if (e.target.closest(".xp-ctrl")) return;
    e.preventDefault();

    if (win.classList.contains("xp-maximized")) {
      win.classList.remove("xp-maximized");
      win.style.left   = saved.l;
      win.style.top    = saved.t;
      win.style.width  = saved.w;
      win.style.height = saved.h;
    }

    dragging = true;
    const areaRect = document.getElementById("xpArea").getBoundingClientRect();
    const winRect  = win.getBoundingClientRect();
    ox = e.clientX - winRect.left;
    oy = e.clientY - winRect.top;
    win.style.left = (winRect.left - areaRect.left) + "px";
    win.style.top  = (winRect.top  - areaRect.top)  + "px";
    win.style.userSelect = "none";
  });
  document.addEventListener("mousemove", e => {
    if (!dragging) return;
    const area     = document.getElementById("xpArea");
    const areaRect = area.getBoundingClientRect();
    const maxX = area.clientWidth  - win.offsetWidth;
    const maxY = area.clientHeight - win.offsetHeight;
    win.style.left = Math.max(0, Math.min(maxX, e.clientX - areaRect.left - ox)) + "px";
    win.style.top  = Math.max(0, Math.min(maxY, e.clientY - areaRect.top  - oy)) + "px";
  });
  document.addEventListener("mouseup", () => { dragging = false; win.style.userSelect = ""; });
})();

// ── Init ───────────────────────────────────────────────
renderTabs();
switchTab('home');
