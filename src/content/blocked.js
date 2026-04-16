(async () => {
  const checkBlock = async () => {
    try {
      const results = await chrome.storage.sync.get(['blocklist']);
      const blocklist = results.blocklist || [];
      const currentDomain = window.location.hostname.replace(/^www\./, '');

      if (blocklist.some(d => currentDomain === d || currentDomain.endsWith('.' + d))) {
        blockPage();
      }
    } catch (e) {
      console.error('Error checking blocklist:', e);
    }
  };

  const blockPage = () => {
    // Inject custom CSS to hide everything immediately
    const style = document.createElement('style');
    style.innerHTML = `
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        height: 100% !important;
        overflow: hidden !important;
        background: #1a1a1a !important;
        color: white !important;
        font-family: 'Inter', sans-serif !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      #blocked-container {
        text-align: center;
        max-width: 600px;
        padding: 2rem;
        border: 1px solid #333;
        border-radius: 12px;
        background: #222;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      }
      h1 { color: #ff4d4d; font-size: 2.5rem; margin-bottom: 1rem; }
      p { color: #888; font-size: 1.2rem; }
      button { 
        margin-top: 2rem;
        padding: 0.8rem 2rem;
        background: #646cff;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1rem;
      }
      button:hover { background: #535bf2; }
    `;
    document.head.appendChild(style);

    // Create blocked UI
    const container = document.createElement('div');
    container.id = 'blocked-container';
    container.innerHTML = `
      <h1>🛑 Page Blocked</h1>
      <p>This site is on your Focus Mode blocklist.</p>
      <p>Stay productive! You can remove this site in the extension options.</p>
      <button id="go-back">Go Back</button>
    `;

    document.body.innerHTML = '';
    document.body.appendChild(container);

    document.getElementById('go-back').onclick = () => {
      window.history.back();
    };
  };

  checkBlock();
})();
