import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import Modal from "@/components/Modal";
import useMediaQuery from "@/hooks/useMediaQuery";

function DropdownMenu({ title, items, setParentOpen }) {
  const [isOpen, setIsOpen] = useState(false);

  const isMdScreen = useMediaQuery("(min-width: 768px)");

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const closeMenu = () => {
    console.log("close menu called");
    setIsOpen(false);
    setParentOpen(false);
  };

  const dropdownRef = useRef(null);

  // Close the menu if you click outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Add event listener on mount
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="md:relative py-3 px-4 md:p-0" ref={dropdownRef}>
      <div
        onClick={toggleMenu}
        className="flex flex-row items-center font-medium text-gray-800 hover:text-gray-600 cursor-pointer"
      >
        {title}
        {isOpen ? <MdKeyboardArrowUp size={24} /> : <MdKeyboardArrowDown size={24} />}
      </div>

      {isMdScreen ? (
        <div>
          {/* Desktop menu */}
          <Modal open={isOpen}>
            {items.map((item) => (
              <Link
                href={item.href}
                className="block px-4 py-2 font-medium text-gray-800 hover:bg-gray-100"
                onClick={closeMenu}
              >
                {item.title}
              </Link>
            ))}
          </Modal>
        </div>
      ) : (
        <div>
          {/* Mobile menu */}
          {isOpen && (
            <ul className="md:hidden left-0 mt-2 bg-white text-gray-800">
              {items.map((item) => (
                <li>
                  <Link href={item.href} className="block px-4 py-2 font-medium text-gray-800" onClick={closeMenu}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default DropdownMenu;
