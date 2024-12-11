// CustomModal.js
import React from 'react';
import { IoIosClose } from "react-icons/io";



const CustomModal = ({ isOpen, closeModal, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-orange-100 p-6 rounded-lg w-full max-w-2xl h-auto overflow-auto relative">
       <IoIosClose size={40}  className='absolute right-10 cursor-pointer' onClick={closeModal}/>
        <div className="modal-content max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
