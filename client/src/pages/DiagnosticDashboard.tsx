import React from 'react';
import { LightweightNewsfeed } from '../components/dashboard/LightweightNewsfeed';

// Diagnostic Dashboard with lightweight newsfeed component
export default function DiagnosticDashboard() {
  return (
    <div style={{padding: '20px', background: 'white', minHeight: '100vh'}}>
      <h1 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '16px'}}>
        Diagnostic Dashboard
      </h1>
      <p style={{marginBottom: '16px'}}>
        Testing with the lightweight newsfeed component
      </p>
      
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px'
      }}>
        <h2 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '8px'}}>
          System Status
        </h2>
        <p>Testing with a simplified newsfeed component to isolate memory issues.</p>
        <button 
          style={{
            marginTop: '16px',
            padding: '8px 16px',
            background: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </button>
      </div>
      
      {/* Including the lightweight newsfeed */}
      <div style={{marginTop: '24px'}}>
        <LightweightNewsfeed />
      </div>
    </div>
  );
}