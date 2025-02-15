chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  const currentUrl = tabs[0].url; // Lấy URL của tab hiện tại
  document.getElementById("currentUrl").textContent = currentUrl;

  const apiUrl = `https://phising-url-api-dacn.onrender.com/predict?url=${encodeURIComponent(
    currentUrl
  )}`;

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.text()) // Chuyển từ JSON sang text
    .then((data) => {
      const resultDiv = document.getElementById("result");

      // Xóa các class cũ trước khi thêm mới
      resultDiv.classList.remove("safe", "phishing", "unknown");

      // Lấy giá trị phần trăm và hiển thị
      const chance = parseFloat(data); // Chuyển đổi sang kiểu float
      resultDiv.textContent = `There is ${chance}% chance, the URL is malicious!`;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
