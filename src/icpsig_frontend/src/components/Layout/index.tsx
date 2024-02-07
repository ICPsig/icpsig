import React from "react";
import Navbar from "../navbar";
import Sidebar from "../sidebar";
import Footer from "../footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <div className='flex overflow-hidden bg-white pt-15'>
        <Sidebar />
        <div
          id='main-content'
          className='h-full w-full bg-gray-50 relative overflow-y-auto lg:ml-64'
        >
          <main>
            <div className='w-full h-[calc(100vh-109px)] p-4 mt-[53px]'>
              {children}
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
