import React, { useState } from 'react';
import { Flag, X, AlertTriangle, ShieldAlert, Loader2, CheckCircle2 } from 'lucide-react';
import { submitReport } from '../services/api';

const REPORT_REASONS = [
  { id: 'Harassment', label: 'Harassment or Bullying', desc: 'Targeted insults, persistent hostility, or hate speech.' },
  { id: 'Threats', label: 'Threats of Violence', desc: 'Direct threats of physical harm or violence.' },
  { id: 'Sexual content', label: 'Explicit Sexual Content', desc: 'Unsolicited explicit or inappropriate sexual messages.' },
  { id: 'Spam', label: 'Spam or Commercial Ads', desc: 'Repetitive messages, phishing links, or advertising bots.' },
  { id: 'Illegal/harmful content', label: 'Illegal / Dangerous Activity', desc: 'Instructions for crime, exploitation, or weapons.' },
  { id: 'Other', label: 'Other Safety Concern', desc: 'Any other violation of respectful community guidelines.' },
];

export default function ReportModal({ isOpen, onClose, reporterId, reportedUserId, roomId, onReportSuccess }) {
  const [selectedReason, setSelectedReason] = useState('Harassment');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await submitReport({
        reporterId,
        reportedUserId,
        roomId,
        reason: selectedReason,
        details,
      });

      setSubmitted(true);
      if (onReportSuccess) onReportSuccess();
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setDetails('');
      }, 1800);
    } catch (err) {
      setError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-dark-900 border border-white/10 rounded-2xl shadow-2xl p-6 text-slate-100 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white">
              Report Stranger
            </h3>
            <p className="text-xs text-slate-400">
              Help us keep Dark Chat safe and anonymous. Reports are reviewed immediately.
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
            <h4 className="font-semibold text-white text-base">Report Submitted</h4>
            <p className="text-xs text-slate-400 max-w-xs">
              Thank you. The user has also been automatically blocked for the remainder of your session.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Reasons List */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {REPORT_REASONS.map((r) => (
                <label
                  key={r.id}
                  onClick={() => setSelectedReason(r.id)}
                  className={`flex items-start gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    selectedReason === r.id
                      ? 'bg-rose-500/10 border-rose-500/40 text-white'
                      : 'bg-dark-800/60 border-white/5 text-slate-300 hover:bg-dark-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={r.id}
                    checked={selectedReason === r.id}
                    onChange={() => setSelectedReason(r.id)}
                    className="mt-1 text-rose-500 focus:ring-rose-500 bg-dark-900 border-white/20"
                  />
                  <div>
                    <div className="text-xs font-semibold">{r.label}</div>
                    <div className="text-[11px] text-slate-400">{r.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            {/* Optional Details */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Additional Details (Optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Briefly explain what happened..."
                rows={2}
                maxLength={500}
                className="w-full px-3 py-2 text-xs bg-dark-800 border border-white/10 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors resize-none"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 transition-all focus:outline-none disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Flag className="w-3.5 h-3.5" />
                    <span>Submit & Block</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
