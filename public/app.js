// ── Tab state ──────────────────────────────────────────
const tabs = [
	{ id: 'home', label: 'Home', icon: 'computer' },
	{ id: 'projects', label: 'Projects', icon: 'vm' },
	{ id: 'resume', label: 'Resume', icon: 'vm' },
	{ id: 'ctfs', label: 'CTFs', icon: 'vm' },
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
	bar.innerHTML = openTabs
		.map((id) => {
			const t = tabs.find((x) => x.id === id);
			const active = id === activeTab ? 'active' : '';
			const icon = t.icon === 'computer' ? computerIcon() : vmIcon();
			return `<div class="tab ${active}" data-tab="${id}">
      ${icon}
      ${t.label}
      <span class="tab__close" data-close="${id}">&#x2715;</span>
    </div>`;
		})
		.join('');
}

function switchTab(id) {
	if (!openTabs.includes(id)) openTabs.push(id);
	activeTab = id;
	document.querySelectorAll('.vm-screen').forEach((s) => s.classList.remove('active'));
	const screen = document.getElementById('screen-' + id);
	if (screen) screen.classList.add('active');
	document.querySelectorAll('.tree-item[data-tab]').forEach((el) => {
		el.classList.toggle('active', el.dataset.tab === id);
	});
	renderTabs();
}

function closeTab(id) {
	openTabs = openTabs.filter((t) => t !== id);
	if (activeTab === id) activeTab = openTabs[openTabs.length - 1] || null;
	if (activeTab) switchTab(activeTab);
	else {
		document.querySelectorAll('.vm-screen').forEach((s) => s.classList.remove('active'));
		renderTabs();
	}
}

document.getElementById('tabBar').addEventListener('click', (e) => {
	const closeBtn = e.target.closest('[data-close]');
	if (closeBtn) {
		closeTab(closeBtn.dataset.close);
		return;
	}
	const tab = e.target.closest('[data-tab]');
	if (tab) switchTab(tab.dataset.tab);
});

document.querySelectorAll('.tree-item[data-tab]').forEach((el) => {
	el.addEventListener('click', () => switchTab(el.dataset.tab));
});

// ── Background code columns ────────────────────────────
const hexLines = () => {
	const lines = [];
	for (let i = 0; i < 120; i++) {
		let row = '';
		for (let j = 0; j < 8; j++) {
			row +=
				Math.floor(Math.random() * 256)
					.toString(16)
					.padStart(2, '0')
					.toUpperCase() + ' ';
		}
		lines.push(row.trim());
	}
	return lines.join('\n') + '\n' + lines.join('\n');
};

const codeLines = [
	'def complete_show(self, text, line, arglist, state, begidx, endidx):',
	'    typeList = self.get_manager_types()',
	'    if state == 1:',
	'        return [item',
	'            for item in sorted(typeList)',
	'            if item.upper().startswith(text.upper())]',
	'    elif state == 2:',
	'        if arglist[1] not in typeList:',
	'            return []',
	'        pluginList = self.get_manager(arglist[1]).get_plugin_names()',
	'        return [item for item in pluginList]',
	'    else:',
	'        return []',
	'def help_show(self):',
	'    self.io.print_usage(usage)',
	'def do_show(self, input):',
	'    argc, argv = util.parse_args(input)',
	'    if argc == 0:',
	'        for plugin in self.get_manager():',
	'            self.io.print_plugin_info(plugin)',
	'    else:',
	'        plugin = self.get_manager().get_plugin(argv[1])',
	'        self.io.print_plugin_info(plugin)',
];
const doubled = [...codeLines, ...codeLines].join('\n');

document.querySelectorAll('.vm-bg__col').forEach((col, i) => {
	col.textContent = i % 3 === 1 ? hexLines() : doubled + '\n' + doubled;
});

// ── Toast ──────────────────────────────────────────────
function toast(msg, duration = 2500) {
	const el = document.createElement('div');
	el.className = 'toast';
	el.textContent = msg;
	document.getElementById('toastContainer').appendChild(el);
	setTimeout(() => el.remove(), duration);
}

// ── Tab history (for revert button) ────────────────────
const tabHistory = [];
const _origSwitchTab = switchTab;
// eslint-disable-next-line no-func-assign
switchTab = function (id) {
	if (activeTab && activeTab !== id) tabHistory.push(activeTab);
	_origSwitchTab(id);
};

// ── Animation toggle ───────────────────────────────────
let animPaused = false;
function toggleAnimation() {
	animPaused = !animPaused;
	document.querySelectorAll('.vm-bg__col').forEach((col) => {
		col.style.animationPlayState = animPaused ? 'paused' : 'running';
	});
	document.getElementById('btnPause').style.color = animPaused ? '#3cb371' : '#e08c3a';
	toast(animPaused ? 'Animation paused' : 'Animation resumed');
	closeDropdown();
}

// ── Library toggle ─────────────────────────────────────
let libraryVisible = true;
function toggleLibrary() {
	libraryVisible = !libraryVisible;
	document.querySelector('.library').style.display = libraryVisible ? '' : 'none';
	toast(libraryVisible ? 'Library shown' : 'Library hidden');
	closeDropdown();
}

// ── Copy section link ──────────────────────────────────
function copyLink() {
	const url = window.location.href.split('#')[0] + '#' + (activeTab || 'home');
	navigator.clipboard.writeText(url).then(() => toast('Link copied: ' + url));
	closeDropdown();
}

// ── Grid view ──────────────────────────────────────────
const screenColors = {
	home: { bg: '#0d1117', fg: '#4a9eff' },
	projects: { bg: '#0d1a0f', fg: '#3cb371' },
	resume: { bg: '#130d1a', fg: '#a06eff' },
	ctfs: { bg: '#1a0d0d', fg: '#e74c3c' },
};

function openGridView() {
	if (!document.getElementById('gridOverlay')) {
		const overlay = document.createElement('div');
		overlay.className = 'grid-overlay';
		overlay.id = 'gridOverlay';
		tabs.forEach((t) => {
			const c = screenColors[t.id] || { bg: '#1a1a1a', fg: '#888' };
			const card = document.createElement('div');
			card.className = 'grid-card';
			card.style.background = c.bg;
			card.style.color = c.fg;
			card.innerHTML = `<span class="grid-card__label">${t.label}</span>`;
			card.addEventListener('click', () => {
				closeGridView();
				switchTab(t.id);
			});
			overlay.appendChild(card);
		});
		document.querySelector('.main').appendChild(overlay);
	}
	document.getElementById('gridOverlay').classList.add('open');
	closeDropdown();
}

function closeGridView() {
	const o = document.getElementById('gridOverlay');
	if (o) o.classList.remove('open');
}

// ── Dropdown system ────────────────────────────────────
let activeDropdown = null;

