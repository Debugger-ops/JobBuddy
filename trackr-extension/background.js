// background.js — service worker
// Receives job data from content.js and posts to your Trackr app

const TRACKR_APP_URL = 'http://localhost:8080'; // Change to your production URL

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'SAVE_JOB') {
    handleSaveJob(msg.payload)
      .then(result => sendResponse(result))
      .catch(err   => sendResponse({ success: false, error: err.message }));
    return true; // keep channel open for async response
  }
});

async function handleSaveJob(job) {
  try {
    // Get stored auth token
    const { authToken, supabaseUrl, supabaseKey } = await chrome.storage.local.get([
      'authToken', 'supabaseUrl', 'supabaseKey'
    ]);

    if (!authToken) {
      // Open Trackr in a new tab so user can log in
      chrome.tabs.create({ url: `${TRACKR_APP_URL}/auth` });
      return { success: false, error: 'Not logged in. Please log in to Trackr.' };
    }

    // Save job directly to Supabase
    const response = await fetch(`${supabaseUrl}/rest/v1/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'apikey':        supabaseKey,
        'Authorization': `Bearer ${authToken}`,
        'Prefer':        'return=representation',
      },
      body: JSON.stringify({
        title:       job.title,
        company:     job.company,
        location:    job.location   || null,
        url:         job.url        || null,
        salary:      job.salary     || null,
        status:      job.status     || 'saved',
        notes:       job.source ? `Auto-captured from ${job.source}` : null,
        deadline:    null,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || 'Failed to save job');
    }

    return { success: true };
  } catch (err) {
    console.error('[Trackr Extension]', err);
    return { success: false, error: err.message };
  }
}

// When the extension is installed, open the setup page
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: `${TRACKR_APP_URL}/?extension=installed` });
  }
});