// ── Utilities ──────────────────────────────────────────
function escHtml(s) {
	return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

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

function loadResumePdf() {
	const frame = document.getElementById('resumeFrame');
	if (!frame) return;
	const resumePath = '/resume/David_Pinheiro_Resume.pdf';
	if (!frame.src || !frame.src.includes(resumePath)) {
		frame.src = resumePath;
	}
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
	if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id);
	if (id === 'resume') loadResumePdf();
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

// ── Mobile warning overlay ─────────────────────────────
(function () {
	const overlay = document.getElementById('mobileOverlay');
	const continueBtn = document.getElementById('mobileContinue');
	if (!overlay || !continueBtn) return;
	const key = 'pinersMobileOverlayDismissed';
	if (localStorage.getItem(key) === 'true') {
		document.body.classList.add('mobile-overlay--dismissed');
	}
	continueBtn.addEventListener('click', () => {
		document.body.classList.add('mobile-overlay--dismissed');
		localStorage.setItem(key, 'true');
	});
})();

// ── My Computer tree collapse / expand ────────────────
(function () {
	const myComputer = document.querySelector('.tree-item:not(.tree-item--child)');
	if (!myComputer) return;
	const toggle = myComputer.querySelector('.tree-item__toggle');
	let collapsed = false;

	myComputer.addEventListener('click', () => {
		collapsed = !collapsed;
		toggle.textContent = collapsed ? '+' : '−';
		document.querySelectorAll('.tree-item--child').forEach((el) => {
			el.style.display = collapsed ? 'none' : '';
		});
	});
})();

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
	document.querySelectorAll('.vm-screen').forEach((s) => {
		s.style.pointerEvents = animPaused ? 'none' : '';
	});
	const img = document.querySelector('#btnPause img');
	if (img) img.src = animPaused ? '/images/random/Start_37108.ico' : '/images/random/pause-16.ico';
	toast(animPaused ? 'VMs paused' : 'VMs resumed');
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
				const a = document.createElement('a');
				a.href = '/resume/David_Pinheiro_Resume.pdf';
				a.download = 'David_Pinheiro_Resume.pdf';
				a.click();
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
		{ label: (animPaused ? 'Resume' : 'Pause') + ' VM', action: toggleAnimation },
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
				window.open('https://github.com/0xpiners', '_blank', 'noopener,noreferrer');
				closeDropdown();
			},
		},
		{
			label: 'LinkedIn',
			action: () => {
				window.open('https://www.linkedin.com/in/davidmbp', '_blank', 'noopener,noreferrer');
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
			label: 'About piners',
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

// ── Light mode toggle ──────────────────────────────────
document.addEventListener('click', (e) => {
	if (!e.target.closest('.btn-light-mode')) return;
	document.body.classList.toggle('light');
});

// ── Toolbar button actions ─────────────────────────────
document.getElementById('btnPause').addEventListener('click', toggleAnimation);
document.getElementById('btnSnapshot').addEventListener('click', copyLink);
document.getElementById('btnRevert').addEventListener('click', () => {
	const prev = tabHistory.pop();
	if (prev) _origSwitchTab(prev);
	else toast('No previous tab');
});
function setViewActive(id) {
	['btnViewSingle', 'btnViewFull', 'btnViewGrid'].forEach((b) => {
		document.getElementById(b).classList.toggle('active', b === id);
	});
}
setViewActive('btnViewSingle');

document.getElementById('btnViewSingle').addEventListener('click', () => {
	closeGridView();
	if (!libraryVisible) toggleLibrary();
	setViewActive('btnViewSingle');
});
document.getElementById('btnViewFull').addEventListener('click', () => {
	closeGridView();
	toggleLibrary();
	setViewActive(libraryVisible ? 'btnViewSingle' : 'btnViewFull');
});
document.getElementById('btnViewGrid').addEventListener('click', () => {
	openGridView();
	setViewActive('btnViewGrid');
});
// ── XP Desktop selection box ───────────────────────────
(function () {
	const area = document.getElementById('xpArea');
	if (!area) return;
	let box = null;
	let startX = 0;
	let startY = 0;
	let dragging = false;
	let moveHandler = null;

	area.addEventListener('mousedown', (e) => {
		if (e.button !== 0) return;
		if (e.target.closest('.xp-icon, .xp-window, .xp-start-menu, .xp-context-menu')) return;
		dragging = true;
		const rect = area.getBoundingClientRect();
		startX = e.clientX - rect.left;
		startY = e.clientY - rect.top;
		box = document.createElement('div');
		box.className = 'xp-select-box';
		box.style.left = startX + 'px';
		box.style.top = startY + 'px';
		box.style.width = '0px';
		box.style.height = '0px';
		area.appendChild(box);

		moveHandler = (ev) => {
			if (!dragging || !box) return;
			const r = area.getBoundingClientRect();
			const x = ev.clientX - r.left;
			const y = ev.clientY - r.top;
			const left = Math.min(x, startX);
			const top = Math.min(y, startY);
			const width = Math.abs(x - startX);
			const height = Math.abs(y - startY);
			box.style.left = left + 'px';
			box.style.top = top + 'px';
			box.style.width = width + 'px';
			box.style.height = height + 'px';
		};

		document.addEventListener('mousemove', moveHandler);
		document.addEventListener('mouseup', () => {
			if (!dragging) return;
			dragging = false;
			if (box) box.remove();
			box = null;
			if (moveHandler) document.removeEventListener('mousemove', moveHandler);
			moveHandler = null;
		}, { once: true });
	});
})();

// ── XP Start Menu ─────────────────────────────────────
(function () {
	const startBtn = document.getElementById('xpStartBtn');
	const menu = document.getElementById('xpStartMenu');
	if (!startBtn || !menu) return;

	function closeMenu() { menu.style.display = 'none'; }
	function openMenu() { menu.style.display = ''; }

	startBtn.addEventListener('click', (e) => {
		e.stopPropagation();
		menu.style.display = menu.style.display === 'none' ? '' : 'none';
	});

	document.addEventListener('click', (e) => {
		if (!e.target.closest('#xpStartMenu') && !e.target.closest('#xpStartBtn')) closeMenu();
	});

	document.getElementById('smTorBrowserItem').addEventListener('click', () => {
		closeMenu();
		if (window.openTorBrowser) window.openTorBrowser();
	});
	document.getElementById('smMyComputerItem').addEventListener('click', () => {
		closeMenu();
		document.getElementById('xpComputerBin').style.display = '';
		document.getElementById('xpComputerTaskbtn').style.display = '';
		document.getElementById('xpComputerTaskbtn').classList.add('active');
	});
	document.getElementById('smMyDocumentsItem').addEventListener('click', () => {
		closeMenu();
		if (window.openMyDocuments) window.openMyDocuments();
	});
	document.getElementById('smRecycleBinItem').addEventListener('click', () => {
		closeMenu();
		document.getElementById('xpRecycleBin').style.display = '';
		document.getElementById('xpRecycleTaskbtn').style.display = '';
		document.getElementById('xpRecycleTaskbtn').classList.add('active');
	});
	document.getElementById('smRMyComputer').addEventListener('click', () => {
		closeMenu();
		document.getElementById('xpComputerBin').style.display = '';
		document.getElementById('xpComputerTaskbtn').style.display = '';
		document.getElementById('xpComputerTaskbtn').classList.add('active');
	});
	document.getElementById('smRMyDocuments').addEventListener('click', () => {
		closeMenu();
		if (window.openMyDocuments) window.openMyDocuments();
	});
	document.getElementById('smLogOff').addEventListener('click', () => {
		closeMenu();
		toast('Logging off... just kidding.');
	});
	document.getElementById('smShutDown').addEventListener('click', () => {
		closeMenu();
		toast('Shutting down... just kidding.');
	});
})();

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
	termPrint(`<span style="color:#e74c3c">[ piners ~ ]#</span> ${escHtml(input)}`);
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
		termPrint(`<span style="color:#e74c3c">bash: ${escHtml(input)}: command not found</span>`);
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

	window.openTorBrowser = function () {
		taskbtn.style.display = '';
		restore();
		bringToFront(win);
	};

	document.getElementById('xpTorMin').addEventListener('click', minimize);
	document.getElementById('xpTorClose').addEventListener('click', close);
	document.getElementById('iconTorBrowser').addEventListener('dblclick', () => {
		window.openTorBrowser();
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

	// drag — clicking title bar or tabstrip spacer restores from maximized then drags (Windows XP behaviour)
	let dragging = false,
		ox = 0,
		oy = 0;

	function startXpTorDrag(e) {
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
	}

	titlebar.addEventListener('mousedown', (e) => {
		if (e.target.closest('.xp-ctrl')) return;
		startXpTorDrag(e);
	});

	const xpTorSpacer = win.querySelector('.tor-tabstrip__spacer');
	if (xpTorSpacer) {
		xpTorSpacer.addEventListener('mousedown', startXpTorDrag);
		xpTorSpacer.addEventListener('dblclick', () => {
			saved = { l: win.style.left || '110px', t: win.style.top || '28px', w: win.style.width || '700px', h: win.style.height || '430px' };
			win.classList.add('xp-maximized');
			win.style.left = win.style.top = win.style.width = win.style.height = '';
		});
	}

	const xpWinctrlMin = win.querySelector('.tor-winctrl--min');
	const xpWinctrlMax = win.querySelector('.tor-winctrl--max');
	const xpWinctrlClose = win.querySelector('.tor-winctrl--close');
	if (xpWinctrlMin) xpWinctrlMin.addEventListener('click', minimize);
	if (xpWinctrlMax) xpWinctrlMax.addEventListener('click', () => document.getElementById('xpTorMax').click());
	if (xpWinctrlClose) xpWinctrlClose.addEventListener('click', close);

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

// ── XP My Documents: minimize / drag / close ─────────
(function () {
	const win = document.getElementById('xpMyDocuments');
	const titlebar = document.getElementById('xpMyDocTitlebar');
	const taskbtn = document.getElementById('xpMyDocTaskbtn');
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

	window.openMyDocuments = open;

	document.getElementById('iconMyDocuments').addEventListener('dblclick', open);
	document.getElementById('xpMyDocClose').addEventListener('click', close);
	document.getElementById('xpMyDocMin').addEventListener('click', minimize);
	document.getElementById('xpMyDocMax').addEventListener('click', () => {
		if (win.classList.contains('xp-maximized')) {
			win.classList.remove('xp-maximized');
			win.style.left = saved.l; win.style.top = saved.t;
			win.style.width = saved.w; win.style.height = saved.h;
		} else {
			saved = { l: win.style.left || '220px', t: win.style.top || '70px', w: win.style.width || '480px', h: win.style.height || '320px' };
			win.classList.add('xp-maximized');
			win.style.left = win.style.top = win.style.width = win.style.height = '';
		}
	});
	taskbtn.addEventListener('click', () => (win.style.display === 'none' ? restore() : minimize()));

	let saved = { l: '220px', t: '70px', w: '480px', h: '320px' };
	let dragging = false, ox = 0, oy = 0;
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
		bringToFront(win);
	});
	document.addEventListener('mousemove', (e) => {
		if (!dragging) return;
		const area = document.getElementById('xpArea');
		const areaRect = area.getBoundingClientRect();
		win.style.left = Math.max(0, Math.min(area.clientWidth - win.offsetWidth, e.clientX - areaRect.left - ox)) + 'px';
		win.style.top = Math.max(0, Math.min(area.clientHeight - win.offsetHeight, e.clientY - areaRect.top - oy)) + 'px';
	});
	document.addEventListener('mouseup', () => { dragging = false; win.style.userSelect = ''; });
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
		if (e.target.closest('.xp-window')) return;
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
	{
		title: 'DepChain',
		description:
			'Permissioned replicated blockchain with 4 nodes and HotStuff-style Byzantine fault-tolerant consensus. Integrates the EVM via Hyperledger Besu, deploys an ISTCoin ERC-20 token at genesis, and builds a full authenticated networking stack from UDP up through perfect links and authenticated channels.',
		tags: ['Java', 'Blockchain', 'BFT', 'EVM'],
		url: 'https://github.com/0xpiners/depchain',
		date: '2026',
		status: 'archived',
		category: 'distributed',
	},
	{
		title: 'Simple Onion Router Network',
		description:
			'Three-component onion routing network: relay nodes, users, and a registry mapping node IDs to RSA public keys. Users wrap messages in layers of RSA encryption and route them through a chain — each node peels one layer without learning source or destination.',
		tags: ['TypeScript', 'Node.js', 'Cryptography', 'Networking'],
		url: 'https://github.com/0xpiners/Simple-onion-router-network',
		date: '2026',
		status: 'archived',
		category: 'security',
	},
	{
		title: 'DeathNode',
		description:
			'Cryptographic peer-to-peer reporting platform where all communication is end-to-end encrypted with AES-256-GCM. Access is invitation-only via signed tokens, transport is secured with TLS mutual authentication, and each service runs in an isolated VM.',
		tags: ['Java', 'Security', 'P2P', 'AES-256', 'TLS'],
		url: 'https://github.com/0xpiners/DeathNode',
		date: '2025',
		status: 'archived',
		category: 'security',
	},
	{
		title: 'Vulnerability Assessment — BLACKHOLE Inc.',
		description:
			'Full penetration test against fictitious company BLACKHOLE Inc., following PTES methodology. Discovered and exploited SSTI leading to RCE (CVE-2022-29078) and a sudo misconfiguration for privilege escalation to root (CVE-2023-22809).',
		tags: ['Pentesting', 'PTES', 'Burp Suite', 'SQLMap', 'Nmap'],
		url: 'https://github.com/0xpiners/Vulnerability-Assessment-ISCTE',
		date: '2025',
		status: 'archived',
		category: 'security',
	},
	{
		title: 'MISP API CLI',
		description:
			'Command-line interface for the MISP open-source threat intelligence platform. Lets analysts manage users, sync feeds, query and create events, and schedule cronjobs directly from the terminal.',
		tags: ['Python', 'Shell', 'MISP', 'Threat Intelligence'],
		url: 'https://github.com/0xpiners/MISP_API_CLI',
		date: '2025',
		status: 'archived',
		category: 'security',
	},
	{
		title: 'AES-GCM Encryption',
		description:
			'Minimal Python script demonstrating authenticated encryption with AES-GCM using pycryptodome. Shows key derivation, encryption, and decryption with integrity verification.',
		tags: ['Python', 'Cryptography', 'AES-GCM'],
		url: 'https://github.com/0xpiners/AES_GCM',
		date: '2024',
		status: 'archived',
		category: 'security',
	},
	{
		title: 'Password Manager',
		description:
			'Local password manager in Python with encrypted storage. Lets users add, retrieve, and manage credentials for multiple accounts with a master-password-based vault.',
		tags: ['Python', 'Cryptography', 'Security'],
		url: 'https://github.com/0xpiners/Password-manager',
		date: '2024',
		status: 'archived',
		category: 'security',
	},
	{
		title: 'Caesar Cipher GUI',
		description:
			'Tkinter desktop app for encoding, decoding, and brute-forcing Caesar cipher messages. Includes all 25 shift variants in the brute-force view.',
		tags: ['Python', 'Cryptography', 'Tkinter', 'GUI'],
		url: 'https://github.com/0xpiners/Caesar_cipher_GUI',
		date: '2023',
		status: 'archived',
		category: 'security',
	},
	{
		title: 'Ben-Or Consensus Algorithm',
		description:
			'TypeScript implementation of the Ben-Or randomized Byzantine consensus protocol. Each process runs independent coin-flip rounds to reach agreement even when up to ⌊(n−1)/5⌋ nodes are faulty.',
		tags: ['TypeScript', 'Distributed Systems', 'BFT', 'Consensus'],
		url: 'https://github.com/0xpiners/Ben-Or-decentralized-consensus-algorithm',
		date: '2026',
		status: 'archived',
		category: 'distributed',
	},
	{
		title: 'Event Queue Application',
		description:
			'Dockerized event-driven system with Nginx reverse proxy, Redis message broker, and Go-based producer/consumer services. Demonstrates queue depth monitoring and backpressure handling.',
		tags: ['Go', 'Redis', 'Nginx', 'Docker'],
		url: 'https://github.com/0xpiners/Event-queue-application',
		date: '2024',
		status: 'archived',
		category: 'distributed',
	},
	{
		title: 'Torrent Workshop',
		description:
			'Hands-on BitTorrent workshop walking through downloading files via magnet links and inspecting swarm behaviour. Explores trackers, peers, and piece verification.',
		tags: ['Networking', 'P2P', 'BitTorrent'],
		url: 'https://github.com/0xpiners/Torrent-workshop',
		date: '2024',
		status: 'archived',
		category: 'distributed',
	},
	{
		title: 'Smalito',
		description:
			"URL shortener deployed on Cloudflare's edge. Supports user accounts with email verification, a link dashboard with click analytics, and uses D1, KV, and R2 — zero origin server.",
		tags: ['TypeScript', 'Cloudflare Workers', 'D1', 'KV'],
		url: 'https://github.com/0xpiners/smalito',
		liveUrl: 'https://smalito.com',
		date: '2026',
		status: 'live',
		category: 'web',
	},
	{
		title: 'FoodShop',
		description:
			'Microservices food store with Angular frontend backed by two independent REST APIs for order management and inventory. Orchestrated with Docker Compose.',
		tags: ['JavaScript', 'Angular', 'Docker', 'Microservices'],
		url: 'https://github.com/0xpiners/FoodShop',
		date: '2026',
		status: 'archived',
		category: 'web',
	},
	{
		title: 'What Did I Learn Today',
		description:
			'Daily learning journal web app for logging, tagging, and reviewing things learned each day. Builds a searchable personal knowledge base over time.',
		tags: ['TypeScript', 'Web'],
		url: 'https://github.com/0xpiners/what-did-i-learn-today',
		date: '2025',
		status: 'wip',
		category: 'web',
	},
	{
		title: 'Portfolio',
		description:
			'Interactive portfolio built as a Cloudflare Workers app with a custom desktop-style UI, tabbed navigation, and dedicated sections for projects, resume, and CTF work. Designed to feel like a retro operating system while staying fully web-native.',
		tags: ['JavaScript', 'Cloudflare Workers', 'Frontend'],
		url: 'https://github.com/0xpiners/portfolio',
		liveUrl: 'https://piners.fyi',
		date: '2026',
		status: 'live',
		category: 'web',
	},
	{
		title: 'ISCTE Flight System v2',
		description:
			'Client-server flight control system for an Operating Systems course. A server process manages all flight and passenger data; client processes connect, issue commands, and receive real-time updates. Explores IPC, process synchronisation, and concurrent file access.',
		tags: ['C', 'Systems', 'IPC', 'Concurrency'],
		url: 'https://github.com/0xpiners/IscteFlight-2',
		date: '2023',
		status: 'archived',
		category: 'systems',
	},
	{
		title: 'ISCTE Flight System v1',
		description:
			'Bash-based flight management CLI with a menu-driven interface for booking flights, registering passengers, and checking flight status. Data is persisted to flat files.',
		tags: ['Bash', 'CLI', 'Systems'],
		url: 'https://github.com/0xpiners/IscteFligth-1',
		date: '2023',
		status: 'archived',
		category: 'systems',
	},
	{
		title: 'Trackfolio',
		description:
			'Java desktop application for tracking and managing a personal investment portfolio — add assets, record transactions, and monitor current value over time.',
		tags: ['Java', 'Finance', 'Desktop'],
		url: 'https://github.com/0xpiners/Trackfolio',
		date: '2024',
		status: 'wip',
		category: 'tools',
	},
	{
		title: 'Space Invaders AI',
		description:
			'Space Invaders agent trained through a genetic algorithm — no hand-coded rules. A population of neural networks plays the game; the best performers reproduce and mutate each generation.',
		tags: ['Java', 'Neural Networks', 'Genetic Algorithm', 'AI'],
		url: 'https://github.com/0xpiners/Space-Invaders-AI',
		date: '2024',
		status: 'archived',
		category: 'ai',
	},
	{
		title: 'Flappy Phoenix',
		description:
			'Flappy Bird reimagined as a phoenix with mid-air enemies and collectible power-ups. Built in Android Studio with custom sprite animations.',
		tags: ['Java', 'Android', 'Game'],
		url: 'https://github.com/0xpiners/Flappyphoenix',
		date: '2024',
		status: 'archived',
		category: 'games',
	},
	{
		title: 'Roguelike Game',
		description:
			'Procedural roguelike dungeon crawler with multi-level dungeons, hostile enemies, and loot drops. Each run is unique; the player must manage health and inventory to reach the deepest floor.',
		tags: ['Java', 'Game', 'Roguelike', 'Procedural'],
		url: 'https://github.com/0xpiners/Roguelike-game',
		date: '2023',
		status: 'archived',
		category: 'games',
	},
	{
		title: 'Sokoban',
		description:
			'Classic Sokoban puzzle game in Java — navigate a warehouse worker and push crates onto their target spots. Features custom level layouts.',
		tags: ['Java', 'Game', 'Puzzle'],
		url: 'https://github.com/0xpiners/Sokoban',
		date: '2023',
		status: 'archived',
		category: 'games',
	},
	{
		title: 'Sudoku',
		description: 'Playable Sudoku game with input validation and puzzle generation, built in Java using the PandionJ teaching framework.',
		tags: ['Java', 'Game', 'Puzzle'],
		url: 'https://github.com/0xpiners/Sudoku',
		date: '2023',
		status: 'archived',
		category: 'games',
	},
	{
		title: 'Termo',
		description:
			'Portuguese-language Wordle clone. Guess the hidden 5-letter word in six tries; correct letters turn green, misplaced letters turn yellow.',
		tags: ['Java', 'Game', 'Wordle'],
		url: 'https://github.com/0xpiners/Termo',
		date: '2023',
		status: 'archived',
		category: 'games',
	},
	{
		title: 'Auto Attendance Bot',
		description:
			'Android app that automates the daily attendance check-in flow on the Leonardo De Vinci University portal. Navigates the login form and submits presence without manual interaction.',
		tags: ['Java', 'Android', 'Automation'],
		url: 'https://github.com/0xpiners/AutoAttendanceLeonardDeVinciUniversity',
		date: '2024',
		status: 'archived',
		category: 'tools',
	},
	{
		title: 'Todo List CLI',
		description:
			'Lightweight command-line todo app in Python. Add, complete, and delete tasks from the terminal; tasks persist between sessions in a local file.',
		tags: ['Python', 'CLI', 'Productivity'],
		url: 'https://github.com/0xpiners/Todo-list-application',
		date: '2023',
		status: 'archived',
		category: 'tools',
	},
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

const STATUS_ORDER = { live: 0, wip: 1, archived: 2 };
function sortProjects(list) {
	return [...list].sort((a, b) => (STATUS_ORDER[a.status] ?? 2) - (STATUS_ORDER[b.status] ?? 2));
}

function buildProjCards(list) {
	return list
		.map(
			(p, i) => `
		<div class="proj-card" data-idx="${p._idx ?? i}">
			<div class="proj-card__header">
				<span class="proj-card__title">${p.title}</span>
				<span class="proj-card__status proj-card__status--${p.status}">${p.status}</span>
			</div>
			<div class="proj-card__tags">
				${p.tags
					.slice(0, 4)
					.map((t) => `<span class="proj-card__tag">${t}</span>`)
					.join('')}
			</div>
			<div class="proj-card__footer">
				<span class="proj-card__date">${p.date}</span>
				<button class="proj-card__open" data-idx="${p._idx ?? i}">Read description</button>
			</div>
		</div>`,
		)
		.join('');
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
				${p.tags.map((t) => `<span class="proj-card__tag">${t}</span>`).join('')}
			</div>
			<div class="proj-modal__actions">
				${
					p.url
						? `<a class="proj-modal__link" href="${p.url}" target="_blank" rel="noopener noreferrer">Open on GitHub &rarr;</a>`
						: '<span class="proj-modal__link proj-modal__link--na">Private</span>'
				}
				${p.liveUrl ? `<a class="proj-modal__link proj-modal__link--live" href="${p.liveUrl}" target="_blank" rel="noopener noreferrer">See Live &rarr;</a>` : ''}
			</div>
		</div>`;
	document.getElementById('projOnionContent').appendChild(modal);
	modal.addEventListener('click', (e) => {
		if (e.target === modal || e.target.closest('.proj-modal__close')) modal.remove();
	});
}

function renderProjects() {
	const container = document.getElementById('projOnionContent');
	if (!container) return;
	const indexed = projects.map((p, i) => ({ ...p, _idx: i }));
	const countFor = (fid) => fid === 'all' ? indexed.length : indexed.filter((p) => fid === 'ai' ? (p.category === 'ai' || p.category === 'games') : p.category === fid).length;
	const filterTabs = PROJ_FILTERS.map(
		(f) => `<button class="proj-filter-tab${f.id === 'all' ? ' active' : ''}" data-filter="${f.id}">${f.label} <span class="proj-filter-count">${countFor(f.id)}</span></button>`,
	).join('');
	const lightSvg = `<svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 2a6 6 0 010 12V2z"/></svg>`;
	container.innerHTML = `
		<div class="proj-onion-header">
			<div class="proj-onion-logo-name">Projects</div>
			<div class="proj-onion-logo-sub">${projects.length} repos</div>
			<button class="btn-light-mode" style="margin-left:auto" title="Toggle light mode">${lightSvg}</button>
		</div>
		<div class="proj-filter-bar">${filterTabs}</div>
		<div class="proj-onion-grid" id="projGrid">${buildProjCards(sortProjects(indexed))}</div>`;

	const bar = container.querySelector('.proj-filter-bar');
	const grid = container.querySelector('#projGrid');
	bar.addEventListener('click', (e) => {
		const btn = e.target.closest('.proj-filter-tab');
		if (!btn) return;
		bar.querySelectorAll('.proj-filter-tab').forEach((b) => b.classList.remove('active'));
		btn.classList.add('active');
		const f = btn.dataset.filter;
		const filtered = f === 'all' ? indexed : indexed.filter((p) => f === 'ai' ? (p.category === 'ai' || p.category === 'games') : p.category === f);
		grid.innerHTML = buildProjCards(sortProjects(filtered));
	});
	container.addEventListener('click', (e) => {
		const clickable = e.target.closest('.proj-card__open') || e.target.closest('.proj-card__title');
		if (!clickable) return;
		const card = clickable.closest('.proj-card');
		if (!card) return;
		const idx = +card.dataset.idx;
		if (idx >= 0 && idx < projects.length) openProjModal(projects[idx]);
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

	document.getElementById('parrotTorMin').addEventListener('click', minimize);
	document.getElementById('parrotTorClose').addEventListener('click', close);
	document.getElementById('iconParrotTor').addEventListener('dblclick', () => {
		taskbtn.style.display = '';
		restore();
	});
	taskbtn.addEventListener('click', () => (win.style.display === 'none' ? restore() : minimize()));

	const refreshBtn = document.getElementById('parrotTorRefresh');
	const loadingBar = document.getElementById('parrotLoadingBar');
	const pageContent = document.getElementById('projOnionContent');
	if (refreshBtn && loadingBar && pageContent) {
		refreshBtn.addEventListener('click', () => {
			loadingBar.style.display = 'block';
			loadingBar.style.width = '0%';
			pageContent.style.opacity = '0.3';
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

	const omnibox = document.getElementById('parrotTorOmnibox');
	if (omnibox) {
		omnibox.addEventListener('click', () => {
			const url = omnibox.querySelector('.tor-omnibox__url').innerText.trim();
			navigator.clipboard.writeText(url).then(() => {
				toast('Onion link copied!');
				omnibox.style.background = '#1a2a1a';
				setTimeout(() => {
					omnibox.style.background = '';
				}, 200);
			});
		});
	}

	let saved = { l: '80px', t: '0px', w: '700px', h: '430px' };
	document.getElementById('parrotTorMax').addEventListener('click', () => {
		if (win.classList.contains('parrot-maximized')) {
			win.classList.remove('parrot-maximized');
			win.style.left = saved.l;
			win.style.top = saved.t;
			win.style.width = saved.w;
			win.style.height = saved.h;
		} else {
			saved = { l: win.style.left || '80px', t: win.style.top || '0px', w: win.style.width || '700px', h: win.style.height || '430px' };
			win.classList.add('parrot-maximized');
			win.style.left = win.style.top = win.style.width = win.style.height = '';
		}
	});

	let dragging = false,
		ox = 0,
		oy = 0;

	function startParrotDrag(e) {
		e.preventDefault();
		if (win.classList.contains('parrot-maximized')) {
			win.classList.remove('parrot-maximized');
			win.style.left = saved.l;
			win.style.top = saved.t;
			win.style.width = saved.w;
			win.style.height = saved.h;
		}
		dragging = true;
		const areaRect = document.getElementById('parrotArea').getBoundingClientRect();
		const winRect = win.getBoundingClientRect();
		ox = e.clientX - winRect.left;
		oy = e.clientY - winRect.top;
		win.style.left = winRect.left - areaRect.left + 'px';
		win.style.top = winRect.top - areaRect.top + 'px';
		win.style.userSelect = 'none';
	}

	titlebar.addEventListener('mousedown', (e) => {
		if (e.target.closest('.parrot-ctrl')) return;
		startParrotDrag(e);
	});

	const parrotSpacer = win.querySelector('.tor-tabstrip__spacer');
	if (parrotSpacer) {
		parrotSpacer.addEventListener('mousedown', startParrotDrag);
		parrotSpacer.addEventListener('dblclick', () => {
			saved = { l: win.style.left || '80px', t: win.style.top || '0px', w: win.style.width || '700px', h: win.style.height || '430px' };
			win.classList.add('parrot-maximized');
			win.style.left = win.style.top = win.style.width = win.style.height = '';
		});
	}

	const parrotWinctrlMin = win.querySelector('.tor-winctrl--min');
	const parrotWinctrlMax = win.querySelector('.tor-winctrl--max');
	const parrotWinctrlClose = win.querySelector('.tor-winctrl--close');
	if (parrotWinctrlMin) parrotWinctrlMin.addEventListener('click', minimize);
	if (parrotWinctrlMax) parrotWinctrlMax.addEventListener('click', () => document.getElementById('parrotTorMax').click());
	if (parrotWinctrlClose) parrotWinctrlClose.addEventListener('click', close);

	document.addEventListener('mousemove', (e) => {
		if (!dragging) return;
		const area = document.getElementById('parrotArea');
		const areaRect = area.getBoundingClientRect();
		win.style.left = Math.max(0, Math.min(area.clientWidth - win.offsetWidth, e.clientX - areaRect.left - ox)) + 'px';
		win.style.top = Math.max(0, Math.min(area.clientHeight - win.offsetHeight, e.clientY - areaRect.top - oy)) + 'px';
	});
	document.addEventListener('mouseup', () => {
		dragging = false;
		win.style.userSelect = '';
	});
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
		title: 'format string 0',
		event: 'picoCTF',
		category: 'pwn',
		tags: ['picoCTF', 'pwn', 'easy'],
		date: '2025',
		placement: null,
		description:
			'Can you use your knowledge of format strings to make the customers happy? Download the binary [here](https://artifacts.picoctf.net/c_mimas/76/format-s...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/binary/easy/format string 0/format string 0.md',
	},
	{
		title: 'heap 0',
		event: 'picoCTF',
		category: 'pwn',
		tags: ['picoCTF', 'pwn', 'easy'],
		date: '2025',
		placement: null,
		description:
			'Are overflows just a stack concern? Download the binary [here](https://artifacts.picoctf.net/c_tethys/15/chall). Download the source [here](https://ar...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/binary/easy/heap 0/heap 0.md',
	},
	{
		title: 'Echo Valley (Incomplete)',
		event: 'picoCTF',
		category: 'pwn',
		tags: ['picoCTF', 'pwn'],
		date: '2026',
		placement: null,
		description: 'CTF Challenge from picoCTF',
		writeup: true,
		markdownPath: '/ctf/picoCTF/binary/medium/Echo Valley (Incomplete)/Echo Valley.md',
	},
	{
		title: 'hash-only-1',
		event: 'picoCTF',
		category: 'pwn',
		tags: ['picoCTF', 'pwn', 'medium'],
		date: '2025',
		placement: null,
		description:
			'Here is a binary that has enough privilege to read the content of the flag file but will only let you know its hash. If only it could just give you th...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/binary/medium/hash-only-1/hash-only-1.md',
	},
	{
		title: 'hash-only-2',
		event: 'picoCTF',
		category: 'pwn',
		tags: ['picoCTF', 'pwn', 'medium'],
		date: '2025',
		placement: null,
		description:
			'Here is a binary that has enough privilege to read the content of the flag file but will only let you know its hash. If only it could just give you th...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/binary/medium/hash-only-2/hash-only-2.md',
	},
	{
		title: 'Input Injection 1',
		event: 'picoCTF',
		category: 'pwn',
		tags: ['picoCTF', 'pwn', 'medium'],
		date: '2025',
		placement: null,
		description:
			'A friendly program wants to greet you… but its goodbye might say more than it should. Can you convince it to reveal the flag? connect to the challenge...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/binary/medium/Input Injection 1/Input Injection 1.md',
	},
	{
		title: 'Input Injection 2',
		event: 'picoCTF',
		category: 'pwn',
		tags: ['picoCTF', 'pwn', 'medium'],
		date: '2025',
		placement: null,
		description:
			'This program greets you and then runs a command. But can you take control of what command it executes? Connect to the program with netcat: `nc saffron...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/binary/medium/Input Injection 2/Input Injection 2.md',
	},
	{
		title: 'PIE TIME 2',
		event: 'picoCTF',
		category: 'pwn',
		tags: ['picoCTF', 'pwn', 'medium'],
		date: '2025',
		placement: null,
		description:
			"Can you try to get the flag? I'm not revealing anything anymore!! Connect to the program with netcat: $ nc rescued-float.picoctf.net 53338",
		writeup: true,
		markdownPath: '/ctf/picoCTF/binary/medium/PIE TIME 2/PIE TIME 2.md',
	},
	{
		title: '13',
		event: 'picoCTF',
		category: 'crypto',
		tags: ['picoCTF', 'crypto', 'easy'],
		date: '2025',
		placement: null,
		description: 'Cryptography can be easy, do you know what ROT13 is? cvpbPGS{abg_gbb_onq_bs_n_ceboyrz} I used cyberchef to decode this.',
		writeup: true,
		markdownPath: '/ctf/picoCTF/criptography/easy/13/13.md',
	},
	{
		title: 'EVEN RSA CAN BE BROKEN',
		event: 'picoCTF',
		category: 'crypto',
		tags: ['picoCTF', 'crypto', 'easy'],
		date: '2025',
		placement: null,
		description:
			'This service provides you an encrypted flag. Can you decrypt it with just N & e? Connect to the program with netcat: `$ nc verbal-sleep.picoctf.net 49...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/criptography/easy/EVEN RSA CAN BE BROKEN/EVEN RSA CAN BE BROKEN.md',
	},
	{
		title: 'interencdec',
		event: 'picoCTF',
		category: 'crypto',
		tags: ['picoCTF', 'crypto', 'easy'],
		date: '2025',
		placement: null,
		description:
			'Can you get the real meaning from this file. Download the file [here](https://artifacts.picoctf.net/c_titan/3/enc_flag). By using cat on the file we s...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/criptography/easy/interencdec/interencdec.md',
	},
	{
		title: 'Images',
		event: 'picoCTF',
		category: 'crypto',
		tags: ['picoCTF', 'crypto'],
		date: '2026',
		placement: null,
		description: 'CTF Challenge from picoCTF',
		writeup: true,
		markdownPath: '/ctf/picoCTF/criptography/easy/The Numbers/The Numbers.md',
	},
	{
		title: 'Corrupted File',
		event: 'picoCTF',
		category: 'forensics',
		tags: ['picoCTF', 'forensics', 'easy'],
		date: '2025',
		placement: null,
		description:
			'Description: This file seems broken... or is it? Maybe a couple of bytes could make all the difference. Can you figure out how to bring it back to lif...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/forensics/easy/Corrupted File/Corrupted File.md',
	},
	{
		title: 'Flag in Flame',
		event: 'picoCTF',
		category: 'forensics',
		tags: ['picoCTF', 'forensics', 'easy'],
		date: '2025',
		placement: null,
		description: 'They give us a .txt file Using the command cat with see a random of data that looks base64 encoded',
		writeup: true,
		markdownPath: '/ctf/picoCTF/forensics/easy/Flag in Flame/Flag in Flame.md',
	},
	{
		title: 'Hidden_In_plainsight',
		event: 'picoCTF',
		category: 'forensics',
		tags: ['picoCTF', 'forensics'],
		date: '2026',
		placement: null,
		description: 'CTF Challenge from picoCTF',
		writeup: true,
		markdownPath: '/ctf/picoCTF/forensics/easy/Hidden_In_plainsight/Hidden.md',
	},
	{
		title: 'Riddle Registry',
		event: 'picoCTF',
		category: 'forensics',
		tags: ['picoCTF', 'forensics', 'easy'],
		date: '2025',
		placement: null,
		description: 'They give you a file c50790f066676d65fdc2d2cfa0256fe4ba3845d91c5424be26d2597fd88b73fe  confidential.pdf',
		writeup: true,
		markdownPath: '/ctf/picoCTF/forensics/easy/Riddle Registry/Riddle Registry.md',
	},
	{
		title: 'endianness-v2',
		event: 'picoCTF',
		category: 'forensics',
		tags: ['picoCTF', 'forensics', 'medium'],
		date: '2026',
		placement: null,
		description:
			"Here's a file that was recovered from a 32-bits system that organized the bytes a weird way. We're not even sure what type of file it is. Download it ...",
		writeup: true,
		markdownPath: '/ctf/picoCTF/forensics/medium/endianness-v2/endianness-v2.md',
	},
	{
		title: 'MSB',
		event: 'picoCTF',
		category: 'forensics',
		tags: ['picoCTF', 'forensics', 'medium'],
		date: '2026',
		placement: null,
		description:
			"This image passes LSB statistical analysis, but we can't help but think there must be something to the visual artifacts present in this image... Downl...",
		writeup: true,
		markdownPath: '/ctf/picoCTF/forensics/medium/MSB/MSB.md',
	},
	{
		title: '2warm',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description: 'Can you convert the number 42 (base 10) to binary (base 2)? Yes I can',
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/2warm/2warm.md',
	},
	{
		title: 'Bases',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description: 'What does this bDNhcm5fdGgzX3IwcDM1 mean? I think it has something to do with bases. This looks base64 lets decode it.',
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/Bases/Bases.md',
	},
	{
		title: 'Big Zip',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description: 'Unzip this archive and find the flag. - [Download zip file](https://artifacts.picoctf.net/c/503/big-zip-files.zip)',
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/Big Zip/Big Zip.md',
	},
	{
		title: 'Binary Search',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description:
			'Want to play a game? As you use more of the shell, you might be interested in how they work! Binary search is a classic algorithm used to quickly find...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/Binary Search/Binary Search.md',
	},
	{
		title: 'binhexa',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description:
			'How well can you perfom basic binary operations? Start searching for the flag here `nc titan.picoctf.net 52141` This is what we get when we connect to...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/binhexa/binhexa.md',
	},
	{
		title: 'Blame Game',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description:
			"Someone's commits seems to be preventing the program from working. Who is it? You can download the challenge files here: - [challenge.zip](https://art...",
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/Blame Game/Blame Game.md',
	},
	{
		title: 'Codebook',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description:
			'Run the Python script `code.py` in the same directory as `codebook.txt`. - [Download code.py](https://artifacts.picoctf.net/c/3/code.py)',
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/Codebook/Codebook.md',
	},
	{
		title: 'Collaborative Development',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description:
			"My team has been working very hard on new features for our flag printing program! I wonder how they'll work together? You can download the challenge f...",
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/Collaborative Development/Collaborative Development.md',
	},
	{
		title: 'Commitment Issues',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description:
			'I accidentally wrote the flag down. Good thing I deleted it! You download the challenge files here: - [challenge.zip](https://artifacts.picoctf.net/c_...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/Commitment Issues/Commitment Issues.md',
	},
	{
		title: 'convertme.py',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description:
			'Run the Python script and convert the given number from decimal to binary to get the flag. [Download Python script](https://artifacts.picoctf.net/c/22...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/convertme.py/convertme.py.md',
	},
	{
		title: 'endianness',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description: 'Know of little and big endian? [Source](https://artifacts.picoctf.net/c_titan/118/flag.c) This is a big file.',
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/endianness/endianness.md',
	},
	{
		title: 'First Find',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description:
			"Unzip this archive and find the file named 'uber-secret.txt' - [Download zip file](https://artifacts.picoctf.net/c/500/files.zip)",
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/First Find/First Find.md',
	},
	{
		title: 'First Grep',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description:
			'Can you find the flag in the file? This would be really tedious to look through manually, something tells me there is a better way. The flag is in thi...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/First Grep/First Grep.md',
	},
	{
		title: 'fixme1.py',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description:
			'Fix the syntax error in this Python script to print the flag. [Download Python script](https://artifacts.picoctf.net/c/25/fixme1.py) I assume the scri...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/fixme1.py/fixme1.py.md',
	},
	{
		title: 'fixme2.py',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description:
			'Fix the syntax error in the Python script to print the flag. [Download Python script](https://artifacts.picoctf.net/c/6/fixme2.py) They give us a pyth...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/fixme2.py/fixme2.py.md',
	},
	{
		title: 'Glitch Cat',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description: 'Our flag printing service has started glitching! `$ nc saturn.picoctf.net 63213` Connecting to the port give us this:',
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/Glitch Cat/Glitch Cat.md',
	},
	{
		title: 'HashingJobApp',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description:
			'If you want to hash with the best, beat this test! `nc saturn.picoctf.net 59618` When we connect to the port it prompts this',
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/HashingJobApp/HashingJobApp.md',
	},
	{
		title: 'Lets Warm Up',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description: 'If I told you a word started with 0x70 in hexadecimal, what would it start with in ASCII? picoCTF{p}',
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/Lets Warm Up/Lets Warm Up.md',
	},
	{
		title: 'Log Hunt',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description: 'We only get one file We can see it has only ascii text.',
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/Log Hunt/Log Hunt.md',
	},
	{
		title: 'Magikarp Ground Mission',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description:
			'Do you know how to move between directories and read files in the shell? Start the container, `ssh` to it, and then `ls` once connected to begin. Logi...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/Magikarp Ground Mission/Magikarp Ground Mission.md',
	},
	{
		title: 'Mod 26',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description:
			"Cryptography can be easy, do you know what ROT13 is? `cvpbPGS{arkg_gvzr_V'yy_gel_2_ebhaqf_bs_ebg13_jdJBFOXJ}` Lets use cyberchef for this.",
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/Mod 26/Mod 26.md',
	},
	{
		title: 'Nice netcat',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description:
			"There is a nice program that you can talk to by using this command in a shell: `$ nc mercury.picoctf.net 21135`, but it doesn't speak English... When ...",
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/Nice netcat/Nice netcat.md',
	},
	{
		title: 'Obedient Cat',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description:
			'This file has a flag in plain sight (aka "in-the-clear"). [Download flag](https://mercury.picoctf.net/static/0e428b2db9788d31189329bed089ce98/flag). J...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/Obedient Cat/Obedient Cat.md',
	},
	{
		title: 'PW Crack 1',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description:
			"Can you crack the password to get the flag? Download the password checker [here](https://artifacts.picoctf.net/c/12/level1.py) and you'll need the enc...",
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/PW Crack 1/PW Crack 1.md',
	},
	{
		title: 'PW Crack 2',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description:
			"Can you crack the password to get the flag? Download the password checker [here](https://artifacts.picoctf.net/c/15/level2.py) and you'll need the enc...",
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/PW Crack 2/PW Crack 2.md',
	},
	{
		title: 'Python Wrangling',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description:
			'Python scripts are invoked kind of like programs in the Terminal... Can you run [this Python script](https://mercury.picoctf.net/static/b351a89e0bc674...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/Python Wrangling/Python Wrangling.md',
	},
	{
		title: 'repetitions',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description:
			'Can you make sense of this file? Download the file [here](https://artifacts.picoctf.net/c/475/enc_flag). Using cat on the file, we can see its encoded...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/repetitions/repetitions.md',
	},
	{
		title: 'runme.py',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description:
			'Run the `runme.py` script to get the flag. Download the script with your browser or with `wget` in the webshell. [Download runme.py Python script](htt...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/runme.py/runme.py.md',
	},
	{
		title: 'Rust fixme 2',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description:
			'The Rust saga continues? I ask you, can I borrow that, pleeeeeaaaasseeeee? Download the Rust code [here](https://challenge-files.picoctf.net/c_verbal_...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/Rust fixme 2/Rust fixme 2.md',
	},
	{
		title: 'Rust fixme 3',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description:
			'Have you heard of Rust? Fix the syntax errors in this Rust file to print the flag! Download the Rust code [here](https://challenge-files.picoctf.net/c...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/Rust fixme 3/Rust fixme 3.md',
	},
	{
		title: "Static ain't always noise",
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description:
			'Can you look at the data in this binary: [static](https://mercury.picoctf.net/static/ff4e569d6b49b92d090796d4631a2577/static)? This [BASH script](http...',
		writeup: true,
		markdownPath: "/ctf/picoCTF/general/easy/Static ain't always noise/Static ain't always noise.md",
	},
	{
		title: 'strings it',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description:
			'Can you find the flag in [file](https://jupiter.challenges.picoctf.org/static/fae9ac5267cd6e44124e559b901df177/strings) without running it? Lets use t...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/strings it/strings it.md',
	},
	{
		title: 'Super SSH',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description:
			"Using a Secure Shell (SSH) is going to be pretty important. Can you `ssh` as `ctf-player` to `titan.picoctf.net` at port `53785` to get the flag? You'...",
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/Super SSH/Super SSH.md',
	},
	{
		title: 'Tab, Tab, Attack',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description:
			'Using tabcomplete in the Terminal will add years to your life, esp. when dealing with long rambling directory structures and filenames: [Addadshashana...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/Tab, Tab, Attack/Tab, Tab, Attack.md',
	},
	{
		title: 'Time Machine',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description:
			'What was I last working on? I remember writing a note to help me remember... You can download the challenge files here: - [challenge.zip](https://arti...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/Time Machine/Time Machine.md',
	},
	{
		title: 'Warmed Up',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description: 'What is 0x3D (base 16) in decimal (base 10)? Lets just do it with python',
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/Warmed Up/Warmed Up.md',
	},
	{
		title: 'Wave a flag',
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description:
			'Can you invoke help flags for a tool or binary? [This program](https://mercury.picoctf.net/static/fc1d77192c544314efece5dd309092e3/warm) has extraordi...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/general/easy/Wave a flag/Wave a flag.md',
	},
	{
		title: "what's a net cat",
		event: 'picoCTF',
		category: 'general',
		tags: ['picoCTF', 'general', 'easy'],
		date: '2025',
		placement: null,
		description:
			'Using netcat (nc) is going to be pretty important. Can you connect to `jupiter.challenges.picoctf.org` at port `64287` to get the flag? Just connect t...',
		writeup: true,
		markdownPath: "/ctf/picoCTF/general/easy/what's a net cat/what's a net cat.md",
	},
	{
		title: 'Flag Hunters',
		event: 'picoCTF',
		category: 'rev',
		tags: ['picoCTF', 'rev', 'easy'],
		date: '2025',
		placement: null,
		description:
			"Lyrics jump from verses to the refrain kind of like a subroutine call. There's a hidden refrain this program doesn't print by default. Can you get it ...",
		writeup: true,
		markdownPath: '/ctf/picoCTF/rev/easy/Flag Hunters/Flag Hunters.md',
	},
	{
		title: 'Transformation',
		event: 'picoCTF',
		category: 'rev',
		tags: ['picoCTF', 'rev', 'easy'],
		date: '2025',
		placement: null,
		description:
			"Description I wonder what this really is... enc ''.join([chr((ord(flag[i]) << 8) + ord(flag[i + 1])) for i in range(0, len(flag), 2)])",
		writeup: true,
		markdownPath: '/ctf/picoCTF/rev/easy/Transformation/Transformation.md',
	},
	{
		title: 'Vault Door Training',
		event: 'picoCTF',
		category: 'rev',
		tags: ['picoCTF', 'rev'],
		date: '2026',
		placement: null,
		description: 'CTF Challenge from picoCTF',
		writeup: true,
		markdownPath: '/ctf/picoCTF/rev/easy/Vault Door Training/vault-door-training.md',
	},
	{
		title: 'Chronohack',
		event: 'picoCTF',
		category: 'rev',
		tags: ['picoCTF', 'rev', 'medium'],
		date: '2025',
		placement: null,
		description:
			'Can you guess the exact token and unlock the hidden flag? Our school relies on tokens to authenticate students. Unfortunately, someone leaked an impor...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/rev/medium/Chronohack/Chronohack.md',
	},
	{
		title: "M1n10n'5_53cr37",
		event: 'picoCTF',
		category: 'rev',
		tags: ['picoCTF', 'rev', 'medium'],
		date: '2025',
		placement: null,
		description:
			"Get ready for a mischievous adventure with your favorite Minions! 🕵️‍♂️💥 They’ve been up to their old tricks, and this time, they've hidden the flag...",
		writeup: true,
		markdownPath: "/ctf/picoCTF/rev/medium/M1n10n'5_53cr37/M1n10n'5_53cr37.md",
	},
	{
		title: 'Pico Bank',
		event: 'picoCTF',
		category: 'rev',
		tags: ['picoCTF', 'rev', 'medium'],
		date: '2025',
		placement: null,
		description:
			'In a bustling city where innovation meets finance, Pico Bank has emerged as a beacon of cutting-edge security. Promising state-of-the-art protection f...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/rev/medium/Pico Bank/Pico Bank.md',
	},
	{
		title: 'Quantum Scrambler',
		event: 'picoCTF',
		category: 'rev',
		tags: ['picoCTF', 'rev', 'medium'],
		date: '2025',
		placement: null,
		description:
			'We invented a new cypher that uses "quantum entanglement" to encode the flag. Do you have what it takes to decode it? Connect to the program with netc...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/rev/medium/Quantum Scrambler/Quantum Scrambler.md',
	},
	{
		title: 'Tap into Hash',
		event: 'picoCTF',
		category: 'rev',
		tags: ['picoCTF', 'rev', 'medium'],
		date: '2025',
		placement: null,
		description:
			'Can you make sense of this source code file and write a function that will decode the given encrypted file content? Find the encrypted file [here](htt...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/rev/medium/Tap into Hash/Tap into Hash.md',
	},
	{
		title: 'Cookies',
		event: 'picoCTF',
		category: 'web',
		tags: ['picoCTF', 'web', 'easy'],
		date: '2025',
		placement: null,
		description:
			"Who doesn't love cookies? Try to figure out the best one. [http://mercury.picoctf.net:27177/](http://mercury.picoctf.net:27177/) We get a page to sear...",
		writeup: true,
		markdownPath: '/ctf/picoCTF/web/easy/Cookies/Cookies.md',
	},
	{
		title: 'Crack The Gate 1',
		event: 'picoCTF',
		category: 'web',
		tags: ['picoCTF', 'web'],
		date: '2026',
		placement: null,
		description: "doesn't mention anything about SQLi, I figured our way in must be something else.",
		writeup: true,
		markdownPath: '/ctf/picoCTF/web/easy/Crack The Gate 1/Crack the Gate 1.md',
	},
	{
		title: 'GET aHEAD',
		event: 'picoCTF',
		category: 'web',
		tags: ['picoCTF', 'web', 'easy'],
		date: '2025',
		placement: null,
		description:
			'Find the flag being held on this server to get ahead of the competition [http://mercury.picoctf.net:21939/](http://mercury.picoctf.net:21939/) The des...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/web/easy/GET aHEAD/GET aHEAD.md',
	},
	{
		title: 'head-dump',
		event: 'picoCTF',
		category: 'web',
		tags: ['picoCTF', 'web', 'easy'],
		date: '2026',
		placement: null,
		description:
			'Welcome to the challenge! In this challenge, you will explore a web application and find an endpoint that exposes a file containing a hidden flag. The...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/web/easy/head-dump/head-dump.md',
	},
	{
		title: 'inspector',
		event: 'picoCTF',
		category: 'web',
		tags: ['picoCTF', 'web'],
		date: '2026',
		placement: null,
		description: 'CTF Challenge from picoCTF',
		writeup: true,
		markdownPath: '/ctf/picoCTF/web/easy/inspector/Inspector.md',
	},
	{
		title: 'IntroBurp',
		event: 'picoCTF',
		category: 'web',
		tags: ['picoCTF', 'web', 'easy'],
		date: '2025',
		placement: null,
		description: 'Try [here](http://titan.picoctf.net:61347/) to find the flag When I visit the site for the first time, we see this',
		writeup: true,
		markdownPath: '/ctf/picoCTF/web/easy/IntroBurp/IntroBurp.md',
	},
	{
		title: 'logon',
		event: 'picoCTF',
		category: 'web',
		tags: ['picoCTF', 'web', 'easy'],
		date: '2025',
		placement: null,
		description:
			"The factory is hiding things from all of its users. Can you login as Joe and find what they've been looking at? `https://jupiter.challenges.picoctf.or...",
		writeup: true,
		markdownPath: '/ctf/picoCTF/web/easy/logon/logon.md',
	},
	{
		title: 'Where are the robots',
		event: 'picoCTF',
		category: 'web',
		tags: ['picoCTF', 'web', 'easy'],
		date: '2025',
		placement: null,
		description:
			'Can you find the robots? `https://jupiter.challenges.picoctf.org/problem/56830/` ([link](https://jupiter.challenges.picoctf.org/problem/56830/)) or ht...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/web/easy/Where are the robots/Where are the robots.md',
	},
	{
		title: 'bypassed',
		event: 'picoCTF',
		category: 'web',
		tags: ['picoCTF', 'web', 'medium'],
		date: '2025',
		placement: null,
		description:
			"A university's online registration portal asks students to upload their ID cards for verification. The developer put some filters in place to ensure o...",
		writeup: true,
		markdownPath: '/ctf/picoCTF/web/medium/bypassed/bypassed.md',
	},
	{
		title: 'Crack the Gate 2',
		event: 'picoCTF',
		category: 'web',
		tags: ['picoCTF', 'web', 'medium'],
		date: '2025',
		placement: null,
		description:
			'The login system has been upgraded with a basic rate-limiting mechanism that locks out repeated failed attempts from the same source. We’ve received a...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/web/medium/Crack the Gate 2/Crack the Gate 2.md',
	},
	{
		title: 'findme (Incomplete)',
		event: 'picoCTF',
		category: 'web',
		tags: ['picoCTF', 'web'],
		date: '2026',
		placement: null,
		description: 'says to test the app with the user "test" and password "test!", I did exactly that.',
		writeup: true,
		markdownPath: '/ctf/picoCTF/web/medium/findme (Incomplete)/findme.md',
	},
	{
		title: 'Java Code Analysis',
		event: 'picoCTF',
		category: 'web',
		tags: ['picoCTF', 'web', 'medium'],
		date: '2026',
		placement: null,
		description:
			"BookShelf Pico, my premium online book-reading service. I believe that my website is super secure. I challenge you to prove me wrong by reading the 'F...",
		writeup: true,
		markdownPath: '/ctf/picoCTF/web/medium/Java Code Analysis/Java Code Analysis.md',
	},
	{
		title: 'MatchTheRegex',
		event: 'picoCTF',
		category: 'web',
		tags: ['picoCTF', 'web', 'medium'],
		date: '2026',
		placement: null,
		description:
			'How about trying to match a regular expression Additional details will be available after launching your challenge instance.',
		writeup: true,
		markdownPath: '/ctf/picoCTF/web/medium/MatchTheRegex/MatchTheRegex.md',
	},
	{
		title: 'Pachinko (Incomplete)',
		event: 'picoCTF',
		category: 'web',
		tags: ['picoCTF', 'web'],
		date: '2026',
		placement: null,
		description: 'CTF Challenge from picoCTF',
		writeup: true,
		markdownPath: '/ctf/picoCTF/web/medium/Pachinko (Incomplete)/Pachinko.md',
	},
	{
		title: 'Secrets',
		event: 'picoCTF',
		category: 'web',
		tags: ['picoCTF', 'web', 'medium'],
		date: '2026',
		placement: null,
		description:
			'We have several pages hidden. Can you find the one with the flag? The website is running [here](http://saturn.picoctf.net:64866/).',
		writeup: true,
		markdownPath: '/ctf/picoCTF/web/medium/Secrets/Secrets.md',
	},
	{
		title: 'SOAP',
		event: 'picoCTF',
		category: 'web',
		tags: ['picoCTF', 'web', 'medium'],
		date: '2026',
		placement: null,
		description:
			'The web project was rushed and no security assessment was done. Can you read the /etc/passwd file? [Web Portal](http://saturn.picoctf.net:50907/) This...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/web/medium/SOAP/SOAP.md',
	},
	{
		title: 'SSTI2 (Incomplete)',
		event: 'picoCTF',
		category: 'web',
		tags: ['picoCTF', 'web'],
		date: '2026',
		placement: null,
		description: 'CTF Challenge from picoCTF',
		writeup: true,
		markdownPath: '/ctf/picoCTF/web/medium/SSTI2 (Incomplete)/SSTI2.md',
	},
	{
		title: 'Trickster',
		event: 'picoCTF',
		category: 'web',
		tags: ['picoCTF', 'web', 'medium'],
		date: '2026',
		placement: null,
		description:
			'I found a web app that can help process images: PNG images only! Try it [here](http://atlas.picoctf.net:63196/)! When I first enter the site this is w...',
		writeup: true,
		markdownPath: '/ctf/picoCTF/web/medium/Trickster/Trickster.md',
	},
	{
		title: 'Agent T (Incomplete)',
		event: 'THM',
		category: 'web',
		tags: ['THM', 'web', 'easy'],
		date: '2026',
		placement: null,
		description: 'HTTP header injection vulnerability in a PHP web app. Exploiting misconfigured server headers to gain admin access.',
		writeup: true,
		markdownPath: '/ctf/THM/Agent T (Incomplete)/Agent T.md',
	},
	{
		title: 'All in One (Incomplete)',
		event: 'THM',
		category: 'pwn',
		tags: ['THM', 'pwn', 'easy', 'linux'],
		date: '2026',
		placement: null,
		description: 'WordPress site with multiple attack surfaces. Chained plugin exploits and sudo misconfigurations to reach root.',
		writeup: true,
		markdownPath: '/ctf/THM/All in One (Incomplete)/All in One.md',
	},
	{
		title: 'Corridor',
		event: 'THM',
		category: 'web',
		tags: ['THM', 'web', 'easy'],
		date: '2026',
		placement: null,
		description: 'IDOR vulnerability through hashed endpoint IDs. Enumerate accessible rooms by manipulating MD5-hashed URL parameters.',
		writeup: true,
		markdownPath: '/ctf/THM/Corridor/Corridor.md',
	},
	{
		title: 'Dig Dug (Incomplete)',
		event: 'THM',
		category: 'misc',
		tags: ['THM', 'misc', 'easy'],
		date: '2026',
		placement: null,
		description: 'DNS-based challenge. Use dig to query a custom DNS server and retrieve the hidden flag from DNS records.',
		writeup: true,
		markdownPath: '/ctf/THM/Dig Dug (Incomplete)/Dig Dug.md',
	},
	{
		title: 'Dreaming',
		event: 'THM',
		category: 'pwn',
		tags: ['THM', 'pwn', 'easy', 'linux'],
		date: '2025',
		placement: null,
		description:
			'A Pluck CMS on an Apache server. Exploited a file upload vulnerability to gain a shell, then chained multiple privilege escalation steps to reach root...',
		writeup: true,
		markdownPath: '/ctf/THM/Dreaming/Dreaming.md',
	},
	{
		title: 'IDE',
		event: 'THM',
		category: 'pwn',
		tags: ['THM', 'pwn', 'easy', 'linux'],
		date: '2025',
		placement: null,
		description:
			'An exposed FTP service leaks credentials. After gaining a foothold through a vulnerable web service, exploited a sudo misconfiguration to escalate to ...',
		writeup: true,
		markdownPath: '/ctf/THM/IDE/IDE.md',
	},
	{
		title: 'Library',
		event: 'THM',
		category: 'pwn',
		tags: ['THM', 'pwn', 'easy', 'linux'],
		date: '2025',
		placement: null,
		description:
			'Boot2root box from the FIT and BSides Guatemala CTF. Enumerated a hidden login, brute-forced credentials, and leveraged a Python library hijacking for...',
		writeup: true,
		markdownPath: '/ctf/THM/Library/Library.md',
	},
	{
		title: 'Plotted-TMS',
		event: 'THM',
		category: 'pwn',
		tags: ['THM', 'pwn', 'easy', 'linux'],
		date: '2025',
		placement: null,
		description:
			'Traffic Management System running on a misconfigured server. Chained SQL injection and file upload to RCE, then exploited a cron job for privilege esc...',
		writeup: true,
		markdownPath: '/ctf/THM/Plotted-TMS/Plotted-TMS.md',
	},
	{
		title: 'Skynet',
		event: 'THM',
		category: 'pwn',
		tags: ['THM', 'pwn', 'easy', 'linux'],
		date: '2025',
		placement: null,
		description:
			'Terminator-themed machine combining Samba enumeration, Squirrelmail exploitation, and a remote file inclusion leading to a root shell via a wildcard i...',
		writeup: true,
		markdownPath: '/ctf/THM/Skynet/Skynet.md',
	},
	{
		title: 'Team',
		event: 'THM',
		category: 'pwn',
		tags: ['THM', 'pwn', 'easy', 'linux'],
		date: '2025',
		placement: null,
		description:
			'Beginner-friendly box. Virtual host enumeration revealed a dev subdomain with an LFI vulnerability. Escalated through SSH keys and a writable script c...',
		writeup: true,
		markdownPath: '/ctf/THM/Team/Team.md',
	},
	{
		title: 'Guess a BIG Number',
		event: 'SSoF',
		category: 'pwn',
		tags: ['SSoF', 'pwn', 'easy'],
		date: '2026',
		placement: null,
		description: 'Interact with a service to guess a randomly generated large number. Scripted with pwntools to brute-force the seed.',
		writeup: true,
		markdownPath: '/ctf/SSoF/Lab1/Guess a BIG Number/Guess a BIG Number.md',
	},
	{
		title: 'Guess a Number',
		event: 'SSoF',
		category: 'pwn',
		tags: ['SSoF', 'pwn', 'easy'],
		date: '2026',
		placement: null,
		description: 'Intro to pwntools: connect to a service and automate guessing the correct number to retrieve the flag.',
		writeup: true,
		markdownPath: '/ctf/SSoF/Lab1/Guess a Number/Guess a Number.md',
	},
	{
		title: 'PwnTools Sockets',
		event: 'SSoF',
		category: 'pwn',
		tags: ['SSoF', 'pwn', 'easy'],
		date: '2026',
		placement: null,
		description: 'Introduction to pwntools socket interactions. Send and receive data from a remote service to extract the flag.',
		writeup: true,
		markdownPath: '/ctf/SSoF/Lab1/PwnTools Sockets/PwnTools Sockets.md',
	},
	{
		title: 'Python requests',
		event: 'SSoF',
		category: 'web',
		tags: ['SSoF', 'web', 'easy'],
		date: '2026',
		placement: null,
		description: 'Use Python requests library to interact with an HTTP endpoint and retrieve the flag programmatically.',
		writeup: true,
		markdownPath: '/ctf/SSoF/Lab1/Python requests/Python requests.md',
	},
	{
		title: 'Python requests Again',
		event: 'SSoF',
		category: 'web',
		tags: ['SSoF', 'web', 'easy'],
		date: '2026',
		placement: null,
		description: 'Advanced HTTP scripting with Python requests: handle sessions, cookies and redirects to bypass access controls.',
		writeup: true,
		markdownPath: '/ctf/SSoF/Lab1/Python requests Again/Python requests Again.md',
	},
	{
		title: 'Secure by Design',
		event: 'SSoF',
		category: 'misc',
		tags: ['SSoF', 'misc', 'easy'],
		date: '2026',
		placement: null,
		description: 'Analyse a supposedly secure application and find the design flaw that leaks the flag.',
		writeup: true,
		markdownPath: '/ctf/SSoF/Lab1/Secure by Design/Secure by Design.md',
	},
	{
		title: 'Another jackpot',
		event: 'SSoF',
		category: 'pwn',
		tags: ['SSoF', 'pwn', 'medium'],
		date: '2026',
		placement: null,
		description: 'Race condition on a lottery service. Win the jackpot by exploiting a TOCTOU flaw in the randomness check.',
		writeup: true,
		markdownPath: '/ctf/SSoF/Lab2/Another jackpot/Another jackpot.md',
	},
	{
		title: 'I challenge you for a race',
		event: 'SSoF',
		category: 'pwn',
		tags: ['SSoF', 'pwn', 'medium'],
		date: '2026',
		placement: null,
		description: 'Classic race condition challenge. Two concurrent requests to the same endpoint produce an exploitable state.',
		writeup: true,
		markdownPath: '/ctf/SSoF/Lab2/I challenge you for a race/I challenge you for a race.md',
	},
	{
		title: 'Pickles in a seri(al)ous race',
		event: 'SSoF',
		category: 'pwn',
		tags: ['SSoF', 'pwn', 'medium'],
		date: '2026',
		placement: null,
		description: 'Python pickle deserialization combined with a race condition. Craft a malicious pickle payload to execute arbitrary code.',
		writeup: true,
		markdownPath: '/ctf/SSoF/Lab2/Pickles in a seri(al)ous race/Pickles in a seri(al)ous race.md',
	},
	{
		title: 'Give me more than a simple WAF',
		event: 'SSoF',
		category: 'web',
		tags: ['SSoF', 'web', 'medium'],
		date: '2026',
		placement: null,
		description: 'Bypass a Web Application Firewall using encoding and obfuscation techniques to inject a malicious payload.',
		writeup: true,
		markdownPath: '/ctf/SSoF/Lab3/Give me more than a simple WAF/Give me more than a simple WAF.md',
	},
	{
		title: 'Go on and censor my posts',
		event: 'SSoF',
		category: 'web',
		tags: ['SSoF', 'web', 'medium'],
		date: '2026',
		placement: null,
		description: 'Stored XSS in a blog application. Inject a script that bypasses content filters to steal the admin session cookie.',
		writeup: true,
		markdownPath: '/ctf/SSoF/Lab3/Go on and censor my posts/Go on and censor my posts.md',
	},
	{
		title: 'Just my boring cookies',
		event: 'SSoF',
		category: 'web',
		tags: ['SSoF', 'web', 'medium'],
		date: '2026',
		placement: null,
		description: 'Cookie manipulation challenge. Decode and forge a session cookie to escalate privileges to admin.',
		writeup: true,
		markdownPath: '/ctf/SSoF/Lab3/Just my boring cookies/Just my boring cookies.md',
	},
	{
		title: 'My favourite cookies',
		event: 'SSoF',
		category: 'web',
		tags: ['SSoF', 'web', 'medium'],
		date: '2026',
		placement: null,
		description: 'Advanced cookie exploitation: tamper with signed session tokens and exploit weak secret keys.',
		writeup: true,
		markdownPath: '/ctf/SSoF/Lab3/My favourite cookies/My favourite cookies.md',
	},
	{
		title: 'Read my lips No more scripts',
		event: 'SSoF',
		category: 'web',
		tags: ['SSoF', 'web', 'medium'],
		date: '2026',
		placement: null,
		description: 'XSS with CSP bypass. Craft an injection that survives Content-Security-Policy restrictions to exfiltrate data.',
		writeup: true,
		markdownPath: '/ctf/SSoF/Lab3/Read my lips No more scripts/Read my lips No more scripts.md',
	},
	{
		title: 'I will take care of this site',
		event: 'SSoF',
		category: 'web',
		tags: ['SSoF', 'web', 'medium'],
		date: '2026',
		placement: null,
		description: 'XSS-based admin takeover. Inject a persistent script to hijack the admin account and retrieve the flag.',
		writeup: true,
		markdownPath: '/ctf/SSoF/Lab4/I will take care of this site/I will take care of this site.md',
	},
	{
		title: 'Money, money, money',
		event: 'SSoF',
		category: 'web',
		tags: ['SSoF', 'web', 'medium'],
		date: '2026',
		placement: null,
		description: 'Business logic flaw in a jackpot application. Exploit integer overflow or negative transfer to accumulate balance.',
		writeup: true,
		markdownPath: '/ctf/SSoF/Lab4/Money, money, money/Money, money, money.md',
	},
	{
		title: 'Sometimes we are just temporarily blind',
		event: 'SSoF',
		category: 'web',
		tags: ['SSoF', 'web', 'medium'],
		date: '2026',
		placement: null,
		description: 'Blind SQL injection with time-based techniques. Enumerate the database character by character using sleep payloads.',
		writeup: true,
		markdownPath: '/ctf/SSoF/Lab4/Sometimes we are just temporarily blind/Sometimes we are just temporarily blind.md',
	},
	{
		title: "Wow, it can't be more juicy than this",
		event: 'SSoF',
		category: 'web',
		tags: ['SSoF', 'web', 'medium'],
		date: '2026',
		placement: null,
		description: 'Boolean-based blind SQLi on a blog. Craft payloads to leak the secret post and retrieve the flag.',
		writeup: true,
		markdownPath: "/ctf/SSoF/Lab4/Wow, it can't be more juicy than this/Wow, it can't be more juicy than this.md",
	},
	{
		title: 'Calling Functions',
		event: 'SSoF',
		category: 'pwn',
		tags: ['SSoF', 'pwn', 'medium'],
		date: '2026',
		placement: null,
		description: 'Binary exploitation: overwrite a function pointer or GOT entry to redirect execution to the win function.',
		writeup: true,
		markdownPath: '/ctf/SSoF/Lab5/Calling Functions/Calling Functions.md',
	},
	{
		title: 'Canaries (Extra class)',
		event: 'SSoF',
		category: 'pwn',
		tags: ['SSoF', 'pwn', 'hard'],
		date: '2026',
		placement: null,
		description: 'Stack canary bypass using a format string leak to read the canary value, then overflow to overwrite the return address.',
		writeup: true,
		markdownPath: '/ctf/SSoF/Lab5/Extra/Canaries (Extra class)/Canaries (Extra class).md',
	},
	{
		title: 'More Canaries (Extra class)',
		event: 'SSoF',
		category: 'pwn',
		tags: ['SSoF', 'pwn', 'hard'],
		date: '2026',
		placement: null,
		description: 'Advanced canary bypass with PIE enabled. Combine ASLR leak and canary leak to build a full ROP chain.',
		writeup: true,
		markdownPath: '/ctf/SSoF/Lab5/Extra/More Canaries (Extra class)/More Canaries (Extra class).md',
	},
	{
		title: 'Simple Leak (Extra class)',
		event: 'SSoF',
		category: 'pwn',
		tags: ['SSoF', 'pwn', 'medium'],
		date: '2026',
		placement: null,
		description: 'Format string vulnerability to leak stack/libc addresses, then use the leaked pointers to control the return address.',
		writeup: true,
		markdownPath: '/ctf/SSoF/Lab5/Extra/Simple Leak (Extra class)/Simple Leak (Extra class).md',
	},
	{
		title: 'Super Secure Lottery',
		event: 'SSoF',
		category: 'pwn',
		tags: ['SSoF', 'pwn', 'medium'],
		date: '2026',
		placement: null,
		description: 'Predictable PRNG in a lottery binary. Reverse the seed generation to always win and trigger the flag.',
		writeup: true,
		markdownPath: '/ctf/SSoF/Lab5/Extra/Super Secure Lottery/Super Secure Lottery.md',
	},
	{
		title: 'Match an Exact Value',
		event: 'SSoF',
		category: 'pwn',
		tags: ['SSoF', 'pwn', 'easy'],
		date: '2026',
		placement: null,
		description: 'Intro buffer overflow: overwrite a local variable on the stack with an exact value to pass the check and print the flag.',
		writeup: true,
		markdownPath: '/ctf/SSoF/Lab5/Match an Exact Value/Match an Exact Value.md',
	},
	{
		title: 'Return Address',
		event: 'SSoF',
		category: 'pwn',
		tags: ['SSoF', 'pwn', 'medium'],
		date: '2026',
		placement: null,
		description: 'Classic ret2win: overflow the stack buffer past saved RBP to overwrite the return address with the win function.',
		writeup: true,
		markdownPath: '/ctf/SSoF/Lab5/Return Address/Return Address.md',
	},
	{
		title: 'Simple Overflow',
		event: 'SSoF',
		category: 'pwn',
		tags: ['SSoF', 'pwn', 'easy'],
		date: '2026',
		placement: null,
		description: 'Basic stack buffer overflow. Send more bytes than the buffer holds to corrupt adjacent memory and unlock the flag.',
		writeup: true,
		markdownPath: '/ctf/SSoF/Lab5/Simple Overflow/Simple Overflow.md',
	},
	{
		title: 'Super Secure System',
		event: 'SSoF',
		category: 'pwn',
		tags: ['SSoF', 'pwn', 'medium'],
		date: '2026',
		placement: null,
		description: 'Full binary exploit chain: leak canary + libc address via format string, build ROP chain to call system("/bin/sh").',
		writeup: true,
		markdownPath: '/ctf/SSoF/Lab5/Super Secure System/Super Secure System.md',
	},
];



function buildCtfCards(list) {
	return list
		.map(
			(c, i) => `
		<div class="proj-card" data-idx="${c._idx ?? i}">
			<div class="proj-card__header">
				<span class="proj-card__title">${c.title}</span>
				${c.placement ? `<span class="proj-card__status proj-card__status--active">${c.placement}</span>` : `<span class="proj-card__status">${c.event}</span>`}
			</div>
			<div class="proj-card__tags">
				${c.tags
					.slice(0, 4)
					.map((t) => `<span class="proj-card__tag">${t}</span>`)
					.join('')}
			</div>
			<div class="proj-card__footer">
				<span class="proj-card__date">${c.date}</span>
				<button class="proj-card__open" data-idx="${c._idx ?? i}">${c.writeup ? 'Read writeup' : 'View details'}</button>
			</div>
		</div>`,
		)
		.join('');
}


function renderTemposCtfs() {
	const app = document.getElementById('ctfTemposApp');
	if (!app) return;

	const indexed = ctfs.map((c, i) => ({ ...c, _idx: i }));

	const platformColors = {
		picoctf: '#55ffff',
		thm: '#ff5555',
		ssof: '#ff55ff',
		'hack the box': '#55ff55',
		htb: '#55ff55',
	};
	const vgaFallbacks = ['#ffff55', '#55ff55', '#ff55ff', '#ff5555', '#55ffff'];
	let fallbackColorMap = {};

	function tileColor(event) {
		const k = Object.keys(platformColors).find((k) => event.toLowerCase().includes(k));
		if (k) return platformColors[k];
		if (!fallbackColorMap[event]) {
			const used = Object.values(fallbackColorMap).length;
			fallbackColorMap[event] = vgaFallbacks[used % vgaFallbacks.length];
		}
		return fallbackColorMap[event];
	}

	function getDifficulty(c) {
		if (c.tags.includes('easy')) return 'easy';
		if (c.tags.includes('medium')) return 'medium';
		if (c.tags.includes('hard')) return 'hard';
		return '';
	}

	// Derive filter options from data
	const allPlatforms = [...new Set(indexed.map((c) => c.event))].sort();
	const allTypes = [...new Set(indexed.map((c) => c.category).filter(Boolean))].sort();
	const allDiffs = ['easy', 'medium', 'hard'].filter((d) => indexed.some((c) => c.tags.includes(d)));

	// Filter state
	let fPlatform = 'all', fType = 'all', fDiff = 'all';

	function filtered(list) {
		return list.filter((c) => {
			if (fPlatform !== 'all' && c.event !== fPlatform) return false;
			if (fType !== 'all' && c.category !== fType) return false;
			if (fDiff !== 'all' && getDifficulty(c) !== fDiff) return false;
			return true;
		});
	}

	function filterBarHtml() {
		function sel(id, opts, val) {
			return `<select class="tempos-filter-sel" data-filter="${id}">
				<option value="all">All ${id}s</option>
				${opts.map((o) => `<option value="${o}"${val === o ? ' selected' : ''}>${o}</option>`).join('')}
			</select>`;
		}
		return `<div class="tempos-filter-bar">
			${sel('platform', allPlatforms, fPlatform)}
			${sel('type', allTypes, fType)}
			${sel('diff', allDiffs, fDiff)}
		</div>`;
	}

	function bindFilters() {
		app.querySelectorAll('.tempos-filter-sel').forEach((sel) => {
			sel.addEventListener('change', (e) => {
				const f = e.target.dataset.filter;
				const v = e.target.value;
				if (f === 'platform') fPlatform = v;
				else if (f === 'type') fType = v;
				else if (f === 'diff') fDiff = v;
				const header = app.querySelector('.tempos-app-header [data-event]');
				if (f === 'platform' || !header) showTiles();
				else showEvent(header.dataset.event);
			});
		});
	}

	function showTiles() {
		const byEvent = {};
		filtered(indexed).forEach((c) => {
			if (!byEvent[c.event]) byEvent[c.event] = [];
			byEvent[c.event].push(c);
		});
		const events = allPlatforms.filter((ev) => byEvent[ev]);

		app.innerHTML = `
			<div class="tempos-app-header">&#x2020; /Home/piners/CTFs &#x2020;</div>
			${filterBarHtml()}
			<div class="tempos-tiles">
				${events.length ? events.map((ev) => {
					const col = tileColor(ev);
					const count = byEvent[ev].length;
					return `<div class="tempos-tile" data-event="${ev}" style="border-color:${col}">
						<div class="tempos-tile__glyph" style="color:${col}">&#x2020;</div>
						<div class="tempos-tile__name" style="color:${col}">${ev}</div>
						<div class="tempos-tile__count">${count} writeup${count !== 1 ? 's' : ''}</div>
					</div>`;
				}).join('') : '<div class="tempos-loading">No results for current filters.</div>'}
			</div>`;

		bindFilters();
		app.querySelectorAll('.tempos-tile').forEach((tile) => {
			tile.addEventListener('click', () => showEvent(tile.dataset.event));
		});
	}

	function showEvent(eventName) {
		const col = tileColor(eventName);
		const list = filtered(indexed.filter((c) => c.event === eventName));

		app.innerHTML = `
			<div class="tempos-app-header">
				<button class="tempos-back-btn">&#x25C4; Back</button>
				<span data-event="${eventName}" style="color:${col}">&#x2020; ${eventName} &#x2020;</span>
			</div>
			${filterBarHtml()}
			<div class="tempos-ctf-list">
				${list.length ? list.map((c) => {
					const diff = getDifficulty(c);
					const diffCol = diff === 'easy' ? '#55ff55' : diff === 'medium' ? '#ffff55' : diff === 'hard' ? '#ff5555' : '#888';
					return `<div class="tempos-ctf-item" data-idx="${c._idx}">
						<span class="tempos-ctf-item__title">${c.title}</span>
						<span class="tempos-ctf-item__cat">${c.category || ''}</span>
						${diff ? `<span class="tempos-ctf-item__diff" style="color:${diffCol};border-color:${diffCol}">${diff}</span>` : ''}
						${c.writeup && c.markdownPath ? '<span class="tempos-ctf-item__badge">writeup</span>' : ''}
					</div>`;
				}).join('') : '<div class="tempos-loading">No results for current filters.</div>'}
			</div>`;

		bindFilters();
		app.querySelector('.tempos-back-btn').addEventListener('click', showTiles);
		app.querySelectorAll('.tempos-ctf-item').forEach((item) => {
			item.addEventListener('click', () => {
				const c = ctfs[+item.dataset.idx];
				if (c.writeup && c.markdownPath) showWriteup(c, eventName);
				else toast(c.writeup ? 'Writeup coming soon.' : 'No writeup available.');
			});
		});
	}

	async function showWriteup(c, fromEvent) {
		app.innerHTML = `<div class="tempos-loading">Loading&#x2026;</div>`;
		try {
			const res = await fetch(c.markdownPath);
			if (!res.ok) throw new Error(res.statusText);
			let md = await res.text();
			const basePath = c.markdownPath.substring(0, c.markdownPath.lastIndexOf('/'));
			const encodedBase = basePath.split('/').map((s) => encodeURIComponent(s)).join('/');
			md = md.replace(/!\[\[(.*?)\]\]/g, (_, fn) => `![${fn}](${encodedBase}/Images/${encodeURIComponent(fn)})`);
			md = md.replace(/!\[(.*?)\]\((?!https?:\/\/|\/)(.*?)\)/g, (_, alt, src) => {
				const encodedSrc = src.split('/').map((s) => encodeURIComponent(decodeURIComponent(s))).join('/');
				return `![${alt}](${encodedBase}/${encodedSrc})`;
			});
			const bodyHtml = marked.parse(md);
			const diff = getDifficulty(c);
			const diffCol = diff === 'easy' ? '#55ff55' : diff === 'medium' ? '#ffff55' : '#ff5555';
			const genericDesc = ['CTF Challenge from THM', 'CTF Challenge from SSoF', 'CTF Challenge from picoCTF'];
			const hasDesc = c.description && !genericDesc.includes(c.description.trim());
			app.innerHTML = `
				<div class="tempos-app-header">
					<button class="tempos-back-btn">&#x25C4; Back</button>
					<span>&#x2020; ${c.title} &#x2020;</span>
				</div>
				<div class="tempos-writeup">
					<div class="tempos-writeup__meta">
						<span>${c.event}</span>
						<span class="tempos-writeup__sep">&middot;</span>
						<span>${c.category || ''}</span>
						${diff ? `<span class="tempos-writeup__sep">&middot;</span><span class="tempos-writeup__diff" style="color:${diffCol}">${diff}</span>` : ''}
						<span class="tempos-writeup__sep">&middot;</span>
						<span>${c.date || ''}</span>
						${c.placement ? `<span class="tempos-writeup__sep">&middot;</span><span>${c.placement}</span>` : ''}
					</div>
					${hasDesc ? `<div class="tempos-writeup__desc">${c.description}</div>` : ''}
					<div class="tempos-writeup__body">${bodyHtml}</div>
				</div>`;
			app.querySelector('.tempos-back-btn').addEventListener('click', () => showEvent(fromEvent || c.event));
			const body = app.querySelector('.tempos-writeup__body');
			if (body) {
				const pImgOnly = (el) => el.tagName === 'P' && el.textContent.trim() === '' && el.querySelector('img');
				const nodes = Array.from(body.children);
				let i = 0;
				while (i < nodes.length) {
					if (pImgOnly(nodes[i])) {
						const group = [];
						while (i < nodes.length && pImgOnly(nodes[i])) group.push(nodes[i++]);
						if (group.length >= 2) {
							for (let j = 0; j < group.length; j += 2) {
								const row = document.createElement('div');
								row.className = 'img-row';
								group[j].before(row);
								row.appendChild(group[j]);
								if (group[j + 1]) row.appendChild(group[j + 1]);
							}
						}
					} else { i++; }
				}
			}
		} catch (err) {
			app.innerHTML = `<div class="tempos-loading" style="color:#ff5555">Error: ${escHtml(err.message)}<br><button class="tempos-back-btn" style="margin-top:12px">&#x25C4; Back</button></div>`;
			app.querySelector('.tempos-back-btn')?.addEventListener('click', () => showEvent(fromEvent || c.event));
		}
	}

	showTiles();
}


// ── CTF window controls ────────────────────────────────
(function () {
	const win = document.getElementById('ctfTorBrowser');
	const titlebar = document.getElementById('ctfTorTitlebar');
	const taskbtn = document.getElementById('ctfTorTaskbtn');
	if (!win || !taskbtn) return;

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

	document.getElementById('ctfTorMin').addEventListener('click', minimize);
	document.getElementById('ctfTorClose').addEventListener('click', close);
	taskbtn.addEventListener('click', () => (win.style.display === 'none' ? restore() : minimize()));

	let saved = { l: '80px', t: '0px', w: '700px', h: '430px' };
	document.getElementById('ctfTorMax').addEventListener('click', () => {
		if (win.classList.contains('parrot-maximized')) {
			win.classList.remove('parrot-maximized');
			win.style.left = saved.l;
			win.style.top = saved.t;
			win.style.width = saved.w;
			win.style.height = saved.h;
		} else {
			saved = { l: win.style.left || '80px', t: win.style.top || '0px', w: win.style.width || '700px', h: win.style.height || '430px' };
			win.classList.add('parrot-maximized');
			win.style.left = win.style.top = win.style.width = win.style.height = '';
		}
	});

	let dragging = false,
		ox = 0,
		oy = 0;

	function startCtfDrag(e) {
		e.preventDefault();
		if (win.classList.contains('parrot-maximized')) {
			win.classList.remove('parrot-maximized');
			win.style.left = saved.l;
			win.style.top = saved.t;
			win.style.width = saved.w;
			win.style.height = saved.h;
		}
		dragging = true;
		const areaRect = document.getElementById('ctfArea').getBoundingClientRect();
		const winRect = win.getBoundingClientRect();
		ox = e.clientX - winRect.left;
		oy = e.clientY - winRect.top;
		win.style.left = winRect.left - areaRect.left + 'px';
		win.style.top = winRect.top - areaRect.top + 'px';
		win.style.userSelect = 'none';
	}

	titlebar.addEventListener('mousedown', (e) => {
		if (e.target.closest('.parrot-ctrl')) return;
		startCtfDrag(e);
	});

	document.addEventListener('mousemove', (e) => {
		if (!dragging) return;
		const area = document.getElementById('ctfArea');
		const areaRect = area.getBoundingClientRect();
		win.style.left = Math.max(0, Math.min(area.clientWidth - win.offsetWidth, e.clientX - areaRect.left - ox)) + 'px';
		win.style.top = Math.max(0, Math.min(area.clientHeight - win.offsetHeight, e.clientY - areaRect.top - oy)) + 'px';
	});
	document.addEventListener('mouseup', () => {
		dragging = false;
		win.style.userSelect = '';
	});
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

// ── Global Home Listeners ──────────────────────────────
document.addEventListener('click', (e) => {
	const homeProjTitle = e.target.closest('.hb-proj-item__title');
	if (homeProjTitle) {
		const titleText = homeProjTitle.textContent.trim();
		const p = projects.find((proj) => proj.title === titleText || proj.title.includes(titleText));
		if (p) {
			switchTab('projects');
			openProjModal(p);
		}
	}
});

// ── Generic window resizer ─────────────────────────────
function makeResizable(winEl, handleEl, areaEl, minW, minH) {
	if (!winEl || !handleEl) return;
	let resizing = false, startX, startY, startW, startH;
	handleEl.addEventListener('mousedown', (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (winEl.classList.contains('parrot-maximized') || winEl.classList.contains('xp-maximized')) return;
		resizing = true;
		startX = e.clientX;
		startY = e.clientY;
		startW = winEl.offsetWidth;
		startH = winEl.offsetHeight;
		winEl.style.userSelect = 'none';
	});
	document.addEventListener('mousemove', (e) => {
		if (!resizing) return;
		const areaRect = areaEl.getBoundingClientRect();
		const newW = Math.min(areaEl.clientWidth - winEl.offsetLeft, Math.max(minW, startW + e.clientX - startX));
		const newH = Math.min(areaEl.clientHeight - winEl.offsetTop, Math.max(minH, startH + e.clientY - startY));
		winEl.style.width = newW + 'px';
		winEl.style.height = newH + 'px';
	});
	document.addEventListener('mouseup', () => {
		resizing = false;
		winEl.style.userSelect = '';
	});
}

makeResizable(
	document.getElementById('xpTorBrowser'),
	document.getElementById('xpTorResize'),
	document.getElementById('xpArea'), 420, 260
);
makeResizable(
	document.getElementById('parrotTorBrowser'),
	document.getElementById('parrotTorResize'),
	document.getElementById('parrotArea'), 320, 200
);
makeResizable(
	document.getElementById('ctfTorBrowser'),
	document.getElementById('ctfTorResize'),
	document.getElementById('ctfArea'), 320, 200
);

// ── Parrot OS Terminal ─────────────────────────────────
(function () {
	const win = document.getElementById('parrotTerminal');
	const titlebar = document.getElementById('parrotTermTitlebar');
	const taskbtn = document.getElementById('parrotTermTaskbtn');
	const body = document.getElementById('parrotTermBody');
	const input = document.getElementById('parrotTermInput');
	if (!win || !body || !input) return;

	let cwd = '~';
	const history = [];
	let histIdx = -1;

	const fs = {
		'~': ['projects/', 'ctf/', 'tools/', 'README.md', '.bashrc', '.zshrc'],
		'~/projects': ['smalito/', 'deathnode/', 'depchain/', 'simple-onion-router/'],
		'~/ctf': ['picoCTF/', 'HTB/', 'writeups.md'],
		'~/tools': ['burpsuite', 'nmap', 'metasploit', 'gobuster'],
	};
	const fileContents = {
		'README.md': '# piners\nOffensive Security Researcher\nMSc Cybersecurity @ IST\n\nSee the portfolio for more.',
		'.zshrc': 'export PATH=$PATH:~/.local/bin\nalias ll="ls -la"\nalias gs="git status"\nplugins=(git zsh-autosuggestions)',
		'.bashrc': '# ~/.bashrc\nexport EDITOR=vim\nalias cls=clear\nexport PS1="\\u@\\h:\\w$ "',
		'writeups.md': '# CTF Writeups\n- format string 0 (picoCTF)\n- Patchwork (HTB)\n- SQLi labs\n- ...',
	};

	function print(html) {
		const line = document.createElement('div');
		line.className = 'p-term-line';
		line.innerHTML = html;
		body.appendChild(line);
		body.scrollTop = body.scrollHeight;
	}

	function prompt(cmd) {
		print(`<span style="color:#3af097">┌──(piners㉿parrot)-[<span style="color:#fff">${escHtml(cwd)}</span>]</span>`);
		print(`<span style="color:#3af097">└─$</span> <span style="color:#e0e0e0">${escHtml(cmd)}</span>`);
	}

	const commands = {
		help() {
			print(`<span style="color:#3af097">Available commands:</span>
  <span style="color:#7dd3fc">ls</span> [-la]      list directory contents
  <span style="color:#7dd3fc">cat</span> [file]    print file contents
  <span style="color:#7dd3fc">cd</span> [dir]      change directory
  <span style="color:#7dd3fc">pwd</span>           print working directory
  <span style="color:#7dd3fc">whoami</span>        current user
  <span style="color:#7dd3fc">id</span>            user identity
  <span style="color:#7dd3fc">uname -a</span>      system info
  <span style="color:#7dd3fc">neofetch</span>      system info with art
  <span style="color:#7dd3fc">echo</span> [text]   print text
  <span style="color:#7dd3fc">date</span>          current date/time
  <span style="color:#7dd3fc">ping</span> [host]   ping a host
  <span style="color:#7dd3fc">nmap</span> [host]   port scan
  <span style="color:#7dd3fc">history</span>       command history
  <span style="color:#7dd3fc">clear</span>         clear terminal
  <span style="color:#7dd3fc">exit</span>          close terminal`);
		},
		ls(args) {
			const long = args.includes('-la') || args.includes('-l') || args.includes('-a');
			const dir = fs[cwd] || [];
			if (long) {
				print(`total ${dir.length * 4}`);
				dir.forEach((f) => {
					const isDir = f.endsWith('/');
					const perm = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
					const name = isDir
						? `<span style="color:#7dd3fc;font-weight:bold">${f}</span>`
						: `<span style="color:#e0e0e0">${f}</span>`;
					print(`${perm}  1 piners piners  ${(Math.random() * 4000 + 100) | 0} May 18 2026 ${name}`);
				});
			} else {
				const parts = dir.map((f) =>
					f.endsWith('/')
						? `<span style="color:#7dd3fc;font-weight:bold">${f}</span>`
						: `<span style="color:#e0e0e0">${f}</span>`,
				);
				print(parts.join('  '));
			}
		},
		pwd() { print(cwd.replace('~', '/home/piners')); },
		whoami() { print('piners'); },
		id() { print('uid=1000(piners) gid=1000(piners) groups=1000(piners),27(sudo),44(video)'); },
		hostname() { print('parrot'); },
		date() { print(new Date().toString()); },
		clear() { body.innerHTML = ''; },
		echo(args) { print(escHtml(args.join(' '))); },
		cd(args) {
			const target = args[0] || '~';
			const resolved = target === '~' ? '~' : target.startsWith('/') ? target : cwd + '/' + target.replace(/\/$/, '');
			const key = resolved.replace('/home/piners', '~');
			if (fs[key] !== undefined || key === '~') { cwd = key; }
			else { print(`<span style="color:#f87171">bash: cd: ${escHtml(target)}: No such file or directory</span>`); }
		},
		cat(args) {
			if (!args[0]) { print('<span style="color:#f87171">cat: missing file operand</span>'); return; }
			const content = fileContents[args[0]];
			if (content) { content.split('\n').forEach((l) => print(l || '&nbsp;')); }
			else { print(`<span style="color:#f87171">cat: ${escHtml(args[0])}: No such file or directory</span>`); }
		},
		uname(args) {
			if (args.includes('-a')) print('Linux parrot 6.1.0-parrot1-amd64 #1 SMP PREEMPT_DYNAMIC Parrot 6.1.15-1parrot1 (2023-04-25) x86_64 GNU/Linux');
			else print('Linux');
		},
		neofetch() {
			print(`<span style="color:#3af097">    ╔═╗  </span>  piners<span style="color:#555">@</span>parrot`);
			print(`<span style="color:#3af097">   ╔╝ ╚╗ </span>  ───────────────────`);
			print(`<span style="color:#3af097">  ╔╝   ╚╗</span>  <span style="color:#7dd3fc">OS:</span>     Parrot OS 5.3 (GNU/Linux)`);
			print(`<span style="color:#3af097"> ╔╝     ╚╗</span> <span style="color:#7dd3fc">Kernel:</span> 6.1.0-parrot1-amd64`);
			print(`<span style="color:#3af097"> ╚╗     ╔╝</span> <span style="color:#7dd3fc">Shell:</span>  zsh 5.9`);
			print(`<span style="color:#3af097">  ╚╗   ╔╝</span>  <span style="color:#7dd3fc">WM:</span>     XFWM4`);
			print(`<span style="color:#3af097">   ╚╗ ╔╝ </span>  <span style="color:#7dd3fc">Term:</span>   piners-term`);
			print(`<span style="color:#3af097">    ╚═╝  </span>  <span style="color:#7dd3fc">CPU:</span>    Brain of piners`);
			print(`         <span style="color:#7dd3fc">Memory:</span> enough for exploits`);
			print('');
			print(`<span style="background:#e74c3c">   </span><span style="background:#e67e22">   </span><span style="background:#f1c40f">   </span><span style="background:#2ecc71">   </span><span style="background:#3af097">   </span><span style="background:#3498db">   </span><span style="background:#9b59b6">   </span><span style="background:#e0e0e0">   </span>`);
		},
		ping(args) {
			if (!args[0]) { print('<span style="color:#f87171">ping: missing host operand</span>'); return; }
			const host = escHtml(args[0]);
			print(`PING ${host}: 56 data bytes`);
			[1, 2, 3, 4].forEach((i) => {
				const ms = (Math.random() * 20 + 5).toFixed(3);
				print(`64 bytes from ${host}: icmp_seq=${i} ttl=64 time=${ms} ms`);
			});
			print(`--- ${host} ping statistics ---`);
			print('4 packets transmitted, 4 received, 0% packet loss');
		},
		nmap(args) {
			if (!args[0]) { print('<span style="color:#f87171">nmap: requires a target</span>'); return; }
			print(`Starting Nmap 7.94 ( https://nmap.org )`);
			print(`Nmap scan report for ${escHtml(args[0])}`);
			print('PORT     STATE SERVICE');
			print('22/tcp   open  ssh');
			print('80/tcp   open  http');
			print('443/tcp  open  https');
			print(`Nmap done: 1 IP address (1 host up) scanned in ${(Math.random() * 3 + 1).toFixed(2)}s`);
		},
		sudo(args) {
			print(`[sudo] password for piners: `);
			setTimeout(() => print('<span style="color:#f87171">piners is not in the sudoers file. This incident will be reported.</span>'), 400);
		},
		history() { history.forEach((h, i) => print(`  ${String(i + 1).padStart(3)}  ${h}`)); },
		exit() { close(); },
	};

	function runCommand(raw) {
		const trimmed = raw.trim();
		if (!trimmed) return;
		history.push(trimmed);
		histIdx = history.length;
		const [cmd, ...args] = trimmed.split(/\s+/);
		prompt(trimmed);
		if (commands[cmd]) commands[cmd](args);
		else print(`<span style="color:#f87171">bash: ${escHtml(cmd)}: command not found</span>`);
	}

	function open() {
		win.style.display = '';
		taskbtn.style.display = '';
		taskbtn.classList.add('active');
		if (body.children.length === 0) {
			print(`<span style="color:#3af097">Parrot OS Terminal — piners@parrot</span>`);
			print(`Type <span style="color:#7dd3fc">help</span> for available commands.`);
			print('');
		}
		input.focus();
	}
	function minimize() { win.style.display = 'none'; taskbtn.classList.remove('active'); }
	function close() { win.style.display = 'none'; taskbtn.style.display = 'none'; }

	document.getElementById('iconParrotTerm').addEventListener('dblclick', open);
	document.getElementById('parrotTermMin').addEventListener('click', minimize);
	document.getElementById('parrotTermClose').addEventListener('click', close);
	document.getElementById('parrotTermMax').addEventListener('click', () => {
		win.classList.toggle('parrot-maximized');
	});
	taskbtn.addEventListener('click', () => (win.style.display === 'none' ? open() : minimize()));

	input.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') {
			runCommand(input.value);
			input.value = '';
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (histIdx > 0) { histIdx--; input.value = history[histIdx]; }
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (histIdx < history.length - 1) { histIdx++; input.value = history[histIdx]; }
			else { histIdx = history.length; input.value = ''; }
		}
	});

	// drag
	let dragging = false, ox = 0, oy = 0;
	let savedTerm = { l: '60px', t: '40px', w: '620px', h: '380px' };
	titlebar.addEventListener('mousedown', (e) => {
		if (e.target.closest('.parrot-ctrl')) return;
		e.preventDefault();
		if (win.classList.contains('parrot-maximized')) {
			win.classList.remove('parrot-maximized');
			win.style.left = savedTerm.l; win.style.top = savedTerm.t;
			win.style.width = savedTerm.w; win.style.height = savedTerm.h;
		}
		dragging = true;
		const areaRect = document.getElementById('parrotArea').getBoundingClientRect();
		const winRect = win.getBoundingClientRect();
		ox = e.clientX - winRect.left; oy = e.clientY - winRect.top;
		win.style.left = winRect.left - areaRect.left + 'px';
		win.style.top = winRect.top - areaRect.top + 'px';
		win.style.userSelect = 'none';
	});
	document.addEventListener('mousemove', (e) => {
		if (!dragging) return;
		const area = document.getElementById('parrotArea');
		const areaRect = area.getBoundingClientRect();
		win.style.left = Math.max(0, Math.min(area.clientWidth - win.offsetWidth, e.clientX - areaRect.left - ox)) + 'px';
		win.style.top = Math.max(0, Math.min(area.clientHeight - win.offsetHeight, e.clientY - areaRect.top - oy)) + 'px';
	});
	document.addEventListener('mouseup', () => { dragging = false; win.style.userSelect = ''; });

	makeResizable(win, document.getElementById('parrotTermResize'), document.getElementById('parrotArea'), 380, 220);
})();

// ── TempleOS background ────────────────────────────────
(function () {
	const bg = document.getElementById('temposBg');
	if (!bg) return;
	const colors = ['#55ffff', '#ff5555', '#ffff55', '#55ff55', '#ff55ff', '#5555ff', '#aaaaaa', '#ffffff'];
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?✝†☩✞♦♠♣♥←→↑↓█▓▒░';
	const lines = [];
	for (let i = 0; i < 80; i++) {
		let line = '';
		for (let j = 0; j < 120; j++) {
			const c = colors[Math.floor(Math.random() * colors.length)];
			const ch = chars[Math.floor(Math.random() * chars.length)];
			line += `<span style="color:${c}">${ch}</span>`;
		}
		lines.push(line);
	}
	bg.innerHTML = lines.join('<br>');
})();

// ── XP Start Menu: Run… opens easter-egg terminal ─────
document.getElementById('smRun')?.addEventListener('click', () => {
	document.getElementById('xpStartMenu').style.display = 'none';
	document.getElementById('termOverlay').classList.add('open');
	document.getElementById('termInput').focus();
});

// ── Tor tab close buttons ──────────────────────────────
document.querySelector('#xpTorBrowser .tor-tab__close')?.addEventListener('click', () => {
	document.getElementById('xpTorClose').click();
});
document.querySelector('#parrotTorBrowser .tor-tab__close')?.addEventListener('click', () => {
	document.getElementById('parrotTorClose').click();
});

// ── Init ───────────────────────────────────────────────
renderTabs();
renderProjects();
renderTemposCtfs();

// Restore tab from URL hash (deep-link support)
(function () {
	function applyHash() {
		const id = location.hash.replace('#', '');
		if (id && tabs.find((t) => t.id === id)) switchTab(id);
		else if (!activeTab) switchTab('home');
	}
	applyHash();
	window.addEventListener('hashchange', applyHash);
	if (!location.hash) switchTab('home');
})();
