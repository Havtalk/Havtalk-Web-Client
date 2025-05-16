"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface CursorPosition {
  x: number;
  y: number;
}

export function CustomCursor() {
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    // Detect if on mobile/touch device
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  useEffect(() => {
    // Skip all cursor logic on mobile
    if (isMobile) return;
    
    // Only show custom cursor after it has moved - prevents initial flash at 0,0
    const addEventListeners = () => {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseenter", onMouseEnter);
      document.addEventListener("mouseleave", onMouseLeave);
      document.addEventListener("mousedown", onMouseDown);
      document.addEventListener("mouseup", onMouseUp);
    };

    const removeEventListeners = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (hidden) setHidden(false);
    };

    const onMouseEnter = () => {
      setHidden(false);
    };

    const onMouseLeave = () => {
      setHidden(true);
    };

    const onMouseDown = () => {
      setClicked(true);
    };

    const onMouseUp = () => {
      setClicked(false);
    };

    // Add hover detection to interactive elements
    const handleElementHover = () => {
      setHovered(true);
    };

    const handleElementLeave = () => {
      setHovered(false);
    };

    const interactiveElements = document.querySelectorAll(
      "a, button, [role='button'], input, textarea, select, [tabindex='0']"
    );

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleElementHover);
      el.addEventListener("mouseleave", handleElementLeave);
    });

    addEventListeners();

    return () => {
      removeEventListeners();
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleElementHover);
        el.removeEventListener("mouseleave", handleElementLeave);
      });
    };
  }, [hidden, isMobile]);
  
  // Don't render the custom cursor on mobile
  if (isMobile) return null;

  return (
    <div
      className={`pointer-events-none fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center ${
        hidden ? "opacity-0" : "opacity-100"
      } transition-opacity duration-150`}
      style={{
        pointerEvents: "none",
        position: "fixed",
        zIndex: 9999,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      {/* Main cursor dot */}
      <div
        className={`absolute rounded-full transition-transform duration-150 ${
          clicked ? "scale-75" : hovered ? "scale-150" : "scale-100"
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: "10px",
          height: "10px",
          backgroundColor: isDark ? "#FFFFFF" : "#000000",
          transform: "translate(-50%, -50%)",
          boxShadow: `0 0 ${clicked ? "10px" : hovered ? "20px" : "0px"} ${
            isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"
          }`,
          transition: "width 0.2s, height 0.2s, background-color 0.2s, box-shadow 0.2s, transform 0.1s",
        }}
      />

      {/* Outer cursor ring */}
      <div
        className={`absolute rounded-full border-2 transition-transform duration-300 ${
          clicked ? "scale-75" : hovered ? "scale-150" : "scale-100"
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: "30px",
          height: "30px",
          borderColor: isDark ? "#FFFFFF" : "#000000",
          transform: "translate(-50%, -50%)",
          opacity: hovered ? 0.8 : 0.4,
          transition: "width 0.3s, height 0.3s, opacity 0.3s, transform 0.2s",
        }}
      />
      
      {/* Custom effects for different states */}
      {hovered && (
        <div
          className="absolute rounded-full animate-ping"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: "15px",
            height: "15px",
            backgroundColor: "var(--primary)",
            transform: "translate(-50%, -50%)",
            opacity: 0.5,
          }}
        />
      )}
      
      {clicked && (
        <div
          className="absolute rounded-full"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: "40px",
            height: "40px",
            backgroundColor: "transparent",
            border: `2px solid var(--primary)`,
            transform: "translate(-50%, -50%) scale(0)",
            animation: "ping 1s cubic-bezier(0, 0, 0.2, 1) forwards",
            opacity: 0,
          }}
        />
      )}
    </div>
  );
} 