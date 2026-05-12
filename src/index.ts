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
    }

    .title-bar__left {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #c8c8c8;
    }

    .title-bar__icon {
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .title-bar__icon svg {
      width: 16px;
      height: 16px;
    }

    .title-bar__controls {
      display: flex;
      gap: 4px;
    }

    .title-bar__btn {
      width: 28px;
      height: 20px;
      background: transparent;
      border: none;
      color: #a0a0a0;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 2px;
      transition: background 0.15s;
    }

    .title-bar__btn:hover { background: #3e3e3e; color: #fff; }

    /* ── Menu / toolbar bar ────────────────────────────── */
    .toolbar {
      display: flex;
      align-items: center;
      background: #252525;
      height: 38px;
      padding: 0 8px;
      gap: 2px;
      border-bottom: 1px solid #111;
      user-select: none;
    }

    .toolbar__menu {
      display: flex;
      align-items: center;
      gap: 0;
    }

    .toolbar__menu-item {
      font-size: 13px;
      color: #c8c8c8;
      padding: 4px 10px;
      border-radius: 3px;
      cursor: pointer;
      transition: background 0.15s;
      text-decoration: underline;
      text-underline-offset: 2px;
      text-decoration-color: transparent;
    }

    .toolbar__menu-item:hover {
      background: #3a3a3a;
      color: #fff;
    }

    .toolbar__menu-item span {
      text-decoration: underline;
      text-underline-offset: 2px;
    }

    .toolbar__sep {
      width: 1px;
      height: 22px;
      background: #444;
      margin: 0 6px;
    }

    .toolbar__icons {
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .toolbar__icon-btn {
      width: 30px;
      height: 28px;
      background: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 3px;
      color: #a0a0a0;
      transition: background 0.15s;
    }

    .toolbar__icon-btn:hover { background: #3a3a3a; color: #fff; }

    .toolbar__icon-btn.active {
      border: 1.5px solid #4a7cc7;
      color: #7ab0f0;
      background: #1e3356;
    }

    .toolbar__icon-btn.pause {
      color: #e08c3a;
      font-size: 18px;
    }

    .toolbar__icon-group {
      display: flex;
      align-items: center;
      border: 1.5px solid #4a7cc7;
      border-radius: 3px;
      overflow: hidden;
    }

    .toolbar__icon-group .toolbar__icon-btn {
      border-radius: 0;
      border: none;
      color: #7ab0f0;
      background: #1e3356;
    }

    .toolbar__icon-group .toolbar__icon-btn:hover { background: #254470; }

    .toolbar__icon-group .toolbar__icon-btn + .toolbar__icon-btn {
      border-left: 1px solid #4a7cc7;
    }
  </style>
</head>
<body>

  <!-- Title bar -->
  <div class="title-bar">
    <div class="title-bar__left">
      <div class="title-bar__icon">
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="2" width="14" height="10" rx="1" stroke="#7ab0f0" stroke-width="1.2"/>
          <rect x="5" y="12" width="6" height="1.5" fill="#7ab0f0"/>
          <rect x="3" y="13.5" width="10" height="1" fill="#7ab0f0"/>
        </svg>
      </div>
      0xpiners — Portfolio
    </div>
    <div class="title-bar__controls">
      <button class="title-bar__btn" title="Minimize">&#8722;</button>
      <button class="title-bar__btn" title="Maximize">&#9633;</button>
    </div>
  </div>

  <!-- Menu / toolbar bar -->
  <div class="toolbar">
    <nav class="toolbar__menu">
      <div class="toolbar__menu-item"><span>F</span>ile</div>
      <div class="toolbar__menu-item"><span>E</span>dit</div>
      <div class="toolbar__menu-item"><span>V</span>iew</div>
      <div class="toolbar__menu-item">V<span>M</span></div>
      <div class="toolbar__menu-item"><span>T</span>abs</div>
      <div class="toolbar__menu-item"><span>H</span>elp</div>
    </nav>

    <div class="toolbar__sep"></div>

    <div class="toolbar__icons">
      <!-- Pause button -->
      <button class="toolbar__icon-btn pause" title="Pause">&#9646;&#9646;</button>

      <div class="toolbar__sep"></div>

      <!-- Snapshot / revert icons -->
      <button class="toolbar__icon-btn" title="Take Snapshot">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 2a6 6 0 100 12A6 6 0 008 2zm0 1.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zM7.25 5v3.31l2.47 1.47.53-.88-2-.19V5h-1z"/></svg>
      </button>
      <button class="toolbar__icon-btn" title="Revert">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4.5 4.5A5.5 5.5 0 118 13.95V12.4a4 4 0 10-2.83-6.83L6.5 7H3V3.5l1.5 1z"/></svg>
      </button>
      <button class="toolbar__icon-btn" title="Send Ctrl+Alt+Del">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="4" width="12" height="8" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M5 7h6M5 9h4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
      </button>

      <div class="toolbar__sep"></div>

      <!-- View mode group (active) -->
      <div class="toolbar__icon-group">
        <button class="toolbar__icon-btn" title="Single Window">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3" width="12" height="10" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>
        </button>
        <button class="toolbar__icon-btn" title="Full Screen">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 5V2h3M14 5V2h-3M2 11v3h3M14 11v3h-3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" fill="none"/></svg>
        </button>
        <button class="toolbar__icon-btn" title="Unity">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="2" width="5" height="5" rx="0.5" fill="none" stroke="currentColor" stroke-width="1.2"/><rect x="9" y="2" width="5" height="5" rx="0.5" fill="none" stroke="currentColor" stroke-width="1.2"/><rect x="2" y="9" width="5" height="5" rx="0.5" fill="none" stroke="currentColor" stroke-width="1.2"/><rect x="9" y="9" width="5" height="5" rx="0.5" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>
        </button>
      </div>

      <div class="toolbar__sep"></div>

      <!-- Terminal / console button -->
      <button class="toolbar__icon-btn" title="Console">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="3" width="14" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M4 7l2.5 2L4 11M8 11h4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
      </button>

      <button class="toolbar__icon-btn" title="Settings">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 5a3 3 0 100 6A3 3 0 008 5zm0 1.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"/><path d="M8 1l-.9 1.6a5.5 5.5 0 00-1.5.6L4 2.7l-1.3 1.3.9 1.6a5.5 5.5 0 00-.6 1.5L1.5 8l.5 1.9 1.6-.9c.4.23.95.45 1.5.6L5.5 11l1.3 1.3 1.6-.9c.5.23 1 .45 1.5.6l.5 1.5h1.9l.9-1.6c.5-.15 1.05-.37 1.5-.6l1.6.9 1.3-1.3-.9-1.6c.23-.5.45-1 .6-1.5L14.5 8l-.5-1.9-1.6.9a5.5 5.5 0 00-1.5-.6L10.5 5 9.2 3.7l-1.6.9A5.5 5.5 0 008 4V1z" fill="none" stroke="currentColor" stroke-width="1.1"/></svg>
      </button>
    </div>
  </div>

</body>
</html>`;

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		return new Response(html, {
			headers: { 'Content-Type': 'text/html; charset=utf-8' },
		});
	},
} satisfies ExportedHandler<Env>;
