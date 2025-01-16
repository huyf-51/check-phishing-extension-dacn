chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  const currentUrl = tabs[0].url; // Lấy URL của tab hiện tại
  checkPhishing(currentUrl);
});

// Hàm gửi request đến API và nhận kết quả
function checkPhishing(url) {
  const apiUrl = `https://phising-url-api-dacn.onrender.com/predict?url=${encodeURIComponent(
    url
  )}`;

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.text()) // Chuyển từ JSON sang text
    .then((data) => {
      chrome.action.setPopup({
        popup: "popup.html",
      });

      // Giả sử data trả về là một số float
      const chance = parseFloat(data); // Chuyển đổi sang kiểu float
      chrome.action.setBadgeText({ text: `${chance}%` });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
