/* ==========================================================================
   AgriStack Card Helper - Interactive Landing Page Scripts
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
  }

  // 3. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close other FAQs
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

  // 5. Read Full Policy Buttons (Modals)
  const readPolicyBtns = document.querySelectorAll('.legal-read-btn');
  readPolicyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const policyId = btn.getAttribute('data-policy');
      openPolicyModal(policyId);
    });
  });

  // 6. Modal Close Button & Backdrop Click
  const modal = document.getElementById('policyModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closePolicyModal);
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closePolicyModal();
      }
    });
  }

  // Handle ESC key for modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePolicyModal();
    }
  });

  // 7. Active Nav Link Highlighting on Scroll
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

// Policy Modal Data & Open Handler
const policyContents = {
  terms: {
    title: 'Terms & Conditions (Digital Software License)',
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
    title: 'Privacy Policy (100% Client-Side Privacy)',
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

// Contact Form Handler
function handleContactSubmit() {
  const name = document.getElementById('senderName').value;
  const email = document.getElementById('senderEmail').value;
  const phone = document.getElementById('senderPhone').value;
  const message = document.getElementById('senderMessage').value;
  const toast = document.getElementById('toastMessage');
  const sendBtn = document.getElementById('sendBtn');

  if (!name || !email || !message) return;

  sendBtn.disabled = true;
  sendBtn.textContent = 'Sending inquiry...';

  setTimeout(() => {
    sendBtn.disabled = false;
    sendBtn.innerHTML = '<span>Send Message to Support</span>';
    if (toast) {
      toast.style.display = 'block';
      setTimeout(() => {
        toast.style.display = 'none';
      }, 6000);
    }
    document.getElementById('contactForm').reset();
  }, 700);
}
