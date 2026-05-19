import React from "react";

interface ConfirmUnsavedModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmUnsavedModal({ onConfirm, onCancel }: ConfirmUnsavedModalProps) {
  return (
    <div className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center backdrop-blur-md p-4">
      <div className="bg-[#111] border border-white/20 p-6 rounded-2xl max-w-sm w-full text-white shadow-2xl flex flex-col gap-4">
        <h3 className="font-bold text-lg text-white">Cambios sin guardar</h3>
        <p className="text-white/70 text-sm">
          Tienes cambios sin guardar en el código de la skin. ¿Estás seguro de que deseas salir y perder estos cambios?
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 hover:bg-white/10 text-white/70 rounded transition-colors text-sm font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded transition-colors text-sm font-bold tracking-wide"
          >
            Salir sin guardar
          </button>
        </div>
      </div>
    </div>
  );
}
