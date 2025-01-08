import React, { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

function DropdownMenu({title, items}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Close the menu if you click outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Add event listener on mount
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="md:relative py-3 px-4 md:p-0" ref={dropdownRef}>
      <div
        onClick={toggleMenu}
        className="flex flex-row items-center font-medium text-gray-800 hover:text-gray-600 cursor-pointer"
      >
        {title}
        {isOpen ? <MdKeyboardArrowUp size={24}/> : <MdKeyboardArrowDown size={24}/>}
      </div>
      {isOpen && (
        <>
          {/* Desktop menu */}
          <ul className="hidden md:block absolute left-0 mt-2 bg-white text-gray-800 shadow-lg rounded-md w-48">
            {items.map((item) => (
              <li className="hover:bg-gray-100">
                <Link
                  href={item.href}
                  className="block px-4 py-2 font-medium text-gray-800"
                  onClick={toggleMenu}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile menu */}
          <ul className="md:hidden left-0 mt-2 bg-white text-gray-800">
            {items.map((item) => (
              <li>
                <Link
                  href={item.href}
                  className="block px-4 py-2 font-medium text-gray-800"
                  onClick={toggleMenu}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default DropdownMenu;
