import React from 'react';

const LanguageButton = () => {
  return (
    <div className="absolute top-4">
      {/* Left Card */}
      <div className="absolute left-[-3px]  w-7 h-8 bg-orange-600 border-2 border-white rounded-md flex justify-center items-center text-white font-bold text-[16px] z-10">
      తె
      </div>

      {/* Right Card */}
      <div className="absolute left-4 top-2 w-7 h-8 bg-white border-2 border-orange-600 rounded-md flex justify-center items-center text-orange-600 font-bold text-[15px] z-0" style={{ fontFamily: 'Noto Sans Telugu, Arial, sans-serif' }}>
        A
      </div>
    </div>
  );
};

export default LanguageButton;
