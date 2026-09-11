/* ==========================================================================
   AgriStack Card Helper - Official Digital Prepaid Wallet & Landing Page
   ========================================================================== */

const WALLET_BACKEND_URL = 'https://farmer-wallet-extension.onrender.com';
const CARD_FEE = 22;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Year
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 2. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking on nav links
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
      }
    });
  }

  // 3. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // 4. Legal Policies Accordion
  const legalItems = document.querySelectorAll('.legal-accordion-item');
  legalItems.forEach(item => {
    const trigger = item.querySelector('.legal-accordion-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        legalItems.forEach(i => {
          i.classList.remove('active');
          const btn = i.querySelector('.legal-accordion-trigger');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });
        if (!isActive) {
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // Open first legal section by default
  if (legalItems.length > 0) {
    legalItems[0].classList.add('active');
    const firstTrigger = legalItems[0].querySelector('.legal-accordion-trigger');
    if (firstTrigger) firstTrigger.setAttribute('aria-expanded', 'true');
  }

  // 5. Policy Read Buttons (Modals)
  const readPolicyBtns = document.querySelectorAll('.legal-read-btn');
  readPolicyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const policyId = btn.getAttribute('data-policy');
      openPolicyModal(policyId);
    });
  });

  // 6. Modal Close Handlers
  const policyModal = document.getElementById('policyModal');
  if (policyModal) {
    policyModal.addEventListener('click', (e) => {
      if (e.target === policyModal) closePolicyModal();
    });
  }

  const rechargeModal = document.getElementById('rechargeModal');
  if (rechargeModal) {
    rechargeModal.addEventListener('click', (e) => {
      if (e.target === rechargeModal) closeRechargeModal();
    });
  }

  const rechargeSuccessModal = document.getElementById('rechargeSuccessModal');
  if (rechargeSuccessModal) {
    rechargeSuccessModal.addEventListener('click', (e) => {
      if (e.target === rechargeSuccessModal) closeRechargeSuccessModal();
    });
  }

  // Handle ESC key for all modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePolicyModal();
      closeRechargeModal();
      closeRechargeSuccessModal();
    }
  });

  // 7. Copy to Clipboard Buttons
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        copyToClipboard(textToCopy, btn);
      }
    });
  });

  // 8. Active Nav Link Highlighting on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
});

/* ==========================================================================
   Install Guide Tab Switcher
   ========================================================================== */
function switchInstallTab(browser) {
  const btnFirefox = document.getElementById('tabBtnFirefox');
  const btnChrome = document.getElementById('tabBtnChrome');
  const paneFirefox = document.getElementById('paneFirefox');
  const paneChrome = document.getElementById('paneChrome');

  if (browser === 'firefox') {
    if (btnFirefox) btnFirefox.classList.add('active');
    if (btnChrome) btnChrome.classList.remove('active');
    if (paneFirefox) paneFirefox.classList.add('active');
    if (paneChrome) paneChrome.classList.remove('active');
  } else {
    if (btnChrome) btnChrome.classList.add('active');
    if (btnFirefox) btnFirefox.classList.remove('active');
    if (paneChrome) paneChrome.classList.add('active');
    if (paneFirefox) paneFirefox.classList.remove('active');
  }
}

/* ==========================================================================
   Prepaid Wallet Recharge & Hub Functions
   ========================================================================== */
function switchRechargeTab(tab) {
  const tabRechargeBtn = document.getElementById('tabRechargeBtn');
  const tabBalanceBtn = document.getElementById('tabBalanceBtn');
  const paneRecharge = document.getElementById('paneRecharge');
  const paneBalance = document.getElementById('paneBalance');

  if (tab === 'recharge') {
    if (tabRechargeBtn) tabRechargeBtn.classList.add('active');
    if (tabBalanceBtn) tabBalanceBtn.classList.remove('active');
    if (paneRecharge) paneRecharge.classList.add('active');
    if (paneBalance) paneBalance.classList.remove('active');
  } else {
    if (tabBalanceBtn) tabBalanceBtn.classList.add('active');
    if (tabRechargeBtn) tabRechargeBtn.classList.remove('active');
    if (paneBalance) paneBalance.classList.add('active');
    if (paneRecharge) paneRecharge.classList.remove('active');
  }
}

