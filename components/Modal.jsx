import {useRef, useEffect} from "react";

export default function Modal({ children, open, setOpen }) {
  const dropdownRef = useRef(null);

  // Close the menu if you click outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
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
    <>
      {open && (
        <div ref={dropdownRef} className="absolute left-0 mt-2 bg-white text-gray-800 shadow-lg rounded-md w-48">
          {children}
        </div>
      )}
    </>
  )
}