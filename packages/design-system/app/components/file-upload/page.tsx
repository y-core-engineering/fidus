'use client';

import { FileUpload } from '@fidus/ui';
import { useState } from 'react';

export default function FileUploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [multipleFiles, setMultipleFiles] = useState<File[]>([]);

  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8">
      <div>
        <h1 className="mb-2 text-4xl font-bold">File Upload</h1>
        <p className="text-lg text-muted-foreground">
          A drag-and-drop file upload component with support for multiple files, file type filtering, size limits, and preview functionality.
        </p>
      </div>

      {/* Basic Example */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Basic File Upload</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <FileUpload
              label="Upload Document"
              value={files}
              onChange={setFiles}
            />
          </div>
        </div>
      </section>

      {/* Multiple Files */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Multiple Files</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <FileUpload
              label="Upload Documents"
              multiple
              value={multipleFiles}
              onChange={setMultipleFiles}
              helperText="You can upload multiple files"
            />
          </div>
        </div>
      </section>

      {/* With Helper Text */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Helper Text</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <FileUpload
              label="Profile Picture"
              helperText="Upload your profile picture in JPG or PNG format"
            />
          </div>
        </div>
      </section>

      {/* Images Only */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Images Only</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <FileUpload
              label="Photo Gallery"
              accept="image/*"
              multiple
              showPreview
              helperText="Upload images in any format"
            />
          </div>
        </div>
      </section>

      {/* Documents Only */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Documents Only</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <FileUpload
              label="Resume Upload"
              accept=".pdf,.doc,.docx"
              helperText="Accepted formats: PDF, DOC, DOCX"
            />
          </div>
        </div>
      </section>

      {/* With Max File Size */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Max File Size</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <FileUpload
              label="Small Files"
              maxSize={2 * 1024 * 1024} // 2MB
              helperText="Maximum file size: 2MB"
            />
          </div>
        </div>
      </section>

      {/* With Max Files Limit */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Max Files Limit</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <FileUpload
              label="Limited Upload"
              multiple
              maxFiles={3}
              helperText="You can upload up to 3 files"
            />
          </div>
        </div>
      </section>

      {/* With Preview (Images) */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">With Preview</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <FileUpload
              label="Image Upload with Preview"
              accept="image/*"
              multiple
              showPreview
              helperText="Uploaded images will show a preview"
            />
          </div>
        </div>
      </section>

      {/* Without Preview */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Without Preview</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <FileUpload
              label="Document Upload"
              accept="image/*"
              multiple
              showPreview={false}
              helperText="Files listed without preview"
            />
          </div>
        </div>
      </section>

      {/* Error State (File Too Large) */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Error State</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <FileUpload
              label="Upload File"
              error="File size exceeds maximum limit of 5MB"
            />
          </div>
        </div>
      </section>

      {/* Disabled State */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Disabled State</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <FileUpload
              label="Upload Disabled"
              disabled
              helperText="File upload is currently disabled"
            />
          </div>
        </div>
      </section>

      {/* Required Field */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Required Field</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <FileUpload
              label="Required Document"
              required
              helperText="You must upload at least one file"
            />
          </div>
        </div>
      </section>

      {/* Combined Use Case */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Combined Use Case</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <FileUpload
              label="Project Attachments"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              maxSize={5 * 1024 * 1024} // 5MB
              maxFiles={5}
              showPreview
              required
              helperText="Upload up to 5 files (PDF or images, max 5MB each)"
            />
          </div>
        </div>
      </section>

      {/* Props Table */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Props</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-2 text-left font-semibold">Prop</th>
                  <th className="p-2 text-left font-semibold">Type</th>
                  <th className="p-2 text-left font-semibold">Default</th>
                  <th className="p-2 text-left font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">label</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">File upload label text (required)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">accept</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Accepted file types (e.g., &quot;image/*&quot;, &quot;.pdf&quot;)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">multiple</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Allow multiple file selection</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">maxSize</td>
                  <td className="p-2 font-mono text-xs">number</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Maximum file size in bytes</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">maxFiles</td>
                  <td className="p-2 font-mono text-xs">number</td>
                  <td className="p-2 font-mono text-xs">10</td>
                  <td className="p-2">Maximum number of files allowed</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">showPreview</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">true</td>
                  <td className="p-2">Show preview for image files</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">disabled</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Whether file upload is disabled</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">required</td>
                  <td className="p-2 font-mono text-xs">boolean</td>
                  <td className="p-2 font-mono text-xs">false</td>
                  <td className="p-2">Whether file is required (shows * indicator)</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">error</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Error message to display</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">helperText</td>
                  <td className="p-2 font-mono text-xs">string</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Helper text below file upload</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">value</td>
                  <td className="p-2 font-mono text-xs">File[]</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Controlled array of uploaded files</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">onChange</td>
                  <td className="p-2 font-mono text-xs">(files: File[]) =&gt; void</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Callback when files change</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-2 font-mono">onBlur</td>
                  <td className="p-2 font-mono text-xs">() =&gt; void</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2">Callback when upload loses focus</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Accessibility</h2>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li>Keyboard accessible (Tab, Enter, Space for interaction)</li>
            <li>ARIA attributes: aria-invalid, aria-describedby, aria-label</li>
            <li>Error messages announced with aria-live</li>
            <li>Focus indicator visible on dropzone</li>
            <li>Label properly associated with file input</li>
            <li>Required fields indicated with * and aria-required</li>
            <li>Drag-and-drop accessible via keyboard</li>
            <li>File list accessible with proper labels</li>
            <li>Remove buttons labeled for screen readers</li>
            <li>Validation errors clearly announced</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
