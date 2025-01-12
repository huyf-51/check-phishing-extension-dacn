(async () => {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });

    fetch('https://phishing-url-api.onrender.com/predict', {
        method: 'POST',
        body: JSON.stringify({ url: tab.url }),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((res) => res.json())
        .then((data) => {
            document.getElementById('result-container').style.display = 'block';
            document.getElementById('loader').style.display = 'none';
            const inputUrl = tab.url;
            const output = data['prediction'];
            const resultContainer = document.getElementById('result-container');
            const urlStatus = document.getElementById('url-status');
            const urlName = document.getElementById('url-name');
            const extraInfo = {
                top1m: document.getElementById('top-1m'),
                sslDetected: document.getElementById('ssl-detected'),
                olderThan3Months: document.getElementById(
                    'older-than-3-months'
                ),
                temporaryDomain: document.getElementById('temporary-domain'),
                googleSafe: document.getElementById('google-safe'),
                nortonSafe: document.getElementById('norton-safe'),
                urlVoidBlacklist: document.getElementById('url-void-blacklist'),
                mcafeeBlacklist: document.getElementById('mcafee-blacklist'),
                sucuriBlacklist: document.getElementById('sucuri-blacklist'),
                ipsetBlacklist: document.getElementById('ipset-blacklist'),
            };
            const targetUrlsContainer = document.getElementById(
                'target-urls-container'
            );
            const tryAgainBtn = document.getElementById('try-again-btn');

            // Score handling
            const HIGHEST_URL_SCORE = 180;
            const urlScore = output['SCORE'];
            let threatLevel = null;

            if (urlScore >= 120) {
                threatLevel = 'SAFE';
                urlStatus.innerHTML =
                    'The given URL is SAFE! ✅ No Malicious activity detected.';
            } else if (urlScore > 60 && urlScore < 120) {
                threatLevel = 'POTENTIAL';
                urlStatus.innerHTML =
                    'The given URL is Potentially Risky! ⚠️ Use Incognito Mode & VPN for safety.';
            } else {
                threatLevel = 'RISKY';
                urlStatus.innerHTML =
                    "The given URL is Highly Malicious! ❌ Please Don't Visit It.";
            }

            urlName.innerText = `${inputUrl}`;

            // Populate extra information
            extraInfo.top1m.innerText = `In Top Most Visited Sites: ${
                output.InTop1Million ? '✅ Yes' : '❌ No'
            }`;
            extraInfo.sslDetected.innerText = `SSL Certificate Detected: ${
                output.hasSSLCertificate ? '✅ Yes' : '❌ No'
            }`;
            extraInfo.olderThan3Months.innerText = `Domain is Older Than 3 Months: ${
                output.isOlderThan3Months ? '✅ Yes' : '❌ No'
            }`;
            extraInfo.temporaryDomain.innerText = `Uses Temporary Domain: ${
                output.isTemporaryDomain ? '❌ Yes' : '✅ No'
            }`;
            extraInfo.googleSafe.innerText = `Passed Google WebSafe Evaluation: ${
                output.GoogleSafePassed ? '✅ Yes' : '❌ No'
            }`;
            extraInfo.nortonSafe.innerText = `Passed Norton WebSafe Evaluation: ${
                output.NortonWebSafePassed ? '✅ Yes' : '❌ No'
            }`;
            extraInfo.urlVoidBlacklist.innerText = `Blacklisted in URLVoid sources: ${
                output.InURLVoidBlackList ? '❌ Yes' : '✅ No'
            }`;
            extraInfo.mcafeeBlacklist.innerText = `Blacklisted in McAfee sources: ${
                output.InMcaffeBlackList ? '❌ Yes' : '✅ No'
            }`;
            extraInfo.sucuriBlacklist.innerText = `Blacklisted in Sucuri sources: ${
                output.InSucuriBlacklist ? '❌ Yes' : '✅ No'
            }`;
            extraInfo.ipsetBlacklist.innerText = `Blacklisted in IpSet sources: ${
                output.isBlackListedinIpSets ? '❌ Yes' : '✅ No'
            }`;

            document
                .getElementById('toggle-btn')
                .addEventListener('click', function () {
                    var extraInfo = document.getElementById('extra-info');
                    if (extraInfo.style.display === 'none') {
                        extraInfo.style.display = 'block'; // Show the div (you can use 'block' or 'flex' depending on your layout)
                        this.textContent = 'Hide Info';
                    } else {
                        extraInfo.style.display = 'none'; // Hide the div
                        this.textContent = 'Show Info';
                    }
                });
        });
})();
