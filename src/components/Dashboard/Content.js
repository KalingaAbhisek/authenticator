/*global chrome*/
import QRCode from "qrcode-reader";
import jsQR from "jsqr";

// @ts-expect-error - injected by vue-svg-loader
import scanGIF from "../../../build/scan.gif";

if (!document.getElementById("__ga_grayLayout__")) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
      case "capture":
        sendResponse("beginCapture");
        showGrayLayout();
        break;
      case "sendCaptureUrl":
        qrDecode(
          message.info.url,
          message.info.captureBoxLeft,
          message.info.captureBoxTop,
          message.info.captureBoxWidth,
          message.info.captureBoxHeight
        );
        break;
      case "stopCapture":
        hideGrayLayout();
        break;
      default:
        // invalid command, ignore it
        break;
    }
    return true; // Keep the message channel open for async response
  });
}

sessionStorage.setItem("captureBoxPositionLeft", "0");
sessionStorage.setItem("captureBoxPositionTop", "0");

function showGrayLayout() {
  let grayLayout = document.getElementById("__ga_grayLayout__");
  let qrCanvas = document.getElementById("__ga_qrCanvas__");
  
  if (!grayLayout) {
    qrCanvas = document.createElement("canvas");
    qrCanvas.id = "__ga_qrCanvas__";
    qrCanvas.style.display = "none";
    document.body.appendChild(qrCanvas);

    grayLayout = document.createElement("div");
    grayLayout.id = "__ga_grayLayout__";
    grayLayout.style.position = "fixed";
    grayLayout.style.top = "0";
    grayLayout.style.left = "0";
    grayLayout.style.width = "100vw";
    grayLayout.style.height = "100vh";
    grayLayout.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    grayLayout.style.zIndex = "9999";
    grayLayout.style.cursor = "crosshair";
    document.body.appendChild(grayLayout);

    const scan = document.createElement("div");
    scan.className = "scan";
    scan.id = "__ga_scan__";
    scan.style.background = `url('${scanGIF}') no-repeat center`;
    grayLayout.appendChild(scan);

    const captureBox = document.createElement("div");
    captureBox.id = "__ga_captureBox__";
    captureBox.style.position = "absolute";
    captureBox.style.border = "2px dashed red";
    captureBox.style.display = "none";
    grayLayout.appendChild(captureBox);

    grayLayout.onmousedown = grayLayoutDown;
    grayLayout.onmousemove = grayLayoutMove;
    grayLayout.onmouseup = (event) => grayLayoutUp(event);
    grayLayout.oncontextmenu = (event) => {
      event.preventDefault();
      return;
    };
  }

  grayLayout.style.display = "block";
}

function hideGrayLayout() {
  const grayLayout = document.getElementById("__ga_grayLayout__");
  const captureBox = document.getElementById("__ga_captureBox__");
  if (grayLayout) {
    grayLayout.style.display = "none";
  }
  if (captureBox) {
    captureBox.style.display = "none";
  }
}

function grayLayoutDown(event) {
  if (event.button === 1 || event.button === 2) {
    event.preventDefault();
    return;
  }
  
  const captureBox = document.getElementById("__ga_captureBox__");
  if (!captureBox) {
    return;
  }

  sessionStorage.setItem("captureBoxPositionLeft", event.clientX.toString());
  sessionStorage.setItem("captureBoxPositionTop", event.clientY.toString());
  captureBox.style.left = event.clientX + "px";
  captureBox.style.top = event.clientY + "px";
  captureBox.style.width = "1px";
  captureBox.style.height = "1px";
  captureBox.style.display = "block";

  const scan = document.getElementById("__ga_scan__");
  if (scan) {
    scan.style.background = "transparent";
  }
  return;
}

function grayLayoutMove(event) {
  if (event.button === 1 || event.button === 2) {
    event.preventDefault();
    return;
  }
  
  const captureBox = document.getElementById("__ga_captureBox__");
  if (!captureBox) {
    return;
  }

  const captureBoxLeft = Math.min(
    Number(sessionStorage.getItem("captureBoxPositionLeft")),
    event.clientX
  );
  const captureBoxTop = Math.min(
    Number(sessionStorage.getItem("captureBoxPositionTop")),
    event.clientY
  );
  const captureBoxWidth = Math.abs(
    Number(sessionStorage.getItem("captureBoxPositionLeft")) - event.clientX
  );
  const captureBoxHeight = Math.abs(
    Number(sessionStorage.getItem("captureBoxPositionTop")) - event.clientY
  );
  
  captureBox.style.left = captureBoxLeft + "px";
  captureBox.style.top = captureBoxTop + "px";
  captureBox.style.width = captureBoxWidth + "px";
  captureBox.style.height = captureBoxHeight + "px";
  return;
}

function grayLayoutUp(event) {
  const grayLayout = document.getElementById("__ga_grayLayout__");
  const captureBox = document.getElementById("__ga_captureBox__");
  if (!captureBox || !grayLayout) {
    return;
  }

  if (event.button === 1 || event.button === 2) {
    event.preventDefault();
    return;
  }

  const captureBoxLeft = Math.min(
    Number(sessionStorage.getItem("captureBoxPositionLeft")),
    event.clientX
  );
  const captureBoxTop = Math.min(
    Number(sessionStorage.getItem("captureBoxPositionTop")),
    event.clientY
  );
  const captureBoxWidth = Math.abs(
    Number(sessionStorage.getItem("captureBoxPositionLeft")) - event.clientX
  );
  const captureBoxHeight = Math.abs(
    Number(sessionStorage.getItem("captureBoxPositionTop")) - event.clientY
  );

  // Send the capture box info to background script for processing
  chrome.runtime.sendMessage({
    action: "getCapture",
    info: {
      captureBoxLeft,
      captureBoxTop,
      captureBoxWidth,
      captureBoxHeight,
    },
  });

  // Hide elements after capturing
  setTimeout(() => {
    captureBox.style.display = "none";
    grayLayout.style.display = "none";
  }, 100);
  return false;
}

async function qrDecode(url, left, top, width, height) {
  const canvas = document.getElementById("__ga_qrCanvas__");
  const qr = new Image();
  qr.onload = () => {
    const devicePixelRatio = qr.width / window.innerWidth;
    canvas.width = qr.width;
    canvas.height = qr.height;
    canvas.getContext("2d").drawImage(qr, 0, 0);
    const imageData = canvas.getContext("2d").getImageData(
      left * devicePixelRatio,
      top * devicePixelRatio,
      width * devicePixelRatio,
      height * devicePixelRatio
    );

    if (imageData) {
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      canvas.getContext("2d").putImageData(imageData, 0, 0);

      const qrReader = new QRCode();
      qrReader.callback = (error, text) => {
        let qrRes = "";
        if (error) {
          console.error(error);
          const jsQrCode = jsQR(imageData.data, imageData.width, imageData.height);
          if (jsQrCode) {
            qrRes = jsQrCode.data;
          } else {
            alert(chrome.i18n.getMessage("errorqr"));
          }
        } else {
          qrRes = text.result;
        }

        chrome.runtime.sendMessage({
          action: "getTotp",
          info: qrRes,
        });
      };
      qrReader.decode(imageData);
    }
  };
  qr.src = url;
}

// To handle escape key press to cancel the capture
window.onkeydown = (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    hideGrayLayout();
  }
};