const menuDefs = {
	file: () => [
		{ label: 'Open Tab', disabled: true },
		...tabs.map((t) => ({
			label: '    ' + t.label,
			action: () => {
				switchTab(t.id);
				closeDropdown();
			},
		})),
		{ sep: true },
		{
			label: 'Close Tab',
			action: () => {
				if (activeTab) closeTab(activeTab);
				closeDropdown();
			},
			disabled: !activeTab,
		},
		{ sep: true },
		{
			label: 'Download Resume',
			action: () => {
				switchTab('resume');
				toast('Opening Resume...');
				closeDropdown();
			},
		},
	],
	edit: () => [
		{ label: 'Copy Section Link', shortcut: 'Ctrl+L', action: copyLink },
		{
			label: 'Focus Search',
			shortcut: 'Ctrl+F',
			action: () => {
				document.getElementById('librarySearch').focus();
				closeDropdown();
			},
		},
	],
	view: () => [
		{ label: 'Toggle Library', shortcut: 'Ctrl+B', action: toggleLibrary },
		{ label: (animPaused ? 'Resume' : 'Pause') + ' Animation', action: toggleAnimation },
		{ sep: true },
		{ label: 'Grid View', action: openGridView },
	],
	vm: () => [
		{ label: 'Power On', disabled: true },
		...tabs.map((t) => ({
			label: '    ' + t.label,
			action: () => {
				switchTab(t.id);
				closeDropdown();
			},
		})),
		{ sep: true },
		{
			label: 'Suspend (Close Tab)',
			action: () => {
				if (activeTab) closeTab(activeTab);
				closeDropdown();
			},
		},
		{ label: 'Snapshot (Copy Link)', action: copyLink },
	],
	tabs: () =>
		openTabs.length
			? openTabs.map((id) => {
					const t = tabs.find((x) => x.id === id);
					return {
						label: t.label,
						checked: id === activeTab,
						action: () => {
							switchTab(id);
							closeDropdown();
						},
					};
				})
			: [{ label: 'No open tabs', disabled: true }],
	help: () => [
		{
			label: 'GitHub',
			action: () => {
				window.open('https://github.com/0xpiners', '_blank');
				closeDropdown();
			},
		},
		{
			label: 'LinkedIn',
			action: () => {
				toast('LinkedIn coming soon');
				closeDropdown();
			},
		},
		{ sep: true },
		{
			label: 'Keyboard Shortcuts',
			action: () => {
				showShortcuts();
				closeDropdown();
			},
		},
		{ sep: true },
		{
			label: 'About 0xpiners',
			action: () => {
				switchTab('home');
				closeDropdown();
			},
		},
	],
};

function closeDropdown() {
	if (activeDropdown) {
		activeDropdown.el.remove();
		activeDropdown.trigger.classList.remove('open');
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
	const dd = document.createElement('div');
	dd.className = 'dropdown';
	items.forEach((item) => {
		if (item.sep) {
			dd.appendChild(Object.assign(document.createElement('div'), { className: 'dropdown-sep' }));
			return;
		}
		const el = document.createElement('div');
		el.className = 'dropdown-item' + (item.disabled ? ' disabled' : '') + (item.checked ? ' checked' : '');
		el.innerHTML = `<span>${item.label}</span>${item.shortcut ? `<span class="shortcut">${item.shortcut}</span>` : ''}`;
		if (item.action && !item.disabled) el.addEventListener('click', item.action);
		dd.appendChild(el);
	});
	trigger.appendChild(dd);
	trigger.classList.add('open');
	activeDropdown = { name, el: dd, trigger };
}

document.getElementById('toolbarMenu').addEventListener('click', (e) => {
	const item = e.target.closest('[data-menu]');
	if (item) openDropdown(item.dataset.menu, item);
});

document.addEventListener('click', (e) => {
	if (activeDropdown && !e.target.closest('[data-menu]')) closeDropdown();
});

// ── Toolbar button actions ─────────────────────────────
document.getElementById('btnPause').addEventListener('click', toggleAnimation);
document.getElementById('btnSnapshot').addEventListener('click', copyLink);
document.getElementById('btnRevert').addEventListener('click', () => {
	const prev = tabHistory.pop();
	if (prev) _origSwitchTab(prev);
	else toast('No previous tab');
});
document.getElementById('btnViewSingle').addEventListener('click', () => {
	closeGridView();
	if (!libraryVisible) toggleLibrary();
});
document.getElementById('btnViewFull').addEventListener('click', () => {
	closeGridView();
	toggleLibrary();
});
document.getElementById('btnViewGrid').addEventListener('click', openGridView);
document.getElementById('btnTerminal').addEventListener('click', () => {
	document.getElementById('termOverlay').classList.add('open');
	document.getElementById('termInput').focus();
});

// ── Keyboard shortcuts ─────────────────────────────────
document.addEventListener('keydown', (e) => {
	if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
		e.preventDefault();
		toggleLibrary();
	}
	if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
		e.preventDefault();
		document.getElementById('librarySearch').focus();
		closeDropdown();
	}
	if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
		e.preventDefault();
		copyLink();
	}
	if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
		e.preventDefault();
		if (activeTab) closeTab(activeTab);
	}
	if (e.key === 'Escape') {
		closeDropdown();
		closeGridView();
		document.getElementById('termOverlay').classList.remove('open');
	}
});

function showShortcuts() {
	toast('Ctrl+B: Toggle library  |  Ctrl+F: Search  |  Ctrl+W: Close tab  |  Ctrl+L: Copy link  |  Esc: Close', 4000);
}

// ── Easter egg terminal ────────────────────────────────
document.getElementById('termClose').addEventListener('click', () => {
	document.getElementById('termOverlay').classList.remove('open');
});

const termCmds = {
	help: 'Available commands: help, whoami, ls, clear, exit',
	whoami: 'piners — security researcher & developer',
	ls: 'home/  projects/  resume/  ctfs/',
	'ls -la': 'drwxr-xr-x  piners  home/\ndrwxr-xr-x  piners  projects/\ndrwxr-xr-x  piners  ctfs/\n-rw-r--r--  piners  resume.pdf',
	pwd: '/home/piners',
	date: () => new Date().toString(),
	uname: 'Linux portfolio 5.15.0 #1 SMP x86_64 GNU/Linux',
	clear: '__clear__',
	exit: '__exit__',
};

function termPrint(html) {
	const body = document.getElementById('termBody');
	const line = document.createElement('div');
	line.innerHTML = html;
	body.appendChild(line);
	body.scrollTop = body.scrollHeight;
}

document.getElementById('termInput').addEventListener('keydown', (e) => {
	if (e.key !== 'Enter') return;
	const input = e.target.value.trim();
	e.target.value = '';
	termPrint(`<span style="color:#e74c3c">[ piners ~ ]#</span> ${input}`);
	if (!input) return;
	const raw = termCmds[input.toLowerCase()];
	const resp = typeof raw === 'function' ? raw() : raw;
	if (resp === '__clear__') {
		document.getElementById('termBody').innerHTML = '';
	} else if (resp === '__exit__') {
		document.getElementById('termOverlay').classList.remove('open');
	} else if (resp) {
		resp.split('\n').forEach((line) => termPrint(`<span style="color:#aaa">${line}</span>`));
	} else {
		termPrint(`<span style="color:#e74c3c">bash: ${input}: command not found</span>`);
	}
});

