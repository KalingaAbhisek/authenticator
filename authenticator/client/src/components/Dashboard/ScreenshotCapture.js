import React, { useState, useRef } from "react";
import "./ScreenshotCapture.css";

function ScreenshotCapture({ onDragEnd }) {
  const [dragging, setDragging] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const overlayRef = useRef(null);

  const handleMouseDown = (e) => {
    setDragging(true);
    setStartPoint({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!dragging || !overlayRef.current) return;

    // Update drag box in the overlay
    const dragBox = overlayRef.current.querySelector(".drag-box");
    if (dragBox) {
      dragBox.style.left = `${Math.min(e.clientX, startPoint.x)}px`;
      dragBox.style.top = `${Math.min(e.clientY, startPoint.y)}px`;
      dragBox.style.width = `${Math.abs(e.clientX - startPoint.x)}px`;
      dragBox.style.height = `${Math.abs(e.clientY - startPoint.y)}px`;
    }
  };

  const handleMouseUp = async (e) => {
    setDragging(false);

    const endPoint = { x: e.clientX, y: e.clientY };
    onDragEnd(startPoint, endPoint);

    // Clear the drag box styling
    const dragBox = overlayRef.current.querySelector(".drag-box");
    if (dragBox) {
      dragBox.style.width = "0";
      dragBox.style.height = "0";
    }
  };

  return (
    <div
      ref={overlayRef}
      className="overlay"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <img src="../../../build/scan.gif" alt="QR Code" className="qr-code" />
      <div className="drag-box" />
    </div>
  );
}

export default ScreenshotCapture;
