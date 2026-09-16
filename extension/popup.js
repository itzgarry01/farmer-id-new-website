/**
 * AgriStack Card Generator Helper - Extension Popup Script (Version 4.0)
 * 
 * Extracts verified farmer registration details from the active portal tab
 * and initiates secure card generation via Razorpay Payment Gateway.
 */
(function () {
    "use strict";

    const DEFAULT_SERVER_URL = "https://farmer-wallet-extension.onrender.com/";

    document.addEventListener("DOMContentLoaded", function () {
        const statusDiv = document.getElementById("status");
        const aadhaarInput = document.getElementById("aadhaar");
        const payBtn = document.getElementById("payBtn");

        function setStatus(message, type) {
            if (!statusDiv) return;
            statusDiv.textContent = message;
            if (type === "success") {
                statusDiv.className = "status-success";
            } else if (type === "error") {
                statusDiv.className = "status-error";
            } else {
                statusDiv.className = "";
            }
        }

        // 1. Health check to confirm backend connectivity
        checkBackendHealth();

        function checkBackendHealth() {
            fetch(DEFAULT_SERVER_URL + "health", { method: "GET" })
                .then(function (response) {
                    if (response.ok) {
                        setStatus("🟢 Ready for Card Generation", "success");
                    } else {
                        setStatus("⚠️ Backend connecting... Please wait.", "error");
                    }
                })
                .catch(function () {
                    setStatus("⚠️ Backend connecting... Please wait.", "error");
                });
        }

        // 2. Read HTML contents from the active AgriStack tab
        function getActiveTabHtml() {
            return new Promise(function (resolve, reject) {
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
                            return reject(new Error("Failed to read webpage contents. Make sure you are on the verified details page."));
                        }
                        resolve({ tabId: activeTab.id, html: results[0].result });
                    });
                });
            });
        }

        // 3. Initiate Razorpay Payment & Card Generation
        if (payBtn) {
            payBtn.addEventListener("click", function () {
                const aadhaarValue = aadhaarInput ? aadhaarInput.value.trim() : "";
                setStatus("Reading farmer details from webpage...", "normal");
                payBtn.disabled = true;

                getActiveTabHtml()
                    .then(function (pageData) {
                        const serverUrl = DEFAULT_SERVER_URL.replace(/\/+$/, "");
                        setStatus("Connecting to Secure Razorpay Gateway...", "normal");

                        const payload = {
                            html: pageData.html,
                            aadhaar: aadhaarValue
                        };

                        return fetch(serverUrl + "/create_payment_session", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(payload)
                        }).then(function (res) {
                            if (!res.ok) {
                                return res.json().catch(function () { return {}; }).then(function (err) {
                                    throw new Error(err.error || ("Server error (" + res.status + ")"));
                                });
                            }
                            return res.json();
                        }).then(function (sessionData) {
                            const checkoutUrl = sessionData.checkout_url.startsWith("http")
                                ? sessionData.checkout_url
                                : (serverUrl + sessionData.checkout_url);

                            let openedWindowId = null;
                            if (chrome.windows && chrome.windows.create) {
                                chrome.windows.create({
                                    url: checkoutUrl,
                                    type: "popup",
                                    width: 460,
                                    height: 700,
                                    focused: true
                                }, function (win) {
                                    openedWindowId = win ? win.id : null;
                                });
                            } else if (chrome.tabs && chrome.tabs.create) {
                                chrome.tabs.create({ url: checkoutUrl });
                            }

                            setStatus("✅ Payment window opened! Complete payment to download.", "success");

                            // Poll for order payment status
                            if (sessionData.session_id) {
                                let isCompleted = false;
                                const pollTimer = setInterval(function () {
                                    fetch(serverUrl + "/order_status?session_id=" + encodeURIComponent(sessionData.session_id))
                                        .then(function (r) { return r.json(); })
                                        .then(function (statusData) {
                                            if (statusData && statusData.status === "paid" && !isCompleted) {
                                                isCompleted = true;
                                                clearInterval(pollTimer);
                                                setStatus("🎉 Payment Complete! Farmer Card Downloaded.", "success");

                                                setTimeout(function () {
                                                    if (openedWindowId && chrome.windows && chrome.windows.remove) {
                                                        chrome.windows.remove(openedWindowId, function () {
                                                            if (chrome.runtime.lastError) {}
                                                        });
                                                    }
                                                    setStatus("✅ Farmer Card Downloaded Successfully!", "success");
                                                }, 1500);
                                            }
                                        })
                                        .catch(function () {});
                                }, 1500);

                                setTimeout(function () {
                                    clearInterval(pollTimer);
                                }, 600000);
                            }
                        });
                    })
                    .catch(function (err) {
                        setStatus("❌ " + err.message, "error");
                    })
                    .finally(function () {
                        payBtn.disabled = false;
                    });
            });
        }
    });
})();