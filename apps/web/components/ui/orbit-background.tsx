'use client';

import React from 'react';

export function OrbitBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute rounded-full border border-indigo-500/10"
        style={{ width: 700, height: 700, top: -200, right: -300 }}
      />
      <div
        className="absolute rounded-full border border-purple-500/10"
        style={{ width: 500, height: 500, top: -80, right: -160 }}
      />
      <div
        className="absolute rounded-full border border-blue-500/10"
        style={{ width: 600, height: 600, bottom: -200, left: -250 }}
      />
      <div
        className="absolute w-96 h-96 rounded-full bg-indigo-600/10 blur-[100px]"
        style={{ top: '20%', left: '10%' }}
      />
    </div>
  );
}
