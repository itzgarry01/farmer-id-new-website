/* ==========================================================================
   AgriStack Card Helper & Digital Prepaid Wallet — Modern Core Scripts
   Features: 3D Card Flip, Interactive Simulator, Tab Switcher, Policy Modals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Year
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 2. 3D Card Flip Handler
  const cardFlipper = document.getElementById('cardFlipper');
  const card3D = document.getElementById('card3D');
  const flipCardBtn = document.getElementById('flipCardBtn');

  if (card3D) {
    const flipCard = (e) => {
      // Prevent double trigger if clicking child
      card3D.classList.toggle('is-flipped');
    };

    if (cardFlipper) cardFlipper.addEventListener('click', flipCard);
    if (flipCardBtn) flipCardBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      flipCard();
    });
  }

  // 3. Live Card Simulator
  initSimulator();

  // 4. Installation Guide Tab Switcher
  initInstallTabs();

  // 5. Mobile Navigation Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
      }
    });
  }

  // 6. Close Modal on Escape Key or Outside Click
  const policyModal = document.getElementById('policyModal');
  if (policyModal) {
    policyModal.addEventListener('click', (e) => {
      if (e.target === policyModal) {
        closePolicyModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && policyModal.classList.contains('open')) {
        closePolicyModal();
      }
    });
  }
});

/* ==========================================================================
   Interactive Simulator
   ========================================================================== */
function initSimulator() {
  const simNameEn = document.getElementById('simNameEn');
  const simNamePb = document.getElementById('simNamePb');
  const simFarmerId = document.getElementById('simFarmerId');
  const simVillage = document.getElementById('simVillage');

  const previewCardName = document.getElementById('previewCardName');
  const previewCardNamePb = document.getElementById('previewCardNamePb');
  const previewCardId = document.getElementById('previewCardId');
  const previewCardVillage = document.getElementById('previewCardVillage');
  const simDisplayPb = document.getElementById('simDisplayPb');

  if (simNameEn && previewCardName) {
    simNameEn.addEventListener('input', (e) => {
      previewCardName.textContent = e.target.value.trim() || 'Harpreet Singh';
    });
  }

  if (simNamePb && previewCardNamePb) {
    simNamePb.addEventListener('input', (e) => {
      const val = e.target.value.trim() || 'ਹਰਪ੍ਰੀਤ ਸਿੰਘ';
      previewCardNamePb.textContent = val;
      if (simDisplayPb) simDisplayPb.textContent = val;
    });
  }

  if (simFarmerId && previewCardId) {
    simFarmerId.addEventListener('input', (e) => {
      previewCardId.textContent = e.target.value.trim() || 'PB-FR-2024-884920';
    });
  }

  if (simVillage && previewCardVillage) {
    simVillage.addEventListener('input', (e) => {
      previewCardVillage.textContent = e.target.value.trim() || 'Kothe Guru, Bathinda';
    });
  }
}

/* ==========================================================================
   Installation Guide Tabs
   ========================================================================== */
function initInstallTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-tab');

      // Update button active state
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update tab contents
      tabContents.forEach(content => {
        if (content.id === targetTabId) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
    });
  });
}

/* ==========================================================================
   FAQ & Accordion Handlers
   ========================================================================== */
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  if (item) {
    item.classList.toggle('active');
  }
}

function toggleAccordion(headerBtn) {
  const isExpanded = headerBtn.getAttribute('aria-expanded') === 'true';
  const body = headerBtn.nextElementSibling;

  headerBtn.setAttribute('aria-expanded', !isExpanded);
  if (body) {
    body.classList.toggle('open', !isExpanded);
  }
}

/* ==========================================================================
   Policy Modal Reader
   ========================================================================== */
