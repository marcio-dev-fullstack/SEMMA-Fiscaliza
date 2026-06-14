import React from "react";

export default function CardInfra({ tipo, data, status, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-4 rounded-lg shadow border-l-4 border-primary cursor-pointer hover:bg-gray-50 active:scale-[0.98] transition-all"
    >
      <h3 className="font-bold text-lg text-gray-800">{tipo}</h3>
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-gray-500">{data}</span>
        <span
          className={`text-xs font-bold px-2 py-1 rounded-full ${status === "Pendente" ? "bg-secondary text-gray-900" : "bg-green-100 text-primary"}`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}
