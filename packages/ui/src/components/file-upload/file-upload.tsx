'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { z } from 'zod';
import { Upload, X, File as FileIcon, Image as ImageIcon, FileText } from 'lucide-react';
import { cn } from '../../lib/cn';

export const FileUploadPropsSchema = z.object({
  label: z.string(),
  helperText: z.string().optional(),
  error: z.string().optional(),
  disabled: z.boolean().optional(),
  required: z.boolean().optional(),
  multiple: z.boolean().optional(),
  accept: z.string().optional(),
  maxSize: z.number().optional(),
  maxFiles: z.number().optional(),
  showPreview: z.boolean().optional(),
  value: z.array(z.instanceof(File)).optional(),
  onChange: z
    .function()
    .args(z.array(z.instanceof(File)))
    .returns(z.void())
    .optional(),
  onBlur: z
    .function()
    .returns(z.void())
    .optional(),
  className: z.string().optional(),
});

export type FileUploadProps = z.infer<typeof FileUploadPropsSchema>;

const dropzoneVariants = cva(
  'relative flex flex-col items-center justify-center rounded-md border-2 border-dashed px-6 py-8 text-center transition-colors',
  {
    variants: {
      state: {
        default: 'border-border hover:border-primary hover:bg-accent/50',
        error: 'border-error hover:border-error',
        disabled: 'border-border cursor-not-allowed opacity-50',
        dragActive: 'border-primary bg-accent/50',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);

interface FileWithPreview extends File {
  preview?: string;
}

export const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  (props, ref) => {
    const {
      label,
      helperText,
      error,
      disabled,
      required,
      multiple = false,
      accept,
      maxSize,
      maxFiles = 10,
      showPreview = true,
      value,
      onChange,
      onBlur,
      className,
    } = props;

    const [internalFiles, setInternalFiles] = React.useState<FileWithPreview[]>(
      []
    );
    const [isDragActive, setIsDragActive] = React.useState(false);
    const [validationError, setValidationError] = React.useState<string>('');
    const inputRef = React.useRef<HTMLInputElement>(null);

    const currentFiles = value !== undefined ? value : internalFiles;
    const hasError = !!error || !!validationError;
    const displayError = error || validationError;

    // Generate previews for images
    React.useEffect(() => {
      const files = currentFiles as FileWithPreview[];
      files.forEach((file) => {
        if (file.type.startsWith('image/') && !file.preview) {
          const reader = new FileReader();
          reader.onloadend = () => {
            file.preview = reader.result as string;
            setInternalFiles([...files]);
          };
          reader.readAsDataURL(file);
        }
      });
    }, [currentFiles]);

    // Cleanup previews on unmount
    React.useEffect(() => {
      return () => {
        internalFiles.forEach((file) => {
          if (file.preview) {
            URL.revokeObjectURL(file.preview);
          }
        });
      };
    }, [internalFiles]);

    const validateFiles = (files: File[]): string | null => {
      // Check max files
      if (currentFiles.length + files.length > maxFiles) {
        return `Maximum ${maxFiles} files allowed`;
      }

      // Check file size
      if (maxSize) {
        const oversizedFile = files.find((file) => file.size > maxSize);
        if (oversizedFile) {
          const maxSizeMB = (maxSize / 1024 / 1024).toFixed(2);
          return `File size exceeds ${maxSizeMB}MB limit`;
        }
      }

      // Check file type
      if (accept) {
        const acceptedTypes = accept.split(',').map((t) => t.trim());
        const invalidFile = files.find((file) => {
          return !acceptedTypes.some((type) => {
            if (type.startsWith('.')) {
              return file.name.toLowerCase().endsWith(type.toLowerCase());
            }
            if (type.endsWith('/*')) {
              const category = type.split('/')[0];
              return file.type.startsWith(category);
            }
            return file.type === type;
          });
        });
        if (invalidFile) {
          return `File type not accepted: ${invalidFile.name}`;
        }
      }

      return null;
    };

    const handleFiles = (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);
      const validationErrorMsg = validateFiles(fileArray);

      if (validationErrorMsg) {
        setValidationError(validationErrorMsg);
        return;
      }

      setValidationError('');
      const newFiles = multiple
        ? [...currentFiles, ...fileArray]
        : fileArray.slice(0, 1);

      if (value === undefined) {
        setInternalFiles(newFiles);
      }
      onChange?.(newFiles);
    };

    const handleRemove = (index: number) => {
      const newFiles = currentFiles.filter((_, i) => i !== index);
      if (value === undefined) {
        setInternalFiles(newFiles);
      }
      onChange?.(newFiles);
      setValidationError('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragActive(true);
      }
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      if (disabled) return;

      handleFiles(e.dataTransfer.files);
    };

    const handleClick = () => {
      if (!disabled) {
        inputRef.current?.click();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    };

    const getFileIcon = (file: File) => {
      if (file.type.startsWith('image/')) {
        return <ImageIcon className="h-8 w-8 text-primary" />;
      }
      if (file.type.startsWith('text/')) {
        return <FileText className="h-8 w-8 text-primary" />;
      }
      return <FileIcon className="h-8 w-8 text-primary" />;
    };

    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const dropzoneState = disabled
      ? 'disabled'
      : isDragActive
        ? 'dragActive'
        : hasError
          ? 'error'
          : 'default';

    return (
      <div className={cn('w-full', className)}>
        {/* Label */}
        <label className="mb-1 block text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-1 text-error">*</span>}
        </label>

        {/* Hidden Input */}
        <input
          ref={(node) => {
            // Set internal ref
            (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;

            // Forward ref to parent
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
            }
          }}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleInputChange}
          onBlur={onBlur}
          disabled={disabled}
          className="hidden"
          aria-invalid={hasError}
          aria-describedby={
            displayError
              ? `${label}-error`
              : helperText
                ? `${label}-helper`
                : undefined
          }
        />

        {/* Dropzone */}
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={dropzoneVariants({ state: dropzoneState })}
          aria-label="File upload dropzone"
        >
          <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="mb-1 text-sm font-medium text-foreground">
            {isDragActive ? 'Drop files here' : 'Click to upload or drag and drop'}
          </p>
          <p className="text-xs text-muted-foreground">
            {accept ? `Accepted: ${accept}` : 'All file types accepted'}
            {maxSize && ` (Max: ${formatFileSize(maxSize)})`}
          </p>
        </div>

        {/* File List */}
        {currentFiles.length > 0 && (
          <div className="mt-3 space-y-2">
            {currentFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 rounded-md border border-border bg-background p-3"
              >
                {/* Preview or Icon */}
                {showPreview &&
                file.type.startsWith('image/') &&
                (file as FileWithPreview).preview ? (
                  <img
                    src={(file as FileWithPreview).preview}
                    alt={file.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                ) : (
                  getFileIcon(file as FileWithPreview)
                )}

                {/* File Info */}
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium text-foreground">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                {/* Remove Button */}
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(index);
                    }}
                    className="text-muted-foreground transition-colors hover:text-error"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Helper Text / Error */}
        <div className="mt-1 text-xs">
          {displayError && (
            <p
              id={`${label}-error`}
              className="text-error"
              role="alert"
              aria-live="polite"
            >
              {displayError}
            </p>
          )}
          {!displayError && helperText && (
            <p id={`${label}-helper`} className="text-muted-foreground">
              {helperText}
            </p>
          )}
        </div>
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';
