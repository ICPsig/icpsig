import React from "react";

export default function Navbar() {
  return (
    <nav className='bg-white border-b border-gray-200 fixed z-30 w-full'>
      <div className='px-3 py-3 lg:px-5 lg:pl-3'>
        <div className='flex items-center justify-start'>
          <a href='/' className='text-xl font-bold flex items-center lg:ml-2.5'>
            <img
              src='https://demo.themesberg.com/windster/images/logo.svg'
              className='h-6 mr-2'
              alt='Windster Logo'
              width={30}
              height={30}
            />
            <span className='self-center whitespace-nowrap'>Polkasafe</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
