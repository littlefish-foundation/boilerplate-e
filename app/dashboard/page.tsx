
"use client";

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import GridLayout from "react-grid-layout";
import { useSession } from "next-auth/react";

// Define the DashboardPage function component
export default  function DashboardPage() {
    const session = useSession(); // Get the session object from the useSession hook
    return (
      <>
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <h1>Dashboard</h1>
        </div>
      </>
    );
  }

  