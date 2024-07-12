"use client"
import React from 'react';
import { FiLock, FiCoffee, FiDownload, FiGift, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

const FeatureCard = ({ title, description, icon: Icon }: { title: string, description: string, icon: React.ElementType }) => (
  <div className="bg-gray-800 rounded-lg shadow-md p-6">
    <div className="flex items-center mb-4">
      <Icon className="w-6 h-6 text-indigo-400 mr-3" />
      <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
    </div>
    <p className="text-gray-300">{description}</p>
  </div>
);

export default function TokenGatedDemoPage() {

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/" className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors">
            <FiArrowLeft className="w-6 h-6 mr-2" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Welcome to the Littefish Token Access Demo
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-400">
            This page is only accessible to holders of ADA Handle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <FeatureCard 
            icon={FiCoffee}
            title="Exclusive Content"
            description="Access for token holders only. You can gate different pages based on the user's token collection."
          />
          <FeatureCard 
            icon={FiLock}
            title="Secure Access"
            description="Your exclusive access is secured by blockchain technology."
          />
        </div>
      </div>
    </div>
  );
}