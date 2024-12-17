/*global chrome*/
// import React, { useRef, useState } from 'react';
// import html2canvas from 'html2canvas';
// import jsQR from 'jsqr';
// import './QRScanner.css';
// import domtoimage from 'dom-to-image';
// import { useEffect } from 'react';
// import { authenticator } from 'otplib';

// const QRScanner = ({props}) => {

//     const [isScanning, setIsScanning] = useState(false);
//     const [dragging, setDragging] = useState(false);
//     const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
//     const [endCoords, setEndCoords] = useState({ x: 0, y: 0 });
//     const [otp, setOtp] = useState('');
//     const [secret, setSecret] = useState(null);
//     const [qrData, setQrData] = useState(null);
//     const captureRef = useRef();
//     useEffect(()=>{
//         console.log(props);
//         if(props){
//             setIsScanning(true); 
//         }
//     },[props])
//     useEffect(() => {
//         if (secret) {
//             const interval = setInterval(() => {
//                 const newOtp = authenticator.generate(secret);
//                 setOtp(newOtp);
//             }, 15000); // Update every 15 seconds

//             return () => clearInterval(interval); // Cleanup interval on unmount
//         }
//         if(otp)
//             return otp;
//     }, [secret,otp]);
//     const handleMouseDown = (e) => {
//         if (!isScanning) return;
//         setDragging(true);
//         setStartCoords({ x: e.clientX, y: e.clientY });
//     };

//     const handleMouseMove = (e) => {
//         if (!dragging && !isScanning) return;
//         setEndCoords({ x: e.clientX, y: e.clientY });
//     };

//     const handleMouseUp = async () => {
//         if (!isScanning) return;
//         setDragging(false);
//         try {
//             await scanQRCode();
//           } catch (error) {
//             console.error('Error scanning QR code:', error);
//           }
//         setIsScanning(false);
//     };

//     const scanQRCode = async () => {
//         const element = captureRef.current;

//         // Capture only the selected area
//         const { x: startX, y: startY } = startCoords;
//         const { x: endX, y: endY } = endCoords;
    
//         const selectedWidth = Math.abs(endX - startX);
//         const selectedHeight = Math.abs(endY - startY);
    
//         // Ensure valid selection
//         if (selectedWidth <= 0 || selectedHeight <= 0) {
//           alert('Please select a valid area containing a QR code.');
//           return;
//         }
    
//         const node = document.createElement('div');
//         node.style.position = 'absolute';
//         node.style.top = `${Math.min(startY, endY)}px`;
//         node.style.left = `${Math.min(startX, endX)}px`;
//         node.style.width = `${selectedWidth}px`;
//         node.style.height = `${selectedHeight}px`;
//         node.style.overflow = 'hidden';
//         document.body.appendChild(node);

//         const dataURL = await domtoimage.toPng(element, {
//           clip: {
//             x: startX,
//             y: startY,
//             width: selectedWidth,
//             height: selectedHeight,
//           },
//         });

//         console.log('dataURL',dataURL);
    
//         const image = new Image();
//         image.src = dataURL;
//         image.onload = async () => {
//           const canvas = document.createElement('canvas');
//           const ctx = canvas.getContext('2d');
//           canvas.width = selectedWidth;
//           canvas.height = selectedHeight;
//           ctx.drawImage(image, 0, 0, selectedWidth, selectedHeight);
    
//           const imageData = ctx.getImageData(0, 0, selectedWidth, selectedHeight);
//           const qrCode = await jsQR(imageData.data, selectedWidth, selectedHeight);
    
//           if (qrCode) {
//             alert(`QR Code detected: ${qrCode.data}`);
//             setQrData(qrCode.data);
//             setSecret(qrCode.data); // Assuming the secret is in the QR code
//           } else {
//             alert('No QR Code found in the selected area.');
//           }
//         };
//         // const element = captureRef.current;
//         // const { width, height } = element.getBoundingClientRect();
//         // const canvas = await html2canvas(document.body, {
//         //     width,
//         //     height,
//         //     useCORS: true,
//         // });

//         // const ctx = canvas.getContext('2d',{ willReadFrequently: true });
//         // const { x: startX, y: startY } = startCoords;
//         // const { x: endX, y: endY } = endCoords;

//         // const selectedWidth = Math.abs(endX - startX);
//         // const selectedHeight = Math.abs(endY - startY);

