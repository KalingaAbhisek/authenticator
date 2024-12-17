let otpInterval;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generateOTP') {
    const qrCodeData = request.data;
    const qrCode = new QRCode(document.getElementById('qr-code'), {
      text: qrCodeData
    });
    // Generate OTP using jsqrcode or another library
    const otp = generateOTP(qrCodeData);
    chrome.runtime.sendMessage({ action: 'updateOTP', otp });
    clearInterval(otpInterval); // Clear existing interval
    otpInterval = setInterval(() => {
      // Refresh OTP every 15 seconds
      const newOTP = generateOTP(qrCodeData);
      chrome.runtime.sendMessage({ action: 'updateOTP', otp: newOTP });
    }, 15000);
  }
});