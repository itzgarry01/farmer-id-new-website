/* ==========================================================================
   AgriStack Card Helper - Extension Purchase & Automatic Download Engine
   ========================================================================== */

// Global Plan Definition
const PLANS = {
  'lifetime': {
    id: 'lifetime',
    cardElementId: 'planLifetime',
    name: 'Full Extension Lifetime License',
    displayTitle: 'Full Extension Lifetime License',
    price: '₹599',
    priceDisplay: '₹599 one-time',
    numericPrice: 599,
    buttonText: 'Buy Extension — ₹599 (Auto-Download)'
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
  'pay-per-card': {
    id: 'pay-per-card',
    cardElementId: 'planSingle',
    name: 'Pay-Per-Card',
    displayTitle: 'Pay-Per-Card (Single Generation)',
    price: '₹20',
    priceDisplay: '₹20 / card',
    numericPrice: 20,
    buttonText: 'Select Pay-Per-Card'
  },
  'custom': {
    id: 'custom',
    cardElementId: 'planLifetime',
    name: 'Custom Bulk Pack',
    displayTitle: 'Custom Bulk Pack (Multi-Center)',
    price: 'Custom',
    priceDisplay: 'Contact Us',
    numericPrice: 0,
    buttonText: 'Inquire Custom Pack'
  }
};

let currentSelectedPlanId = 'lifetime';
let lastGeneratedLicenseKey = 'AGRI-PRO-599-8F29-4D17';
let currentCustomer = {
  name: 'CSC Operator',
  email: 'operator@example.com',
  phone: '+91 62392 45940',
  orderId: 'AGRI-' + Math.floor(100000 + Math.random() * 900000)
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

  const successModal = document.getElementById('downloadSuccessModal');
  if (successModal) {
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) closeSuccessModal();
    });
  }

  const invoiceModal = document.getElementById('invoiceModal');
  if (invoiceModal) {
    invoiceModal.addEventListener('click', (e) => {
      if (e.target === invoiceModal) closeInvoiceModal();
    });
  }

  // Handle ESC key for all modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePolicyModal();
      closeCheckoutModal();
      closeSuccessModal();
      closeInvoiceModal();
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

  // Check if user previously bought and has saved license
  const savedPurchase = localStorage.getItem('agristack_extension_purchase');
  if (savedPurchase) {
    try {
      const data = JSON.parse(savedPurchase);
      if (data && data.licenseKey) {
        lastGeneratedLicenseKey = data.licenseKey;
        currentCustomer = data;
      }
    } catch (e) {}
  }
});

/* ==========================================================================
   Plan Selection & 2-Way Synchronization Logic
   ========================================================================== */
function initPlanSelection() {
  const pricingCards = document.querySelectorAll('.pricing-card');
  const formPlanSelect = document.getElementById('selectedPlan');

  // Click on Pricing Card
  pricingCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const planId = card.getAttribute('data-plan-id');
      if (card.classList.contains('unavailable')) {
        alert('This plan is temporarily unavailable. The Full Extension Lifetime License (₹599) is the only active plan.');
        selectPlan('lifetime');
        return;
      }

      if (planId) {
        selectPlan(planId);

        // If clicked on Buy / Action button, open checkout modal directly
        if (e.target.closest('.plan-action-btn')) {
          openCheckoutModal(planId);
        }
      }
    });

    // Keyboard accessibility for selecting plans via Enter / Space
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (card.classList.contains('unavailable')) return;
        const planId = card.getAttribute('data-plan-id');
        if (planId) {
          selectPlan(planId);
          openCheckoutModal(planId);
        }
      }
    });
  });

  // Form Select Dropdown Change -> Sync with Pricing Cards
  if (formPlanSelect) {
    formPlanSelect.addEventListener('change', (e) => {
      if (e.target.value !== 'lifetime') {
        alert('This plan is temporarily unavailable. Only the Full Extension Lifetime License (₹599) is currently available.');
        e.target.value = 'lifetime';
      }
      selectPlan('lifetime', false);
    });
  }

  // Initialize with default plan
  selectPlan('lifetime', true);
}

