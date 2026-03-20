// content.js — runs on job listing pages
// Scrapes job details and injects a "Save to Trackr" button

(function () {
  'use strict';

  const hostname = window.location.hostname;

  // ── Scrapers per site ──────────────────────────────────────────────────────

  function scrapeLinkedIn() {
    const title    = document.querySelector('.job-details-jobs-unified-top-card__job-title h1')?.textContent?.trim()
                  || document.querySelector('h1.t-24')?.textContent?.trim()
                  || document.querySelector('h1')?.textContent?.trim()
                  || '';

    const company  = document.querySelector('.job-details-jobs-unified-top-card__company-name a')?.textContent?.trim()
                  || document.querySelector('.job-details-jobs-unified-top-card__company-name')?.textContent?.trim()
                  || document.querySelector('.topcard__org-name-link')?.textContent?.trim()
                  || '';

    const location = document.querySelector('.job-details-jobs-unified-top-card__bullet')?.textContent?.trim()
                  || document.querySelector('.topcard__flavor--bullet')?.textContent?.trim()
                  || '';

    const salary   = document.querySelector('.compensation__salary-range')?.textContent?.trim()
                  || document.querySelector('[class*="salary"]')?.textContent?.trim()
                  || '';

    return { title, company, location, salary, url: window.location.href, source: 'LinkedIn' };
  }

  function scrapeNaukri() {
    const title    = document.querySelector('h1.jd-header-title')?.textContent?.trim()
                  || document.querySelector('.job-tittle h1')?.textContent?.trim()
                  || document.querySelector('h1')?.textContent?.trim()
                  || '';

    const company  = document.querySelector('.jd-header-comp-name a')?.textContent?.trim()
                  || document.querySelector('.comp-name')?.textContent?.trim()
                  || '';

    const location = document.querySelector('.location-content')?.textContent?.trim()
                  || document.querySelector('[class*="location"]')?.textContent?.trim()
                  || '';

    const salary   = document.querySelector('.salary-detail')?.textContent?.trim()
                  || document.querySelector('[class*="salary"]')?.textContent?.trim()
                  || '';

    return { title, company, location, salary, url: window.location.href, source: 'Naukri' };
  }

  function scrapeInternshala() {
    const title    = document.querySelector('.profile-box h1')?.textContent?.trim()
                  || document.querySelector('h1.heading_4_5')?.textContent?.trim()
                  || document.querySelector('h1')?.textContent?.trim()
                  || '';

    const company  = document.querySelector('.company-name a')?.textContent?.trim()
                  || document.querySelector('.heading_6')?.textContent?.trim()
                  || '';

    const location = document.querySelector('.locations span a')?.textContent?.trim()
                  || document.querySelector('.location_link')?.textContent?.trim()
                  || '';

    const salary   = document.querySelector('.stipend')?.textContent?.trim()
                  || '';

    return { title, company, location, salary, url: window.location.href, source: 'Internshala' };
  }

  function scrapeIndeed() {
    const title    = document.querySelector('h1.jobsearch-JobInfoHeader-title')?.textContent?.trim()
                  || document.querySelector('h1')?.textContent?.trim()
                  || '';

    const company  = document.querySelector('[data-company-name]')?.textContent?.trim()
                  || document.querySelector('.jobsearch-InlineCompanyRating-companyHeader a')?.textContent?.trim()
                  || '';

    const location = document.querySelector('.jobsearch-JobInfoHeader-subtitle .css-1f5nrea')?.textContent?.trim()
                  || '';

    const salary   = document.querySelector('#salaryInfoAndJobType .attribute_snippet')?.textContent?.trim()
                  || '';

    return { title, company, location, salary, url: window.location.href, source: 'Indeed' };
  }

  function scrapeGlassdoor() {
    const title    = document.querySelector('[data-test="job-title"]')?.textContent?.trim()
                  || document.querySelector('h1')?.textContent?.trim()
                  || '';

    const company  = document.querySelector('[data-test="employer-name"]')?.textContent?.trim()
                  || '';

    const location = document.querySelector('[data-test="location"]')?.textContent?.trim()
                  || '';

    const salary   = document.querySelector('[data-test="detailSalary"]')?.textContent?.trim()
                  || '';

    return { title, company, location, salary, url: window.location.href, source: 'Glassdoor' };
  }

  // ── Pick the right scraper ─────────────────────────────────────────────────

  function scrapeCurrentPage() {
    if (hostname.includes('linkedin.com'))    return scrapeLinkedIn();
    if (hostname.includes('naukri.com'))      return scrapeNaukri();
    if (hostname.includes('internshala.com')) return scrapeInternshala();
    if (hostname.includes('indeed.com'))      return scrapeIndeed();
    if (hostname.includes('glassdoor.com'))   return scrapeGlassdoor();
    return null;
  }

  // ── Inject "Save to Trackr" button ────────────────────────────────────────

  function injectButton() {
    if (document.getElementById('trackr-save-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'trackr-save-btn';
    btn.innerHTML = `
      <span id="trackr-btn-icon">🎯</span>
      <span id="trackr-btn-text">Save to Trackr</span>
    `;
    btn.style.cssText = `
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 999999;
      display: flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #1d4ed8, #3b82f6);
      color: #fff;
      border: none;
      border-radius: 50px;
      padding: 12px 22px;
      font-size: 14px;
      font-weight: 600;
      font-family: 'Segoe UI', system-ui, sans-serif;
      cursor: pointer;
      box-shadow: 0 6px 24px rgba(37,99,235,0.45);
      transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
      letter-spacing: 0.01em;
    `;

    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-2px)';
      btn.style.boxShadow = '0 10px 32px rgba(37,99,235,0.55)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translateY(0)';
      btn.style.boxShadow = '0 6px 24px rgba(37,99,235,0.45)';
    });

    btn.addEventListener('click', () => {
      const job = scrapeCurrentPage();
      if (!job || !job.title) {
        showToast('❌ Could not detect job details on this page.', 'error');
        return;
      }

      // Send to background script → your app
      chrome.runtime.sendMessage({ type: 'SAVE_JOB', payload: job }, (response) => {
        if (response?.success) {
          showToast(`✅ "${job.title}" saved to Trackr!`, 'success');
          btn.style.opacity = '0.6';
          setTimeout(() => { btn.style.opacity = '1'; }, 2000);
        } else {
          showToast('❌ ' + (response?.error || 'Failed to save. Are you logged in to Trackr?'), 'error');
        }
      });
    });

    document.body.appendChild(btn);
  }

  // ── Toast notification ─────────────────────────────────────────────────────

  function showToast(message, type = 'success') {
    const existing = document.getElementById('trackr-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'trackr-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 88px;
      right: 28px;
      z-index: 999999;
      background: ${type === 'success' ? '#0f172a' : '#7f1d1d'};
      color: #fff;
      padding: 12px 20px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 500;
      font-family: 'Segoe UI', system-ui, sans-serif;
      box-shadow: 0 8px 24px rgba(0,0,0,0.25);
      animation: trackrSlideIn 0.2s ease both;
      max-width: 320px;
      line-height: 1.4;
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes trackrSlideIn {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // ── Auto-detect "Apply" button clicks on LinkedIn ─────────────────────────

  function watchApplyButton() {
    if (!hostname.includes('linkedin.com')) return;

    const observer = new MutationObserver(() => {
      const applyBtn = document.querySelector('.jobs-apply-button--top-card button, .jobs-apply-button button');
      if (applyBtn && !applyBtn.dataset.trackrWatched) {
        applyBtn.dataset.trackrWatched = 'true';
        applyBtn.addEventListener('click', () => {
          const job = scrapeCurrentPage();
          if (job?.title) {
            // Auto-save with status "applied" when Apply is clicked
            chrome.runtime.sendMessage({
              type: 'SAVE_JOB',
              payload: { ...job, status: 'applied', autoDetected: true }
            }, (response) => {
              if (response?.success) {
                showToast(`✅ Auto-saved "${job.title}" as Applied!`, 'success');
              }
            });
          }
        });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // ── Init ──────────────────────────────────────────────────────────────────

  // Wait a moment for dynamic content to load
  setTimeout(() => {
    injectButton();
    watchApplyButton();
  }, 1500);

  // Re-inject on SPA navigation (LinkedIn is a SPA)
  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(() => {
        injectButton();
        watchApplyButton();
      }, 2000);
    }
  }).observe(document.body, { childList: true, subtree: true });

  // Listen for popup requesting current job data
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.type === 'GET_JOB_DATA') {
      sendResponse({ job: scrapeCurrentPage() });
    }
    return true;
  });

})();