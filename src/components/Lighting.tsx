import React from 'react';

export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={0.6} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#a0a0ff" />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
    </>
  );
}