/**
 * FieldFilepicker - 파일 업로드 필드 렌더러
 *
 * Custom styled Dropzone with drag & drop support.
 *
 * @example
 * <FieldFilepicker
 *   label="Upload Avatar"
 *   model="avatar"
 *   type="image"
 *   prominence="Standard"
 * />
 */

import { CloudUpload, File as FileIcon, Image as ImageIcon, Trash2, X } from 'lucide-react';
import type React from 'react';
import { useRef, useState } from 'react';
import { Text } from '@/components/types/Element/Text/Text';
import type { Intent, Prominence } from '@/components/types/Shared.types';
import { cn } from '@/shared/lib/utils';
import { errorStyles, fieldWrapperStyles, labelStyles } from '../../styles/field.styles';

export interface FieldFilepickerProps {
  label: string;
  model: string;
  type: 'file' | 'image';
  prominence?: Prominence;
  intent?: Intent;
  density?: 'Comfortable' | 'Standard' | 'Compact';
  required?: boolean;
  value?: File | null; // For controlled component if needed, usually just internal or onChange
  onChange?: (file: File | null) => void;
  className?: string;
  disabled?: boolean;
  accept?: string; // e.g. "image/*,application/pdf"
}

export function FieldFilepicker(props: FieldFilepickerProps) {
  const {
    label,
    model,
    type,
    prominence = 'Standard',
    intent = 'Neutral',
    density = 'Standard',
    required = false,
    onChange,
    className,
    disabled = false,
    accept,
  } = props;

  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Basic type check based on `type` prop or `accept`
    if (type === 'image' && !file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    setSelectedFile(file);
    onChange?.(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    onChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / k ** i).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn(fieldWrapperStyles({ density }), className)}>
      {/* Label */}
      <label htmlFor={model} className={labelStyles({ prominence, required })}>
        {label}
      </label>

      {/* Hidden Input */}
      <input
        ref={fileInputRef}
        id={model}
        type="file"
        accept={accept || (type === 'image' ? 'image/*' : undefined)}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Drop Zone or File Preview */}
      {!selectedFile ? (
        <div
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer group',
            isDragOver
              ? 'border-accent bg-accent/5'
              : 'border-border bg-layer-1 hover:border-accent/50 hover:bg-layer-2',
            disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
          )}
        >
          <div
            className={cn(
              'p-3 rounded-full mb-3 transition-colors',
              isDragOver
                ? 'bg-accent/10 text-accent'
                : 'bg-layer-2 text-muted group-hover:text-text group-hover:bg-layer-3'
            )}
          >
            <CloudUpload size={24} />
          </div>
          <Text role="Body" prominence="Strong" content="Click to upload or drag and drop" />
          <Text
            role="Body"
            prominence="Subtle"
            className="text-xs mt-1"
            content={type === 'image' ? 'SVG, PNG, JPG or GIF' : 'Any file types'}
          />
        </div>
      ) : (
        /* Selected File Preview Box */
        <div className="relative border border-border bg-layer-1 rounded-lg p-4 flex items-center gap-4 animate-in fade-in zoom-in-95 duration-200">
          {/* Icon or Thumbnail */}
          <div className="w-12 h-12 bg-layer-2 rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
            {type === 'image' && selectedFile.type.startsWith('image/') ? (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="w-full h-full object-cover"
                onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
              />
            ) : (
              <FileIcon className="text-accent" size={24} />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <Text
              role="Body"
              prominence="Strong"
              className="truncate"
              content={selectedFile.name}
            />
            <Text
              role="Body"
              prominence="Subtle"
              className="text-xs"
              content={formatFileSize(selectedFile.size)}
            />
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            className="p-2 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
            title="Remove file"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
