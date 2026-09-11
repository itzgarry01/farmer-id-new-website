/**
 * AgriStack Card Generator Helper - Extension Popup Script (v5.0)
 * 
 * Features:
 * - Prepaid Digital Wallet System (Zero-Bypass Server-Side Deduction)
 * - Cashfree Sandbox/Production PG Wallet Recharge Integration
 * - 1-Click Instant Card Generation & Gurmukhi HarfBuzz Complex Text Shaping
 * - Dedicated Production Cloud Backend (Render Hosted)
 * - Accurate Live Detection for Render Paused / Suspended States
 */
(function () {
    "use strict";

    const DEFAULT_SERVER_URL = "https://farmer-wallet-extension.onrender.com";
    const CARD_FEE = 22;

    let currentServerUrl = DEFAULT_SERVER_URL;
    let walletId = "";
    let walletToken = "";
    let currentBalance = 0.0;
    let isServerConnected = false;
    let isRechargePolling = false;
    let currentCheckoutWindowId = null;

    document.addEventListener("DOMContentLoaded", function () {
        // UI Elements
        const statusDiv = document.getElementById("status");
        const backendBadge = document.getElementById("backendBadge");
        const walletBalDisplay = document.getElementById("walletBalDisplay");
        const cardsRemainingBadge = document.getElementById("cardsRemainingBadge");
        const refreshBalBtn = document.getElementById("refreshBalBtn");
        const toggleRechargeBtn = document.getElementById("toggleRechargeBtn");
        const closeRechargeBtn = document.getElementById("closeRechargeBtn");
        const rechargeDrawer = document.getElementById("rechargeDrawer");
        const rechargeAmountInput = document.getElementById("rechargeAmountInput");
        const submitRechargeBtn = document.getElementById("submitRechargeBtn");
        const chipBtns = document.querySelectorAll(".chip-btn");
        const aadhaarInput = document.getElementById("aadhaar");
        const generateBtn = document.getElementById("generateBtn");
        const toggleActivityBtn = document.getElementById("toggleActivityBtn");
        const activityList = document.getElementById("activityList");
        const activityArrow = document.getElementById("activityArrow");
        const secretAdminTrigger = document.getElementById("secretAdminTrigger");

        const configDrawer = document.getElementById("configDrawer");
        const serverUrlInput = document.getElementById("serverUrlInput");
        const saveServerBtn = document.getElementById("saveServerBtn");
        const customerPhoneNotice = document.getElementById("customerPhoneNotice");
        const customerPhoneDisplay = document.getElementById("customerPhoneDisplay");

        let detectedFarmerPhone = "";
        try {
            const savedPhone = localStorage.getItem("agristack_detected_phone");
            if (savedPhone && /^[6-9]\d{9}$/.test(savedPhone)) {
                detectedFarmerPhone = savedPhone;
            }
        } catch (e) {}

        function setStatus(message, type) {
            if (!statusDiv) return;
            statusDiv.textContent = message;
            if (type === "success") {
                statusDiv.className = "status-success";
            } else if (type === "error") {
                statusDiv.className = "status-error";
            } else if (type === "warning") {
                statusDiv.className = "status-warning";
            } else {
                statusDiv.className = "";
            }
        }

        function setBadge(state, label, tooltip) {
            if (!backendBadge) return;
            backendBadge.textContent = label;
            backendBadge.title = tooltip || label;
            backendBadge.className = "status-badge " + state;
        }

        // Display cached balance or 0.00 at start
        try {
            const cachedBal = localStorage.getItem("agristack_wallet_balance") || "0.00";
            if (walletBalDisplay && cachedBal) {
                walletBalDisplay.textContent = "₹" + parseFloat(cachedBal).toFixed(2);
                if (cardsRemainingBadge) {
                    const rem = Math.floor(parseFloat(cachedBal) / CARD_FEE);
                    cardsRemainingBadge.textContent = rem + (rem === 1 ? " card" : " cards");
                }
            }
        } catch (e) {}

        // 1. Load Stored Server URL & Wallet Credentials (with Dual LocalStorage Fallback)
        const localStoredId = localStorage.getItem("agristack_wallet_id");
        const localStoredToken = localStorage.getItem("agristack_wallet_token");

        if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get([
                "server_url",
                "cloud_server_url",
                "wallet_id",
                "wallet_token"
            ], function (res) {
                const storedUrl = res.cloud_server_url || res.server_url;
                if (storedUrl && !storedUrl.includes("127.0.0.1") && !storedUrl.includes("localhost") && !storedUrl.includes("agristack-extension.onrender.com")) {
                    currentServerUrl = storedUrl.replace(/\/+$/, "");
                } else {
                    currentServerUrl = DEFAULT_SERVER_URL;
                }

                if (serverUrlInput) serverUrlInput.value = currentServerUrl;
                walletId = res.wallet_id || localStoredId || "";
                walletToken = res.wallet_token || localStoredToken || "";

                initWallet();
            });
        } else {
            walletId = localStoredId || "";
            walletToken = localStoredToken || "";
            initWallet();
        }

        // 2. Initialize or Sync Wallet with Render Backend
        function initWallet() {
            setBadge("paused", "☁️ Connecting...", "Connecting to Render Cloud...");
            setStatus("Connecting to online server...", "normal");

            const controller = new AbortController();
            const timeoutId = setTimeout(function () { controller.abort(); }, 35000);

            return fetch(currentServerUrl + "/api/wallet/init", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    wallet_id: walletId,
                    wallet_token: walletToken
                }),
                signal: controller.signal
            })
            .then(function (res) {
                clearTimeout(timeoutId);

                // Specific Render Paused / Suspended check
                const routingHeader = res.headers.get("x-render-routing") || "";
                if (res.status === 503 || routingHeader.includes("suspend")) {
                    throw new Error("RENDER_PAUSED");
                }
                if (res.status === 502 || res.status === 504) {
                    throw new Error("RENDER_OFFLINE");
                }
                if (!res.ok) {
                    throw new Error("HTTP " + res.status);
                }
                return res.json().catch(function () {
                    throw new Error("INVALID_JSON");
                });
            })
            .then(function (data) {
                if (data.status === "success") {
                    isServerConnected = true;
                    walletId = data.wallet_id;
                    walletToken = data.wallet_token;
                    currentBalance = Number(data.balance) || 0.0;

                    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
                        chrome.storage.local.set({
                            server_url: currentServerUrl,
                            cloud_server_url: currentServerUrl,
                            wallet_id: walletId,
                            wallet_token: walletToken
                        });
                    }
                    try {
                        localStorage.setItem("agristack_wallet_id", walletId);
                        localStorage.setItem("agristack_wallet_token", walletToken);
                        localStorage.setItem("agristack_wallet_balance", currentBalance.toFixed(2));
                    } catch (e) {}

                    updateWalletUI(data);
                    setBadge("online", "🟢 Ready", "Connected to Render Cloud");
                    if (currentBalance >= CARD_FEE) {
                        setStatus("Ready. 1-click card generation enabled.", "success");
                    } else {
                        setStatus("Ready. Balance ₹0.00 — please recharge wallet to generate cards.", "normal");
                    }
                    return true;
                } else {
                    throw new Error(data.error || "Wallet initialization failed");
                }
            })
            .catch(function (err) {
                clearTimeout(timeoutId);
                isServerConnected = false;

                if (err.message === "RENDER_PAUSED") {
                    setBadge("paused", "⚠️ Render Paused", "Render deployment is suspended by owner.");
                    setStatus("⚠️ Render server is paused. Please resume the service on your Render dashboard.", "warning");
                } else if (err.message === "RENDER_OFFLINE" || err.message.includes("502") || err.message.includes("504")) {
                    setBadge("paused", "⏳ Waking Up...", "Render server is starting up.");
                    setStatus("⏳ Render server is waking up from sleep (~30-50s). Retrying in 5s...", "warning");
                    setTimeout(function () {
                        if (!isServerConnected) initWallet();
                    }, 5000);
                } else if (err.name === "AbortError") {
                    setBadge("paused", "⏳ Waking Up...", "Render server is spinning up.");
                    setStatus("⏳ Render server is spinning up. Reconnecting automatically in 5s...", "warning");
                    setTimeout(function () {
                        if (!isServerConnected) initWallet();
                    }, 5000);
                } else {
                    setBadge("offline", "⚠️ Server Offline", "Unable to connect to online server.");
                    setStatus("⚠️ Server offline: " + err.message + ". Retrying in 8s...", "error");
                    setTimeout(function () {
                        if (!isServerConnected) initWallet();
                    }, 8000);
                }

                if (walletBalDisplay && (!currentBalance || currentBalance <= 0)) {
                    try {
                        const cached = localStorage.getItem("agristack_wallet_balance");
                        if (cached) {
                            walletBalDisplay.textContent = "₹" + parseFloat(cached).toFixed(2);
                        }
                    } catch (e) {}
                }
            });
        }

        // 3. Refresh Live Wallet Balance
        function refreshBalance(silent) {
            if (!walletId || !walletToken || !isServerConnected) {
                initWallet();
                return;
            }
            if (!silent) setStatus("Refreshing balance...", "normal");

            const controller = new AbortController();
            const timeoutId = setTimeout(function () { controller.abort(); }, 5000);

            fetch(currentServerUrl + "/api/wallet/balance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    wallet_id: walletId,
                    wallet_token: walletToken
                }),
                signal: controller.signal
            })
            .then(function (res) {
                clearTimeout(timeoutId);
                const routingHeader = res.headers.get("x-render-routing") || "";
                if (res.status === 503 || routingHeader.includes("suspend")) {
                    throw new Error("RENDER_PAUSED");
                }
                if (!res.ok) throw new Error("Status " + res.status);
                return res.json();
            })
            .then(function (data) {
                if (data.status === "success") {
                    isServerConnected = true;
                    if (data.wallet_id) walletId = data.wallet_id;
                    if (data.wallet_token) walletToken = data.wallet_token;
                    currentBalance = Number(data.balance) || 0.0;
                    updateWalletUI(data);

                    setBadge("online", "🟢 Ready", "Connected to Render Cloud");
                    if (!silent) setStatus("Balance refreshed: " + data.formatted_balance, "success");
                }
            })
            .catch(function (err) {
                clearTimeout(timeoutId);
                isServerConnected = false;

                if (err.message === "RENDER_PAUSED") {
                    setBadge("paused", "⚠️ Render Paused", "Render deployment is suspended by owner.");
                    setStatus("⚠️ Render server is paused. Resume service on Render dashboard.", "warning");
                } else {
                    setBadge("offline", "⚠️ Server Offline", "Online server unreachable.");
                    setStatus("⚠️ Server offline: " + err.message, "error");
                }

                if (walletBalDisplay && (!currentBalance || currentBalance <= 0)) {
                    try {
                        const cached = localStorage.getItem("agristack_wallet_balance");
                        if (cached) {
                            walletBalDisplay.textContent = "₹" + parseFloat(cached).toFixed(2);
                        }
                    } catch (e) {}
                }
            });
        }

        function updateWalletUI(data) {
            if (data.balance !== undefined && !isNaN(Number(data.balance))) {
                currentBalance = Number(data.balance);
            }
            if (walletBalDisplay) {
                walletBalDisplay.textContent = data.formatted_balance || ("₹" + currentBalance.toFixed(2));
            }
            if (cardsRemainingBadge) {
                const remaining = Math.floor(currentBalance / CARD_FEE);
                cardsRemainingBadge.textContent = remaining + (remaining === 1 ? " card" : " cards");
            }
            try {
                localStorage.setItem("agristack_wallet_balance", currentBalance.toFixed(2));
                if (walletId) localStorage.setItem("agristack_wallet_id", walletId);
                if (walletToken) localStorage.setItem("agristack_wallet_token", walletToken);
            } catch (e) {}
            if (data.recent_transactions && activityList) {
                renderActivity(data.recent_transactions);
            }
        }

        function renderActivity(txns) {
            if (!txns || txns.length === 0) {
                activityList.innerHTML = '<div style="text-align:center; color:#94A3B8; padding:8px;">No recent transactions</div>';
                return;
            }
            let html = '';
            txns.forEach(function (t) {
                const isRecharge = t.txn_type === 'RECHARGE' || t.amount > 0;
                const sign = isRecharge ? '+' : '';
                const amtClass = isRecharge ? 'txn-plus' : 'txn-minus';
                const desc = t.description || (isRecharge ? 'Wallet Top-up' : 'Farmer Card Generation');
                const timeStr = t.created_at ? t.created_at.split(' ')[1] || '' : '';

                html += '<div class="activity-item">' +
                    '<div>' +
                    '<div style="font-weight:600; color:#1E293B;">' + desc + '</div>' +
                    '<div style="font-size:10px; color:#94A3B8;">' + (t.reference_id || '') + ' ' + timeStr + '</div>' +
                    '</div>' +
                    '<div class="' + amtClass + '">' + sign + '₹' + Math.abs(t.amount).toFixed(2) + '</div>' +
                    '</div>';
            });
            activityList.innerHTML = html;
        }

        // 4. Recharge Drawer & Presets
        function detectFarmerPhoneFromActiveTab() {
            return new Promise(function (resolve) {
                if (typeof chrome === "undefined" || !chrome.tabs || !chrome.tabs.query) {
                    return resolve(detectedFarmerPhone || "7009980800");
                }
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    const activeTab = tabs && tabs[0];
                    if (!activeTab || !activeTab.id || !activeTab.url) {
                        return resolve(detectedFarmerPhone || "7009980800");
                    }
                    if (activeTab.url.startsWith("chrome://") || activeTab.url.startsWith("chrome-extension://") || activeTab.url.startsWith("edge://") || activeTab.url.startsWith("about:")) {
                        return resolve(detectedFarmerPhone || "7009980800");
                    }
                    chrome.scripting.executeScript({
                        target: { tabId: activeTab.id },
                        func: function () {
                            const text = (document.body ? document.body.innerText : "") + "\n" + (document.documentElement ? document.documentElement.innerText : "");
                            // Patterns for mobile number extraction from Punjab AgriStack portal (e.g. Mobile Number6280534342)
                            const patterns = [
                                /(?:Mobile\s*Number|Mobile|Contact|Phone)[:\s\-]*([6-9]\d{9})/i,
                                /(?:ਮੋਬਾਈਲ|ਮੋਬਾਇਲ)\s*(?:ਨੰਬਰ)?[:\s\-]*([6-9]\d{9})/i,
                                /\b([6-9]\d{9})\b/
                            ];
                            for (let i = 0; i < patterns.length; i++) {
                                const m = text.match(patterns[i]);
                                if (m && m[1]) return m[1];
                            }
                            const inputs = document.querySelectorAll('input[type="tel"], input[name*="mobile" i], input[name*="phone" i], input[id*="mobile" i], input[id*="phone" i]');
                            for (let i = 0; i < inputs.length; i++) {
                                const val = inputs[i].value || "";
                                const m = val.match(/\b([6-9]\d{9})\b/);
                                if (m && m[1]) return m[1];
                            }
                            return null;
                        }
                    }, function (results) {
                        if (chrome.runtime.lastError || !results || !results[0] || !results[0].result) {
                            return resolve(detectedFarmerPhone || "7009980800");
                        }
                        const phone = results[0].result;
                        if (phone && /^[6-9]\d{9}$/.test(phone)) {
                            detectedFarmerPhone = phone;
                            try { localStorage.setItem("agristack_detected_phone", phone); } catch (e) {}
                            if (customerPhoneNotice && customerPhoneDisplay) {
                                customerPhoneDisplay.textContent = "+91 " + phone;
                                customerPhoneNotice.style.display = "flex";
                            }
                            return resolve(phone);
                        }
                        resolve(detectedFarmerPhone || "7009980800");
                    });
                });
            });
        }

        // Auto-detect farmer phone on load
        detectFarmerPhoneFromActiveTab();

        if (toggleRechargeBtn) {
            toggleRechargeBtn.addEventListener("click", function () {
                const isVisible = rechargeDrawer.style.display === "block";
                rechargeDrawer.style.display = isVisible ? "none" : "block";
                if (!isVisible) {
                    detectFarmerPhoneFromActiveTab();
                }
            });
        }

        if (closeRechargeBtn) {
            closeRechargeBtn.addEventListener("click", function () {
                rechargeDrawer.style.display = "none";
            });
        }

        chipBtns.forEach(function (btn) {
            btn.addEventListener("click", function () {
                chipBtns.forEach(function (c) { c.classList.remove("active"); });
                btn.classList.add("active");
                const amt = btn.getAttribute("data-amt");
                if (rechargeAmountInput) rechargeAmountInput.value = amt;
            });
        });

        if (refreshBalBtn) {
            refreshBalBtn.addEventListener("click", function () {
                refreshBalance(false);
            });
        }

        // 5. Submit Wallet Recharge (Cashfree PG)
        if (submitRechargeBtn) {
            submitRechargeBtn.addEventListener("click", function () {
                if (!isServerConnected) {
                    setStatus("⚠️ Render deployment is paused or offline. Resume service on Render first.", "error");
                    return;
                }

                const amount = parseFloat(rechargeAmountInput ? rechargeAmountInput.value : 0);
                if (isNaN(amount) || amount < 10) {
                    setStatus("Please enter a valid amount (minimum ₹10).", "error");
                    return;
                }

                setStatus("Detecting farmer mobile & initializing Cashfree PG...", "normal");
                submitRechargeBtn.disabled = true;

                detectFarmerPhoneFromActiveTab().then(function (farmerPhone) {
                    const finalPhone = farmerPhone || detectedFarmerPhone || "7009980800";

                    fetch(currentServerUrl + "/api/wallet/recharge", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            wallet_id: walletId,
                            wallet_token: walletToken,
                            amount: amount,
                            customer_phone: finalPhone
                        })
                    })
                    .then(function (res) {
                        if (!res.ok) {
                            return res.json().catch(function () { return {}; }).then(function (err) {
                                throw new Error(err.error || ("Server error (" + res.status + ")"));
                            });
                        }
                        return res.json();
                    })
                    .then(function (data) {
                        if (data.status !== "success") {
                            throw new Error(data.error || "Failed to create recharge order.");
                        }

                        const checkoutUrl = data.full_checkout_url || (currentServerUrl + data.checkout_url);

                        // Open hosted checkout in popup window or tab
                        if (typeof chrome !== "undefined" && chrome.windows && chrome.windows.create) {
                            chrome.windows.create({
                                url: checkoutUrl,
                                type: "popup",
                                width: 460,
                                height: 720,
                                focused: true
                            }, function (newWin) {
                                if (newWin && newWin.id) {
                                    currentCheckoutWindowId = newWin.id;
                                }
                            });
                        } else if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.create) {
                            chrome.tabs.create({ url: checkoutUrl });
                        } else {
                            window.open(checkoutUrl, "_blank");
                        }

                        setStatus("✅ Cashfree Checkout opened for +91 " + (data.customer_phone || finalPhone) + "! Complete payment to add funds.", "success");
                        pollForRecharge(data.order_id);
                    })
                    .catch(function (err) {
                        setStatus("❌ " + err.message, "error");
                    })
                    .finally(function () {
                        submitRechargeBtn.disabled = false;
                    });
                });
            });
        }

        // Poll for recharge confirmation in the background
        function pollForRecharge(orderId) {
            if (isRechargePolling) return;
            isRechargePolling = true;

            let attempts = 0;
            const pollTimer = setInterval(function () {
                attempts++;
                if (attempts > 100) {
                    clearInterval(pollTimer);
                    isRechargePolling = false;
                    return;
                }

                fetch(currentServerUrl + "/api/wallet/verify_recharge", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ order_id: orderId })
                })
                .then(function (r) { return r.json(); })
                .then(function (vData) {
                    if (vData.status === "success" && vData.order_status === "PAID") {
                        clearInterval(pollTimer);
                        isRechargePolling = false;
                        currentBalance = Number(vData.new_balance) || (currentBalance + Number(vData.amount || 0));
                        updateWalletUI(vData);
                        if (rechargeDrawer) rechargeDrawer.style.display = "none";
                        const addedAmt = Number(vData.amount || 0).toFixed(2);
                        setStatus("🎉 Recharge Successful! +₹" + addedAmt + " added to wallet.", "success");
                        refreshBalance(false);

                        // Auto-close checkout popup window after payment confirmation
                        if (currentCheckoutWindowId && typeof chrome !== "undefined" && chrome.windows && chrome.windows.remove) {
                            setTimeout(function () {
                                chrome.windows.remove(currentCheckoutWindowId, function () {
                                    if (chrome.runtime.lastError) {}
                                });
                                currentCheckoutWindowId = null;
                            }, 1500);
                        }
                    }
                })
                .catch(function () {});
            }, 1800);
        }

        // Listen for BroadcastChannel updates from checkout window
        try {
            const bc = new BroadcastChannel("agristack_wallet_channel");
            bc.onmessage = function (ev) {
                if (ev.data && ev.data.action === "RECHARGE_COMPLETED") {
                    refreshBalance(false);
                    if (currentCheckoutWindowId && typeof chrome !== "undefined" && chrome.windows && chrome.windows.remove) {
                        chrome.windows.remove(currentCheckoutWindowId, function () {
                            if (chrome.runtime.lastError) {}
                        });
                        currentCheckoutWindowId = null;
                    }
                }
            };
        } catch (e) {}

        // Listen for chrome.runtime message events
        if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.onMessage) {
            chrome.runtime.onMessage.addListener(function (msg) {
                if (msg && msg.action === "RECHARGE_COMPLETED") {
                    refreshBalance(false);
                    if (currentCheckoutWindowId && chrome.windows && chrome.windows.remove) {
                        chrome.windows.remove(currentCheckoutWindowId, function () {
                            if (chrome.runtime.lastError) {}
                        });
                        currentCheckoutWindowId = null;
                    }
                }
            });
        }

        // Auto-refresh balance whenever popup window gains focus
        window.addEventListener("focus", function () {
            refreshBalance(true);
        });

        // 6. Extract Farmer Details from Active Portal Tab
        function getActiveTabHtml() {
            return new Promise(function (resolve, reject) {
                if (typeof chrome === "undefined" || !chrome.tabs || !chrome.tabs.query) {
                    return reject(new Error("Browser tabs API unavailable."));
                }
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    const activeTab = tabs && tabs[0];
                    if (!activeTab || !activeTab.id) {
                        return reject(new Error("No active browser tab found."));
                    }
                    if (activeTab.url && (activeTab.url.startsWith("chrome://") || activeTab.url.startsWith("chrome-extension://") || activeTab.url.startsWith("edge://") || activeTab.url.startsWith("about:"))) {
                        return reject(new Error("Please switch to the AgriStack farmer registry webpage tab first."));
                    }
                    chrome.scripting.executeScript({
                        target: { tabId: activeTab.id },
                        func: function () {
                            return document.documentElement.outerHTML;
                        }
                    }, function (results) {
                        if (chrome.runtime.lastError) {
                            return reject(new Error(chrome.runtime.lastError.message));
                        }
                        if (!results || !results[0] || !results[0].result) {
                            return reject(new Error("Failed to read webpage content. Ensure you are on the verified details page."));
                        }
                        resolve({ tabId: activeTab.id, html: results[0].result });
                    });
                });
            });
        }

        // 7. ⚡ 1-Click Instant Card Generation from Wallet
        if (generateBtn) {
            generateBtn.addEventListener("click", function () {
                if (!isServerConnected) {
                    setStatus("⚠️ Render deployment is paused or offline. Please resume the service on your Render dashboard.", "error");
                    return;
                }

                if (currentBalance < CARD_FEE) {
                    setStatus("⚠️ Insufficient balance (₹" + currentBalance.toFixed(2) + "). Need ₹" + CARD_FEE + ". Please recharge.", "warning");
                    if (rechargeDrawer) rechargeDrawer.style.display = "block";
                    return;
                }

                const aadhaarValue = aadhaarInput ? aadhaarInput.value.trim() : "";
                setStatus("Reading farmer registry data from active webpage...", "normal");
                generateBtn.disabled = true;

                getActiveTabHtml()
                    .then(function (pageData) {
                        setStatus("Shaping Gurmukhi text & generating card PDF...", "normal");

                        const payload = {
                            wallet_id: walletId,
                            wallet_token: walletToken,
                            html: pageData.html,
                            aadhaar: aadhaarValue
                        };

                        return fetch(currentServerUrl + "/api/card/generate", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(payload)
                        }).then(function (res) {
                            if (!res.ok) {
                                return res.json().catch(function () { return {}; }).then(function (err) {
                                    if (res.status === 402) {
                                        if (rechargeDrawer) rechargeDrawer.style.display = "block";
                                        throw new Error(err.error || "Insufficient wallet balance. Please recharge.");
                                    }
                                    throw new Error(err.error || ("Server error (" + res.status + ")"));
                                });
                            }
                            return res.json();
                        });
                    })
                    .then(function (cardData) {
                        if (cardData.status !== "success") {
                            throw new Error(cardData.error || "Card generation failed.");
                        }

                        // Update wallet balance immediately from server response
                        currentBalance = Number(cardData.wallet_balance) || 0.0;
                        updateWalletUI(cardData);

                        const downloadUrl = cardData.download_url.startsWith("http")
                            ? cardData.download_url
                            : (currentServerUrl + cardData.download_url);

                        const filename = "Punjab_Farmer_Card_" + (cardData.farmer_id || "Verified") + ".pdf";

                        // Trigger automatic PDF download in browser
                        if (typeof chrome !== "undefined" && chrome.downloads && chrome.downloads.download) {
                            chrome.downloads.download({
                                url: downloadUrl,
                                filename: filename,
                                saveAs: false
                            }, function (downloadId) {
                                if (chrome.runtime.lastError) {
                                    console.warn("Chrome download notice:", chrome.runtime.lastError);
                                    window.open(downloadUrl, "_blank");
                                }
                            });
                        } else {
                            window.open(downloadUrl, "_blank");
                        }

                        setStatus("✅ Card generated! Downloaded: " + filename + " (-₹" + CARD_FEE + ")", "success");
                        refreshBalance(true);
                    })
                    .catch(function (err) {
                        setStatus("❌ " + err.message, "error");
                    })
                    .finally(function () {
                        generateBtn.disabled = false;
                    });
            });
        }

        // 8. Toggle Activity Accordion
        if (toggleActivityBtn) {
            toggleActivityBtn.addEventListener("click", function () {
                const isOpen = activityList.style.display === "block";
                activityList.style.display = isOpen ? "none" : "block";
                if (activityArrow) activityArrow.textContent = isOpen ? "▼" : "▲";
                if (!isOpen) refreshBalance(true);
            });
        }

        // 9. Secret Admin Trigger (Triple Click on Title)
        let clickCount = 0;
        let clickTimer = null;
        if (secretAdminTrigger) {
            secretAdminTrigger.addEventListener("click", function () {
                clickCount++;
                if (clickCount >= 3) {
                    clickCount = 0;
                    if (configDrawer) {
                        configDrawer.style.display = configDrawer.style.display === "block" ? "none" : "block";
                    }
                }
                clearTimeout(clickTimer);
                clickTimer = setTimeout(function () { clickCount = 0; }, 800);
            });
        }

        if (saveServerBtn) {
            saveServerBtn.addEventListener("click", function () {
                if (serverUrlInput && serverUrlInput.value.trim()) {
                    currentServerUrl = serverUrlInput.value.trim().replace(/\/+$/, "");
                }

                if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
                    chrome.storage.local.set({
                        server_url: currentServerUrl,
                        cloud_server_url: currentServerUrl
                    });
                }

                setStatus("Server URL updated. Connecting...", "normal");
                initWallet();
            });
        }
    });
})();
