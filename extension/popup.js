document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('extractAndPrintBtn');
  const status = document.getElementById('statusMessage');

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    btn.innerHTML = '<span>⏳ Scanning Portal Data...</span>';
    status.className = 'status-area';
    status.style.display = 'none';

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) throw new Error('No active tab found');

      chrome.tabs.sendMessage(tab.id, { action: 'GENERATE_AGRISTACK_CARD' }, (response) => {
        btn.disabled = false;
        btn.innerHTML = '<span>🖨️ Format & Generate PDF Card</span>';

        if (chrome.runtime.lastError) {
          status.className = 'status-area status-error';
          status.textContent = 'Please open the Farmer Registry portal page first.';
          status.style.display = 'block';
          return;
        }

        if (response && response.success) {
          status.className = 'status-area status-success';
          status.textContent = '✅ Card generated & downloaded in 300 DPI!';
          status.style.display = 'block';
        } else {
          status.className = 'status-area status-error';
          status.textContent = response?.error || 'Unable to detect farmer records on this page.';
          status.style.display = 'block';
        }
      });
    } catch (e) {
      btn.disabled = false;
      btn.innerHTML = '<span>🖨️ Format & Generate PDF Card</span>';
      status.className = 'status-area status-error';
      status.textContent = 'Error: ' + e.message;
      status.style.display = 'block';
    }
  });
});
