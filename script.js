/* ==========================================================================
   Farmer ID - Extension Download & Payment Engine
   ========================================================================== */

// Global Plan Definition
const PLANS = {
  'pay-per-card': {
    id: 'pay-per-card',
    cardElementId: 'planSingle',
    name: 'Farmer ID — Pay-Per-Card Plan',
    displayTitle: 'Farmer ID (₹20 / Card Layout)',
    price: '₹20',
    priceDisplay: '₹20 / card',
    numericPrice: 20,
    buttonText: 'Select Pay-Per-Card'
  },
  'lifetime': {
    id: 'lifetime',
    cardElementId: 'planLifetime',
    name: 'Full Extension License',
    displayTitle: 'Full Extension License',
    price: '₹599',
    priceDisplay: '₹599 one-time',
    numericPrice: 599,
    buttonText: 'Download Extension'
  },
  'monthly-pro': {
    id: 'monthly-pro',
    cardElementId: 'planMonthly',
    name: 'Monthly Operator Pack',
    displayTitle: 'Monthly Operator Pack',
    price: '₹99',
    priceDisplay: '₹99 / month',
    numericPrice: 99,
    buttonText: 'Select Monthly Pack'
  }
};

let currentSelectedPlanId = 'pay-per-card';
let lastGeneratedLicenseKey = 'FARMER-ID-PRO-8F29-4D17';
let currentCustomer = {
  name: 'CSC Operator',
  email: 'igxrry@gmail.com',
  phone: '+91 70099 80800',
  orderId: 'FID-' + Math.floor(100000 + Math.random() * 900000)
};

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
        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherBtn = otherItem.querySelector('.faq-question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
          questionBtn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
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
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

        // Close all other items
        legalItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherTrigger = otherItem.querySelector('.legal-accordion-trigger');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current item
        if (isExpanded) {
          item.classList.remove('active');
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // Expand first legal item by default
  if (legalItems.length > 0) {
    legalItems[0].classList.add('active');
    const firstTrigger = legalItems[0].querySelector('.legal-accordion-trigger');
    if (firstTrigger) firstTrigger.setAttribute('aria-expanded', 'true');
  }

  // 5. Policy Read Buttons (Modals)
  const readPolicyBtns = document.querySelectorAll('.legal-read-btn');
  readPolicyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const policyKey = btn.getAttribute('data-policy');
      if (policyKey) openPolicyModal(policyKey);
    });
  });

  // 6. Modal Close Handlers
  const policyModal = document.getElementById('policyModal');
  const policyCloseBtn = document.getElementById('modalCloseBtn');
  if (policyCloseBtn) policyCloseBtn.addEventListener('click', closePolicyModal);
  if (policyModal) {
    policyModal.addEventListener('click', (e) => {
      if (e.target === policyModal) closePolicyModal();
    });
  }

  // Handle ESC key for all modals
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
    const scrollPos = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
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
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showCopySuccess(btnElement);
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
  textArea.select();
  try {
    document.execCommand('copy');
    showCopySuccess(btnElement);
  } catch (err) {
    console.error('Fallback copy failed', err);
  }
  document.body.removeChild(textArea);
}

function showCopySuccess(btnElement) {
  if (!btnElement) return;
  const originalText = btnElement.textContent;
  btnElement.textContent = '✓ Copied!';
  btnElement.classList.add('copied');
  setTimeout(() => {
    btnElement.textContent = originalText;
    btnElement.classList.remove('copied');
  }, 2000);
}

/* ==========================================================================
   Installation Tab Switcher
   ========================================================================== */
function switchInstallTab(tabName) {
  const tabFirefox = document.getElementById('tabBtnFirefox');
  const tabChrome = document.getElementById('tabBtnChrome');
  const paneFirefox = document.getElementById('paneFirefox');
  const paneChrome = document.getElementById('paneChrome');

  if (tabName === 'firefox') {
    if (tabFirefox) tabFirefox.classList.add('active');
    if (tabChrome) tabChrome.classList.remove('active');
    if (paneFirefox) paneFirefox.classList.add('active');
    if (paneChrome) paneChrome.classList.remove('active');
  } else {
    if (tabChrome) tabChrome.classList.add('active');
    if (tabFirefox) tabFirefox.classList.remove('active');
    if (paneChrome) paneChrome.classList.add('active');
    if (paneFirefox) paneFirefox.classList.remove('active');
  }
}

/* ==========================================================================
   Contact Form Handler
   ========================================================================== */
function handleContactSubmit() {
  const sendBtn = document.getElementById('sendInquiryBtn');
  const toast = document.getElementById('toastMessage');

  if (sendBtn) {
    sendBtn.disabled = true;
    sendBtn.textContent = '⏳ Sending Message...';
  }

  setTimeout(() => {
    if (sendBtn) {
      sendBtn.disabled = false;
      sendBtn.textContent = 'Send Support Message';
    }
    if (toast) {
      toast.style.display = 'block';
      setTimeout(() => {
        toast.style.display = 'none';
      }, 7000);
    }
    document.getElementById('contactForm').reset();
  }, 600);
}

/* ==========================================================================
   Legal Policies Modal Content & Management
   ========================================================================== */
