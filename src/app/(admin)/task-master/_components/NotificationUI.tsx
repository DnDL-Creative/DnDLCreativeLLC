"use client";

import { AlertTriangle, CheckCircle2, X, Trash2, XCircle } from "lucide-react";

// --- TYPES ---
export type ToastType = {
  id: string;
  type: "success" | "error" | "info";
  message: string;
};

// --- TOAST COMPONENT (Named Export) ---
export function Toast({
  toast,
  onClose,
}: {
  toast: ToastType;
  onClose: () => void;
}) {
  const isError = toast.type === "error";
  const bgClass = isError
    ? "bg-rose-500/10 border-rose-500/50"
    : "bg-emerald-500/10 border-emerald-500/50";
  const textClass = isError ? "text-rose-400" : "text-emerald-400";
  const Icon = isError ? XCircle : CheckCircle2;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl animate-in slide-in-from-right-10 fade-in duration-300 ${bgClass}`}
    >
      <Icon size={20} className={textClass} />
      <span className="font-bold text-sm text-slate-200">{toast.message}</span>
      <button
        onClick={onClose}
        className="ml-4 hover:text-white text-slate-500 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}

// --- CONFIRM MODAL COMPONENT (Named Export) ---
export function ConfirmModal({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  isProcessing,
}: {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onCancel}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4 text-rose-500">
          <div className="p-2 bg-rose-500/10 rounded-lg">
            <AlertTriangle size={24} />
          </div>
          <h3 className="text-xl font-black uppercase tracking-wide text-white">
            {title}
          </h3>
        </div>

        <p className="text-slate-400 leading-relaxed mb-8">{description}</p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="px-5 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wide text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Abort
          </button>

          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="px-5 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wide bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 transition-all flex items-center gap-2"
          >
            {isProcessing ? (
              <span>Purging...</span>
            ) : (
              <>
                <Trash2 size={16} /> Confirm Purge
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
