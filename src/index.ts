const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>0xpiners — Portfolio</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: #1a1a1a;
      font-family: 'Segoe UI', system-ui, sans-serif;
      color: #d4d4d4;
      height: 100vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    /* ── Title bar ─────────────────────────────────────── */
    .title-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #2b2b2b;
      height: 32px;
      padding: 0 12px;
      border-bottom: 1px solid #111;
      user-select: none;
      flex-shrink: 0;
    }
    .title-bar__left {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #c8c8c8;
    }
    .title-bar__controls { display: flex; gap: 4px; }
    .title-bar__btn {
      width: 28px; height: 20px;
      background: transparent; border: none;
      color: #a0a0a0; font-size: 14px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      border-radius: 2px; transition: background 0.15s;
    }
    .title-bar__btn:hover { background: #3e3e3e; color: #fff; }

    /* ── Toolbar ───────────────────────────────────────── */
    .toolbar {
      display: flex;
      align-items: center;
      background: #252525;
      height: 38px;
      padding: 0 8px;
      gap: 2px;
      border-bottom: 1px solid #111;
      user-select: none;
      flex-shrink: 0;
    }
    .toolbar__menu { display: flex; align-items: center; }
    .toolbar__menu-item {
      font-size: 13px; color: #c8c8c8;
      padding: 4px 10px; border-radius: 3px;
      cursor: pointer; transition: background 0.15s;
    }
    .toolbar__menu-item:hover { background: #3a3a3a; color: #fff; }
    .toolbar__menu-item span { text-decoration: underline; text-underline-offset: 2px; }
    .toolbar__sep { width: 1px; height: 22px; background: #444; margin: 0 6px; }
    .toolbar__icons { display: flex; align-items: center; gap: 2px; }
    .toolbar__icon-btn {
      width: 30px; height: 28px;
      background: transparent; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      border-radius: 3px; color: #a0a0a0; transition: background 0.15s;
    }
    .toolbar__icon-btn:hover { background: #3a3a3a; color: #fff; }
    .toolbar__icon-btn.pause { color: #e08c3a; font-size: 18px; }
    .toolbar__icon-group {
      display: flex; align-items: center;
      border: 1.5px solid #4a7cc7; border-radius: 3px; overflow: hidden;
    }
    .toolbar__icon-group .toolbar__icon-btn {
      border-radius: 0; border: none;
      color: #7ab0f0; background: #1e3356;
    }
    .toolbar__icon-group .toolbar__icon-btn:hover { background: #254470; }
    .toolbar__icon-group .toolbar__icon-btn + .toolbar__icon-btn {
      border-left: 1px solid #4a7cc7;
    }

    /* ── Layout ────────────────────────────────────────── */
    .workspace {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    /* ── Library sidebar ───────────────────────────────── */
    .library {
      width: 200px; min-width: 200px;
      background: #1e1e1e;
      border-right: 1px solid #111;
      display: flex; flex-direction: column;
      user-select: none;
    }
    .library__header {
      display: flex; align-items: center; justify-content: space-between;
      background: #2b2b2b; padding: 5px 8px; border-bottom: 1px solid #111;
    }
    .library__title { font-size: 13px; color: #c8c8c8; }
    .library__close {
      background: transparent; border: none; color: #888;
      font-size: 14px; cursor: pointer; padding: 0 2px;
      line-height: 1; border-radius: 2px; transition: background 0.15s, color 0.15s;
    }
    .library__close:hover { background: #c0392b; color: #fff; }
    .library__search {
      display: flex; align-items: center;
      background: #141414; border-bottom: 1px solid #111;
      padding: 4px 6px; gap: 5px;
    }
    .library__search svg { flex-shrink: 0; color: #666; }
    .library__search input {
      flex: 1; background: transparent; border: none; outline: none;
      font-size: 12px; color: #c8c8c8; min-width: 0;
    }
    .library__search input::placeholder { color: #555; }
    .library__search-arrow { color: #555; font-size: 10px; flex-shrink: 0; }
    .library__tree { padding: 6px 0; flex: 1; overflow-y: auto; }
    .tree-item {
      display: flex; align-items: center; gap: 4px;
      padding: 3px 8px; font-size: 12px; color: #c8c8c8;
      cursor: pointer; white-space: nowrap;
    }
    .tree-item:hover { background: #2a2a2a; }
    .tree-item.active { background: #1e3356; color: #7ab0f0; }
    .tree-item__toggle { width: 12px; font-size: 11px; color: #888; text-align: center; flex-shrink: 0; }
    .tree-item__icon { flex-shrink: 0; display: flex; align-items: center; }
    .tree-item--child { padding-left: 28px; }

    /* ── Main area ─────────────────────────────────────── */
    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* ── Tab bar ───────────────────────────────────────── */
    .tab-bar {
      display: flex;
      align-items: flex-end;
      background: #252525;
      height: 30px;
      border-bottom: 1px solid #111;
      user-select: none;
      flex-shrink: 0;
    }
    .tab {
      display: flex; align-items: center; gap: 6px;
      padding: 0 10px 0 8px;
      height: 100%;
      font-size: 12px; color: #888;
      border-right: 1px solid #1a1a1a;
      cursor: pointer;
      background: #2b2b2b;
      transition: background 0.15s;
      position: relative;
    }
    .tab:hover { background: #303030; color: #ccc; }
    .tab.active {
      background: #1a1a1a;
      color: #d4d4d4;
    }
    .tab.active::after {
      content: '';
      position: absolute;
      bottom: -1px; left: 0; right: 0;
      height: 1px;
      background: #1a1a1a;
    }
    .tab__close {
      font-size: 11px; color: #666;
      padding: 1px 2px; border-radius: 2px;
      margin-left: 2px; transition: background 0.15s, color 0.15s;
    }
    .tab__close:hover { background: #c0392b; color: #fff; }

    /* ── VM Screen ─────────────────────────────────────── */
    .vm-screen {
      flex: 1;
      position: relative;
      overflow: hidden;
      background: #0d1117;
      display: none;
    }
    .vm-screen.active { display: flex; align-items: center; justify-content: center; }
    #screen-resume.active { align-items: stretch; justify-content: stretch; }

    /* scrolling code background */
    .vm-bg {
      position: absolute;
      inset: 0;
      display: flex;
      pointer-events: none;
      overflow: hidden;
    }
    .vm-bg__col {
      flex: 1;
      font-family: 'Courier New', monospace;
      font-size: 11px;
      line-height: 1.55;
      white-space: pre;
      overflow: hidden;
      opacity: 0.18;
      color: #4a9eff;
      animation: scroll-up 30s linear infinite;
    }
    .vm-bg__col:nth-child(2) { opacity: 0.12; animation-duration: 22s; animation-direction: reverse; }
    .vm-bg__col:nth-child(3) { opacity: 0.1; animation-duration: 35s; }
    @keyframes scroll-up {
      from { transform: translateY(0); }
      to { transform: translateY(-50%); }
    }

    /* floating terminal window */
    .terminal {
      position: relative;
      z-index: 10;
      width: min(700px, 90%);
      background: #0c0c0c;
      border: 1px solid #444;
      box-shadow: 0 8px 40px rgba(0,0,0,0.7);
    }
    .terminal__titlebar {
      display: flex; align-items: center; justify-content: space-between;
      background: #2b2b2b; padding: 3px 8px;
      font-size: 12px; font-family: 'Courier New', monospace;
      color: #c8c8c8;
    }
    .terminal__titlebar-controls { display: flex; gap: 4px; }
    .terminal__titlebar-btn {
      width: 14px; height: 14px; border-radius: 50%; border: none; cursor: pointer; font-size: 9px;
      display: flex; align-items: center; justify-content: center;
    }
    .terminal__titlebar-btn.close-btn { background: #c0392b; color: #7a0000; }
    .terminal__titlebar-btn.min-btn { background: #888; color: #444; }
    .terminal__titlebar-btn.max-btn { background: #888; color: #444; }
    .terminal__body {
      padding: 10px 14px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.6;
      color: #d4d4d4;
      min-height: 180px;
    }
    .term-prompt { color: #d4d4d4; }
    .term-prompt .bracket-red { color: #e74c3c; }
    .term-prompt .path { color: #3498db; }
    .term-prompt .hash { color: #d4d4d4; }
    .term-cmd { color: #fff; }
    .term-output { color: #aaa; }
    .term-success { color: #2ecc71; }
    .term-error { color: #e74c3c; }
    .term-warning { color: #f39c12; }
    .term-cursor {
      display: inline-block; width: 8px; height: 14px;
      background: #d4d4d4; vertical-align: middle;
      animation: blink 1s step-end infinite;
    }
    @keyframes blink { 50% { opacity: 0; } }

    .placeholder {
      position: relative;
      z-index: 10;
      color: #555;
      font-family: 'Courier New', monospace;
      font-size: 14px;
    }

    /* ── Dropdown menus ────────────────────────────────── */
    .toolbar__menu-item { position: relative; }
    .toolbar__menu-item.open { background: #3a3a3a; color: #fff; }

    .dropdown {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      background: #2b2b2b;
      border: 1px solid #3a3a3a;
      min-width: 210px;
      z-index: 1000;
      box-shadow: 0 6px 20px rgba(0,0,0,0.7);
      padding: 3px 0;
    }
    .dropdown-item {
      display: flex;
      align-items: center;
      padding: 5px 16px;
      font-size: 12px;
      color: #c8c8c8;
      cursor: pointer;
      white-space: nowrap;
      gap: 8px;
    }
    .dropdown-item:hover { background: #3a3a3a; color: #fff; }
    .dropdown-item.disabled { color: #4a4a4a; cursor: default; pointer-events: none; }
    .dropdown-item.checked::before { content: "✓"; color: #7ab0f0; font-size: 11px; width: 12px; }
    .dropdown-item:not(.checked)::before { content: ""; width: 12px; }
    .dropdown-item .shortcut { margin-left: auto; color: #555; font-size: 11px; }
    .dropdown-sep { height: 1px; background: #383838; margin: 3px 0; }

    /* ── Toast notifications ───────────────────────────── */
    .toast-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 3000;
      display: flex;
      flex-direction: column;
      gap: 8px;
      pointer-events: none;
    }
    .toast {
      background: #2b2b2b;
      border: 1px solid #444;
      color: #c8c8c8;
      font-size: 12px;
      font-family: 'Courier New', monospace;
      padding: 8px 14px;
      border-radius: 2px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.6);
      animation: toast-in 0.15s ease;
    }
    @keyframes toast-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

    /* ── Easter egg terminal overlay ───────────────────── */
    .term-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.65);
      z-index: 2000;
      align-items: center;
      justify-content: center;
    }
    .term-overlay.open { display: flex; }
    .term-overlay__window {
      width: min(680px, 92vw);
      height: min(400px, 65vh);
      background: #0c0c0c;
      border: 1px solid #555;
      box-shadow: 0 12px 48px rgba(0,0,0,0.9);
      display: flex;
      flex-direction: column;
    }
    .term-overlay__titlebar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #2b2b2b;
      padding: 4px 10px;
      font-size: 12px;
      font-family: 'Courier New', monospace;
      color: #c8c8c8;
      flex-shrink: 0;
    }
    .term-overlay__close {
      background: #c0392b; border: none; color: #fff;
      width: 14px; height: 14px; border-radius: 50%;
      cursor: pointer; font-size: 9px;
      display: flex; align-items: center; justify-content: center;
    }
    .term-overlay__body {
      flex: 1;
      padding: 10px 14px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      color: #d4d4d4;
      overflow-y: auto;
      line-height: 1.7;
    }
    .term-overlay__input-row {
      display: flex;
      align-items: center;
      padding: 4px 14px 10px;
      gap: 6px;
      flex-shrink: 0;
      border-top: 1px solid #1e1e1e;
    }
    .term-overlay__prompt { font-family: 'Courier New', monospace; font-size: 13px; color: #e74c3c; white-space: nowrap; }
    .term-overlay__input {
      flex: 1; background: transparent; border: none; outline: none;
      font-family: 'Courier New', monospace; font-size: 13px;
      color: #d4d4d4; caret-color: #d4d4d4;
    }

    /* ── Grid view ─────────────────────────────────────── */
    .grid-overlay {
      display: none;
      position: absolute;
      inset: 0;
      background: #111;
      z-index: 50;
      padding: 20px;
      gap: 14px;
      flex-wrap: wrap;
      align-content: flex-start;
    }
    .grid-overlay.open { display: flex; }
    .grid-card {
      width: calc(33.33% - 10px);
      height: 130px;
      border: 1px solid #2a2a2a;
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      cursor: pointer;
      transition: border-color 0.15s, transform 0.15s;
      overflow: hidden;
      position: relative;
    }
    .grid-card:hover { border-color: #555; transform: scale(1.02); }
    .grid-card__label { position: relative; z-index: 1; font-weight: bold; text-shadow: 0 1px 6px rgba(0,0,0,0.9); }
  </style>
</head>
<body>

  <!-- Title bar -->
  <div class="title-bar">
    <div class="title-bar__left">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="2" width="14" height="10" rx="1" stroke="#7ab0f0" stroke-width="1.2"/>
        <rect x="5" y="12" width="6" height="1.5" fill="#7ab0f0"/>
        <rect x="3" y="13.5" width="10" height="1" fill="#7ab0f0"/>
      </svg>
      0xpiners — Portfolio
    </div>
    <div class="title-bar__controls">
      <button class="title-bar__btn">&#8722;</button>
      <button class="title-bar__btn">&#9633;</button>
    </div>
  </div>

  <!-- Toolbar -->
  <div class="toolbar">
    <nav class="toolbar__menu" id="toolbarMenu">
      <div class="toolbar__menu-item" data-menu="file"><span>F</span>ile</div>
      <div class="toolbar__menu-item" data-menu="edit"><span>E</span>dit</div>
      <div class="toolbar__menu-item" data-menu="view"><span>V</span>iew</div>
      <div class="toolbar__menu-item" data-menu="vm">V<span>M</span></div>
      <div class="toolbar__menu-item" data-menu="tabs"><span>T</span>abs</div>
      <div class="toolbar__menu-item" data-menu="help"><span>H</span>elp</div>
    </nav>
    <div class="toolbar__sep"></div>
    <div class="toolbar__icons">
      <button class="toolbar__icon-btn pause" id="btnPause" title="Pause animation">&#9646;&#9646;</button>
      <div class="toolbar__sep"></div>
      <button class="toolbar__icon-btn" id="btnSnapshot" title="Copy section link">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 2a6 6 0 100 12A6 6 0 008 2zm0 1.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zM7.25 5v3.31l2.47 1.47.53-.88-2-.19V5h-1z"/></svg>
      </button>
      <button class="toolbar__icon-btn" id="btnRevert" title="Go to previous tab">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4.5 4.5A5.5 5.5 0 118 13.95V12.4a4 4 0 10-2.83-6.83L6.5 7H3V3.5l1.5 1z"/></svg>
      </button>
      <div class="toolbar__sep"></div>
      <div class="toolbar__icon-group">
        <button class="toolbar__icon-btn" id="btnViewSingle" title="Single view">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3" width="12" height="10" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>
        </button>
        <button class="toolbar__icon-btn" id="btnViewFull" title="Hide sidebar">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 5V2h3M14 5V2h-3M2 11v3h3M14 11v3h-3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" fill="none"/></svg>
        </button>
        <button class="toolbar__icon-btn" id="btnViewGrid" title="Grid view">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="2" width="5" height="5" rx="0.5" fill="none" stroke="currentColor" stroke-width="1.2"/><rect x="9" y="2" width="5" height="5" rx="0.5" fill="none" stroke="currentColor" stroke-width="1.2"/><rect x="2" y="9" width="5" height="5" rx="0.5" fill="none" stroke="currentColor" stroke-width="1.2"/><rect x="9" y="9" width="5" height="5" rx="0.5" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>
        </button>
      </div>
      <div class="toolbar__sep"></div>
      <button class="toolbar__icon-btn" id="btnTerminal" title="Open terminal">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="3" width="14" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M4 7l2.5 2L4 11M8 11h4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
      </button>
    </div>
  </div>

  <!-- Workspace -->
  <div class="workspace">

    <!-- Library -->
    <aside class="library">
      <div class="library__header">
        <span class="library__title">Library</span>
        <button class="library__close">&#x2715;</button>
      </div>
      <div class="library__search">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
          <path d="M11.742 10.344a6.5 6.5 0 10-1.397 1.398l3.85 3.85a1 1 0 001.415-1.415l-3.868-3.833zm-5.242 1.156a5 5 0 110-10 5 5 0 010 10z"/>
        </svg>
        <input type="text" id="librarySearch" placeholder="Type here to search" />
        <span class="library__search-arrow">&#9660;</span>
      </div>
      <div class="library__tree">
        <div class="tree-item">
          <span class="tree-item__toggle">&#8722;</span>
          <span class="tree-item__icon">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="2" width="14" height="10" rx="1" stroke="#a0a0a0" stroke-width="1.2"/>
              <rect x="5" y="12" width="6" height="1.2" fill="#a0a0a0"/>
              <rect x="3" y="13.2" width="10" height="1" fill="#a0a0a0"/>
            </svg>
          </span>
          My Computer
        </div>

        <div class="tree-item tree-item--child" data-tab="home">
          <span class="tree-item__icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="2" width="11" height="8" rx="1" stroke="#a0a0a0" stroke-width="1.1"/>
              <rect x="3.5" y="10" width="4" height="1" fill="#a0a0a0"/>
              <rect x="2" y="11" width="7" height="0.8" fill="#a0a0a0"/>
              <rect x="9" y="7" width="7" height="7" rx="1" fill="#1e1e1e"/>
              <polygon points="10.5,8.2 10.5,12.8 14.5,10.5" fill="#3cb371"/>
            </svg>
          </span>
          Home
        </div>

        <div class="tree-item tree-item--child" data-tab="projects">
          <span class="tree-item__icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="2" width="11" height="8" rx="1" stroke="#a0a0a0" stroke-width="1.1"/>
              <rect x="3.5" y="10" width="4" height="1" fill="#a0a0a0"/>
              <rect x="2" y="11" width="7" height="0.8" fill="#a0a0a0"/>
              <rect x="9" y="7" width="7" height="7" rx="1" fill="#1e1e1e"/>
              <polygon points="10.5,8.2 10.5,12.8 14.5,10.5" fill="#3cb371"/>
            </svg>
          </span>
          Projects
        </div>

        <div class="tree-item tree-item--child" data-tab="resume">
          <span class="tree-item__icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="2" width="11" height="8" rx="1" stroke="#a0a0a0" stroke-width="1.1"/>
              <rect x="3.5" y="10" width="4" height="1" fill="#a0a0a0"/>
              <rect x="2" y="11" width="7" height="0.8" fill="#a0a0a0"/>
              <rect x="9" y="7" width="7" height="7" rx="1" fill="#1e1e1e"/>
              <polygon points="10.5,8.2 10.5,12.8 14.5,10.5" fill="#3cb371"/>
            </svg>
          </span>
          Resume
        </div>

        <div class="tree-item tree-item--child" data-tab="contact">
          <span class="tree-item__icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="2" width="11" height="8" rx="1" stroke="#a0a0a0" stroke-width="1.1"/>
              <rect x="3.5" y="10" width="4" height="1" fill="#a0a0a0"/>
              <rect x="2" y="11" width="7" height="0.8" fill="#a0a0a0"/>
              <rect x="9" y="7" width="7" height="7" rx="1" fill="#1e1e1e"/>
              <polygon points="10.5,8.2 10.5,12.8 14.5,10.5" fill="#3cb371"/>
            </svg>
          </span>
          Contact
        </div>

        <div class="tree-item tree-item--child" data-tab="ctfs">
          <span class="tree-item__icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="2" width="11" height="8" rx="1" stroke="#a0a0a0" stroke-width="1.1"/>
              <rect x="3.5" y="10" width="4" height="1" fill="#a0a0a0"/>
              <rect x="2" y="11" width="7" height="0.8" fill="#a0a0a0"/>
              <rect x="9" y="7" width="7" height="7" rx="1" fill="#1e1e1e"/>
              <polygon points="10.5,8.2 10.5,12.8 14.5,10.5" fill="#3cb371"/>
            </svg>
          </span>
          CTFs
        </div>
      </div>
    </aside>

    <!-- Main area -->
    <div class="main">

      <!-- Tab bar -->
      <div class="tab-bar" id="tabBar">
        <!-- tabs injected by JS -->
      </div>

      <!-- VM Screens -->
      <div class="vm-screen active" id="screen-home" style="background:#0d1117;">
        <div class="vm-bg">
          <div class="vm-bg__col" id="bgLeft"></div>
          <div class="vm-bg__col" id="bgMid"></div>
          <div class="vm-bg__col" id="bgRight"></div>
        </div>
        <div class="placeholder" style="color:#4a9eff;">Hello World — Home</div>
      </div>

      <div class="vm-screen" id="screen-projects" style="background:#0d1a0f;">
        <div class="vm-bg">
          <div class="vm-bg__col" style="color:#3cb371;"></div>
          <div class="vm-bg__col" style="color:#3cb371;"></div>
          <div class="vm-bg__col" style="color:#3cb371;"></div>
        </div>
        <div class="placeholder" style="color:#3cb371;">Hello World — Projects</div>
      </div>

      <div class="vm-screen" id="screen-resume" style="background:#130d1a;">
        <div class="vm-bg">
          <div class="vm-bg__col" style="color:#a06eff;"></div>
          <div class="vm-bg__col" style="color:#a06eff;"></div>
          <div class="vm-bg__col" style="color:#a06eff;"></div>
        </div>
        <iframe
          src="/resume/David_Pinheiro_Resume.pdf"
          style="position:relative;z-index:10;width:100%;height:100%;border:none;"
          title="Resume"
        ></iframe>
      </div>

      <div class="vm-screen" id="screen-contact" style="background:#1a100d;">
        <div class="vm-bg">
          <div class="vm-bg__col" style="color:#e08c3a;"></div>
          <div class="vm-bg__col" style="color:#e08c3a;"></div>
          <div class="vm-bg__col" style="color:#e08c3a;"></div>
        </div>
        <div class="placeholder" style="color:#e08c3a;">Hello World — Contact</div>
      </div>

      <div class="vm-screen" id="screen-ctfs" style="background:#1a0d0d;">
        <div class="vm-bg">
          <div class="vm-bg__col" style="color:#e74c3c;"></div>
          <div class="vm-bg__col" style="color:#e74c3c;"></div>
          <div class="vm-bg__col" style="color:#e74c3c;"></div>
        </div>
        <div class="placeholder" style="color:#e74c3c;">Hello World — CTFs</div>
      </div>

    </div>
  </div>

  <!-- Toast container -->
  <div class="toast-container" id="toastContainer"></div>

  <!-- Easter egg terminal -->
  <div class="term-overlay" id="termOverlay">
    <div class="term-overlay__window">
      <div class="term-overlay__titlebar">
        <span>piners@portfolio:~</span>
        <button class="term-overlay__close" id="termClose">&#x2715;</button>
      </div>
      <div class="term-overlay__body" id="termBody"></div>
      <div class="term-overlay__input-row">
        <span class="term-overlay__prompt">[ piners ~ ]#</span>
        <input class="term-overlay__input" id="termInput" autocomplete="off" spellcheck="false" />
      </div>
    </div>
  </div>

  <!-- Grid view overlay (inside .main, injected by JS) -->

  <script>
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
      return \`<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="2" width="14" height="10" rx="1" stroke="currentColor" stroke-width="1.2"/>
        <rect x="5" y="12" width="6" height="1.2" fill="currentColor"/>
        <rect x="3" y="13.2" width="10" height="1" fill="currentColor"/>
      </svg>\`;
    }

    function vmIcon() {
      return \`<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="2" width="11" height="8" rx="1" stroke="currentColor" stroke-width="1.1"/>
        <rect x="3.5" y="10" width="4" height="1" fill="currentColor"/>
        <rect x="9" y="7" width="7" height="7" rx="1" fill="#1a1a1a"/>
        <polygon points="10.5,8.2 10.5,12.8 14.5,10.5" fill="#3cb371"/>
      </svg>\`;
    }

    function renderTabs() {
      const bar = document.getElementById('tabBar');
      bar.innerHTML = openTabs.map(id => {
        const t = tabs.find(x => x.id === id);
        const active = id === activeTab ? 'active' : '';
        const icon = t.icon === 'computer' ? computerIcon() : vmIcon();
        return \`<div class="tab \${active}" data-tab="\${id}">
          \${icon}
          \${t.label}
          <span class="tab__close" data-close="\${id}">&#x2715;</span>
        </div>\`;
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
          row += Math.floor(Math.random() * 256).toString(16).padStart(2,'0').toUpperCase() + ' ';
        }
        lines.push(row.trim());
      }
      return lines.join('\\n') + '\\n' + lines.join('\\n');
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
    const doubled = [...codeLines, ...codeLines].join('\\n');

    document.querySelectorAll('.vm-bg__col').forEach((col, i) => {
      col.textContent = (i % 3 === 1) ? hexLines() : doubled + '\\n' + doubled;
    });

    // ── Toast ──────────────────────────────────────────────
    function toast(msg, duration) {
      duration = duration || 2500;
      const el = document.createElement("div");
      el.className = "toast";
      el.textContent = msg;
      document.getElementById("toastContainer").appendChild(el);
      setTimeout(() => el.remove(), duration);
    }

    // ── Tab history (for revert button) ────────────────────
    const tabHistory = [];

    const _origSwitchTab = switchTab;
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
      const btn = document.getElementById("btnPause");
      btn.style.color = animPaused ? "#3cb371" : "#e08c3a";
      toast(animPaused ? "Animation paused" : "Animation resumed");
      closeDropdown();
    }

    // ── Library toggle ─────────────────────────────────────
    let libraryVisible = true;
    function toggleLibrary() {
      libraryVisible = !libraryVisible;
      const lib = document.querySelector(".library");
      lib.style.display = libraryVisible ? "" : "none";
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
    let gridOpen = false;
    const screenColors = {
      home: { bg: "#0d1117", fg: "#4a9eff" },
      projects: { bg: "#0d1a0f", fg: "#3cb371" },
      resume: { bg: "#130d1a", fg: "#a06eff" },
      ctfs: { bg: "#1a0d0d", fg: "#e74c3c" },
      contact: { bg: "#1a100d", fg: "#e08c3a" },
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
          card.innerHTML = \`<span class="grid-card__label">\${t.label}</span>\`;
          card.addEventListener("click", () => { closeGridView(); switchTab(t.id); });
          overlay.appendChild(card);
        });
        document.querySelector(".main").appendChild(overlay);
      }
      gridOpen = true;
      document.getElementById("gridOverlay").classList.add("open");
      closeDropdown();
    }

    function closeGridView() {
      gridOpen = false;
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
        { label: "Grid View",         action: openGridView },
      ],
      vm: () => [
        { label: "Power On", disabled: true },
        ...tabs.map(t => ({ label: "    " + t.label, action: () => { switchTab(t.id); closeDropdown(); } })),
        { sep: true },
        { label: "Suspend (Close Tab)",   action: () => { if (activeTab) closeTab(activeTab); closeDropdown(); } },
        { label: "Snapshot (Copy Link)",  action: copyLink },
      ],
      tabs: () => openTabs.length
        ? openTabs.map(id => {
            const t = tabs.find(x => x.id === id);
            return { label: t.label, checked: id === activeTab, action: () => { switchTab(id); closeDropdown(); } };
          })
        : [{ label: "No open tabs", disabled: true }],
      help: () => [
        { label: "GitHub",            action: () => { window.open("https://github.com/0xpiners", "_blank"); closeDropdown(); } },
        { label: "LinkedIn",          action: () => { toast("LinkedIn coming soon"); closeDropdown(); } },
        { sep: true },
        { label: "Keyboard Shortcuts", action: () => { showShortcuts(); closeDropdown(); } },
        { sep: true },
        { label: "About 0xpiners",    action: () => { switchTab("home"); closeDropdown(); } },
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
        el.innerHTML = \`<span>\${item.label}</span>\${item.shortcut ? \`<span class="shortcut">\${item.shortcut}</span>\` : ""}\`;
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

    document.getElementById("btnViewSingle").addEventListener("click", () => {
      closeGridView();
      if (!libraryVisible) toggleLibrary();
    });

    document.getElementById("btnViewFull").addEventListener("click", () => {
      closeGridView();
      toggleLibrary();
    });

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

    // ── Shortcuts help overlay ─────────────────────────────
    function showShortcuts() {
      toast("Ctrl+B: Toggle library  |  Ctrl+F: Search  |  Ctrl+W: Close tab  |  Ctrl+L: Copy link  |  Esc: Close", 4000);
    }

    // ── Easter egg terminal ────────────────────────────────
    document.getElementById("termClose").addEventListener("click", () => {
      document.getElementById("termOverlay").classList.remove("open");
    });

    const termCmds = {
      help: "Available commands: help, whoami, ls, clear, exit",
      whoami: "piners — security researcher & developer",
      ls: "home/  projects/  resume/  ctfs/  contact/",
      "ls -la": "drwxr-xr-x  piners  home/\\ndrwxr-xr-x  piners  projects/\\ndrwxr-xr-x  piners  ctfs/\\n-rw-r--r--  piners  resume.pdf",
      pwd: "/home/piners",
      date: new Date().toString(),
      uname: "Linux portfolio 5.15.0 #1 SMP x86_64 GNU/Linux",
      clear: "__clear__",
      exit: "__exit__",
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
      termPrint(\`<span style="color:#e74c3c">[ piners ~ ]#</span> \${input}\`);
      if (!input) return;
      const resp = termCmds[input.toLowerCase()];
      if (resp === "__clear__") {
        document.getElementById("termBody").innerHTML = "";
      } else if (resp === "__exit__") {
        document.getElementById("termOverlay").classList.remove("open");
      } else if (resp) {
        resp.split("\\n").forEach(line => termPrint(\`<span style="color:#aaa">\${line}</span>\`));
      } else {
        termPrint(\`<span style="color:#e74c3c">bash: \${input}: command not found</span>\`);
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

    // init
    renderTabs();
    switchTab('home');
  </script>

</body>
</html>`;

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		return new Response(html, {
			headers: { 'Content-Type': 'text/html; charset=utf-8' },
		});
	},
} satisfies ExportedHandler<Env>;