function setHubAmount(val) {
  const input = document.getElementById('hubRechargeAmount');
  if (input) input.value = val;

  const chips = document.querySelectorAll('#paneRecharge .amount-chip');
  chips.forEach(c => {
    c.classList.remove('active');
    if (c.textContent.replace(/[^\d]/g, '') === String(val)) {
      c.classList.add('active');
    }
  });
}

function setModalAmount(val) {
  const input = document.getElementById('modalRechargeAmount');
  if (input) input.value = val;

  const chips = document.querySelectorAll('#rechargeModal .amount-chip');
  chips.forEach(c => {
    c.classList.remove('active');
    if (c.textContent.replace(/[^\d]/g, '') === String(val)) {
      c.classList.add('active');
    }
  });
}

function openRechargeModal(amount = 500, packTitle = 'Value Pro Pack') {
  const modal = document.getElementById('rechargeModal');
  const title = document.getElementById('modalRechargeTitle');
  const alertBox = document.getElementById('modalRechargeAlert');

  if (title) title.textContent = `⚡ Top-Up: ${packTitle}`;
  if (alertBox) alertBox.style.display = 'none';

  setModalAmount(amount);

  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

function closeRechargeModal() {
  const modal = document.getElementById('rechargeModal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

function openRechargeSuccessModal(amount, phone) {
  const modal = document.getElementById('rechargeSuccessModal');
  const succAmount = document.getElementById('succAmount');
  const succMobile = document.getElementById('succMobile');
  const succCards = document.getElementById('succCards');

  const parsedAmount = parseFloat(amount) || 0;
  const cards = Math.floor(parsedAmount / CARD_FEE);

  if (succAmount) succAmount.textContent = `₹${parsedAmount.toFixed(2)}`;
  if (succMobile) succMobile.textContent = phone || 'N/A';
  if (succCards) succCards.textContent = `~${cards} Cards`;

  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

function closeRechargeSuccessModal() {
  const modal = document.getElementById('rechargeSuccessModal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   Cashfree Gateway Payment Trigger
   ========================================================================== */
async function processCashfreeRecharge(phone, amount, btnElement, alertElement, isModal = false) {
  if (!phone || phone.trim().length < 6) {
    showAlert(alertElement, 'Please enter a valid operator mobile number or wallet ID.', 'error');
    return;
  }

  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount < 10) {
    showAlert(alertElement, 'Minimum wallet recharge amount is ₹10.', 'error');
    return;
  }

  if (btnElement) {
    btnElement.disabled = true;
    btnElement.innerHTML = '<span>⏳ Connecting Secure Payment Gateway...</span>';
  }
  showAlert(alertElement, 'Initializing secure payment transaction...', 'info');

  try {
    const resp = await fetch(`${WALLET_BACKEND_URL}/api/wallet/recharge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_phone: phone.trim(),
        wallet_id: phone.trim(),
        amount: numAmount
      })
    });

    const data = await resp.json();

    if (resp.ok && data.status === 'success') {
      showAlert(alertElement, 'Order created! Opening secure payment...', 'success');

      // Check if Cashfree JS SDK is loaded
      if (data.payment_session_id && typeof Cashfree !== 'undefined') {
        try {
          const cashfree = Cashfree({ mode: "production" });
          cashfree.checkout({
            paymentSessionId: data.payment_session_id,
            redirectTarget: "_modal"
          }).then((result) => {
            if (result.error) {
              showAlert(alertElement, `Payment: ${result.error.message || 'Cancelled'}`, 'error');
            }
            if (result.paymentDetails) {
              if (isModal) closeRechargeModal();
              openRechargeSuccessModal(numAmount, phone);
            }
          });
          return;
        } catch (sdkErr) {
          console.warn("Cashfree SDK modal launch failed, redirecting to checkout:", sdkErr);
        }
      }

      // Fallback redirect to checkout URL
      if (data.checkout_url) {
        window.location.href = data.checkout_url.startsWith('http')
          ? data.checkout_url
          : `${WALLET_BACKEND_URL}${data.checkout_url}`;
        return;
      }

      // If simulated / instant confirm:
      if (isModal) closeRechargeModal();
      openRechargeSuccessModal(numAmount, phone);

    } else {
      const errMsg = data.error || 'Unable to connect to payment gateway. Please check your connection or contact support.';
      showAlert(alertElement, errMsg, 'error');
    }
  } catch (err) {
    console.warn("Wallet recharge network error:", err);
    showAlert(alertElement, 'Server connecting... If using in-extension, please recharge directly in the toolbar popup.', 'error');
  } finally {
    if (btnElement) {
      btnElement.disabled = false;
      btnElement.innerHTML = '<span>🔒 Proceed to Payment</span>';
    }
  }
}

function submitModalRecharge() {
  const phone = document.getElementById('modalWalletId').value;
  const amount = document.getElementById('modalRechargeAmount').value;
  const btn = document.getElementById('btnModalPay');
  const alertBox = document.getElementById('modalRechargeAlert');
  processCashfreeRecharge(phone, amount, btn, alertBox, true);
}

function submitWebsiteWalletRecharge() {
  const phone = document.getElementById('hubCustomerPhone').value;
  const amount = document.getElementById('hubRechargeAmount').value;
  const btn = document.getElementById('btnHubPay');
  const alertBox = document.getElementById('hubRechargeAlert');
  processCashfreeRecharge(phone, amount, btn, alertBox, false);
}

async function checkWebsiteWalletBalance() {
  const phoneInput = document.getElementById('hubCheckPhone');
  const btn = document.getElementById('btnHubCheck');
  const alertBox = document.getElementById('hubBalanceAlert');
  const resultCard = document.getElementById('hubBalanceResult');
  const dispAmount = document.getElementById('dispBalAmount');
  const dispCards = document.getElementById('dispBalCards');

  const phone = phoneInput ? phoneInput.value.trim() : '';
  if (!phone) {
    showAlert(alertBox, 'Please enter your registered mobile number or wallet ID.', 'error');
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span>⏳ Querying Live Wallet...</span>';
  }
  if (resultCard) resultCard.style.display = 'none';
  showAlert(alertBox, 'Fetching real-time wallet balance...', 'info');

  try {
    const resp = await fetch(`${WALLET_BACKEND_URL}/api/wallet/status?wallet_id=${encodeURIComponent(phone)}`);
    const data = await resp.json();

    if (resp.ok && data.status === 'success') {
      alertBox.style.display = 'none';
      if (dispAmount) dispAmount.textContent = data.formatted_balance || `₹${Number(data.balance || 0).toFixed(2)}`;
      if (dispCards) dispCards.textContent = `${data.cards_remaining || 0} cards remaining (@ ₹${data.card_fee || CARD_FEE} / card)`;
      if (resultCard) resultCard.style.display = 'block';
    } else {
      showAlert(alertBox, data.error || 'Wallet not found for this mobile number. You can recharge above to initialize it.', 'error');
    }
  } catch (err) {
    console.warn("Wallet status error:", err);
    showAlert(alertBox, 'Could not query balance at this moment. You can view your balance live anytime inside the browser extension.', 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<span>🔍 Check Live Wallet Balance</span>';
    }
  }
}

function showAlert(element, message, type = 'info') {
  if (!element) return;
  element.style.display = 'block';
  element.className = `recharge-status-alert ${type}`;
  element.textContent = message;
}

/* ==========================================================================
   Clipboard Helpers
   ========================================================================== */
function copyToClipboard(text, btnElement) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showCopyFeedback(btnElement);
    }).catch(() => {
      fallbackCopy(text, btnElement);
    });
  } else {
    fallbackCopy(text, btnElement);
  }
}

function fallbackCopy(text, btnElement) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showCopyFeedback(btnElement);
  } catch (err) {
    console.warn('Fallback copy failed:', err);
  }
  document.body.removeChild(textarea);
}

function showCopyFeedback(btnElement) {
  if (!btnElement) return;
  const originalText = btnElement.textContent;
  btnElement.textContent = 'Copied!';
  btnElement.style.color = '#22C55E';
  setTimeout(() => {
    btnElement.textContent = originalText;
    btnElement.style.color = '';
  }, 2000);
}

/* ==========================================================================
   Contact Form Inquiry Submission
   ========================================================================== */
function handleContactSubmit() {
  const name = document.getElementById('senderName').value.trim();
  const email = document.getElementById('senderEmail').value.trim();
  const toast = document.getElementById('toastMessage');
  const sendBtn = document.getElementById('sendInquiryBtn');

  if (!name || !email) {
    alert('Please enter your name and email address.');
    return;
  }

  if (sendBtn) {
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<span>⏳ Sending Support Message...</span>';
  }

  setTimeout(() => {
    if (toast) {
      toast.style.display = 'block';
    }
    if (sendBtn) {
      sendBtn.disabled = false;
      sendBtn.innerHTML = '<span>📩 Send Support Message</span>';
    }
    document.getElementById('contactForm').reset();
  }, 800);
}

/* ==========================================================================
   Legal Policies Modal Reader
   ========================================================================== */
const POLICIES = {
  terms: {
    title: 'Terms & Conditions',
    content: `
      <h4>1. Agreement to Terms</h4>
      <p>By downloading, installing, or using the AgriStack Card Generator Helper browser extension and its associated prepaid wallet service, you agree to be bound by these Terms and Conditions. If you do not agree, do not install or use the tool.</p>

      <h4>2. Description of Digital Service</h4>
      <p>AgriStack Card Generator Helper is an automated browser productivity extension designed to format and organize publicly available, legally accessible farmer identity records from official Punjab Farmer Registry and AgriStack portals into calibrated 300 DPI print-ready PDF identity cards with verified QR codes.</p>

      <h4>3. Prepaid Wallet & Pay-Per-Card Pricing</h4>
      <p>The browser extension is 100% free to download and install. Usage is billed on a prepaid wallet model at a flat rate of ₹22 per generated card PDF. Users maintain a prepaid balance which is deducted in real-time upon card generation. All transactions are billed in Indian Rupees (INR) and processed via authorized payment aggregators (Cashfree Payments).</p>

      <h4>4. User Responsibilities & Compliance</h4>
      <p>Users must be authorized operators (CSC VLEs, Cyber Cafe operators, or farmers) with legitimate login credentials to the respective state farmer portals. Users agree not to misuse, alter, or falsify any extracted data.</p>
    `
  },
  privacy: {
    title: 'Privacy Policy',
    content: `
      <h4>1. 100% Client-Side In-Browser Processing</h4>
      <p>We prioritize your privacy and data sovereignty. AgriStack Card Generator Helper performs all DOM scanning, data parsing, Gurmukhi HarfBuzz typography shaping, photo rendering, and QR code creation locally inside your browser sandbox.</p>

      <h4>2. No Server Storage of Farmer Data</h4>
      <p>No sensitive personal farmer records (names, Aadhaar details, mobile numbers, land records, or photos) are ever transmitted to or stored on our servers. All identity data remains solely in browser volatile memory.</p>

      <h4>3. Payment Data Security</h4>
      <p>Payment transactions for wallet top-ups are handled exclusively by Cashfree Payments India Pvt Ltd through RBI-compliant, 256-bit SSL encrypted payment channels. We do not store credit/debit card numbers, UPI PINs, or banking credentials.</p>
    `
  },
  refund: {
    title: 'Refund & Cancellation Policy',
    content: `
      <h4>1. Prepaid Wallet Balance Refunds</h4>
      <p>We believe in 100% customer satisfaction. If you recharge your prepaid wallet and decide you no longer wish to use the service, you may request a full refund of your unused, unspent wallet balance within 7 days of the recharge transaction date.</p>

      <h4>2. Per-Card Generation Deductions</h4>
      <p>Fees deducted for successfully generated and downloaded 300 DPI PDF cards (₹22 per card) are non-refundable once the digital PDF file has been downloaded to your computer.</p>

      <h4>3. How to Request a Refund</h4>
      <p>To request a refund for an unspent wallet balance, contact our support team at <strong>igxrry@gmail.com</strong> or via WhatsApp at <strong>+91 70099 80800</strong> with your registered mobile number and transaction receipt.</p>
    `
  },
  shipping: {
    title: 'Shipping & Delivery Policy',
    content: `
      <h4>1. Instant Digital Delivery</h4>
      <p>AgriStack Card Generator Helper is a 100% digital software product. No physical media (CDs, flash drives, or printed cards) are shipped by mail.</p>

      <h4>2. Delivery Timelines</h4>
      <p>Browser extension download packages (.ZIP) and Firefox Add-on installations are available immediately upon request. Wallet balance top-ups are credited to your account instantaneously upon successful bank confirmation from Cashfree Payments.</p>
    `
  }
};

function openPolicyModal(policyKey) {
  const modal = document.getElementById('policyModal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  if (POLICIES[policyKey]) {
    if (title) title.textContent = POLICIES[policyKey].title;
    if (body) body.innerHTML = POLICIES[policyKey].content;
  }

  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

function closePolicyModal() {
  const modal = document.getElementById('policyModal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}
