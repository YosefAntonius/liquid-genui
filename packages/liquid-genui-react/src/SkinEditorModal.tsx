import React, { useState } from "react";
import { X, Save } from "lucide-react";
import { ConfirmUnsavedModal } from "./ConfirmUnsavedModal";

interface SkinEditorModalProps {
  initialHtml: string;
  onSave: (html: string) => void;
  onClose: () => void;
}

export function SkinEditorModal({ initialHtml, onSave, onClose }: SkinEditorModalProps) {
  const [code, setCode] = useState(initialHtml);
  const [showConfirm, setShowConfirm] = useState(false);

  const hasChanges = code !== initialHtml;

  const handleClose = () => {
    if (hasChanges) {
      setShowConfirm(true);
    } else {
      onClose();
    }
  };

  const handleSave = () => {
    onSave(code);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[250] bg-black/80 flex items-center justify-center backdrop-blur-md p-4">
        <div className="bg-[#111] border border-white/20 rounded-2xl w-full max-w-5xl h-[85vh] text-white shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0a0a0a]">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              Editor de Código HTML
              {hasChanges && <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full ml-2 border border-amber-400/20">Modificado</span>}
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 disabled:opacity-50 disabled:bg-white/5 disabled:text-white/30 hover:bg-emerald-500/30 rounded-lg transition-colors text-sm font-bold tracking-wide"
              >
                <Save size={16} />
                Guardar Código
              </button>
              <button
                onClick={handleClose}
                className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 bg-[#0a0a0a] p-4 overflow-hidden relative group">
            <textarea
              className="w-full h-full bg-[#111] text-emerald-400 font-mono text-sm p-4 rounded-xl border border-white/10 focus:border-white/30 outline-none resize-none leading-relaxed"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              placeholder="<!-- Escribe tu HTML aquí -->"
            />
          </div>
        </div>
      </div>

      {showConfirm && (
        <ConfirmUnsavedModal
          onConfirm={onClose}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
