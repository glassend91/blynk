"use client";

import { Technician } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  technicians: Technician[];
  storeName: string;
}

export default function TechnicianDetailsModal({ open, onClose, technicians, storeName }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl animate-in zoom-in-95 duration-200 rounded-[24px] bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="border-b border-[#F0EDF5] px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[24px] font-bold text-[#0A0A0A]">Technicians</h2>
              <p className="text-[14px] text-[#6F6C90]">Working at <span className="font-semibold text-[#3F205F]">{storeName}</span></p>
            </div>
            <button 
              onClick={onClose}
              className="rounded-full p-2 hover:bg-[#F4F1F9] transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6F6C90" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto px-8 py-6">
          <div className="space-y-8">
            {technicians.map((tech) => (
              <div key={tech.id} className="flex flex-col gap-6 md:flex-row">
                {/* Photo / Initial */}
                <div className="flex-shrink-0">
                  {tech.photoUrl ? (
                    <img 
                      src={tech.photoUrl} 
                      alt={tech.fullName} 
                      className="h-24 w-24 rounded-[16px] object-cover shadow-sm"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-[16px] bg-gradient-to-br from-[#F4F1F9] to-[#E7E4EC] text-[32px] font-bold text-[#3F205F]">
                      {tech.fullName.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-[18px] font-bold text-[#0A0A0A]">{tech.fullName}</h3>
                      <p className="text-[14px] font-medium text-[#7F5DA9]">{tech.roleTitle || "Specialist"}</p>
                    </div>
                    {tech.years && (
                      <span className="rounded-full bg-[#E6F4EA] px-3 py-1 text-[12px] font-bold text-[#0F9D58]">
                        {tech.years} Years Exp.
                      </span>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4">
                    {tech.specialties && (
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#6F6C90]">Specialties</span>
                        <p className="text-[14px] text-[#0A0A0A]">{tech.specialties}</p>
                      </div>
                    )}
                    {tech.bio && (
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#6F6C90]">Bio</span>
                        <p className="text-[14px] leading-relaxed text-[#0A0A0A]">{tech.bio}</p>
                      </div>
                    )}
                    {tech.videoUrl && (
                      <div className="mt-2">
                        <a 
                          href={tech.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-[13px] font-bold text-[#3F205F] hover:underline"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                          </svg>
                          Watch Introduction Video
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#F0EDF5] bg-[#FAF9FC] px-8 py-4 text-right">
          <button 
            onClick={onClose}
            className="rounded-[12px] bg-[#3F205F] px-6 py-2 text-[14px] font-bold text-white shadow-lg shadow-[#3F205F]/10 transition-all hover:opacity-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
