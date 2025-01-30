import React, { forwardRef, useImperativeHandle, useState, useCallback } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface LabelProps {
  text: string;
  position: [number, number, number];
  color: string;
  client?: string;
  isMobile?: boolean;
  isSystemCore?: boolean;
}

export const Label = forwardRef<{ updatePosition: (pos: THREE.Vector3) => void }, LabelProps>(
  function Label({ text, position, color, client, isMobile, isSystemCore }, ref) {
    const [worldPos, setWorldPos] = useState<THREE.Vector3>(new THREE.Vector3());

    const updatePosition = useCallback((pos: THREE.Vector3) => {
      setWorldPos(pos.clone());
    }, []);

    useImperativeHandle(ref, () => ({
      updatePosition
    }), [updatePosition]);

    const fontSize = isMobile ? {
      title: isSystemCore ? '8px' : '12px',
      info: '10px'
    } : {
      title: isSystemCore ? '10px' : '14px',
      info: '11px'
    };

    const padding = isMobile ? {
      title: '4px 8px',
      info: '4px 8px'
    } : {
      title: '6px 10px',
      info: '6px 10px'
    };

    return (
      <Html 
        position={position} 
        center 
        style={{ 
          pointerEvents: 'none', 
          transform: `translateX(${isMobile ? '10px' : '20px'})`,
          zIndex: isSystemCore ? 0 : 1
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: isMobile ? '2px' : '4px',
          }}
        >
          <div
            style={{
              background: 'rgba(0,0,0,0.8)',
              padding: padding.title,
              borderRadius: '4px',
              color: isSystemCore ? '#888' : color,
              fontSize: fontSize.title,
              fontFamily: 'Inter, sans-serif',
              fontWeight: '300',
              whiteSpace: 'nowrap',
              userSelect: 'none',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              letterSpacing: '0.05em',
              width: 'fit-content',
              minWidth: 'max-content',
            }}
          >
            {text}
          </div>

          {client && (
            <div
              style={{
                background: 'rgba(0,0,0,0.8)',
                padding: padding.info,
                borderRadius: '4px',
                color: '#888',
                fontSize: fontSize.info,
                fontFamily: 'Inter, sans-serif',
                fontWeight: '300',
                userSelect: 'none',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                width: 'fit-content',
                minWidth: 'max-content',
              }}
            >
              <div style={{ color: '#aaa' }}>
                Client: <span style={{ color: '#fff' }}>{client}</span>
              </div>
            </div>
          )}
        </div>
      </Html>
    );
  }
);