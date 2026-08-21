/* ==========================================================================
   AgriStack Card Helper - Landing Page & Documentation Scripts
   ========================================================================== */

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

  // 6. Policy Modal Close Handlers
  const policyModal = document.getElementById('policyModal');
  if (policyModal) {
    policyModal.addEventListener('click', (e) => {
      if (e.target === policyModal) closePolicyModal();
    });
  }

  // Handle ESC key for modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePolicyModal();
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
   Clipboard Copy Helper
   ========================================================================== */
function copyToClipboard(text, btnElement) {
  if (navigator.clipboard && window.isSecureContext) {
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
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showCopyFeedback(btnElement);
  } catch (err) {
    alert('Copied: ' + text);
  }
  document.body.removeChild(textArea);
}

function showCopyFeedback(btnElement) {
  if (!btnElement) return;
  const originalText = btnElement.textContent;
  btnElement.textContent = 'Copied!';
  btnElement.style.color = '#166536';
  setTimeout(() => {
    btnElement.textContent = originalText;
    btnElement.style.color = '';
  }, 2000);
}

/* ==========================================================================
   Contact Form Inquiry Submission
   ========================================================================== */
function handleContactSubmit() {
  const nameInput = document.getElementById('senderName');
  const emailInput = document.getElementById('senderEmail');
  const toast = document.getElementById('toastMessage');
  const sendBtn = document.getElementById('sendInquiryBtn');

  if (!nameInput || !emailInput) return;

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  if (!name || !email) {
    alert('Please enter your name and email address.');
    return;
  }

  if (sendBtn) {
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<span>⏳ Submitting...</span>';
  }

  setTimeout(() => {
    if (sendBtn) {
      sendBtn.disabled = false;
      sendBtn.innerHTML = '<span>📩 Send Support Message</span>';
    }
    if (toast) {
      toast.style.display = 'block';
      toast.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(() => {
        toast.style.display = 'none';
      }, 7000);
    }
    const form = document.getElementById('contactForm');
    if (form) form.reset();
  }, 600);
}

/* ==========================================================================
   Policy Modal Overlay Reader
   ========================================================================== */
