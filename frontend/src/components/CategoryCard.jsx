import React from 'react'

function CategoryCard({ name, image, onClick }) {
  return (
    <div
      className="w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-2xl border-2 border-[#ff4d2d] shrink-0 overflow-hidden bg-white shadow-xl shadow-gray-200 hover:shadow-lg transition-shadow relative group"
      onClick={onClick}
    >
      <img
        src={image}
        alt=""
        className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110 cursor-pointer"
      />
      <div
        className="absolute bottom-0 w-full left-0 bg-[#ffffff96] px-3 py-1 rounded-t-xl text-center shadow text-sm font-medium text-gray-800 backdrop-blur
    transform translate-y-full opacity-0 transition-all duration-300
    group-hover:translate-y-0 group-hover:opacity-100"
      >
        {name}
      </div>
    </div>
  );
}

export default CategoryCard