//         // if (selectedWidth <= 0 || selectedHeight <= 0) {
//         //     alert('Please select a valid area containing a QR code.');
//         //     return;
//         // }
    
//         // const imageData = await ctx.getImageData(startX, startY, selectedWidth, selectedHeight);
//         // // ctx.putImageData(imageData, 0, 0);
//         // // console.log('width',width,'height',height);
//         // // console.log('imageData', imageData);
//         // // const imageSrc = canvas.toDataURL();
//         // // console.log('imageSrc',imageSrc);
//         // const qrCode = await jsQR(imageData.data, selectedWidth, selectedHeight);
//         // console.log('qrCode', qrCode);
//         // if (qrCode) {
//         //     alert(`QR Code detected: ${qrCode.data}`);
//         //     setQrData(qrCode.data)
//         //     setSecret(qrCode.data); 
//         // } else {
//         //     alert('No QR Code found in the selected area.');
//         // }
//     };

//     return (
//         <div style={{ position: 'relative' }}>
//             {isScanning && (
//                 <div
//                 ref={captureRef}
//                     style={{
//                         position: 'fixed',
//                         top: 0,
//                         left: 0,
//                         width: '100%',
//                         height: '100%',
//                         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//                         zIndex: 1000,
//                     }}
//                     onMouseDown={handleMouseDown}
//                     onMouseMove={handleMouseMove}
//                     onMouseUp={handleMouseUp}
//                 >
//                     {dragging && (
//                         <div
//                             style={{
//                                 position: 'absolute',
//                                 border: '2px dashed black',
//                                 backgroundColor: 'rgba(255, 255, 255, 0.2)',
//                                 left: Math.min(startCoords.x, endCoords.x),
//                                 top: Math.min(startCoords.y, endCoords.y),
//                                 width: Math.abs(endCoords.x - startCoords.x),
//                                 height: Math.abs(endCoords.y - startCoords.y),
//                             }}
//                         />
//                     )}
//                 </div>
//             )}
//                         {/* Display OTP if available */}
//                         {secret && (
//                 <div style={{ marginTop: '20px' }}>
//                     <h3>Generated OTP: {otp}</h3>
//                     <p>(This OTP refreshes every 15 seconds)</p>
//                 </div>
//             )}

//             {/* Display scanned QR code data */}
//             {qrData && <p>Scanned Data: {qrData}</p>}
//         </div>
//     );
// };

// export default QRScanner;


import React, { useRef, useState } from 'react';

const QRScanner = () => {
  const [screenshotUrl, setScreenshotUrl] = useState(null);
  const [selection, setSelection] = useState(null);
  const canvasRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);

  // Capture Screenshot
  const captureScreenshot = () => {
    chrome.runtime.sendMessage({ message: "capture" }, (response) => {
      if (response.screenshotUrl) {
        setScreenshotUrl(response.screenshotUrl);
      }
    });
  };

  // Handle Mouse Down to Start Selection
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.nativeEvent.offsetX;
    startY.current = e.nativeEvent.offsetY;
    setSelection({ x: startX.current, y: startY.current, width: 0, height: 0 });
  };

  // Handle Mouse Move to Update Selection
  const handleMouseMove = (e) => {
    if (isDragging.current && selection) {
      const width = e.nativeEvent.offsetX - startX.current;
      const height = e.nativeEvent.offsetY - startY.current;
      setSelection({ ...selection, width, height });
    }
  };

  // Handle Mouse Up to Finalize Selection
  const handleMouseUp = () => {
    isDragging.current = false;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y, width, height } = selection;

    // Draw the selection area onto canvas
    const image = new Image();
    image.src = screenshotUrl;
    image.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        image,
        x,
        y,
        width,
        height,
        0,
        0,
        canvas.width,
        canvas.height
      );
    };
  };

  return (
    <div style={{ width: 300, height: 400 }}>
      <button onClick={captureScreenshot}>Capture Screenshot</button>
      {screenshotUrl && (
        <div>
          <p>Select an area to capture:</p>
          <img
            src={screenshotUrl}
            alt="screenshot"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ width: '100%', cursor: 'crosshair' }}
          />
          <canvas ref={canvasRef} width={300} height={200} style={{ border: "1px solid black" }} />
        </div>
      )}
    </div>
  );
};

export default QRScanner;
