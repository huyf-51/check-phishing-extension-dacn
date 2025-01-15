chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentUrl = tabs[0].url; // Lấy URL của tab hiện tại
    document.getElementById('currentUrl').textContent = currentUrl;

    const apiUrl = `https://phishing-url-api.onrender.com/predict?url=${encodeURIComponent(
        currentUrl
    )}`;

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((data) => {
            const resultDiv = document.getElementById('result');

            // Xóa các class cũ trước khi thêm mới
            resultDiv.classList.remove('safe', 'phishing', 'unknown');

            // Gán class và nội dung dựa trên kết quả
            if (data.prediction === 0) {
                resultDiv.textContent = 'The URL is safe.';
                resultDiv.classList.add('safe');
            } else if (data.prediction === 1) {
                resultDiv.textContent = 'The URL is phishing.';
                resultDiv.classList.add('phishing');
            } else {
                resultDiv.textContent = 'Unknown response.';
                resultDiv.classList.add('unknown');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});