// ── Library search ─────────────────────────────────────
document.getElementById('librarySearch').addEventListener('input', (e) => {
	const q = e.target.value.trim().toLowerCase();
	const items = document.querySelectorAll('.tree-item--child');
	let anyVisible = false;
	items.forEach((el) => {
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
	const el = document.getElementById('xpClock');
	if (!el) return;
	const now = new Date();
	let h = now.getHours(),
		m = now.getMinutes();
	const ampm = h >= 12 ? 'PM' : 'AM';
	h = h % 12 || 12;
	el.textContent = h + ':' + String(m).padStart(2, '0') + ' ' + ampm;
}
updateXpClock();
setInterval(updateXpClock, 10000);

// ── XP windows z-index management ──────────────────────
let topZ = 100;
function bringToFront(win) {
	win.style.zIndex = ++topZ;
}

// ── XP Tor Browser: minimize / maximize / drag ────────
(function () {
	const win = document.getElementById('xpTorBrowser');
	const titlebar = document.getElementById('xpTorTitlebar');
	const taskbtn = document.getElementById('xpTorTaskbtn');
	if (!win || !taskbtn) return;

	win.addEventListener('mousedown', () => bringToFront(win));

	// minimize / restore
	function minimize() {
		win.style.display = 'none';
		taskbtn.classList.remove('active');
	}
	function restore() {
		win.style.display = '';
		taskbtn.classList.add('active');
	}
	function close() {
		win.style.display = 'none';
		taskbtn.style.display = 'none';
	}

	window.openTorBrowser = restore;

	document.getElementById('xpTorMin').addEventListener('click', minimize);
	document.getElementById('xpTorClose').addEventListener('click', close);
	document.getElementById('iconTorBrowser').addEventListener('dblclick', () => {
		taskbtn.style.display = '';
		restore();
		bringToFront(win);
	});
	taskbtn.addEventListener('click', () => (win.style.display === 'none' ? restore() : minimize()));

	// Refresh and Copy URL
	const refreshBtn = document.getElementById('torRefresh');
	const omnibox = document.getElementById('torOmnibox');
	const loadingBar = document.getElementById('torLoadingBar');
	const pageContent = document.getElementById('torPageContent');
	const torUrl = document.getElementById('torUrl');

	if (refreshBtn && loadingBar && pageContent) {
		refreshBtn.addEventListener('click', () => {
			// Start animation
			loadingBar.style.display = 'block';
			loadingBar.style.width = '0%';
			pageContent.style.opacity = '0.3';

			// Simulated loading steps
			setTimeout(() => {
				loadingBar.style.width = '30%';
			}, 100);
			setTimeout(() => {
				loadingBar.style.width = '70%';
			}, 500);
			setTimeout(() => {
				loadingBar.style.width = '100%';
				pageContent.style.opacity = '1';
				toast('Page reloaded.');
				setTimeout(() => {
					loadingBar.style.display = 'none';
					loadingBar.style.width = '0%';
				}, 300);
			}, 900);
		});
	}

	if (omnibox && torUrl) {
		omnibox.addEventListener('click', () => {
			const url = torUrl.innerText.trim();
			navigator.clipboard.writeText(url).then(() => {
				toast('Onion link copied to clipboard!');
				omnibox.style.background = '#e1e1e1';
				setTimeout(() => {
					omnibox.style.background = '';
				}, 200);
			});
		});
	}

	// maximize / restore-down — keep a saved windowed position
	let saved = { l: '110px', t: '28px', w: '700px', h: '430px' };
	document.getElementById('xpTorMax').addEventListener('click', () => {
		if (win.classList.contains('xp-maximized')) {
			win.classList.remove('xp-maximized');
			win.style.left = saved.l;
			win.style.top = saved.t;
			win.style.width = saved.w;
			win.style.height = saved.h;
		} else {
			saved = {
				l: win.style.left || '110px',
				t: win.style.top || '28px',
				w: win.style.width || '700px',
				h: win.style.height || '430px',
			};
			win.classList.add('xp-maximized');
			win.style.left = win.style.top = win.style.width = win.style.height = '';
		}
	});

	// drag — clicking title bar restores from maximized then drags (Windows XP behaviour)
	let dragging = false,
		ox = 0,
		oy = 0;
	titlebar.addEventListener('mousedown', (e) => {
		if (e.target.closest('.xp-ctrl')) return;
		e.preventDefault();

		if (win.classList.contains('xp-maximized')) {
			win.classList.remove('xp-maximized');
			win.style.left = saved.l;
			win.style.top = saved.t;
			win.style.width = saved.w;
			win.style.height = saved.h;
		}

		dragging = true;
		const areaRect = document.getElementById('xpArea').getBoundingClientRect();
		const winRect = win.getBoundingClientRect();
		ox = e.clientX - winRect.left;
		oy = e.clientY - winRect.top;
		win.style.left = winRect.left - areaRect.left + 'px';
		win.style.top = winRect.top - areaRect.top + 'px';
		win.style.userSelect = 'none';
	});
	document.addEventListener('mousemove', (e) => {
		if (!dragging) return;
		const area = document.getElementById('xpArea');
		const areaRect = area.getBoundingClientRect();
		const maxX = area.clientWidth - win.offsetWidth;
		const maxY = area.clientHeight - win.offsetHeight;
		win.style.left = Math.max(0, Math.min(maxX, e.clientX - areaRect.left - ox)) + 'px';
		win.style.top = Math.max(0, Math.min(maxY, e.clientY - areaRect.top - oy)) + 'px';
	});
	document.addEventListener('mouseup', () => {
		dragging = false;
		win.style.userSelect = '';
	});
})();

// ── XP My Computer: minimize / maximize / drag ───────
(function () {
	const win = document.getElementById('xpComputerBin');
	const titlebar = document.getElementById('xpComputerTitlebar');
	const taskbtn = document.getElementById('xpComputerTaskbtn');
	if (!win || !taskbtn) return;

	win.addEventListener('mousedown', () => bringToFront(win));

	function open() {
		win.style.display = '';
		taskbtn.style.display = '';
		taskbtn.classList.add('active');
		bringToFront(win);
	}
	function close() {
		win.style.display = 'none';
		taskbtn.style.display = 'none';
	}
	function minimize() {
		win.style.display = 'none';
		taskbtn.classList.remove('active');
	}
	function restore() {
		win.style.display = '';
		taskbtn.classList.add('active');
	}

	window.openMyComputer = open;

	document.getElementById('iconMyComputer').addEventListener('dblclick', open);
	document.getElementById('xpComputerClose').addEventListener('click', close);
	document.getElementById('xpComputerMin').addEventListener('click', minimize);
	taskbtn.addEventListener('click', () => (win.style.display === 'none' ? restore() : minimize()));

	let saved = { l: '180px', t: '80px', w: '500px', h: '350px' };
	document.getElementById('xpComputerMax').addEventListener('click', () => {
		if (win.classList.contains('xp-maximized')) {
			win.classList.remove('xp-maximized');
			win.style.left = saved.l;
			win.style.top = saved.t;
			win.style.width = saved.w;
			win.style.height = saved.h;
		} else {
			saved = {
				l: win.style.left || '180px',
				t: win.style.top || '80px',
				w: win.style.width || '500px',
				h: win.style.height || '350px',
			};
			win.classList.add('xp-maximized');
			win.style.left = win.style.top = win.style.width = win.style.height = '';
		}
	});

	let dragging = false,
		ox = 0,
		oy = 0;
	titlebar.addEventListener('mousedown', (e) => {
		if (e.target.closest('.xp-ctrl')) return;
		e.preventDefault();
		if (win.classList.contains('xp-maximized')) return;

		dragging = true;
		const areaRect = document.getElementById('xpArea').getBoundingClientRect();
		const winRect = win.getBoundingClientRect();
		ox = e.clientX - winRect.left;
		oy = e.clientY - winRect.top;
		win.style.userSelect = 'none';
	});
	document.addEventListener('mousemove', (e) => {
		if (!dragging) return;
		const area = document.getElementById('xpArea');
		const areaRect = area.getBoundingClientRect();
		const maxX = area.clientWidth - win.offsetWidth;
		const maxY = area.clientHeight - win.offsetHeight;
		win.style.left = Math.max(0, Math.min(maxX, e.clientX - areaRect.left - ox)) + 'px';
		win.style.top = Math.max(0, Math.min(maxY, e.clientY - areaRect.top - oy)) + 'px';
	});
	document.addEventListener('mouseup', () => {
		dragging = false;
		win.style.userSelect = '';
	});
})();

// ── XP Recycle Bin: minimize / maximize / drag ────────
(function () {
	const win = document.getElementById('xpRecycleBin');
	const titlebar = document.getElementById('xpRecycleTitlebar');
	const taskbtn = document.getElementById('xpRecycleTaskbtn');
	const icon = document.getElementById('iconRecycleBin');
	if (!win || !taskbtn || !icon) return;

	win.addEventListener('mousedown', () => bringToFront(win));

	function open() {
		win.style.display = '';
		taskbtn.style.display = '';
		taskbtn.classList.add('active');
		bringToFront(win);
	}
	function close() {
		win.style.display = 'none';
		taskbtn.style.display = 'none';
	}
	function minimize() {
		win.style.display = 'none';
		taskbtn.classList.remove('active');
	}
	function restore() {
		win.style.display = '';
		taskbtn.classList.add('active');
	}

	window.openRecycleBin = open;

	icon.addEventListener('dblclick', open);
	document.getElementById('xpRecycleClose').addEventListener('click', close);
	document.getElementById('xpRecycleMin').addEventListener('click', minimize);
	taskbtn.addEventListener('click', () => (win.style.display === 'none' ? restore() : minimize()));

	let saved = { l: '150px', t: '50px', w: '500px', h: '350px' };
	document.getElementById('xpRecycleMax').addEventListener('click', () => {
		if (win.classList.contains('xp-maximized')) {
			win.classList.remove('xp-maximized');
			win.style.left = saved.l;
			win.style.top = saved.t;
			win.style.width = saved.w;
			win.style.height = saved.h;
		} else {
			saved = {
				l: win.style.left || '150px',
				t: win.style.top || '50px',
				w: win.style.width || '500px',
				h: win.style.height || '350px',
			};
			win.classList.add('xp-maximized');
			win.style.left = win.style.top = win.style.width = win.style.height = '';
		}
	});

	let dragging = false,
		ox = 0,
		oy = 0;
	titlebar.addEventListener('mousedown', (e) => {
		if (e.target.closest('.xp-ctrl')) return;
		e.preventDefault();
		if (win.classList.contains('xp-maximized')) return;

		dragging = true;
		const areaRect = document.getElementById('xpArea').getBoundingClientRect();
		const winRect = win.getBoundingClientRect();
		ox = e.clientX - winRect.left;
		oy = e.clientY - winRect.top;
		win.style.userSelect = 'none';
	});
	document.addEventListener('mousemove', (e) => {
		if (!dragging) return;
		const area = document.getElementById('xpArea');
		const areaRect = area.getBoundingClientRect();
		const maxX = area.clientWidth - win.offsetWidth;
		const maxY = area.clientHeight - win.offsetHeight;
		win.style.left = Math.max(0, Math.min(maxX, e.clientX - areaRect.left - ox)) + 'px';
		win.style.top = Math.max(0, Math.min(maxY, e.clientY - areaRect.top - oy)) + 'px';
	});
	document.addEventListener('mouseup', () => {
		dragging = false;
		win.style.userSelect = '';
	});
})();

// ── XP Desktop Icons & Context Menu ───────────────────
(function () {
	const area = document.getElementById('xpArea');
	if (!area) return;

	let activeIcon = null;
	let selectedIcon = null;
	let ox = 0,
		oy = 0;

	// Icon selection & dragging
	document.addEventListener('mousedown', (e) => {
		const icon = e.target.closest('.xp-icon');
		if (selectedIcon && selectedIcon !== icon && !e.target.closest('.xp-context-menu')) {
			selectedIcon.classList.remove('selected');
			selectedIcon = null;
		}

		if (!icon) return;

		selectedIcon = icon;
		selectedIcon.classList.add('selected');

		if (e.button !== 0) return;
		activeIcon = icon;
		const rect = icon.getBoundingClientRect();
		ox = e.clientX - rect.left;
		oy = e.clientY - rect.top;
		icon.style.zIndex = 1000;
	});

	document.addEventListener('mousemove', (e) => {
		if (!activeIcon) return;
		const areaRect = area.getBoundingClientRect();
		const maxX = area.clientWidth - activeIcon.offsetWidth;
		const maxY = area.clientHeight - activeIcon.offsetHeight;
		activeIcon.style.left = Math.max(0, Math.min(maxX, e.clientX - areaRect.left - ox)) + 'px';
		activeIcon.style.top = Math.max(0, Math.min(maxY, e.clientY - areaRect.top - oy)) + 'px';
	});

	document.addEventListener('mouseup', () => {
		if (activeIcon) activeIcon.style.zIndex = '';
		activeIcon = null;
	});

	// Context Menu
	const menu = document.createElement('div');
	menu.className = 'xp-context-menu';
	document.body.appendChild(menu);

	function renderMenu(isIcon = false) {
		if (isIcon) {
			menu.innerHTML = `
				<div class="xp-menu-item" id="xpOpen"><b>Open</b></div>
				<div class="xp-menu-item">Explore</div>
				<div class="xp-menu-sep"></div>
				<div class="xp-menu-item">Cut</div>
				<div class="xp-menu-item">Copy</div>
				<div class="xp-menu-sep"></div>
				<div class="xp-menu-item" id="xpDelete">Delete</div>
				<div class="xp-menu-item" id="xpRename">Rename</div>
				<div class="xp-menu-sep"></div>
				<div class="xp-menu-item">Properties</div>
			`;
		} else {
			menu.innerHTML = `
				<div class="xp-menu-item">View</div>
				<div class="xp-menu-item">Sort By</div>
				<div class="xp-menu-item" id="xpRefresh">Refresh</div>
				<div class="xp-menu-sep"></div>
				<div class="xp-menu-item">Paste</div>
				<div class="xp-menu-item">Paste Shortcut</div>
				<div class="xp-menu-sep"></div>
				<div class="xp-menu-item has-sub">New
					<div class="xp-sub-menu">
						<div class="xp-menu-item" id="xpCreateDoc">Text Document</div>
						<div class="xp-menu-item">Folder</div>
					</div>
				</div>
				<div class="xp-menu-sep"></div>
				<div class="xp-menu-item">Properties</div>
			`;
		}
	}

	area.addEventListener('contextmenu', (e) => {
		e.preventDefault();
		const icon = e.target.closest('.xp-icon');
		if (icon) {
			if (selectedIcon) selectedIcon.classList.remove('selected');
			selectedIcon = icon;
			selectedIcon.classList.add('selected');
			renderMenu(true);
		} else {
			renderMenu(false);
		}
		menu.style.display = 'block';
		menu.style.left = e.clientX + 'px';
		menu.style.top = e.clientY + 'px';
	});

	document.addEventListener('click', (e) => {
		if (!e.target.closest('.xp-context-menu')) {
			menu.style.display = 'none';
		}
	});

	// Actions
	document.addEventListener('click', (e) => {
		const action = e.target.id;
		if (action === 'xpRefresh') {
			area.style.opacity = '0.5';
			setTimeout(() => (area.style.opacity = '1'), 100);
			menu.style.display = 'none';
		}
		if (action === 'xpCreateDoc') {
			createFile('New Text Document', '📄');
			menu.style.display = 'none';
		}
		if (action === 'xpOpen' && selectedIcon) {
			handleOpen(selectedIcon);
			menu.style.display = 'none';
		}
		if (action === 'xpRename' && selectedIcon) {
			handleRename(selectedIcon);
			menu.style.display = 'none';
		}
		if (action === 'xpDelete' && selectedIcon) {
			if (['iconMyComputer', 'iconRecycleBin'].includes(selectedIcon.id)) {
				toast('Cannot delete system icons.');
			} else {
				selectedIcon.remove();
				selectedIcon = null;
			}
			menu.style.display = 'none';
		}
	});

	function createFile(name, emoji) {
		const newIcon = document.createElement('div');
		newIcon.className = 'xp-icon';
		const menuRect = menu.getBoundingClientRect();
		const areaRect = area.getBoundingClientRect();
		newIcon.style.left = menuRect.left - areaRect.left + 'px';
		newIcon.style.top = menuRect.top - areaRect.top + 'px';
		newIcon.innerHTML = `
			<div class="xp-icon__img">${emoji}</div>
			<div class="xp-icon__label">${name}</div>
		`;
		area.appendChild(newIcon);
	}

	function handleOpen(icon) {
		if (icon.id === 'iconMyComputer') window.openMyComputer();
		else if (icon.id === 'iconRecycleBin') window.openRecycleBin();
		else if (icon.id === 'iconTorBrowser') {
			const taskbtn = document.getElementById('xpTorTaskbtn');
			taskbtn.style.display = '';
			window.openTorBrowser();
			bringToFront(document.getElementById('xpTorBrowser'));
		} else if (icon.id === 'iconMyDocuments') toast('My Documents is empty.');
		else toast('Opening ' + icon.innerText.trim() + '...');
	}

	function handleRename(icon) {
		const label = icon.querySelector('.xp-icon__label');
		const oldName = label.innerText;
		const input = document.createElement('input');
		input.type = 'text';
		input.className = 'xp-icon__rename-input';
		input.value = oldName;
		label.innerHTML = '';
		label.appendChild(input);
		input.focus();
		input.select();

		const finish = () => {
			const newName = input.value.trim() || oldName;
			label.innerText = newName;
		};

		input.addEventListener('blur', finish);
		input.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') finish();
			if (e.key === 'Escape') {
				input.value = oldName;
				finish();
			}
		});
	}
})();

// ── Projects data ──────────────────────────────────────
const projects = [
	{ title: 'DepChain', description: 'Permissioned replicated blockchain with 4 nodes and HotStuff-style Byzantine fault-tolerant consensus. Integrates the EVM via Hyperledger Besu, deploys an ISTCoin ERC-20 token at genesis, and builds a full authenticated networking stack from UDP up through perfect links and authenticated channels.', tags: ['Java', 'Blockchain', 'BFT', 'EVM'], url: 'https://github.com/0xpiners/depchain', date: '2026', status: 'live', category: 'distributed' },
	{ title: 'Simple Onion Router Network', description: 'Three-component onion routing network: relay nodes, users, and a registry mapping node IDs to RSA public keys. Users wrap messages in layers of RSA encryption and route them through a chain — each node peels one layer without learning source or destination.', tags: ['TypeScript', 'Node.js', 'Cryptography', 'Networking'], url: 'https://github.com/0xpiners/Simple-onion-router-network', date: '2026', status: 'live', category: 'security' },
	{ title: 'DeathNode', description: 'Cryptographic peer-to-peer reporting platform where all communication is end-to-end encrypted with AES-256-GCM. Access is invitation-only via signed tokens, transport is secured with TLS mutual authentication, and each service runs in an isolated VM.', tags: ['Java', 'Security', 'P2P', 'AES-256', 'TLS'], url: 'https://github.com/0xpiners/DeathNode', date: '2025', status: 'live', category: 'security' },
	{ title: 'Vulnerability Assessment — BLACKHOLE Inc.', description: 'Full penetration test against fictitious company BLACKHOLE Inc., following PTES methodology. Discovered and exploited SSTI leading to RCE (CVE-2022-29078) and a sudo misconfiguration for privilege escalation to root (CVE-2023-22809).', tags: ['Pentesting', 'PTES', 'Burp Suite', 'SQLMap', 'Nmap'], url: 'https://github.com/0xpiners/Vulnerability-Assessment-ISCTE', date: '2025', status: 'archived', category: 'security' },
	{ title: 'MISP API CLI', description: 'Command-line interface for the MISP open-source threat intelligence platform. Lets analysts manage users, sync feeds, query and create events, and schedule cronjobs directly from the terminal.', tags: ['Python', 'Shell', 'MISP', 'Threat Intelligence'], url: 'https://github.com/0xpiners/MISP_API_CLI', date: '2025', status: 'wip', category: 'security' },
	{ title: 'AES-GCM Encryption', description: 'Minimal Python script demonstrating authenticated encryption with AES-GCM using pycryptodome. Shows key derivation, encryption, and decryption with integrity verification.', tags: ['Python', 'Cryptography', 'AES-GCM'], url: 'https://github.com/0xpiners/AES_GCM', date: '2024', status: 'archived', category: 'security' },
	{ title: 'Password Manager', description: 'Local password manager in Python with encrypted storage. Lets users add, retrieve, and manage credentials for multiple accounts with a master-password-based vault.', tags: ['Python', 'Cryptography', 'Security'], url: 'https://github.com/0xpiners/Password-manager', date: '2024', status: 'archived', category: 'security' },
	{ title: 'Caesar Cipher GUI', description: 'Tkinter desktop app for encoding, decoding, and brute-forcing Caesar cipher messages. Includes all 25 shift variants in the brute-force view.', tags: ['Python', 'Cryptography', 'Tkinter', 'GUI'], url: 'https://github.com/0xpiners/Caesar_cipher_GUI', date: '2023', status: 'archived', category: 'security' },
	{ title: 'Ben-Or Consensus Algorithm', description: 'TypeScript implementation of the Ben-Or randomized Byzantine consensus protocol. Each process runs independent coin-flip rounds to reach agreement even when up to ⌊(n−1)/5⌋ nodes are faulty.', tags: ['TypeScript', 'Distributed Systems', 'BFT', 'Consensus'], url: 'https://github.com/0xpiners/Ben-Or-decentralized-consensus-algorithm', date: '2026', status: 'archived', category: 'distributed' },
	{ title: 'Event Queue Application', description: 'Dockerized event-driven system with Nginx reverse proxy, Redis message broker, and Go-based producer/consumer services. Demonstrates queue depth monitoring and backpressure handling.', tags: ['Go', 'Redis', 'Nginx', 'Docker'], url: 'https://github.com/0xpiners/Event-queue-application', date: '2024', status: 'archived', category: 'distributed' },
	{ title: 'Torrent Workshop', description: 'Hands-on BitTorrent workshop walking through downloading files via magnet links and inspecting swarm behaviour. Explores trackers, peers, and piece verification.', tags: ['Networking', 'P2P', 'BitTorrent'], url: 'https://github.com/0xpiners/Torrent-workshop', date: '2024', status: 'archived', category: 'distributed' },
	{ title: 'Smalito', description: 'URL shortener deployed on Cloudflare\'s edge. Supports user accounts with email verification, a link dashboard with click analytics, and uses D1, KV, and R2 — zero origin server.', tags: ['TypeScript', 'Cloudflare Workers', 'D1', 'KV'], url: 'https://github.com/0xpiners/smalito', date: '2026', status: 'live', category: 'web' },
	{ title: 'FoodShop', description: 'Microservices food store with Angular frontend backed by two independent REST APIs for order management and inventory. Orchestrated with Docker Compose.', tags: ['JavaScript', 'Angular', 'Docker', 'Microservices'], url: 'https://github.com/0xpiners/FoodShop', date: '2026', status: 'archived', category: 'web' },
	{ title: 'What Did I Learn Today', description: 'Daily learning journal web app for logging, tagging, and reviewing things learned each day. Builds a searchable personal knowledge base over time.', tags: ['TypeScript', 'Web'], url: 'https://github.com/0xpiners/what-did-i-learn-today', date: '2025', status: 'wip', category: 'web' },
	{ title: 'Portfolio', description: 'Interactive portfolio built as a Cloudflare Workers app with a custom desktop-style UI, tabbed navigation, and dedicated sections for projects, resume, and CTF work. Designed to feel like a retro operating system while staying fully web-native.', tags: ['JavaScript', 'Cloudflare Workers', 'Frontend'], url: 'https://github.com/0xpiners/portfolio', date: '2026', status: 'live', category: 'web' },
	{ title: 'ISCTE Flight System v2', description: 'Client-server flight control system for an Operating Systems course. A server process manages all flight and passenger data; client processes connect, issue commands, and receive real-time updates. Explores IPC, process synchronisation, and concurrent file access.', tags: ['C', 'Systems', 'IPC', 'Concurrency'], url: 'https://github.com/0xpiners/IscteFlight-2', date: '2023', status: 'archived', category: 'systems' },
	{ title: 'ISCTE Flight System v1', description: 'Bash-based flight management CLI with a menu-driven interface for booking flights, registering passengers, and checking flight status. Data is persisted to flat files.', tags: ['Bash', 'CLI', 'Systems'], url: 'https://github.com/0xpiners/IscteFligth-1', date: '2023', status: 'archived', category: 'systems' },
	{ title: 'Trackfolio', description: 'Java desktop application for tracking and managing a personal investment portfolio — add assets, record transactions, and monitor current value over time.', tags: ['Java', 'Finance', 'Desktop'], url: 'https://github.com/0xpiners/Trackfolio', date: '2024', status: 'archived', category: 'tools' },
	{ title: 'Space Invaders AI', description: 'Space Invaders agent trained through a genetic algorithm — no hand-coded rules. A population of neural networks plays the game; the best performers reproduce and mutate each generation.', tags: ['Java', 'Neural Networks', 'Genetic Algorithm', 'AI'], url: 'https://github.com/0xpiners/Space-Invaders-AI', date: '2024', status: 'archived', category: 'ai' },
	{ title: 'Flappy Phoenix', description: 'Flappy Bird reimagined as a phoenix with mid-air enemies and collectible power-ups. Built in Android Studio with custom sprite animations.', tags: ['Java', 'Android', 'Game'], url: 'https://github.com/0xpiners/Flappyphoenix', date: '2024', status: 'archived', category: 'ai' },
	{ title: 'Roguelike Game', description: 'Procedural roguelike dungeon crawler with multi-level dungeons, hostile enemies, and loot drops. Each run is unique; the player must manage health and inventory to reach the deepest floor.', tags: ['Java', 'Game', 'Roguelike', 'Procedural'], url: 'https://github.com/0xpiners/Roguelike-game', date: '2023', status: 'archived', category: 'ai' },
	{ title: 'Sokoban', description: 'Classic Sokoban puzzle game in Java — navigate a warehouse worker and push crates onto their target spots. Features custom level layouts.', tags: ['Java', 'Game', 'Puzzle'], url: 'https://github.com/0xpiners/Sokoban', date: '2023', status: 'archived', category: 'ai' },
	{ title: 'Sudoku', description: 'Playable Sudoku game with input validation and puzzle generation, built in Java using the PandionJ teaching framework.', tags: ['Java', 'Game', 'Puzzle'], url: 'https://github.com/0xpiners/Sudoku', date: '2023', status: 'archived', category: 'ai' },
	{ title: 'Termo', description: 'Portuguese-language Wordle clone. Guess the hidden 5-letter word in six tries; correct letters turn green, misplaced letters turn yellow.', tags: ['Java', 'Game', 'Wordle'], url: 'https://github.com/0xpiners/Termo', date: '2023', status: 'archived', category: 'ai' },
	{ title: 'Auto Attendance Bot', description: 'Android app that automates the daily attendance check-in flow on the Leonardo De Vinci University portal. Navigates the login form and submits presence without manual interaction.', tags: ['Java', 'Android', 'Automation'], url: 'https://github.com/0xpiners/AutoAttendanceLeonardDeVinciUniversity', date: '2024', status: 'archived', category: 'tools' },
	{ title: 'Todo List CLI', description: 'Lightweight command-line todo app in Python. Add, complete, and delete tasks from the terminal; tasks persist between sessions in a local file.', tags: ['Python', 'CLI', 'Productivity'], url: 'https://github.com/0xpiners/Todo-list-application', date: '2023', status: 'archived', category: 'tools' },
];

const PROJ_FILTERS = [
	{ id: 'all', label: 'All' },
	{ id: 'security', label: 'Cyber & Security' },
	{ id: 'distributed', label: 'Distributed & Networking' },
	{ id: 'web', label: 'Web' },
	{ id: 'systems', label: 'Systems' },
	{ id: 'ai', label: 'AI & Games' },
	{ id: 'tools', label: 'Tools' },
];

function buildProjCards(list) {
	return list.map((p, i) => `
		<div class="proj-card" data-idx="${p._idx ?? i}">
			<div class="proj-card__header">
				<span class="proj-card__title">${p.title}</span>
				<span class="proj-card__status proj-card__status--${p.status}">${p.status}</span>
			</div>
			<div class="proj-card__tags">
				${p.tags.slice(0, 4).map(t => `<span class="proj-card__tag">${t}</span>`).join('')}
			</div>
			<div class="proj-card__footer">
				<span class="proj-card__date">${p.date}</span>
				<button class="proj-card__open" data-idx="${p._idx ?? i}">Read description</button>
			</div>
		</div>`).join('');
}

function openProjModal(p) {
	document.querySelector('.proj-modal')?.remove();
	const modal = document.createElement('div');
	modal.className = 'proj-modal';
	modal.innerHTML = `
		<div class="proj-modal__box">
			<div class="proj-modal__header">
				<div>
					<div class="proj-modal__title">${p.title}</div>
					<div class="proj-modal__meta">${p.date} &nbsp;&middot;&nbsp; <span class="proj-card__status proj-card__status--${p.status}">${p.status}</span></div>
				</div>
				<button class="proj-modal__close">&#x2715;</button>
			</div>
			<p class="proj-modal__desc">${p.description}</p>
			<div class="proj-card__tags proj-modal__tags">
				${p.tags.map(t => `<span class="proj-card__tag">${t}</span>`).join('')}
			</div>
			<div class="proj-modal__actions">
				${p.url
					? `<a class="proj-modal__link" href="${p.url}" target="_blank">Open on GitHub &rarr;</a>`
					: '<span class="proj-modal__link proj-modal__link--na">Private</span>'}
			</div>
		</div>`;
	document.getElementById('projOnionContent').appendChild(modal);
	modal.addEventListener('click', e => {
		if (e.target === modal || e.target.closest('.proj-modal__close')) modal.remove();
	});
}

function renderProjects() {
	const container = document.getElementById('projOnionContent');
	if (!container) return;
	const indexed = projects.map((p, i) => ({ ...p, _idx: i }));
	const filterTabs = PROJ_FILTERS.map(f =>
		`<button class="proj-filter-tab${f.id === 'all' ? ' active' : ''}" data-filter="${f.id}">${f.label}</button>`
	).join('');
	container.innerHTML = `
		<div class="proj-onion-header">
			<div class="proj-onion-logo-name">Projects</div>
			<div class="proj-onion-logo-sub">${projects.length} repos</div>
		</div>
		<div class="proj-filter-bar">${filterTabs}</div>
		<div class="proj-onion-grid" id="projGrid">${buildProjCards(indexed)}</div>`;

	const bar = container.querySelector('.proj-filter-bar');
	const grid = container.querySelector('#projGrid');
	bar.addEventListener('click', e => {
		const btn = e.target.closest('.proj-filter-tab');
		if (!btn) return;
		bar.querySelectorAll('.proj-filter-tab').forEach(b => b.classList.remove('active'));
		btn.classList.add('active');
		const f = btn.dataset.filter;
		const filtered = f === 'all' ? indexed : indexed.filter(p => p.category === f);
		grid.innerHTML = buildProjCards(filtered);
	});
	container.addEventListener('click', e => {
		const btn = e.target.closest('.proj-card__open');
		if (!btn) return;
		openProjModal(projects[+btn.dataset.idx]);
	});
}

// ── Parrot OS clock ────────────────────────────────────
function updateParrotClock() {
	const el = document.getElementById('parrotClock');
	if (!el) return;
	const now = new Date();
	const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const h = String(now.getHours()).padStart(2, '0');
	const m = String(now.getMinutes()).padStart(2, '0');
	el.textContent = days[now.getDay()] + ' ' + h + ':' + m;
}
updateParrotClock();
setInterval(updateParrotClock, 10000);

// ── Parrot OS Tor Browser window ───────────────────────
(function () {
	const win = document.getElementById('parrotTorBrowser');
	const titlebar = document.getElementById('parrotTorTitlebar');
	const taskbtn = document.getElementById('parrotTorTaskbtn');
	if (!win || !taskbtn) return;

	function minimize() { win.style.display = 'none'; taskbtn.classList.remove('active'); }
	function restore() { win.style.display = ''; taskbtn.classList.add('active'); }
	function close() { win.style.display = 'none'; taskbtn.style.display = 'none'; }

	document.getElementById('parrotTorMin').addEventListener('click', minimize);
	document.getElementById('parrotTorClose').addEventListener('click', close);
	document.getElementById('iconParrotTor').addEventListener('dblclick', () => { taskbtn.style.display = ''; restore(); });
	taskbtn.addEventListener('click', () => (win.style.display === 'none' ? restore() : minimize()));

	const refreshBtn = document.getElementById('parrotTorRefresh');
	const loadingBar = document.getElementById('parrotLoadingBar');
	const pageContent = document.getElementById('projOnionContent');
	if (refreshBtn && loadingBar && pageContent) {
		refreshBtn.addEventListener('click', () => {
			loadingBar.style.display = 'block';
			loadingBar.style.width = '0%';
			pageContent.style.opacity = '0.3';
			setTimeout(() => { loadingBar.style.width = '30%'; }, 100);
			setTimeout(() => { loadingBar.style.width = '70%'; }, 500);
			setTimeout(() => {
				loadingBar.style.width = '100%';
				pageContent.style.opacity = '1';
				toast('Page reloaded.');
				setTimeout(() => { loadingBar.style.display = 'none'; loadingBar.style.width = '0%'; }, 300);
			}, 900);
		});
	}

	const omnibox = document.getElementById('parrotTorOmnibox');
	if (omnibox) {
		omnibox.addEventListener('click', () => {
			const url = omnibox.querySelector('.tor-omnibox__url').innerText.trim();
			navigator.clipboard.writeText(url).then(() => {
				toast('Onion link copied!');
				omnibox.style.background = '#1a2a1a';
				setTimeout(() => { omnibox.style.background = ''; }, 200);
			});
		});
	}

	let saved = { l: '80px', t: '0px', w: '700px', h: '430px' };
	document.getElementById('parrotTorMax').addEventListener('click', () => {
		if (win.classList.contains('parrot-maximized')) {
			win.classList.remove('parrot-maximized');
			win.style.left = saved.l; win.style.top = saved.t;
			win.style.width = saved.w; win.style.height = saved.h;
		} else {
			saved = { l: win.style.left || '80px', t: win.style.top || '0px', w: win.style.width || '700px', h: win.style.height || '430px' };
			win.classList.add('parrot-maximized');
			win.style.left = win.style.top = win.style.width = win.style.height = '';
		}
	});

	let dragging = false, ox = 0, oy = 0;
	titlebar.addEventListener('mousedown', e => {
		if (e.target.closest('.parrot-ctrl')) return;
		e.preventDefault();
		if (win.classList.contains('parrot-maximized')) {
			win.classList.remove('parrot-maximized');
			win.style.left = saved.l; win.style.top = saved.t;
			win.style.width = saved.w; win.style.height = saved.h;
		}
		dragging = true;
		const areaRect = document.getElementById('parrotArea').getBoundingClientRect();
		const winRect = win.getBoundingClientRect();
		ox = e.clientX - winRect.left;
		oy = e.clientY - winRect.top;
		win.style.left = winRect.left - areaRect.left + 'px';
		win.style.top = winRect.top - areaRect.top + 'px';
		win.style.userSelect = 'none';
	});
	document.addEventListener('mousemove', e => {
		if (!dragging) return;
		const area = document.getElementById('parrotArea');
		const areaRect = area.getBoundingClientRect();
		win.style.left = Math.max(0, Math.min(area.clientWidth - win.offsetWidth, e.clientX - areaRect.left - ox)) + 'px';
		win.style.top = Math.max(0, Math.min(area.clientHeight - win.offsetHeight, e.clientY - areaRect.top - oy)) + 'px';
	});
	document.addEventListener('mouseup', () => { dragging = false; win.style.userSelect = ''; });
})();

// ── CTF data ───────────────────────────────────────────
const CTF_FILTERS = [
	{ id: 'all', label: 'All' },
	{ id: 'web', label: 'Web' },
	{ id: 'pwn', label: 'Pwn' },
	{ id: 'rev', label: 'Rev' },
	{ id: 'crypto', label: 'Crypto' },
	{ id: 'pentest', label: 'Pentest' },
	{ id: 'misc', label: 'Misc' },
];

const ctfs = [
	{
		title: 'Vulnerability Assessment — BLACKHOLE Inc.',
		event: 'Pentest Lab',
		category: 'pentest',
		tags: ['pentest', 'ssti', 'rce', 'privesc'],
		date: '2025',
		placement: null,
		description: 'Full penetration test following PTES methodology. Discovered and exploited SSTI leading to RCE (CVE-2022-29078) and a sudo misconfiguration for privilege escalation to root.',
		writeup: true,
	},
	{
		title: 'Evasive C2 Infrastructure on Cloudflare Workers',
		event: 'Research',
		category: 'misc',
		tags: ['c2', 'red team', 'cloudflare', 'evasion'],
		date: '2025',
		placement: null,
		description: 'Building APT-grade C2 using TypeScript, Workers, R2, and KV. Blending beacon traffic into legitimate CDN requests to evade network detection.',
		writeup: true,
	},
	{
		title: 'HTB University CTF 2024',
		event: 'HackTheBox',
		category: 'misc',
		tags: ['web', 'pwn', 'rev', 'crypto'],
		date: '2024',
		placement: 'CarpeDien',
		description: 'Competed with CarpeDien. Solved challenges across web exploitation, binary exploitation, reverse engineering, and cryptography.',
		writeup: false,
	},
	{
		title: 'Cyber Apocalypse CTF 2024',
		event: 'HackTheBox',
		category: 'misc',
		tags: ['web', 'pwn', 'forensics', 'rev'],
		date: '2024',
		placement: 'CarpeDien',
		description: 'Annual HackTheBox CTF. Solved challenges in web, binary exploitation, and digital forensics with the CarpeDien team.',
		writeup: false,
	},
	{
		title: 'ret2libc — bypassing NX via stack pivot',
		event: 'PWN practice',
		category: 'pwn',
		tags: ['pwn', 'rop', 'libc', 'amd64'],
		date: '2024',
		placement: null,
		description: 'Classical ret2libc with a twist: the stack was misaligned and the binary stripped. Leaked libc base via puts GOT entry, built a ROP chain to pop a shell.',
		writeup: true,
	},
	{
		title: 'JWT alg:none — admin account takeover',
		event: 'Web practice',
		category: 'web',
		tags: ['web', 'jwt', 'auth bypass'],
		date: '2024',
		placement: null,
		description: 'Server accepted unsigned JWTs when alg was set to none. Forged an admin token, bypassed role checks, and exfiltrated the flag from a protected endpoint.',
		writeup: true,
	},
	{
		title: 'LCG seed recovery — breaking PRNG',
		event: 'Crypto practice',
		category: 'crypto',
		tags: ['crypto', 'lcg', 'prng', 'python'],
		date: '2024',
		placement: null,
		description: 'Recovered the LCG seed from a sequence of partial outputs. Used lattice reduction (LLL) to solve the hidden number problem and predict future outputs.',
		writeup: true,
	},
	{
		title: 'UPX malware dropper — static unpacking',
		event: 'Rev practice',
		category: 'rev',
		tags: ['rev', 'malware', 'upx', 'pe'],
		date: '2024',
		placement: null,
		description: 'Statically unpacked a UPX-compressed PE dropper without running it. Reconstructed the import table and analysed the second-stage payload in Ghidra.',
		writeup: true,
	},
];

function buildCtfCards(list) {
	return list.map((c, i) => `
		<div class="proj-card" data-idx="${c._idx ?? i}">
			<div class="proj-card__header">
				<span class="proj-card__title">${c.title}</span>
				${c.placement ? `<span class="proj-card__status proj-card__status--active">${c.placement}</span>` : `<span class="proj-card__status">${c.event}</span>`}
			</div>
			<div class="proj-card__tags">
				${c.tags.slice(0, 4).map(t => `<span class="proj-card__tag">${t}</span>`).join('')}
			</div>
			<div class="proj-card__footer">
				<span class="proj-card__date">${c.date}</span>
				<button class="proj-card__open" data-idx="${c._idx ?? i}">${c.writeup ? 'Read writeup' : 'View details'}</button>
			</div>
		</div>`).join('');
}

function openCtfModal(c) {
	document.querySelector('.ctf-modal')?.remove();
	const modal = document.createElement('div');
	modal.className = 'proj-modal ctf-modal';
	modal.innerHTML = `
		<div class="proj-modal__box">
			<div class="proj-modal__header">
				<div>
					<div class="proj-modal__title">${c.title}</div>
					<div class="proj-modal__meta">${c.date} &nbsp;&middot;&nbsp; ${c.event}${c.placement ? ' &nbsp;&middot;&nbsp; ' + c.placement : ''}</div>
				</div>
				<button class="proj-modal__close">&#x2715;</button>
			</div>
			<p class="proj-modal__desc">${c.description}</p>
			<div class="proj-modal__tags">
				${c.tags.map(t => `<span class="proj-card__tag">${t}</span>`).join('')}
			</div>
			<div class="proj-modal__actions">
				${c.writeup
					? '<span class="proj-modal__link">Writeup coming soon</span>'
					: '<span class="proj-modal__link proj-modal__link--na">No writeup</span>'}
			</div>
		</div>`;
	document.getElementById('ctfOnionContent').appendChild(modal);
	modal.addEventListener('click', e => {
		if (e.target === modal || e.target.closest('.proj-modal__close')) modal.remove();
	});
}

function renderCtfs() {
	const container = document.getElementById('ctfOnionContent');
	if (!container) return;
	const indexed = ctfs.map((c, i) => ({ ...c, _idx: i }));
	const filterTabs = CTF_FILTERS.map(f =>
		`<button class="proj-filter-tab${f.id === 'all' ? ' active' : ''}" data-filter="${f.id}">${f.label}</button>`
	).join('');
	container.innerHTML = `
		<div class="proj-onion-header">
			<div class="proj-onion-logo-name">CTF Writeups</div>
			<div class="proj-onion-logo-sub">${ctfs.length} entries &nbsp;&middot;&nbsp; CarpeDien</div>
		</div>
		<div class="proj-filter-bar">${filterTabs}</div>
		<div class="proj-onion-grid" id="ctfGrid">${buildCtfCards(indexed)}</div>`;

	const bar = container.querySelector('.proj-filter-bar');
	const grid = container.querySelector('#ctfGrid');
	bar.addEventListener('click', e => {
		const btn = e.target.closest('.proj-filter-tab');
		if (!btn) return;
		bar.querySelectorAll('.proj-filter-tab').forEach(b => b.classList.remove('active'));
		btn.classList.add('active');
		const f = btn.dataset.filter;
		const filtered = f === 'all' ? indexed : indexed.filter(c => c.category === f);
		grid.innerHTML = buildCtfCards(filtered);
	});
	container.addEventListener('click', e => {
		const btn = e.target.closest('.proj-card__open');
		if (!btn) return;
		openCtfModal(ctfs[+btn.dataset.idx]);
	});
}

// ── CTF Parrot window controls ─────────────────────────
(function () {
	const win = document.getElementById('ctfTorBrowser');
	const titlebar = document.getElementById('ctfTorTitlebar');
	const taskbtn = document.getElementById('ctfTorTaskbtn');
	if (!win || !taskbtn) return;

	function minimize() { win.style.display = 'none'; taskbtn.classList.remove('active'); }
	function restore() { win.style.display = ''; taskbtn.classList.add('active'); }
	function close() { win.style.display = 'none'; taskbtn.style.display = 'none'; }

	document.getElementById('ctfTorMin').addEventListener('click', minimize);
	document.getElementById('ctfTorClose').addEventListener('click', close);
	document.getElementById('iconCtfTor').addEventListener('dblclick', () => { taskbtn.style.display = ''; restore(); });
	taskbtn.addEventListener('click', () => (win.style.display === 'none' ? restore() : minimize()));

	const refreshBtn = document.getElementById('ctfTorRefresh');
	const loadingBar = document.getElementById('ctfLoadingBar');
	const pageContent = document.getElementById('ctfOnionContent');
	if (refreshBtn && loadingBar && pageContent) {
		refreshBtn.addEventListener('click', () => {
			loadingBar.style.display = 'block';
			loadingBar.style.width = '0%';
			pageContent.style.opacity = '0.3';
			setTimeout(() => { loadingBar.style.width = '30%'; }, 100);
			setTimeout(() => { loadingBar.style.width = '70%'; }, 500);
			setTimeout(() => {
				loadingBar.style.width = '100%';
				pageContent.style.opacity = '1';
				toast('Page reloaded.');
				setTimeout(() => { loadingBar.style.display = 'none'; loadingBar.style.width = '0%'; }, 300);
			}, 900);
		});
	}

	const omnibox = document.getElementById('ctfTorOmnibox');
	if (omnibox) {
		omnibox.addEventListener('click', () => {
			const url = omnibox.querySelector('.tor-omnibox__url').innerText.trim();
			navigator.clipboard.writeText(url).then(() => {
				toast('Onion link copied!');
				omnibox.style.background = '#1a2a1a';
				setTimeout(() => { omnibox.style.background = ''; }, 200);
			});
		});
	}

	let saved = { l: '80px', t: '0px', w: '700px', h: '430px' };
	document.getElementById('ctfTorMax').addEventListener('click', () => {
		if (win.classList.contains('parrot-maximized')) {
			win.classList.remove('parrot-maximized');
			win.style.left = saved.l; win.style.top = saved.t;
			win.style.width = saved.w; win.style.height = saved.h;
		} else {
			saved = { l: win.style.left || '80px', t: win.style.top || '0px', w: win.style.width || '700px', h: win.style.height || '430px' };
			win.classList.add('parrot-maximized');
			win.style.left = win.style.top = win.style.width = win.style.height = '';
		}
	});

	let dragging = false, ox = 0, oy = 0;
	titlebar.addEventListener('mousedown', e => {
		if (e.target.closest('.parrot-ctrl')) return;
		e.preventDefault();
		if (win.classList.contains('parrot-maximized')) {
			win.classList.remove('parrot-maximized');
			win.style.left = saved.l; win.style.top = saved.t;
			win.style.width = saved.w; win.style.height = saved.h;
		}
		dragging = true;
		const areaRect = document.getElementById('ctfArea').getBoundingClientRect();
		const winRect = win.getBoundingClientRect();
		ox = e.clientX - winRect.left;
		oy = e.clientY - winRect.top;
		win.style.left = winRect.left - areaRect.left + 'px';
		win.style.top = winRect.top - areaRect.top + 'px';
		win.style.userSelect = 'none';
	});
	document.addEventListener('mousemove', e => {
		if (!dragging) return;
		const area = document.getElementById('ctfArea');
		const areaRect = area.getBoundingClientRect();
		win.style.left = Math.max(0, Math.min(area.clientWidth - win.offsetWidth, e.clientX - areaRect.left - ox)) + 'px';
		win.style.top = Math.max(0, Math.min(area.clientHeight - win.offsetHeight, e.clientY - areaRect.top - oy)) + 'px';
	});
	document.addEventListener('mouseup', () => { dragging = false; win.style.userSelect = ''; });
})();

// ── CTF clock ──────────────────────────────────────────
(function () {
	function tick() {
		const el = document.getElementById('ctfClock');
		if (!el) return;
		const now = new Date();
		const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		el.textContent = days[now.getDay()] + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
	}
	tick();
	setInterval(tick, 10000);
})();

// ── Init ───────────────────────────────────────────────
renderTabs();
renderProjects();
renderCtfs();
switchTab('home');
