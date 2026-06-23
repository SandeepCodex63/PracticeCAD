import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';

const ZoomImage = ({ src, alt }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Reset zoom settings
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Zoom In/Out triggers
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.3, 4));
  };

  const handleZoomOut = () => {
    setScale(prev => {
      const next = Math.max(prev - 0.3, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  // Double click to zoom toggle
  const handleDoubleClick = (e) => {
    if (scale > 1) {
      handleReset();
    } else {
      setScale(2);
      // Zoom into double-click position roughly
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left - rect.width / 2;
        const clickY = e.clientY - rect.top - rect.height / 2;
        setPosition({ x: -clickX, y: -clickY });
      }
    }
  };

  // Mouse drag to pan
  const handleMouseDown = (e) => {
    if (scale === 1) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging || scale === 1) return;
    setPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Scroll wheel to zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomIntensity = 0.1;
    if (e.deltaY < 0) {
      // Zoom in
      setScale(prev => Math.min(prev + zoomIntensity, 4));
    } else {
      // Zoom out
      setScale(prev => {
        const next = Math.max(prev - zoomIntensity, 1);
        if (next === 1) setPosition({ x: 0, y: 0 });
        return next;
      });
    }
  };

  // Add scroll listener directly to avoid React passive events warnings
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [scale]);

  // Handle escape key to close fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    handleReset();
  };

  // Render Image container
  const renderImageCanvas = () => (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden w-full h-full rounded-xl bg-slate-950 flex items-center justify-center border border-gray-800 ${
        scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
      onDoubleClick={handleDoubleClick}
      style={{ minHeight: isFullscreen ? '100vh' : '360px' }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="max-w-full max-h-full object-contain select-none pointer-events-none transition-transform duration-75"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
        }}
      />

      {/* Floating Canvas Controls */}
      <div className="absolute bottom-4 right-4 flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-700/50 shadow-lg text-white">
        <button 
          onClick={handleZoomOut} 
          disabled={scale === 1}
          className="p-1 hover:text-brand-400 disabled:text-gray-600 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs font-mono w-10 text-center">
          {Math.round(scale * 100)}%
        </span>
        <button 
          onClick={handleZoomIn} 
          disabled={scale >= 4}
          className="p-1 hover:text-brand-400 disabled:text-gray-600 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-gray-700" />
        <button 
          onClick={handleReset} 
          disabled={scale === 1 && position.x === 0 && position.y === 0}
          className="p-1 hover:text-brand-400 disabled:text-gray-600 transition-colors"
          title="Reset Zoom"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-gray-700" />
        <button 
          onClick={toggleFullscreen} 
          className="p-1 hover:text-brand-400 transition-colors"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Helper text overlay when zoomed */}
      {scale > 1 && (
        <div className="absolute top-4 left-4 bg-slate-900/60 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] text-gray-300 font-medium tracking-wide">
          Drag to Pan • Double-click to Reset
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Standard Display */}
      <div className="relative w-full h-[360px] sm:h-[420px]">
        {renderImageCanvas()}
      </div>

      {/* Fullscreen Modal Portal Overlay */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          >
            <div className="w-full h-full max-w-7xl flex flex-col justify-between">
              <div className="flex justify-between items-center py-2 text-white">
                <span className="text-sm font-semibold tracking-wider">{alt}</span>
                <button 
                  onClick={toggleFullscreen}
                  className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-xs font-semibold rounded-lg border border-gray-750 transition-colors"
                >
                  Exit [Esc]
                </button>
              </div>
              
              <div className="flex-1 w-full relative">
                {renderImageCanvas()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ZoomImage;
