// popup.js
(async () => {
  const preview = document.getElementById('job-preview');
  const actions = document.getElementById('actions');
  const result  = document.getElementById('result');
  const badge   = document.getElementById('status-badge');

  // ── Check login status ───────────────────────────────────────────────────
  const { authToken } = await chrome.storage.local.get('authToken');

  if (!authToken) {
    badge.textContent = '● Not logged in';
    badge.className   = 'status-badge disconnected';

    preview.innerHTML = `
      <div class="no-job">
        <div style="font-size:2rem;margin-bottom:8px">🔐</div>
        <strong>Connect your Trackr account</strong><br/>
        Log in to start saving jobs automatically.
      </div>`;

    actions.innerHTML = `
      <div class="login-prompt">
        <p>Open Trackr and log in — your session will sync here automatically.</p>
        <button class="btn-save" id="open-trackr">Open Trackr →</button>
      </div>`;

    document.getElementById('open-trackr').addEventListener('click', () => {
      chrome.tabs.create({ url: 'http://localhost:8080/auth' });
    });
    return;
  }

  badge.textContent = '● Connected';
  badge.className   = 'status-badge connected';

  // ── Get current tab job data ─────────────────────────────────────────────
  let currentJob = null;

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_JOB_DATA' });
    currentJob = response?.job;
  } catch {
    // Not on a supported job page
  }

  if (!currentJob?.title) {
    preview.innerHTML = `
      <div class="no-job">
        <div style="font-size:2rem;margin-bottom:8px">🔍</div>
        <strong>No job detected</strong><br/>
        Open a job listing on LinkedIn, Naukri, Internshala, Indeed, or Glassdoor.
      </div>`;

    actions.innerHTML = `
      <button class="btn-secondary" id="open-dashboard">View Dashboard</button>`;

    document.getElementById('open-dashboard').addEventListener('click', () => {
      chrome.tabs.create({ url: 'http://localhost:8080/dashboard' });
    });
    return;
  }

  // ── Render job preview ───────────────────────────────────────────────────
  preview.innerHTML = `
    <div class="job-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
        <div class="job-card-title" title="${esc(currentJob.title)}">${esc(currentJob.title)}</div>
        <div class="source-chip">${esc(currentJob.source)}</div>
      </div>
      <div class="job-card-company">${esc(currentJob.company)}</div>
      <div class="job-card-meta">
        ${currentJob.location ? `<span class="meta-tag">📍 ${esc(currentJob.location)}</span>` : ''}
        ${currentJob.salary   ? `<span class="meta-tag">💰 ${esc(currentJob.salary)}</span>`   : ''}
      </div>
    </div>`;

  // ── Status selector + Save button ────────────────────────────────────────
  actions.innerHTML = `
    <div class="status-row">
      <label>Status</label>
      <select id="status-select">
        <option value="saved">📌 Saved</option>
        <option value="applied" selected>✅ Applied</option>
        <option value="interview">🎤 Interview</option>
        <option value="offer">🎉 Offer</option>
        <option value="rejected">❌ Rejected</option>
      </select>
    </div>
    <button class="btn-save" id="save-btn">Save to Trackr →</button>
    <hr class="divider" />
    <button class="btn-secondary" id="open-dashboard">View Dashboard</button>`;

  document.getElementById('open-dashboard').addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:8080/dashboard' });
  });

  document.getElementById('save-btn').addEventListener('click', async () => {
    const saveBtn = document.getElementById('save-btn');
    const status  = document.getElementById('status-select').value;

    saveBtn.disabled   = true;
    saveBtn.textContent = 'Saving…';
    result.innerHTML   = '';

    const res = await chrome.runtime.sendMessage({
      type:    'SAVE_JOB',
      payload: { ...currentJob, status },
    });

    if (res?.success) {
      result.innerHTML = `<div class="result success">✅ "${currentJob.title}" saved!</div>`;
      saveBtn.textContent = '✓ Saved!';
      setTimeout(() => window.close(), 1800);
    } else {
      result.innerHTML = `<div class="result error">❌ ${res?.error || 'Failed to save'}</div>`;
      saveBtn.disabled   = false;
      saveBtn.textContent = 'Save to Trackr →';
    }
  });

  function esc(str) {
    if (!str) return '';
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
})();