const policyContents = {
  terms: {
    title: 'Terms & Conditions (Software Agreement)',
    content: `
      <h4>1. Overview & Legal Entity</h4>
      <p>AgriStack Card Generator Helper is operated by <strong>GURINDER SINGH</strong> (Individual Proprietor), Bathinda, Punjab, India. This software provides automated browser formatting tools for Punjab Farmer Registry and AgriStack operators. The extension is free to install, and card formatting generations are priced at <strong>₹20 per card</strong> inside the extension.</p>
      
      <h4>2. Grant of License & Usage</h4>
      <p>We grant you a non-exclusive, non-transferable license to format farmer identity cards from authorized Punjab Farmer Registry / AgriStack portal records.</p>
      
      <h4>3. User Responsibilities & Acceptable Use</h4>
      <ul>
        <li>You agree to process only legitimate records you have authorization to format.</li>
        <li>You shall not reverse-engineer, decompile, or attempt to alter official records illegally.</li>
        <li>This software is a layout and formatting assistant. Official legal identity validity remains solely with the issuing government authority.</li>
      </ul>
      
      <h4>4. Pricing & Payments</h4>
      <p>The extension is free to download. Card formatting generations inside the extension are charged at ₹20 per card in Indian Rupees (INR ₹) with zero hidden fees.</p>
      
      <h4>5. Governing Law & Jurisdiction</h4>
      <p>These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the competent courts in Bathinda, Punjab, India.</p>
    `
  },
  privacy: {
    title: 'Privacy Policy (100% Client-Side Private Processing)',
    content: `
      <h4>1. Local Client-Side Processing</h4>
      <p>Your privacy and citizen record security are paramount. All registry parsing, Gurmukhi text shaping, and 300 DPI PDF card compilations occur <strong>100% inside your local browser sandbox</strong>. No farmer identity records or photos are uploaded, stored, or transferred to remote servers.</p>
      
      <h4>2. Payment Security</h4>
      <p>In-extension payments are conducted directly via authorized, PCI-DSS Level 1 compliant payment gateways. We never see or store your payment card numbers, CVVs, netbanking credentials, or UPI PINs.</p>
      
      <h4>3. Data Collected</h4>
      <ul>
        <li>Transaction reference IDs for card generation confirmation and receipts.</li>
        <li>Support contact information (email/phone) provided when requesting assistance.</li>
      </ul>
      
      <h4>4. Contact Regarding Privacy</h4>
      <p>If you have any questions, email GURINDER SINGH at <a href="mailto:igxrry@gmail.com">igxrry@gmail.com</a> or WhatsApp <a href="tel:+917009980800">+91 70099 80800</a>.</p>
    `
  },
  refund: {
    title: 'Refund & Cancellation Policy (7-Day SLA)',
    content: `
      <h4>1. Digital Services & Generation Credits</h4>
      <p>AgriStack Card Generator Helper formats cards digitally. PDFs download instantly upon in-extension generation.</p>
      
      <h4>2. 7-Day Refund Eligibility</h4>
      <ul>
        <li>If a card generation fails due to verified extension layout errors.</li>
        <li>If a payment was charged multiple times due to a banking network timeout.</li>
      </ul>
      
      <h4>3. How to Request a Refund</h4>
      <p>Send an email to <strong>igxrry@gmail.com</strong> or WhatsApp <strong>+91 70099 80800</strong> with your payment reference / transaction details.</p>
      
      <h4>4. Turnaround Time</h4>
      <p>Refund requests are reviewed within 24 business hours. Approved refunds are credited back to your original payment method (Bank / UPI / Card) within <strong>5–7 business days</strong>.</p>
    `
  },
  shipping: {
    title: 'Shipping & Delivery Policy (Instant Digital Delivery)',
    content: `
      <h4>1. Digital Delivery Only</h4>
      <p><strong>Explicit Declaration:</strong> AgriStack Card Generator Helper (operated by GURINDER SINGH) provides digital software and PDF generation tools. No physical goods or packages are shipped to your postal address.</p>
      
      <h4>2. Delivery Method & Timeline</h4>
      <ul>
        <li><strong>Extension ZIP & Firefox Add-on:</strong> Available for instant, free direct download on our website and Mozilla Add-on store.</li>
        <li><strong>Generated Card PDF:</strong> Download starts automatically in your browser within seconds of generation confirmation.</li>
      </ul>
      
      <h4>3. Delivery Charges</h4>
      <p>₹0.00 (Free digital delivery).</p>
      
      <h4>4. Support</h4>
      <p>For any download or installation queries, contact WhatsApp support at <strong>+91 70099 80800</strong> or email <strong>igxrry@gmail.com</strong>.</p>
    `
  }
};

function openPolicyModal(policyKey) {
  const policy = policyContents[policyKey];
  if (!policy) return;

  const modal = document.getElementById('policyModal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  if (modal && title && body) {
    title.textContent = policy.title;
    body.innerHTML = policy.content;
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

/* ==========================================================================
   Installation Guide Tab Switcher
   ========================================================================== */
function switchInstallTab(browserKey) {
  const tabFirefox = document.getElementById('tabBtnFirefox');
  const tabChrome = document.getElementById('tabBtnChrome');
  const paneFirefox = document.getElementById('paneFirefox');
  const paneChrome = document.getElementById('paneChrome');

  if (browserKey === 'firefox') {
    if (tabFirefox) tabFirefox.classList.add('active', 'firefox-tab');
    if (tabChrome) tabChrome.classList.remove('active');
    if (paneFirefox) paneFirefox.classList.add('active');
    if (paneChrome) paneChrome.classList.remove('active');
  } else {
    if (tabChrome) tabChrome.classList.add('active');
    if (tabFirefox) tabFirefox.classList.remove('active', 'firefox-tab');
    if (paneChrome) paneChrome.classList.add('active');
    if (paneFirefox) paneFirefox.classList.remove('active');
  }
}
