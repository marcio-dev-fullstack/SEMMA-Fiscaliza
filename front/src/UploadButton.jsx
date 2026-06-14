import React, { useState } from "react";
import { Camera, X } from "lucide-react";

export default function UploadButton({ onImageSelect }) {
  const [preview, setPreview] = useState(null);

  const handleCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Cria uma URL local temporária para mostrar a foto na tela
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      if (onImageSelect) onImageSelect(file);
    }
  };

  const clearImage = (e) => {
    e.preventDefault();
    setPreview(null);
    if (onImageSelect) onImageSelect(null);
  };

  if (preview) {
    return (
      <div className="relative border-2 border-primary p-2 rounded-lg bg-gray-50 flex justify-center shadow-sm">
        <img
          src={preview}
          alt="Evidência Capturada"
          className="rounded-lg max-h-48 object-cover w-full"
        />
        <button
          onClick={clearImage}
          className="absolute top-4 right-4 bg-red-500/90 text-white p-2 rounded-full shadow-lg active:scale-90 transition-transform"
        >
          <X size={20} />
        </button>
      </div>
    );
  }

  return (
    <label className="border-2 border-dashed border-gray-300 p-8 rounded-lg flex flex-col items-center justify-center bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer">
      <Camera size={32} className="text-primary mb-2" />
      <span className="text-sm font-semibold text-gray-600">
        Capturar Evidência
      </span>
      <span className="text-xs text-gray-400 mt-1">
        Fotos com metadados GPS
      </span>
      {/* O input oculto aciona a câmera nativa no celular */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleCapture}
      />
    </label>
  );
}