const POLICY_DATA = {
  terms: {
    title: 'Terms & Conditions (Digital Software License Agreement)',
    content: `
      <h4>1. Overview & Legal Entity</h4>
      <p>AgriStack Card Generator Helper ("Software", "Extension") is owned and operated by <strong>GURINDER SINGH</strong> (Individual Proprietor), located at Bathinda, Punjab, India - 151001. By installing, accessing, or purchasing prepaid wallet credits for AgriStack Card Generator Helper, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the extension.</p>

      <h4>2. Digital Software License</h4>
      <p>We grant you a non-exclusive, non-transferable, revocable license to use the AgriStack Card Generator Helper solely for formatting and generating farmer identity card documents from authorized government agricultural registries (such as Punjab Farmer Registry).</p>

      <h4>3. Permitted Use & Operator Responsibilities</h4>
      <p>You agree to use this software only on records and data you are authorized to view and print. You shall not use the software for fraudulent, misleading, or unauthorized alteration of government identity records. The software acts as a layout formatting utility; it does not issue legal identities. Verification of underlying record authenticity remains with the issuing government authority.</p>

      <h4>4. Pricing & Payments</h4>
      <p>Payments for digital license access and prepaid wallet recharges are processed securely in Indian Rupees (INR) at ₹22 per card with zero hidden fees.</p>

      <h4>5. Governing Law & Jurisdiction</h4>
      <p>The software is provided "as is". These terms are governed by the laws of India, under the jurisdiction of competent courts in Bathinda, Punjab, India.</p>
    `
  },
  privacy: {
    title: 'Privacy Policy (100% Client-Side Sandbox Security)',
    content: `
      <h4>1. Client-Side Local Sandbox Processing</h4>
      <p>We take user and farmer privacy with utmost seriousness. All farmer registry details, names, photographs, and land record parameters parsed by the extension are processed <strong>100% locally in your own machine / browser sandbox</strong>. We do not store, copy, upload, or sell any applicant or farmer personal data to remote servers.</p>

      <h4>2. Payment Information Security</h4>
      <p>All payment transactions for wallet top-ups are conducted directly through authorized, PCI-DSS Level 1 compliant payment gateways (Cashfree Payments & Razorpay). We do not collect, store, or have access to your credit/debit card numbers, UPI PINs, CVVs, or Netbanking passwords.</p>

      <h4>3. Data Collected for Operational Integrity</h4>
      <p>We only store transaction identifiers (Payment ID, Order ID, and Wallet Balance) to ensure your prepaid credits are maintained securely and reliably across browser restarts.</p>

      <h4>4. Contact Regarding Privacy</h4>
      <p>If you have any privacy questions, email GURINDER SINGH at <a href="mailto:igxrry@gmail.com">igxrry@gmail.com</a> or WhatsApp <a href="tel:+917009980800">+91 70099 80800</a>.</p>
    `
  },
  refund: {
    title: 'Refund & Cancellation Policy (7-Day Digital Goods SLA)',
    content: `
      <h4>1. Digital Goods & Services Policy</h4>
      <p>Since AgriStack Card Generator Helper is a digital software tool providing instant wallet balance and card generation upon payment, standard physical return processes do not apply.</p>

      <h4>2. 7-Day Refund Guarantee</h4>
      <p>If the extension fails to format your card due to technical defects, portal layout mismatches, or duplicate payment deductions, you can raise a full refund request within <strong>7 days</strong> of the transaction.</p>

      <h4>3. How to Request a Refund</h4>
      <p>To initiate a refund, please send an email to <a href="mailto:igxrry@gmail.com">igxrry@gmail.com</a> or WhatsApp <a href="tel:+917009980800">+91 70099 80800</a> with the subject <em>"Refund Request - [Your Payment ID]"</em> along with a brief description of the issue encountered.</p>

      <h4>4. Processing & Turnaround Time</h4>
      <p>Refund requests are verified within 24–48 hours. Once approved, the refunded amount is credited back to your original payment method (Bank Account, UPI, or Card) within <strong>5–7 business days</strong> as per banking network standards.</p>
    `
  },
  shipping: {
    title: 'Shipping & Delivery Policy (Instant Digital Delivery)',
    content: `
      <h4>1. Purely Digital Software Product</h4>
      <p>AgriStack Card Generator Helper (operated by GURINDER SINGH) is an electronic digital software product. No physical goods or packages are shipped to your postal address.</p>

      <h4>2. Instant Electronic Delivery Mechanism</h4>
      <p>The generated print-ready 300 DPI PDF file is compiled and triggered for immediate download in your web browser within seconds. Wallet balance recharges are credited instantly upon payment confirmation.</p>

      <h4>3. Delivery Timeline & Shipping Fees</h4>
      <p><strong>Timeline:</strong> Instantaneous (0 to 60 seconds post-transaction).<br>
      <strong>Shipping Charges:</strong> ₹0.00 (Free digital electronic delivery).<br>
      <strong>Support Contact:</strong> <a href="mailto:igxrry@gmail.com">igxrry@gmail.com</a> | <a href="tel:+917009980800">+91 70099 80800</a>.</p>
    `
  }
};

function openPolicyModal(policyKey) {
  const policy = POLICY_DATA[policyKey];
  if (!policy) return;

  const modal = document.getElementById('policyModal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  if (modal && title && body) {
    title.textContent = policy.title;
    body.innerHTML = policy.content;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

function closePolicyModal() {
  const modal = document.getElementById('policyModal');
  if (modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   Utility Helpers
   ========================================================================== */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Copied to clipboard: ' + text);
  }).catch(() => {
    prompt('Copy to clipboard:', text);
  });
}

function handleContactSubmit(e) {
  e.preventDefault();
  const toast = document.getElementById('toastMessage');
  const form = document.getElementById('contactForm');

  if (toast) {
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 6000);
  }

  if (form) {
    form.reset();
  }
}
