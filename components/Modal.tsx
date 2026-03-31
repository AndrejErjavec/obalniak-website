interface ModalProps {
  children: React.ReactNode;
  open: boolean;
  className?: string;
}

export default function Modal({ children, open, className = "" }: ModalProps) {
  return (
    <>
      {open && (
        <div className={`absolute left-0 mt-2 bg-white text-gray-800 shadow-lg rounded-md w-48 ${className}`.trim()}>
          {children}
        </div>
      )}
    </>
  );
}
