/* ==========================================================================
   AgriStack Card Helper - Interactive Landing Page & Plan Selection Scripts
   ========================================================================== */

// Global Plan Definition
const PLANS = {
  'pay-per-card': {
    id: 'pay-per-card',
    cardElementId: 'planSingle',
    name: 'Pay-Per-Card',
    displayTitle: 'Pay-Per-Card (Single Generation)',
    price: '₹10',
    priceDisplay: '₹10 / card',
    numericPrice: 10,
    buttonText: 'Select Pay-Per-Card'
  },
  'monthly-pro': {
    id: 'monthly-pro',
    cardElementId: 'planMonthly',
    name: 'Monthly Pro',
    displayTitle: 'Monthly Pro (Unlimited Access)',
    price: '₹99',
    priceDisplay: '₹99 / month',
    numericPrice: 99,
    buttonText: 'Select Monthly Pro'
  },
  'lifetime': {
    id: 'lifetime',
    cardElementId: 'planLifetime',
    name: 'Lifetime License',
    displayTitle: 'Lifetime License (Permanent Access)',
    price: '₹499',
    priceDisplay: '₹499 one-time',
    numericPrice: 499,
    buttonText: 'Select Lifetime License'
  },
  'custom': {
    id: 'custom',
    cardElementId: 'planMonthly',
    name: 'Custom Bulk Pack',
    displayTitle: 'Custom Bulk Pack (Multi-Center)',
    price: 'Custom',
    priceDisplay: 'Contact Us',
    numericPrice: 0,
    buttonText: 'Inquire Custom Pack'
  }
};

let currentSelectedPlanId = 'monthly-pro';

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

  // 3. Plan Selection System
  initPlanSelection();

  // 4. Plan Category Filter Tabs
  initPlanFilterTabs();

  // 5. FAQ Accordion
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

  // 6. Legal Policies Accordion
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

  // 7. Policy Read Buttons (Modals)
  const readPolicyBtns = document.querySelectorAll('.legal-read-btn');
  readPolicyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const policyId = btn.getAttribute('data-policy');
      openPolicyModal(policyId);
    });
  });

  // 8. Modal Close Handlers
  const policyModal = document.getElementById('policyModal');
  const policyCloseBtn = document.getElementById('modalCloseBtn');
  if (policyCloseBtn) policyCloseBtn.addEventListener('click', closePolicyModal);
  if (policyModal) {
    policyModal.addEventListener('click', (e) => {
      if (e.target === policyModal) closePolicyModal();
    });
  }

  const checkoutModal = document.getElementById('checkoutModal');
  const checkoutCloseBtn = document.getElementById('checkoutModalCloseBtn');
  if (checkoutCloseBtn) checkoutCloseBtn.addEventListener('click', closeCheckoutModal);
  if (checkoutModal) {
    checkoutModal.addEventListener('click', (e) => {
      if (e.target === checkoutModal) closeCheckoutModal();
    });
  }

  const openCheckoutBtn = document.getElementById('openCheckoutModalBtn');
  if (openCheckoutBtn) {
    openCheckoutBtn.addEventListener('click', openCheckoutModal);
  }

  // Handle ESC key for all modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePolicyModal();
      closeCheckoutModal();
    }
  });

  // 9. Copy to Clipboard Buttons
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        copyToClipboard(textToCopy, btn);
      }
    });
  });

  // 10. Active Nav Link Highlighting on Scroll
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
   Plan Selection & 2-Way Synchronization Logic
   ========================================================================== */
