/*global chrome*/
import React, { useState, useRef, useEffect } from 'react';

function DraggableScreenshot({ onComplete }) {
  const [selection, setSelection] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const startCoords = useRef(null);

  const handleMouseDown = (e) => {
    startCoords.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const currentCoords = { x: e.clientX, y: e.clientY };
    setSelection({
      left: Math.min(startCoords.current.x, currentCoords.x),
      top: Math.min(startCoords.current.y, currentCoords.y),
      width: Math.abs(startCoords.current.x - currentCoords.x),
      height: Math.abs(startCoords.current.y - currentCoords.y),
    });
  };

  const handleMouseUp = async () => {
    setIsDragging(false);
    if (selection) {
      // Use Chrome's captureVisibleTab to capture the entire visible screen
      chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
        const image = new Image();
        image.src = dataUrl;
        image.onload = () => {
          // Create a canvas to crop the selected area
          const canvas = document.createElement('canvas');
          canvas.width = selection.width;
          canvas.height = selection.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(
            image,
            selection.left,
            selection.top,
            selection.width,
            selection.height,
            0,
            0,
            selection.width,
            selection.height
          );
          // Now you have the cropped screenshot in canvas
          const croppedImageUrl = canvas.toDataURL('image/png');
          console.log(croppedImageUrl); // Use this URL as needed
          onComplete(); // Finish screenshot mode
        };
      });
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, cursor: 'crosshair' }}
      onMouseDown={handleMouseDown}
    >
      {selection && (
        <div
          style={{
            position: 'absolute',
            border: '2px dashed #00f',
            left: selection.left,
            top: selection.top,
            width: selection.width,
            height: selection.height,
          }}
        ></div>
      )}
    </div>
  );
}

export default DraggableScreenshot;
