'use client';

import { FileUpload } from '@fidus/ui/file-upload';
import { Link } from '@fidus/ui/link';
import { Stack } from '@fidus/ui/stack';;
import { ComponentPreview } from '../../../components/helpers/component-preview';
import { PropsTable } from '../../../components/helpers/props-table';
import { useState } from 'react';

export default function FileUploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [multipleFiles, setMultipleFiles] = useState<File[]>([]);

  const props = [
    {
      name: 'label',
      type: 'string',
      required: true,
      description: 'File upload label text',
    },
    {
      name: 'accept',
      type: 'string',
      description: 'Accepted file types (e.g., "image/*", ".pdf")',
    },
    {
      name: 'multiple',
      type: 'boolean',
      default: 'false',
      description: 'Allow multiple file selection',
    },
    {
      name: 'maxSize',
      type: 'number',
      description: 'Maximum file size in bytes',
    },
    {
      name: 'maxFiles',
      type: 'number',
      default: '10',
      description: 'Maximum number of files allowed',
    },
    {
      name: 'showPreview',
      type: 'boolean',
      default: 'true',
      description: 'Show preview for image files',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Whether file upload is disabled',
    },
    {
      name: 'required',
      type: 'boolean',
      default: 'false',
      description: 'Whether file is required (shows * indicator)',
    },
    {
      name: 'error',
      type: 'string',
      description: 'Error message to display',
    },
    {
      name: 'helperText',
      type: 'string',
      description: 'Helper text below file upload',
    },
    {
      name: 'value',
      type: 'File[]',
      description: 'Controlled array of uploaded files',
    },
    {
      name: 'onChange',
      type: '(files: File[]) => void',
      description: 'Callback when files change',
    },
    {
      name: 'onBlur',
      type: '() => void',
      description: 'Callback when upload loses focus',
    },
  ];

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>File Upload</h1>
      <p className="lead">
        A drag-and-drop file upload component with support for multiple files, file type filtering, size limits, and preview functionality.
      </p>

      <h2>Basic File Upload</h2>
      <ComponentPreview
        code={`<FileUpload
  label="Upload Document"
  value={files}
  onChange={setFiles}
/>`}
      >
        <FileUpload
          label="Upload Document"
          value={files}
          onChange={setFiles}
        />
      </ComponentPreview>

      <h2>Multiple Files</h2>
      <ComponentPreview
        code={`<FileUpload
  label="Upload Documents"
  multiple
  value={multipleFiles}
  onChange={setMultipleFiles}
  helperText="You can upload multiple files"
/>`}
      >
        <FileUpload
          label="Upload Documents"
          multiple
          value={multipleFiles}
          onChange={setMultipleFiles}
          helperText="You can upload multiple files"
        />
      </ComponentPreview>

      <h2>With Helper Text</h2>
      <ComponentPreview
        code={`<FileUpload
  label="Profile Picture"
  helperText="Upload your profile picture in JPG or PNG format"
/>`}
      >
        <FileUpload
          label="Profile Picture"
          helperText="Upload your profile picture in JPG or PNG format"
        />
      </ComponentPreview>

      <h2>Images Only</h2>
      <ComponentPreview
        code={`<FileUpload
  label="Photo Gallery"
  accept="image/*"
  multiple
  showPreview
  helperText="Upload images in any format"
/>`}
      >
        <FileUpload
          label="Photo Gallery"
          accept="image/*"
          multiple
          showPreview
          helperText="Upload images in any format"
        />
      </ComponentPreview>

      <h2>Documents Only</h2>
      <ComponentPreview
        code={`<FileUpload
  label="Resume Upload"
  accept=".pdf,.doc,.docx"
  helperText="Accepted formats: PDF, DOC, DOCX"
/>`}
      >
        <FileUpload
          label="Resume Upload"
          accept=".pdf,.doc,.docx"
          helperText="Accepted formats: PDF, DOC, DOCX"
        />
      </ComponentPreview>

      <h2>With Max File Size</h2>
      <ComponentPreview
        code={`<FileUpload
  label="Small Files"
  maxSize={2 * 1024 * 1024}
  helperText="Maximum file size: 2MB"
/>`}
      >
        <FileUpload
          label="Small Files"
          maxSize={2 * 1024 * 1024}
          helperText="Maximum file size: 2MB"
        />
      </ComponentPreview>

      <h2>With Max Files Limit</h2>
      <ComponentPreview
        code={`<FileUpload
  label="Limited Upload"
  multiple
  maxFiles={3}
  helperText="You can upload up to 3 files"
/>`}
      >
        <FileUpload
          label="Limited Upload"
          multiple
          maxFiles={3}
          helperText="You can upload up to 3 files"
        />
      </ComponentPreview>

      <h2>With Preview</h2>
      <ComponentPreview
        code={`<FileUpload
  label="Image Upload with Preview"
  accept="image/*"
  multiple
  showPreview
  helperText="Uploaded images will show a preview"
/>`}
      >
        <FileUpload
          label="Image Upload with Preview"
          accept="image/*"
          multiple
          showPreview
          helperText="Uploaded images will show a preview"
        />
      </ComponentPreview>

      <h2>Without Preview</h2>
      <ComponentPreview
        code={`<FileUpload
  label="Document Upload"
  accept="image/*"
  multiple
  showPreview={false}
  helperText="Files listed without preview"
/>`}
      >
        <FileUpload
          label="Document Upload"
          accept="image/*"
          multiple
          showPreview={false}
          helperText="Files listed without preview"
        />
      </ComponentPreview>

      <h2>States</h2>
      <ComponentPreview
        code={`<Stack direction="vertical" spacing="lg">
  <FileUpload
    label="Upload File"
    error="File size exceeds maximum limit of 5MB"
  />
  <FileUpload
    label="Upload Disabled"
    disabled
    helperText="File upload is currently disabled"
  />
  <FileUpload
    label="Required Document"
    required
    helperText="You must upload at least one file"
  />
</Stack>`}
      >
        <Stack direction="vertical" spacing="lg">
          <FileUpload
            label="Upload File"
            error="File size exceeds maximum limit of 5MB"
          />
          <FileUpload
            label="Upload Disabled"
            disabled
            helperText="File upload is currently disabled"
          />
          <FileUpload
            label="Required Document"
            required
            helperText="You must upload at least one file"
          />
        </Stack>
      </ComponentPreview>

      <h2>Combined Use Case</h2>
      <ComponentPreview
        code={`<FileUpload
  label="Project Attachments"
  multiple
  accept=".pdf,.jpg,.jpeg,.png"
  maxSize={5 * 1024 * 1024}
  maxFiles={5}
  showPreview
  required
  helperText="Upload up to 5 files (PDF or images, max 5MB each)"
/>`}
      >
        <FileUpload
          label="Project Attachments"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          maxSize={5 * 1024 * 1024}
          maxFiles={5}
          showPreview
          required
          helperText="Upload up to 5 files (PDF or images, max 5MB each)"
        />
      </ComponentPreview>

      <h2>Props</h2>
      <PropsTable props={props} />

      <h2>Usage Guidelines</h2>
      <div className="not-prose space-y-lg my-lg">
        <div>
          <h3 className="text-lg font-semibold mb-md">When to use</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For uploading documents, images, or other files</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When users need to attach files to forms or submissions</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>For profile pictures or avatar uploads</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>When importing data from files (CSV, JSON, etc.)</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Best practices</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Clearly indicate accepted file types and size limits in helper text</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Use meaningful labels that describe what files are being uploaded</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Provide visual feedback during upload progress for large files</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Enable preview for image uploads so users can verify their selection</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Show clear error messages for file validation failures</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Set reasonable maxFiles and maxSize limits based on use case</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-md">Accessibility</h3>
          <ul className="space-y-sm text-sm">
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Keyboard accessible (Tab, Enter, Space for interaction)</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>ARIA attributes: aria-invalid, aria-describedby, aria-label</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Error messages announced with aria-live for screen readers</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Focus indicator visible on dropzone for keyboard navigation</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Label properly associated with file input using htmlFor</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Required fields indicated with * and aria-required attribute</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>File list accessible with proper ARIA labels and roles</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-muted-foreground shrink-0">•</span>
              <span>Remove buttons labeled with descriptive aria-label for screen readers</span>
            </li>
          </ul>
        </div>
      </div>

      <h2 className="mt-2xl">Do's and Don'ts</h2>

      <div className="not-prose grid md:grid-cols-2 gap-lg my-lg">
        {/* Do's */}
        <div className="border-2 border-success rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-success mb-md flex items-center gap-sm">
            <span className="text-2xl">✓</span> Do
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Specify accepted file types to prevent invalid uploads</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Set maxSize limits appropriate for your use case</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Provide clear helper text about file requirements</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Enable showPreview for image uploads</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-success shrink-0">•</span>
              <span>Use descriptive labels that indicate what to upload</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-success/10 rounded-md">
            <ComponentPreview
              code={`<FileUpload
  label="Profile Picture"
  accept="image/*"
  maxSize={2 * 1024 * 1024}
  showPreview
  helperText="Upload JPG or PNG, max 2MB"
/>`}
            >
              <FileUpload
                label="Profile Picture"
                accept="image/*"
                maxSize={2 * 1024 * 1024}
                showPreview
                helperText="Upload JPG or PNG, max 2MB"
              />
            </ComponentPreview>
          </div>
        </div>

        {/* Don'ts */}
        <div className="border-2 border-error bg-error/10 rounded-lg p-lg">
          <h3 className="text-lg font-semibold text-error mb-md flex items-center gap-sm">
            <span className="text-2xl">✗</span> Don't
          </h3>
          <ul className="space-y-md text-sm">
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't allow unlimited file sizes without validation</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't use vague labels like "Upload File" without context</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't skip helper text for complex requirements</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't disable preview for images without good reason</span>
            </li>
            <li className="flex gap-sm">
              <span className="text-error shrink-0">•</span>
              <span>Don't forget to handle error states and validation</span>
            </li>
          </ul>
          <div className="mt-md p-md bg-error/20 rounded-md">
            <ComponentPreview
              code={`<FileUpload
  label="Upload File"
/>`}
            >
              <FileUpload
                label="Upload File"
              />
            </ComponentPreview>
          </div>
        </div>
      </div>

      <h2>Related Components</h2>
      <div className="not-prose grid sm:grid-cols-2 lg:grid-cols-3 gap-md my-lg">
        <Link
          href="/components/input"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Input</h3>
          <p className="text-sm text-muted-foreground">For text and basic data entry</p>
        </Link>
        <Link
          href="/components/textarea"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Textarea</h3>
          <p className="text-sm text-muted-foreground">For multi-line text input</p>
        </Link>
        <Link
          href="/components/button"
          className="group block p-md border border-border rounded-lg hover:border-primary hover:shadow-md transition-colors duration-normal no-underline"
        >
          <h3 className="font-semibold mb-xs group-hover:text-primary transition-colors duration-normal">Button</h3>
          <p className="text-sm text-muted-foreground">For triggering form submissions</p>
        </Link>
      </div>

      <h2>Resources</h2>
      <div className="not-prose my-lg">
        <ul className="space-y-md">
          <li>
            <Link
              variant="standalone"
              href="https://github.com/y-core-engineering/fidus/blob/main/packages/ui/src/components/file-upload/file-upload.tsx"
              external
              showIcon
            >
              View source on GitHub
            </Link>
          </li>
          <li>
            <Link
              variant="standalone"
              href="https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/"
              external
              showIcon
            >
              ARIA: File Upload Pattern
            </Link>
          </li>
          <li>
            <Link variant="standalone" href="/getting-started/for-developers">
              Installation guide
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