const policyContents = {
  terms: {
    title: 'Terms & Conditions (Digital Software License Agreement)',
    content: `
      <h4>1. Overview & Agreement</h4>
      <p><strong>Farmer ID</strong> ("Software", "Extension") is owned and operated by <strong>GURINDER SINGH</strong> (Individual Proprietor), located at Bathinda, Punjab, India. By installing, downloading, or purchasing credits for Farmer ID, you agree to abide by these Terms and Conditions.</p>
      
      <h4>2. Grant of License</h4>
      <p>We grant you a non-exclusive, non-transferable, revocable license to use the Farmer ID software for formatting print-ready PDF card documents and layout generation.</p>
      
      <h4>3. Independent Software Utility Disclaimer</h4>
      <p>Farmer ID is an independent productivity software utility. It is <strong>NOT affiliated with, sponsored by, or endorsed by any government entity or department</strong>. The software does NOT issue legal identities or government certifications; it functions solely as a client-side layout, typography, and high-resolution PDF print formatting assistant for print shop and cyber cafe operators.</p>

      <h4>4. User Responsibilities & Acceptable Use</h4>
      <ul>
        <li>You agree to process only legitimate records and documents you are authorized to format and print.</li>
        <li>You shall not use the software for fraudulent, misleading, or unauthorized alteration of documents.</li>
        <li>You shall not reverse-engineer, decompile, or attempt to circumvent software mechanisms.</li>
      </ul>
      
      <h4>5. Pricing & Payments</h4>
      <p>All prices are clearly stated in Indian Rupees (INR ₹) at ₹20 per card layout before checkout with zero hidden fees. Payment processing is secured via Razorpay.</p>
      
      <h4>6. Governing Law & Jurisdiction</h4>
      <p>These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the competent courts in Bathinda, Punjab, India.</p>
    `
  },
  privacy: {
    title: 'Privacy Policy (100% Client-Side Local Processing)',
    content: `
      <h4>1. Local Client-Side Processing</h4>
      <p>Your privacy and data security are paramount. All text parsing, Indic Gurmukhi text shaping, and 300 DPI PDF card compilations occur <strong>100% inside your local browser sandbox</strong>. No user personal records, photos, or documents are uploaded, stored, or transferred to remote servers.</p>
      
      <h4>2. Razorpay Payment Security</h4>
      <p>Payments are conducted directly via <strong>Razorpay</strong> (PCI-DSS Level 1 Compliant). We never see or store your payment card numbers, CVVs, Netbanking credentials, or UPI PINs.</p>
      
      <h4>3. Transaction Data Collected</h4>
      <ul>
        <li>Razorpay Order ID & Payment ID for transaction verification, license validation, and refund processing.</li>
        <li>Customer support email and contact number for sending digital receipts and answering technical inquiries.</li>
      </ul>
      
      <h4>4. Contact Regarding Privacy</h4>
      <p>If you have any questions or data concerns, email GURINDER SINGH at <a href="mailto:igxrry@gmail.com">igxrry@gmail.com</a> or WhatsApp <a href="tel:+917009980800">+91 70099 80800</a>.</p>
    `
  },
  refund: {
    title: 'Refund & Cancellation Policy (7-Day SLA)',
    content: `
      <h4>1. Digital Software Goods</h4>
      <p>Farmer ID is a digital software tool providing instant access and PDF layout generation upon payment.</p>
      
      <h4>2. 7-Day Refund Eligibility</h4>
      <ul>
        <li>If the software fails to generate the formatted PDF card due to verified technical defects.</li>
        <li>If you were charged multiple times due to a banking network timeout.</li>
      </ul>
      
      <h4>3. Refund Request Process</h4>
      <p>Send an email to <strong>igxrry@gmail.com</strong> or WhatsApp <strong>+91 70099 80800</strong> with:</p>
      <ul>
        <li>Your Razorpay Payment ID or Order ID</li>
        <li>A brief description of the issue encountered</li>
      </ul>
      
      <h4>4. Turnaround Time</h4>
      <p>Refund requests are verified within 24–48 hours. Upon approval, funds are credited back to your original payment source (Bank / UPI / Card) within <strong>5–7 business days</strong> as per banking network standards.</p>
    `
  },
  shipping: {
    title: 'Shipping & Delivery Policy (Instant Digital Delivery)',
    content: `
      <h4>1. Nature of Product — Digital Delivery Only</h4>
      <p><strong>Explicit Declaration:</strong> Farmer ID (operated by GURINDER SINGH) is 100% digital software. No physical goods or packages are shipped to your postal address.</p>
      
      <h4>2. Delivery Method & Timeline</h4>
      <ul>
        <li><strong>Generated Card PDF:</strong> Download is triggered instantly in your browser within <strong>0–60 seconds</strong> of successful payment confirmation.</li>
        <li><strong>Receipts:</strong> Delivered instantly on screen and emailed to the user's provided email address.</li>
      </ul>
      
      <h4>3. Delivery Charges</h4>
      <p>₹0.00 (Free instant digital electronic delivery).</p>
      
      <h4>4. Non-Delivery Support</h4>
      <p>If your browser blocked the automatic download, reach out via WhatsApp at <strong>+91 70099 80800</strong> or email <strong>igxrry@gmail.com</strong> for immediate support.</p>
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