function initPlanSelection() {
  const pricingCards = document.querySelectorAll('.pricing-card');
  const formPlanSelect = document.getElementById('selectedPlan');

  // Click on Pricing Card or its Button
  pricingCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const planId = card.getAttribute('data-plan-id');
      if (planId) {
        selectPlan(planId);

        // If clicked on the button or card, smoothly scroll to contact section
        if (e.target.closest('.plan-action-btn') || e.target.closest('.pricing-card')) {
          const contactSec = document.getElementById('contact');
          if (contactSec) {
            contactSec.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    });

    // Keyboard accessibility for selecting plans via Enter / Space
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const planId = card.getAttribute('data-plan-id');
        if (planId) {
          selectPlan(planId);
          const contactSec = document.getElementById('contact');
          if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Form Select Dropdown Change -> Sync with Pricing Cards
  if (formPlanSelect) {
    formPlanSelect.addEventListener('change', (e) => {
      selectPlan(e.target.value, false);
    });
  }

  // Initialize with default plan
  selectPlan(currentSelectedPlanId, true);
}

function selectPlan(planId, updateDropdown = true) {
  if (!PLANS[planId]) planId = 'monthly-pro';
  currentSelectedPlanId = planId;
  const planData = PLANS[planId];

  // 1. Update Pricing Cards UI
  const pricingCards = document.querySelectorAll('.pricing-card');
  pricingCards.forEach(card => {
    const cardPlanId = card.getAttribute('data-plan-id');
    const actionBtn = card.querySelector('.plan-action-btn span');

    if (cardPlanId === planId) {
      card.classList.add('selected');
      card.setAttribute('aria-selected', 'true');
      if (actionBtn) {
        actionBtn.textContent = '✓ Selected Plan (Proceed)';
      }
    } else {
      card.classList.remove('selected');
      card.setAttribute('aria-selected', 'false');
      if (actionBtn) {
        const fallbackText = cardPlanId === 'pay-per-card' ? 'Select Pay-Per-Card' :
                             cardPlanId === 'lifetime' ? 'Select Lifetime License' : 'Select Monthly Pro';
        actionBtn.textContent = fallbackText;
      }
    }
  });

  // 2. Update Dynamic Order Summary Banner in Form
  const displayTitle = document.getElementById('selectedPlanDisplayTitle');
  const displayPrice = document.getElementById('selectedPlanDisplayPrice');
  const toastPlanName = document.getElementById('toastPlanName');
  const messageBox = document.getElementById('senderMessage');

  if (displayTitle) displayTitle.textContent = planData.displayTitle;
  if (displayPrice) displayPrice.textContent = planData.priceDisplay;
  if (toastPlanName) toastPlanName.textContent = planData.name;

  if (messageBox && (!messageBox.value || messageBox.value.startsWith('I would like to activate'))) {
    messageBox.value = `I would like to activate ${planData.name} (${planData.priceDisplay}) for my center.`;
  }

  // 3. Update Dropdown if triggered from card click
  const formPlanSelect = document.getElementById('selectedPlan');
  if (updateDropdown && formPlanSelect && formPlanSelect.value !== planId) {
    formPlanSelect.value = planId;
  }

  // 4. Update Modal Info
  const modalName = document.getElementById('modalCheckoutPlanName');
  const modalPrice = document.getElementById('modalCheckoutPlanPrice');
  if (modalName) modalName.textContent = planData.displayTitle;
  if (modalPrice) modalPrice.textContent = planData.price;
}

/* ==========================================================================
   Plan Filter Tabs
   ========================================================================== */
function initPlanFilterTabs() {
  const filterBtns = document.querySelectorAll('.plan-filter-btn');
  const pricingCards = document.querySelectorAll('.pricing-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      pricingCards.forEach(card => {
        const cardPlanId = card.getAttribute('data-plan-id');
        if (filter === 'all' || cardPlanId === filter) {
          card.style.display = 'flex';
          if (filter !== 'all') {
            selectPlan(filter);
          }
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

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
   Contact Form Submission Handler
   ========================================================================== */
function handleContactSubmit() {
  const name = document.getElementById('senderName').value.trim();
  const email = document.getElementById('senderEmail').value.trim();
  const phone = document.getElementById('senderPhone').value.trim();
  const plan = document.getElementById('selectedPlan').value;
  const message = document.getElementById('senderMessage').value.trim();
  const toast = document.getElementById('toastMessage');
  const sendBtn = document.getElementById('sendInquiryBtn');

  if (!name || !email) {
    alert('Please provide your name and email.');
    return;
  }

  if (sendBtn) {
    sendBtn.disabled = true;
    sendBtn.textContent = 'Submitting...';
  }

  setTimeout(() => {
    if (sendBtn) {
      sendBtn.disabled = false;
      sendBtn.textContent = 'Send Inquiry';
    }
    if (toast) {
      toast.style.display = 'block';
      toast.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(() => {
        toast.style.display = 'none';
      }, 7000);
    }
    document.getElementById('contactForm').reset();
    selectPlan(currentSelectedPlanId, true);
  }, 600);
}

/* ==========================================================================
   Policy Modal Overlay Reader
   ========================================================================== */
const policyContents = {
  terms: {
    title: 'Terms & Conditions (Digital Software License Agreement)',
    content: `
      <h4>1. Overview & Agreement</h4>
      <p>By purchasing a subscription, single-use token, or downloading <strong>AgriStack Card Generator Helper</strong> ("Software"), you agree to abide by these Terms and Conditions. This software is operated independently to provide productivity formatting tools for operators and farmers.</p>
      
      <h4>2. Grant of License</h4>
      <p>We grant you a non-exclusive, non-transferable, revocable software license to format farmer identity cards from authorized Punjab Farmer Registry / AgriStack portal records.</p>
      
      <h4>3. User Responsibilities & Acceptable Use</h4>
      <ul>
        <li>You agree to process only legitimate records you have authorization to format.</li>
        <li>You shall not reverse-engineer, decompile, or attempt to circumvent digital licensing mechanisms.</li>
        <li>This software is a layout and formatting assistant. Official legal identity validity remains solely with the issuing government authority.</li>
      </ul>
      
      <h4>4. Pricing & Payments</h4>
      <p>All prices are clearly stated in Indian Rupees (INR ₹). Payment processing is secured via Razorpay.</p>
      
      <h4>5. Governing Law & Jurisdiction</h4>
      <p>These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the competent courts in Punjab, India.</p>
    `
  },
  privacy: {
    title: 'Privacy Policy (100% Client-Side Private Processing)',
    content: `
      <h4>1. Local Client-Side Processing</h4>
      <p>Your privacy and the security of citizen records are paramount. All registry scraping, image extraction, and PDF compilation are executed <strong>100% inside your local browser sandbox</strong>. No farmer identity data or photo is uploaded, stored, or sold to our servers or any third-party brokers.</p>
      
      <h4>2. Razorpay Payment Security</h4>
      <p>Payments are conducted directly via <strong>Razorpay</strong> (PCI-DSS Level 1 Compliant). We never see or store your payment card numbers, CVVs, netbanking credentials, or UPI PINs.</p>
      
      <h4>3. Transaction Data Collected</h4>
      <ul>
        <li>Razorpay Order ID & Payment ID for transaction verification and license generation.</li>
        <li>User support email for sending digital receipts and answering inquiries.</li>
      </ul>
      
      <h4>4. Data Rights & Inquiries</h4>
      <p>If you have any questions or wish to request deletion of your order records, email us at <a href="mailto:itzgarry01@gmail.com">itzgarry01@gmail.com</a>.</p>
    `
  },
  refund: {
    title: 'Refund & Cancellation Policy (7-Day SLA)',
    content: `
      <h4>1. Digital Software Goods</h4>
      <p>AgriStack Card Generator Helper is a digital software product. Access and output are delivered instantly upon payment.</p>
      
      <h4>2. 7-Day Refund Eligibility</h4>
      <ul>
        <li>If a technical failure prevents your card from generating or downloading properly.</li>
        <li>If you were charged twice due to bank or network timeout issues.</li>
      </ul>
      
      <h4>3. Refund Request Process</h4>
      <p>Send an email to <strong>itzgarry01@gmail.com</strong> with:</p>
      <ul>
        <li>Your Razorpay Payment ID or Order ID</li>
        <li>Screenshot / description of the issue</li>
      </ul>
      
      <h4>4. Turnaround Time</h4>
      <p>Refunds are reviewed within 24 hours. Upon approval, funds are credited back to your original payment source (Bank / Card / UPI) within <strong>5–7 business days</strong>.</p>
    `
  },
  shipping: {
    title: 'Shipping & Delivery Policy (Instant Digital Delivery)',
    content: `
      <h4>1. Nature of Product — Digital Delivery Only</h4>
      <p><strong>Explicit Declaration:</strong> AgriStack Card Generator Helper is 100% digital software. No physical goods or packages will be shipped to your postal address.</p>
      
      <h4>2. Delivery Method & Timeline</h4>
      <ul>
        <li><strong>Generated Card PDF:</strong> Download starts automatically in your browser within <strong>0–60 seconds</strong> of successful Razorpay payment verification.</li>
        <li><strong>License Keys & Receipts:</strong> Delivered instantly via on-screen prompt and confirmation email.</li>
      </ul>
      
      <h4>3. Delivery Charges</h4>
      <p>There are no delivery or shipping fees (₹0.00 Delivery Fee).</p>
      
      <h4>4. Non-Delivery Support</h4>
      <p>If your download did not trigger automatically due to popup blocker settings, contact support at <strong>itzgarry01@gmail.com</strong> for immediate assistance.</p>
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
   Checkout Modal & Razorpay Simulation
   ========================================================================== */
function openCheckoutModal() {
  const planData = PLANS[currentSelectedPlanId] || PLANS['monthly-pro'];
  const modal = document.getElementById('checkoutModal');
  const modalName = document.getElementById('modalCheckoutPlanName');
  const modalPrice = document.getElementById('modalCheckoutPlanPrice');
  const statusBox = document.getElementById('checkoutSimStatus');
  const emailInput = document.getElementById('modalCustEmail');
  const formEmail = document.getElementById('senderEmail');

  if (modalName) modalName.textContent = planData.displayTitle;
  if (modalPrice) modalPrice.textContent = planData.price;
  if (statusBox) statusBox.style.display = 'none';

  if (emailInput && formEmail && formEmail.value) {
    emailInput.value = formEmail.value;
  }

  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

function simulateRazorpayCheckout() {
  const emailInput = document.getElementById('modalCustEmail');
  const statusBox = document.getElementById('checkoutSimStatus');
  const payBtn = document.getElementById('payRazorpaySimBtn');

  if (emailInput && !emailInput.value) {
    alert('Please enter your email to receive your license confirmation.');
    emailInput.focus();
    return;
  }

  if (payBtn) {
    payBtn.disabled = true;
    payBtn.innerHTML = '<span>⏳ Connecting Secure Gateway...</span>';
  }

  if (statusBox) {
    statusBox.style.display = 'block';
    statusBox.style.background = '#FEF3C7';
    statusBox.style.color = '#92400E';
    statusBox.innerHTML = '⚡ <em>Opening Secure Checkout Session...</em>';
  }

  setTimeout(() => {
    if (statusBox) {
      statusBox.style.background = '#DCFCE7';
      statusBox.style.color = '#166536';
      statusBox.innerHTML = '✅ <strong>Payment Successful!</strong> License key has been issued and sent to <u>' + (emailInput ? emailInput.value : 'your email') + '</u>.';
    }
    if (payBtn) {
      payBtn.disabled = false;
      payBtn.innerHTML = '<span>✅ License Activated</span>';
    }
    setTimeout(() => {
      closeCheckoutModal();
    }, 2800);
  }, 1400);
}
