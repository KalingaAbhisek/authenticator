/*global chrome*/
// content.js

function addSelectionOverlay() {
    if (document.getElementById("selection-overlay")) {
        return; // Prevent re-activation
    }
    let startX, startY, endX, endY; // Declare these inside the function to avoid re-declaration issues
    let selectionBox = null;
    // Create a full-screen overlay
    const overlay = document.createElement("div");
    overlay.id = "selection-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.background = "rgba(0,0,0,0.3)";
    overlay.style.zIndex = "9999";
    overlay.style.cursor = "crosshair";
    document.body.appendChild(overlay);
  
    // Start drawing the selection box on mouse down
    overlay.addEventListener("mousedown", (e) => {
        if (e.button === 1 || e.button === 2) {
            e.preventDefault();
            return;
          }
      startX = e.clientX;
      startY = e.clientY;
      sessionStorage.setItem("captureBoxPositionLeft", e.clientX.toString());
      sessionStorage.setItem("captureBoxPositionTop", e.clientY.toString());
      // Create the selection box element
      selectionBox = document.createElement("div");
      selectionBox.style.position = "absolute";
      selectionBox.style.border = "2px dashed #ffffff";
      selectionBox.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
      selectionBox.style.left = `${startX}px`;
      selectionBox.style.top = `${startY}px`;
      selectionBox.style.zIndex = "10000";
      selectionBox.style.width = "1px";
      selectionBox.style.height = "1px";
      selectionBox.style.display = "block";
      selectionBox.style.overflow = 'hidden';
      overlay.appendChild(selectionBox);
  
      // Update the size of the selection box as mouse moves
      overlay.addEventListener("mousemove", updateSelectionBox);
    });
  
    // Function to update the selection box dimensions
    function updateSelectionBox(e) {
        selectionBox.style.width = `${Math.abs(sessionStorage.getItem("captureBoxPositionLeft") - e.clientX) - 1} px`;
        selectionBox.style.height = `${Math.abs(sessionStorage.getItem("captureBoxPositionTop") - e.clientX) - 1} px`;
        selectionBox.style.left = `${Math.min(sessionStorage.getItem("captureBoxPositionLeft"), startX)}px`;
        selectionBox.style.top = `${Math.min(sessionStorage.getItem("captureBoxPositionTop"), startY)}px`;
    }
  
    // Finalize selection on mouse up
    overlay.addEventListener("mouseup", async (e) => {
      endX = e.clientX;
      endY = e.clientY;
      overlay.removeEventListener("mousemove", updateSelectionBox);
      overlay.remove();
      selectionBox.remove();
      setTimeout(() => {
        overlay.style.display = "none";
        selectionBox.style.display = "none";
      }, 100);

      if (e.button === 1 || e.button === 2) {
        e.preventDefault();
        return;
      }
  
      const { x, y, width, height } = getSelectionBoxDimensions();
      if (width > 0 && height > 0) {
        // Capture the visible area of the tab
        chrome.runtime.sendMessage({ action: "captureVisibleTab" }, async (screenshotUrl) => {
          if (screenshotUrl) {
            const croppedImageUrl = await cropImage(screenshotUrl, x, y, width, height);
            console.log("Cropped Screenshot URL:", croppedImageUrl);
          }
          else{
            console.log("No Screenshot");
          }
        });
      }
    });
  
    // Function to get final selection box dimensions
    function getSelectionBoxDimensions() {
      return {
        x: Math.min(startX, endX),
        y: Math.min(startY, endY),
        width: Math.abs(endX - startX),
        height: Math.abs(endY - startY),
      };
    }
  
    // Function to crop the image to the selected area
    async function cropImage(screenshotUrl, x, y, width, height) {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = screenshotUrl;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
          resolve(canvas.toDataURL("image/png"));
        };
      });
    }
  }
  addSelectionOverlay();


  // content.js

// const SelectionOverlay = (() => {
//     let overlayActive = false; // Flag to track if the overlay is active
//     let overlay, startX, startY, endX, endY, selectionBox;
  
//     const initOverlay = () => {
//       if (overlayActive) return; // Exit if the overlay is already active
//       overlayActive = true; // Set the overlay as active
  
//       // Create a full-screen overlay
//       overlay = document.createElement("div");
//       overlay.style.position = "fixed";
//       overlay.style.top = "0";
//       overlay.style.left = "0";
//       overlay.style.width = "100vw";
//       overlay.style.height = "100vh";
//       overlay.style.background = "rgba(0,0,0,0.3)";
//       overlay.style.zIndex = "9999";
//       overlay.style.cursor = "crosshair";
//       document.body.appendChild(overlay);
  
//       // Start drawing the selection box on mouse down
//       overlay.addEventListener("mousedown", onMouseDown);
//     };
  
//     const onMouseDown = (e) => {
//       startX = e.clientX;
//       startY = e.clientY;
  
//       // Create the selection box element
//       selectionBox = document.createElement("div");
//       selectionBox.style.position = "absolute";
//       selectionBox.style.border = "2px dashed #ffffff";
//       selectionBox.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
//       selectionBox.style.left = `${startX}px`;
//       selectionBox.style.top = `${startY}px`;
//       selectionBox.style.zIndex = "10000";
//       overlay.appendChild(selectionBox);
  
//       // Update the size of the selection box as mouse moves
//       overlay.addEventListener("mousemove", updateSelectionBox);
//       overlay.addEventListener("mouseup", onMouseUp);
//     };
  
//     const onMouseUp = async (e) => {
//       endX = e.clientX;
//       endY = e.clientY;
//       overlay.removeEventListener("mousemove", updateSelectionBox);
//       overlay.remove();
  
//       const { x, y, width, height } = getSelectionBoxDimensions();
//       if (width > 0 && height > 0) {
//         // Capture the visible area of the tab
//         chrome.runtime.sendMessage({ action: "captureVisibleTab" }, async (screenshotUrl) => {
//           if (screenshotUrl) {
//             const croppedImageUrl = await cropImage(screenshotUrl, x, y, width, height);
//             console.log("Cropped Screenshot URL:", croppedImageUrl);
//           }
//         });
//       }
  
//       overlayActive = false; // Reset the overlay active status
//     };
  
//     const updateSelectionBox = (e) => {
//       selectionBox.style.width = `${Math.abs(e.clientX - startX)}px`;
//       selectionBox.style.height = `${Math.abs(e.clientY - startY)}px`;
//       selectionBox.style.left = `${Math.min(e.clientX, startX)}px`;
//       selectionBox.style.top = `${Math.min(e.clientY, startY)}px`;
//     };
  
//     const getSelectionBoxDimensions = () => {
//       return {
//         x: Math.min(startX, endX) + window.scrollX,
//         y: Math.min(startY, endY) + window.scrollY,
//         width: Math.abs(endX - startX),
//         height: Math.abs(endY - startY),
//       };
//     };
  
//     const cropImage = (screenshotUrl, x, y, width, height) => {
//       return new Promise((resolve) => {
//         const img = new Image();
//         img.src = screenshotUrl;
//         img.onload = () => {
//           const canvas = document.createElement("canvas");
//           canvas.width = width;
//           canvas.height = height;
//           const ctx = canvas.getContext("2d");
//           ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
//           resolve(canvas.toDataURL("image/png"));
//         };
//       });
//     };
  
//     return {
//       init: initOverlay,
//     };
//   })();
  
//   // Initialize the overlay when the content script runs
//   SelectionOverlay.init();
  
  