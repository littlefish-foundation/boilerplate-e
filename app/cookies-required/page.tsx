"use client"

import React from 'react';

const CookieRequired = () => {
  return (
    <div className="min-h-screen bg-black-100 flex items-center justify-center">
      <div className="bg-gray p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Cookies Required</h1>
        <p className="mb-4">
          This application requires cookies to function properly. It appears that cookies are currently blocked in your browser settings.
        </p>
        <h2 className="text-xl font-semibold mb-2">How to enable cookies:</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Chrome: Settings &gt; Privacy and security &gt; Cookies and other site data</li>
          <li>Firefox: Options &gt; Privacy & Security &gt; Cookies and Site Data</li>
          <li>Safari: Preferences &gt; Privacy &gt; Cookies and website data</li>
        </ul>
        <p className="mb-4">
          After enabling cookies, please refresh the page or click the button below.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          I've enabled cookies, refresh the page
        </button>
      </div>
    </div>
  );
};

export default CookieRequired;