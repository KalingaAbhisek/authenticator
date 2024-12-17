/*global chrome*/
let contentTab;
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === "SIGN_IN") {
      const clientId = '537289145594-9ph1g0pql3s5nn41cmgb96g6hc8bse71.apps.googleusercontent.com';
      let accessToken = "";
      let userInfo = "";
        chrome.identity.launchWebAuthFlow(
          {
            // url: `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&access_type=offline&client_id=${clientId}&scope=https%3A//www.googleapis.com/auth/userinfo.profile&prompt=consent&redirect_uri=${encodeURIComponent(`https://kalinga.io/`)}`,
            url: `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(`https://${chrome.runtime.id}.chromiumapp.org/`)}&scope=profile email`,
            interactive: true
          },
          (redirectUrl) => {
            console.log('redirectUrl', redirectUrl);
            if (chrome.runtime.lastError || !redirectUrl) {
              console.log("Authentication failed:", JSON.stringify(chrome.runtime.lastError));
              return;
            }
            
            const urlParams = new URLSearchParams(new URL(redirectUrl).hash.replace("#", "?"));
            console.log('urlParams',urlParams);
            accessToken = urlParams.get("access_token");
            console.log('accessToken',accessToken);
            
            if (accessToken) {
              console.log("Access token:", accessToken);
              fetch("https://www.googleapis.com/oauth2/v2/userinfo?alt=json", {
                headers: {
                  Authorization: `Bearer ${accessToken}`
                }
              })
                .then((response) => response.json())
                .then((user) => {
                  userInfo = user;
                  sendResponse({ success: true, userInfo,accessToken });
                  console.log("User Info:", userInfo);
                })
                .catch((error) => {
                  sendResponse({ success: false, userInfo, accessToken });
                  console.error("Failed to fetch user info:", error)});              
            }
          }
        );
        return true;
    }
// background.js
if (message.action === "captureVisibleTab") {
  console.log("message",message);
  console.log("sender",sender);
  console.log("sendResponse",sendResponse);
  if(!sender.tab) return;
  const dataUrl = await getCapture(sender.tab);
  console.log('dataUrl',dataUrl);
  return true; // Keeps the message channel open for async sendResponse
}
if (message.action === "executeContentScript") {
  chrome.scripting.executeScript({
    target: { tabId: message.tabId },
    files: ["content.js"]
  });
}

  });
  chrome.alarms.onAlarm.addListener(() => {
    chrome.storage.session.set({ cachedPassphrase: null, cachedKeyId: null });
    if (contentTab && contentTab.id) {
      chrome.tabs.sendMessage(contentTab.id, { action: "stopCapture" });
    }
    chrome.runtime.sendMessage({ action: "stopImport" });
  
    // https://stackoverflow.com/a/56483156
    return true;
  }); 

  async function getCapture(tab) {
    const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, {
      format: "png",
    });
  
    return dataUrl;
  }