import React from 'react';

// Absolute minimum component with no imports
export default function DiagnosticDashboard() {
  return (
    <div style={{padding: '20px', background: 'white', minHeight: '100vh'}}>
      <h1 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '16px'}}>
        Diagnostic Dashboard
      </h1>
      <p style={{marginBottom: '16px'}}>
        This is an emergency diagnostic page with absolutely no dependencies.
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
        <p>This is an ultra-minimal page to troubleshoot memory issues.</p>
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
    </div>
  );
}