import { useEffect } from 'react';
import { CAMERA_SENSITIVITY, MAX_ROTATION_SPEED, MOBILE_SETTINGS } from '../constants';
import type { MouseState } from '../types';
import { PerformanceMonitor } from '../utils/performance';

export function useMouseControls(
  gl: THREE.WebGLRenderer,
  mouseState: MouseState,
  isMobile?: boolean
) {
  useEffect(() => {
    const performanceMonitor = PerformanceMonitor.getInstance();
    let lastEventTime = 0;
    const EVENT_THROTTLE = 16; // ~60fps

    const handleStart = (x: number, y: number) => {
      mouseState.isDragging.current = true;
      mouseState.previousPosition.current = { x, y };
      mouseState.velocity.current = { x: 0, y: 0 };
    };

    const handleMove = (x: number, y: number) => {
      if (!mouseState.isDragging.current) return;

      const now = performance.now();
      if (now - lastEventTime < EVENT_THROTTLE) return;
      lastEventTime = now;

      const deltaX = x - mouseState.previousPosition.current.x;
      const deltaY = y - mouseState.previousPosition.current.y;

      // Apply sensitivity based on device and performance
      const sensitivity = isMobile 
        ? MOBILE_SETTINGS.CAMERA_SENSITIVITY 
        : performanceMonitor.shouldReduceQuality() 
          ? CAMERA_SENSITIVITY * 0.5 
          : CAMERA_SENSITIVITY;

      mouseState.targetRotation.current.y += deltaX * sensitivity;
      mouseState.targetRotation.current.x += deltaY * sensitivity;

      mouseState.velocity.current.x = Math.max(-MAX_ROTATION_SPEED, 
        Math.min(MAX_ROTATION_SPEED, deltaY * sensitivity * 0.05));
      mouseState.velocity.current.y = Math.max(-MAX_ROTATION_SPEED, 
        Math.min(MAX_ROTATION_SPEED, deltaX * sensitivity * 0.05));

      mouseState.previousPosition.current = { x, y };
    };

    const handleEnd = () => {
      mouseState.isDragging.current = false;
    };

    // Mouse event handlers
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 2) return; // Only handle right mouse button
      handleStart(e.clientX, e.clientY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (e.buttons !== 2) return; // Only handle right mouse button
      handleMove(e.clientX, e.clientY);
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button !== 2) return;
      handleEnd();
    };

    // Touch event handlers
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      handleStart(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
      e.preventDefault(); // Prevent scrolling while rotating
    };

    const handleTouchEnd = () => {
      handleEnd();
    };

    // Prevent context menu
    const handleContextMenu = (e: Event) => {
      e.preventDefault();
    };

    // Add event listeners
    const canvas = gl.domElement;
    
    // Mouse events
    canvas.addEventListener('mousedown', handleMouseDown, { passive: true });
    canvas.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });

    // Touch events
    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false }); // Need passive: false to prevent scrolling
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true });
    canvas.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      // Remove event listeners
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [gl, mouseState, isMobile]);
}