import React, { useRef, useState } from 'react';
import { Upload, FileText, Trash2, CheckCircle2, RefreshCw } from 'lucide-react';
import { showToast } from './ToastNotification';
import { cn } from '../../lib/utils';

export interface ResumeFileValue {
  fileName?: string;
  fileSize?: number;
  uploadedAt?: string;
  resumeUrl?: string;
}

interface ResumeUploadSectionProps {
  value: ResumeFileValue;
  onChange: (next: ResumeFileValue) => void;
  showUrlFallback?: boolean;
}

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_EXTS = ['.pdf', '.doc', '.docx'];

function formatFileSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return 'PDF Document';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ResumeUploadSection({
  value,
  onChange,
  showUrlFallback = true,
}: ResumeUploadSectionProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File | undefined | null) => {
    if (!file) return;
    const lowerName = file.name.toLowerCase();
    const isValidExt = ACCEPTED_EXTS.some((ext) => lowerName.endsWith(ext));
    if (!isValidExt) {
      showToast('error', 'Please upload a PDF, DOC, or DOCX resume file.');
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      showToast('error', 'Resume file size must be 5 MB or smaller.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    onChange({
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString().split('T')[0],
      resumeUrl: objectUrl,
    });
    showToast('success', `Uploaded "${file.name}". Click Save Changes to keep it on your profile.`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleRemove = () => {
    onChange({
      fileName: undefined,
      fileSize: undefined,
      uploadedAt: undefined,
      resumeUrl: '',
    });
    showToast('info', 'Resume file removed.');
  };

  const hasUploadedFile = Boolean(value.fileName);

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleInputChange}
        className="hidden"
        aria-label="Upload resume file"
      />

      {hasUploadedFile ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-foreground truncate max-w-[260px]">
                  {value.fileName}
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  Uploaded
                </span>
              </div>
              <div className="text-[11px] font-mono text-muted-foreground">
                {formatFileSize(value.fileSize)}
                {value.uploadedAt ? ` · Updated ${value.uploadedAt}` : ''}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Replace File</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/40 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
              aria-label="Remove resume file"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          className={cn(
            'cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border bg-surface/60 hover:border-primary/50 hover:bg-surface'
          )}
        >
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-primary">
            <Upload className="h-5 w-5" />
          </div>
          <div className="text-xs sm:text-sm font-bold text-foreground">
            Click to upload your resume or drag and drop
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Supports PDF, DOC, or DOCX files up to 5 MB
          </p>
        </div>
      )}

      {showUrlFallback && (
        <div className="space-y-1">
          <label
            htmlFor="resume-external-url"
            className="text-xs font-mono font-semibold text-muted-foreground flex items-center gap-1.5"
          >
            <FileText className="h-3.5 w-3.5" /> Or paste an external Resume URL (optional)
          </label>
          <input
            id="resume-external-url"
            type="url"
            value={value.resumeUrl?.startsWith('blob:') ? '' : value.resumeUrl || ''}
            onChange={(e) =>
              onChange({
                ...value,
                resumeUrl: e.target.value,
              })
            }
            placeholder="https://drive.google.com/... or https://yoursite.dev/resume.pdf"
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
          />
        </div>
      )}
    </div>
  );
}