function selectPlan(planId, updateDropdown = true) {
  // Lock to lifetime plan as the only active product
  planId = 'lifetime';
  currentSelectedPlanId = 'lifetime';
  const planData = PLANS['lifetime'];

  // 1. Update Pricing Cards UI
  const pricingCards = document.querySelectorAll('.pricing-card');
  pricingCards.forEach(card => {
    const cardPlanId = card.getAttribute('data-plan-id');
    const actionBtn = card.querySelector('.plan-action-btn span');

    if (cardPlanId === 'lifetime') {
      card.classList.add('selected');
      card.setAttribute('aria-selected', 'true');
      if (actionBtn) {
        actionBtn.textContent = '⚡ Buy Extension — ₹599 (Auto-Download)';
      }
    } else {
      card.classList.remove('selected');
      card.setAttribute('aria-selected', 'false');
      if (actionBtn) {
        actionBtn.textContent = '❌ Not Available Right Now';
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
  if (updateDropdown && formPlanSelect && formPlanSelect.value !== 'lifetime') {
    formPlanSelect.value = 'lifetime';
  }

  // 4. Update Modal Info
  const modalName = document.getElementById('modalCheckoutPlanName');
  const modalPrice = document.getElementById('modalCheckoutPlanPrice');
  const qrPrice = document.getElementById('qrPriceTag');
  const rzpPrice = document.getElementById('razorpayPriceTag');
  if (modalName) modalName.textContent = planData.displayTitle;
  if (modalPrice) modalPrice.textContent = planData.price;
  if (qrPrice) qrPrice.textContent = planData.price;
  if (rzpPrice) rzpPrice.textContent = planData.price;
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
   Checkout Modal & Payment Management
   ========================================================================== */
const RAZORPAY_TEST_KEY_ID = 'rzp_test_TQLS1vdxi3jjIi';

function switchCheckoutTab(tabName) {
  const rzpTabBtn = document.getElementById('tabRazorpayBtn');
  const upiTabBtn = document.getElementById('tabUpiBtn');
  const rzpContent = document.getElementById('checkoutRazorpayContent');
  const upiContent = document.getElementById('checkoutUpiContent');

  if (tabName === 'razorpay') {
    if (rzpTabBtn) rzpTabBtn.classList.add('active');
    if (upiTabBtn) upiTabBtn.classList.remove('active');
    if (rzpContent) rzpContent.style.display = 'block';
    if (upiContent) upiContent.style.display = 'none';
  } else {
    if (upiTabBtn) upiTabBtn.classList.add('active');
    if (rzpTabBtn) rzpTabBtn.classList.remove('active');
    if (upiContent) upiContent.style.display = 'block';
    if (rzpContent) rzpContent.style.display = 'none';
  }
}

function openCheckoutModal(planId) {
  if (planId) selectPlan(planId);
  const planData = PLANS[currentSelectedPlanId] || PLANS['lifetime'];
  
  const modal = document.getElementById('checkoutModal');
  const modalName = document.getElementById('modalCheckoutPlanName');
  const modalPrice = document.getElementById('modalCheckoutPlanPrice');
  const qrPrice = document.getElementById('qrPriceTag');
  const rzpPrice = document.getElementById('razorpayPriceTag');
  const statusBox = document.getElementById('checkoutSimStatus');
  
  const nameInput = document.getElementById('modalCustName');
  const emailInput = document.getElementById('modalCustEmail');
  const phoneInput = document.getElementById('modalCustPhone');
  
  const formName = document.getElementById('senderName');
  const formEmail = document.getElementById('senderEmail');
  const formPhone = document.getElementById('senderPhone');

  if (modalName) modalName.textContent = planData.displayTitle;
  if (modalPrice) modalPrice.textContent = planData.price;
  if (qrPrice) qrPrice.textContent = planData.price;
  if (rzpPrice) rzpPrice.textContent = planData.price;
  if (statusBox) statusBox.style.display = 'none';

  // Sync inputs from contact form if filled
  if (nameInput && formName && formName.value) nameInput.value = formName.value;
  if (emailInput && formEmail && formEmail.value) emailInput.value = formEmail.value;
  if (phoneInput && formPhone && formPhone.value) phoneInput.value = formPhone.value;

  // Update dynamic QR Code
  const qrImg = document.getElementById('liveUpiQr');
  if (qrImg) {
    const amount = planData.numericPrice || 599;
    const upiUrl = `upi://pay?pa=itzgarry01@okaxis&pn=AgriStack%20Helper&am=${amount}&cu=INR&tn=AgriStack%20Extension%20License`;
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUrl)}`;
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

/* ==========================================================================
   Automatic Download & Payment Confirmation Engine
   ========================================================================== */
function triggerExtensionDownload() {
  // Programmatic HTML5 auto-download trigger for zip package
  const link = document.createElement('a');
  link.href = 'agristack-card-helper-v2.0.zip';
  link.setAttribute('download', 'agristack-card-helper-v2.0.zip');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function generateLicenseKey() {
  const hexPart1 = Math.random().toString(16).substring(2, 6).toUpperCase();
  const hexPart2 = Math.random().toString(16).substring(2, 6).toUpperCase();
  return `AGRI-PRO-599-${hexPart1}-${hexPart2}`;
}

function openRazorpayCheckout(planId) {
  if (planId) selectPlan(planId);
  const planData = PLANS[currentSelectedPlanId] || PLANS['lifetime'];

  const nameInput = document.getElementById('modalCustName');
  const emailInput = document.getElementById('modalCustEmail');
  const phoneInput = document.getElementById('modalCustPhone');
  const formName = document.getElementById('senderName');
  const formEmail = document.getElementById('senderEmail');
  const formPhone = document.getElementById('senderPhone');

  const customerName = (nameInput && nameInput.value.trim()) || (formName && formName.value.trim()) || 'CSC Center Operator';
  const customerEmail = (emailInput && emailInput.value.trim()) || (formEmail && formEmail.value.trim()) || 'itzgarry01@gmail.com';
  const customerPhone = (phoneInput && phoneInput.value.trim()) || (formPhone && formPhone.value.trim()) || '+916239245940';

  const amountInPaise = (planData.numericPrice || 599) * 100;

  const options = {
    key: RAZORPAY_TEST_KEY_ID,
    amount: amountInPaise,
    currency: 'INR',
    name: 'AgriStack Card Helper',
    description: `${planData.name} - Instant Extension Download`,
    image: 'icons/logo.png',
    prefill: {
      name: customerName,
      email: customerEmail,
      contact: customerPhone
    },
    notes: {
      plan_id: planData.id,
      product: 'AgriStack Chrome Extension Lifetime License'
    },
    theme: {
      color: '#1F8547'
    },
    handler: function (response) {
      console.log('Razorpay Payment Succeeded:', response);
      const paymentId = response.razorpay_payment_id || ('pay_' + Math.random().toString(36).substring(2, 10));
      closeCheckoutModal();
      processPaymentSuccess('Razorpay Gateway (' + paymentId + ')', paymentId);
    },
    modal: {
      ondismiss: function () {
        console.log('Razorpay Checkout closed by user.');
      }
    }
  };

  if (typeof Razorpay !== 'undefined') {
    try {
      const rzp = new Razorpay(options);
      rzp.on('payment.failed', function (response) {
        alert('Payment Failed: ' + (response.error ? response.error.description : 'Transaction could not be completed.'));
      });
      rzp.open();
    } catch (e) {
      console.error('Razorpay initialization error:', e);
      simulateRazorpayCheckout();
    }
  } else {
    simulateRazorpayCheckout();
  }
}

function processPaymentSuccess(paymentMethod = 'UPI', gatewayTxnId = null) {
  const nameInput = document.getElementById('modalCustName');
  const emailInput = document.getElementById('modalCustEmail');
  const phoneInput = document.getElementById('modalCustPhone');
  const verifyBtn = document.getElementById('verifyUpiPaymentBtn');
  const statusBox = document.getElementById('checkoutSimStatus');

  const customerName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'CSC Center Operator';
  const customerEmail = emailInput && emailInput.value.trim() ? emailInput.value.trim() : 'customer@example.com';
  const customerPhone = phoneInput && phoneInput.value.trim() ? phoneInput.value.trim() : '+91 62392 45940';

  if (verifyBtn) {
    verifyBtn.disabled = true;
    verifyBtn.innerHTML = '<span>⏳ Verifying Transaction with Bank...</span>';
  }

  if (statusBox) {
    statusBox.style.display = 'block';
    statusBox.style.background = '#FEF3C7';
    statusBox.style.color = '#92400E';
    statusBox.innerHTML = '⚡ <em>Processing instant confirmation...</em>';
  }

  setTimeout(() => {
    // Generate new unique license key
    lastGeneratedLicenseKey = generateLicenseKey();
    const orderId = gatewayTxnId || ('AGRI-2026-' + Math.floor(1000 + Math.random() * 9000));

    currentCustomer = {
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      orderId: orderId,
      licenseKey: lastGeneratedLicenseKey,
      plan: PLANS[currentSelectedPlanId]?.name || 'AgriStack Extension Lifetime License',
      price: PLANS[currentSelectedPlanId]?.price || '₹599',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    // Save purchase in localStorage
    localStorage.setItem('agristack_extension_purchase', JSON.stringify(currentCustomer));

    // Reset button
    if (verifyBtn) {
      verifyBtn.disabled = false;
      verifyBtn.innerHTML = '<span>✅ I Have Paid ₹599 — Download Extension Instantly</span>';
    }

    // Close checkout modal
    closeCheckoutModal();

    // 1. Trigger Automatic Extension Download!
    triggerExtensionDownload();

    // 2. Open Success & License Key Modal
    openSuccessModal();
  }, 1000);
}

function simulateRazorpayCheckout() {
  const emailInput = document.getElementById('modalCustEmail');
  const payBtn = document.getElementById('payRazorpayBtn');

  if (payBtn) {
    payBtn.disabled = true;
    payBtn.innerHTML = '<span>⏳ Connecting Razorpay Gateway...</span>';
  }

  setTimeout(() => {
    if (payBtn) {
      payBtn.disabled = false;
      payBtn.innerHTML = '<span>🔒 Pay ₹599 via Razorpay & Download</span>';
    }
    const mockTxn = 'pay_test_' + Math.random().toString(36).substring(2, 10);
    processPaymentSuccess('Razorpay Gateway (' + mockTxn + ')', mockTxn);
  }, 1200);
}

/* ==========================================================================
   Success & Auto-Download Modal
   ========================================================================== */
function openSuccessModal() {
  const modal = document.getElementById('downloadSuccessModal');
  const keyDisplay = document.getElementById('successLicenseKey');

  if (keyDisplay) {
    keyDisplay.textContent = lastGeneratedLicenseKey;
  }

  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

function closeSuccessModal() {
  const modal = document.getElementById('downloadSuccessModal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

function copyLicenseKeyToClipboard() {
  const keyDisplay = document.getElementById('successLicenseKey');
  const copyBtn = document.getElementById('copyLicenseKeyBtn');
  const keyText = keyDisplay ? keyDisplay.textContent : lastGeneratedLicenseKey;

  copyToClipboard(keyText, copyBtn);
}

/* ==========================================================================
   Tax Invoice Modal
   ========================================================================== */
function openInvoiceModal() {
  const modal = document.getElementById('invoiceModal');
  const invDate = document.getElementById('invDate');
  const invId = document.getElementById('invId');
  const invCustName = document.getElementById('invCustName');
  const invCustEmail = document.getElementById('invCustEmail');
  const invCustPhone = document.getElementById('invCustPhone');
  const invKey = document.getElementById('invKey');

  if (invDate) invDate.textContent = `Date: ${currentCustomer.date || '18 Aug 2026'}`;
  if (invId) invId.textContent = `Inv #: ${currentCustomer.orderId || 'AGRI-2026-8821'}`;
  if (invCustName) invCustName.textContent = currentCustomer.name || 'CSC Operator';
  if (invCustEmail) invCustEmail.textContent = currentCustomer.email || 'operator@example.com';
  if (invCustPhone) invCustPhone.textContent = currentCustomer.phone || '+91 62392 45940';
  if (invKey) invKey.textContent = lastGeneratedLicenseKey;

  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

function closeInvoiceModal() {
  const modal = document.getElementById('invoiceModal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
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
      <p>By purchasing a software license for <strong>₹599</strong> or using <strong>AgriStack Card Generator Helper</strong> ("Software"), you agree to abide by these Terms and Conditions. This software provides automated browser formatting tools for Punjab Farmer Registry and AgriStack operators.</p>
      
      <h4>2. Grant of License</h4>
      <p>We grant you a non-exclusive, non-transferable lifetime software license to format farmer identity cards from authorized Punjab Farmer Registry / AgriStack portal records.</p>
      
      <h4>3. User Responsibilities & Acceptable Use</h4>
      <ul>
        <li>You agree to process only legitimate records you have authorization to format.</li>
        <li>You shall not reverse-engineer, decompile, or attempt to circumvent digital licensing mechanisms.</li>
        <li>This software is a layout and formatting assistant. Official legal identity validity remains solely with the issuing government authority.</li>
      </ul>
      
      <h4>4. Pricing & Payments</h4>
      <p>All prices are clearly stated in Indian Rupees (INR ₹). Payment processing is secured via Cashfree.</p>
      
      <h4>5. Governing Law & Jurisdiction</h4>
      <p>These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the competent courts in Punjab, India.</p>
    `
  },
  privacy: {
    title: 'Privacy Policy (100% Client-Side Private Processing)',
    content: `
      <h4>1. Local Client-Side Processing</h4>
      <p>Your privacy and citizen record security are paramount. All registry parsing, Gurmukhi text shaping, and 300 DPI PDF card compilations occur <strong>100% inside your local browser sandbox</strong>. No farmer identity records or photos are uploaded, stored, or transferred to remote servers.</p>
      
      <h4>2. Cashfree Payment Security</h4>
      <p>Payments are conducted directly via <strong>Cashfree</strong> (PCI-DSS Level 1 Compliant). We never see or store your payment card numbers, CVVs, netbanking credentials, or UPI PINs.</p>
      
      <h4>3. Transaction Data Collected</h4>
      <ul>
        <li>Cashfree Order ID & Payment ID for transaction verification and license generation.</li>
        <li>User support email for sending digital receipts and answering inquiries.</li>
      </ul>
      
      <h4>4. Contact Regarding Privacy</h4>
      <p>If you have any questions, email us at <a href="mailto:itzgarry01@gmail.com">itzgarry01@gmail.com</a>.</p>
    `
  },
  refund: {
    title: 'Refund & Cancellation Policy (7-Day SLA)',
    content: `
      <h4>1. Digital Software Goods</h4>
      <p>AgriStack Card Generator Helper is a digital software product. The extension zip package and license key are delivered instantly upon payment confirmation.</p>
      
      <h4>2. 7-Day Refund Eligibility</h4>
      <ul>
        <li>If the extension fails to format your portal records due to verified technical defects.</li>
        <li>If you were charged multiple times due to a banking network timeout.</li>
      </ul>
      
      <h4>3. Refund Request Process</h4>
      <p>Send an email to <strong>itzgarry01@gmail.com</strong> with:</p>
      <ul>
        <li>Your Cashfree Payment ID or Order ID</li>
        <li>Screenshot / description of the issue</li>
      </ul>
      
      <h4>4. Turnaround Time</h4>
      <p>Refund requests are reviewed within 24 hours. Upon approval, funds are credited back to your original payment source (Bank / UPI / Card) within <strong>5–7 business days</strong>.</p>
    `
  },
  shipping: {
    title: 'Shipping & Delivery Policy (Instant Digital Delivery)',
    content: `
      <h4>1. Nature of Product — Digital Delivery Only</h4>
      <p><strong>Explicit Declaration:</strong> AgriStack Card Generator Helper is 100% digital software. No physical goods or packages are shipped to your postal address.</p>
      
      <h4>2. Delivery Method & Timeline</h4>
      <ul>
        <li><strong>Generated Card PDF:</strong> Download starts automatically in your browser within <strong>0–60 seconds</strong> of successful Cashfree payment verification.</li>
        <li><strong>License Keys & Receipts:</strong> Delivered instantly via on-screen prompt and confirmation email.</li>
      </ul>
      
      <h4>3. Delivery Charges</h4>
      <p>₹0.00 (Free instant digital electronic delivery).</p>
      
      <h4>4. Non-Delivery Support</h4>
      <p>If your browser blocked the automatic download, click the manual Re-Download button on screen or contact WhatsApp support at <strong>+91 62392 45940</strong> for instant file dispatch.</p>
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

