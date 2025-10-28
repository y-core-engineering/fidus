import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileUpload } from './file-upload';

// Mock FileReader
class MockFileReader {
  onloadend: (() => void) | null = null;
  result: string | null = null;

  readAsDataURL() {
    this.result = 'data:image/png;base64,mockdata';
    setTimeout(() => {
      if (this.onloadend) this.onloadend();
    }, 0);
  }
}

global.FileReader = MockFileReader as unknown as typeof FileReader;

const createMockFile = (
  name: string,
  size: number,
  type: string
): File => {
  const file = new File(['mock content'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

describe('FileUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with label', () => {
    render(<FileUpload label="Upload Documents" />);
    expect(screen.getByText('Upload Documents')).toBeInTheDocument();
  });

  it('renders with required indicator', () => {
    render(<FileUpload label="Upload Documents" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders dropzone with upload message', () => {
    render(<FileUpload label="Upload Documents" />);
    expect(
      screen.getByText('Click to upload or drag and drop')
    ).toBeInTheDocument();
  });

  it('shows accepted file types when accept prop is provided', () => {
    render(
      <FileUpload label="Upload Documents" accept=".pdf,.doc,.docx" />
    );
    expect(screen.getByText(/Accepted: \.pdf,\.doc,\.docx/)).toBeInTheDocument();
  });

  it('shows max file size when maxSize prop is provided', () => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    render(<FileUpload label="Upload Documents" maxSize={maxSize} />);
    expect(screen.getByText(/Max: 5.00 MB/)).toBeInTheDocument();
  });

  it('handles file selection via input', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<FileUpload label="Upload Documents" onChange={handleChange} />);

    const file = createMockFile('document.pdf', 1024, 'application/pdf');
    const input = screen.getByLabelText('Upload Documents') as HTMLInputElement;

    await user.upload(input, file);

    expect(handleChange).toHaveBeenCalledWith([file]);
  });

  it('handles multiple file selection', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<FileUpload label="Upload Documents" multiple onChange={handleChange} />);

    const file1 = createMockFile('document1.pdf', 1024, 'application/pdf');
    const file2 = createMockFile('document2.pdf', 2048, 'application/pdf');
    const input = screen.getByLabelText('Upload Documents') as HTMLInputElement;

    await user.upload(input, [file1, file2]);

    expect(handleChange).toHaveBeenCalledWith([file1, file2]);
  });

  it('handles controlled value', () => {
    const file = createMockFile('document.pdf', 1024, 'application/pdf');
    const { rerender } = render(
      <FileUpload label="Upload Documents" value={[file]} />
    );

    expect(screen.getByText('document.pdf')).toBeInTheDocument();

    rerender(<FileUpload label="Upload Documents" value={[]} />);
    expect(screen.queryByText('document.pdf')).not.toBeInTheDocument();
  });

  it('handles uncontrolled value with defaultValue', async () => {
    const user = userEvent.setup();
    render(<FileUpload label="Upload Documents" />);

    const file = createMockFile('document.pdf', 1024, 'application/pdf');
    const input = screen.getByLabelText('Upload Documents') as HTMLInputElement;

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText('document.pdf')).toBeInTheDocument();
    });
  });

  it('handles onChange event', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<FileUpload label="Upload Documents" onChange={handleChange} />);

    const file = createMockFile('document.pdf', 1024, 'application/pdf');
    const input = screen.getByLabelText('Upload Documents') as HTMLInputElement;

    await user.upload(input, file);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('handles onBlur event', async () => {
    const user = userEvent.setup();
    const handleBlur = vi.fn();
    render(<FileUpload label="Upload Documents" onBlur={handleBlur} />);

    const input = screen.getByLabelText('Upload Documents');
    await user.click(input);
    fireEvent.blur(input);

    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('shows error message', () => {
    render(
      <FileUpload label="Upload Documents" error="File is required" />
    );
    expect(screen.getByText('File is required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(
      <FileUpload
        label="Upload Documents"
        helperText="Upload your documents here"
      />
    );
    expect(screen.getByText('Upload your documents here')).toBeInTheDocument();
  });

  it('disables file upload when disabled prop is true', () => {
    render(<FileUpload label="Upload Documents" disabled />);
    const input = screen.getByLabelText('Upload Documents');
    expect(input).toBeDisabled();
  });

  it('sets aria-invalid when error exists', () => {
    render(<FileUpload label="Upload Documents" error="Invalid file" />);
    const input = screen.getByLabelText('Upload Documents');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-describedby for error message', () => {
    render(<FileUpload label="Upload Documents" error="Invalid file" />);
    const input = screen.getByLabelText('Upload Documents');
    expect(input).toHaveAttribute('aria-describedby', 'Upload Documents-error');
  });

  it('sets aria-describedby for helper text', () => {
    render(<FileUpload label="Upload Documents" helperText="Upload files" />);
    const input = screen.getByLabelText('Upload Documents');
    expect(input).toHaveAttribute('aria-describedby', 'Upload Documents-helper');
  });

  it('removes file when remove button is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const file = createMockFile('document.pdf', 1024, 'application/pdf');

    render(<FileUpload label="Upload Documents" value={[file]} onChange={handleChange} />);

    const removeButton = screen.getByLabelText('Remove document.pdf');
    await user.click(removeButton);

    expect(handleChange).toHaveBeenCalledWith([]);
  });

  it('displays file name and size', async () => {
    const user = userEvent.setup();
    render(<FileUpload label="Upload Documents" />);

    const file = createMockFile('document.pdf', 2048, 'application/pdf');
    const input = screen.getByLabelText('Upload Documents') as HTMLInputElement;

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText('document.pdf')).toBeInTheDocument();
      expect(screen.getByText('2 KB')).toBeInTheDocument();
    });
  });

  it('formats file size correctly', async () => {
    const user = userEvent.setup();
    render(<FileUpload label="Upload Documents" />);

    const file = createMockFile('large.pdf', 5 * 1024 * 1024, 'application/pdf');
    const input = screen.getByLabelText('Upload Documents') as HTMLInputElement;

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText('5 MB')).toBeInTheDocument();
    });
  });

  it('validates file size against maxSize', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const maxSize = 1024; // 1KB
    render(
      <FileUpload
        label="Upload Documents"
        maxSize={maxSize}
        onChange={handleChange}
      />
    );

    const file = createMockFile('large.pdf', 2048, 'application/pdf');
    const input = screen.getByLabelText('Upload Documents') as HTMLInputElement;

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText(/File size exceeds/)).toBeInTheDocument();
    });
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('validates file type against accept', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <FileUpload
        label="Upload Documents"
        accept=".pdf"
        onChange={handleChange}
      />
    );

    const file = createMockFile('document.txt', 1024, 'text/plain');
    const input = screen.getByLabelText('Upload Documents') as HTMLInputElement;

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText(/File type not accepted/)).toBeInTheDocument();
    });
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('validates max number of files', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <FileUpload
        label="Upload Documents"
        multiple
        maxFiles={2}
        onChange={handleChange}
      />
    );

    const file1 = createMockFile('doc1.pdf', 1024, 'application/pdf');
    const file2 = createMockFile('doc2.pdf', 1024, 'application/pdf');
    const file3 = createMockFile('doc3.pdf', 1024, 'application/pdf');

    const input = screen.getByLabelText('Upload Documents') as HTMLInputElement;

    await user.upload(input, [file1, file2, file3]);

    await waitFor(() => {
      expect(screen.getByText(/Maximum 2 files allowed/)).toBeInTheDocument();
    });
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('accepts wildcard MIME types', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <FileUpload
        label="Upload Documents"
        accept="image/*"
        onChange={handleChange}
      />
    );

    const file = createMockFile('photo.jpg', 1024, 'image/jpeg');
    const input = screen.getByLabelText('Upload Documents') as HTMLInputElement;

    await user.upload(input, file);

    expect(handleChange).toHaveBeenCalledWith([file]);
  });

  it('handles drag over event', () => {
    render(<FileUpload label="Upload Documents" />);
    const dropzone = screen.getByRole('button', { name: 'File upload dropzone' });

    fireEvent.dragOver(dropzone);

    expect(screen.getByText('Drop files here')).toBeInTheDocument();
  });

  it('handles drag leave event', () => {
    render(<FileUpload label="Upload Documents" />);
    const dropzone = screen.getByRole('button', { name: 'File upload dropzone' });

    fireEvent.dragOver(dropzone);
    expect(screen.getByText('Drop files here')).toBeInTheDocument();

    fireEvent.dragLeave(dropzone);
    expect(screen.getByText('Click to upload or drag and drop')).toBeInTheDocument();
  });

  it('handles drop event', async () => {
    const handleChange = vi.fn();
    render(<FileUpload label="Upload Documents" onChange={handleChange} />);
    const dropzone = screen.getByRole('button', { name: 'File upload dropzone' });

    const file = createMockFile('document.pdf', 1024, 'application/pdf');
    const dataTransfer = {
      files: [file],
    };

    fireEvent.drop(dropzone, { dataTransfer });

    expect(handleChange).toHaveBeenCalledWith([file]);
  });

  it('opens file dialog on click', async () => {
    const user = userEvent.setup();
    render(<FileUpload label="Upload Documents" />);
    const dropzone = screen.getByRole('button', { name: 'File upload dropzone' });

    // Mock input click
    const input = screen.getByLabelText('Upload Documents') as HTMLInputElement;
    const clickSpy = vi.spyOn(input, 'click');

    await user.click(dropzone);

    expect(clickSpy).toHaveBeenCalled();
  });

  it('opens file dialog on Enter key', async () => {
    const user = userEvent.setup();
    render(<FileUpload label="Upload Documents" />);
    const dropzone = screen.getByRole('button', { name: 'File upload dropzone' });

    // Mock input click
    const input = screen.getByLabelText('Upload Documents') as HTMLInputElement;
    const clickSpy = vi.spyOn(input, 'click');

    dropzone.focus();
    await user.keyboard('{Enter}');

    expect(clickSpy).toHaveBeenCalled();
  });

  it('opens file dialog on Space key', async () => {
    const user = userEvent.setup();
    render(<FileUpload label="Upload Documents" />);
    const dropzone = screen.getByRole('button', { name: 'File upload dropzone' });

    // Mock input click
    const input = screen.getByLabelText('Upload Documents') as HTMLInputElement;
    const clickSpy = vi.spyOn(input, 'click');

    dropzone.focus();
    await user.keyboard(' ');

    expect(clickSpy).toHaveBeenCalled();
  });

  it('shows image preview for image files', async () => {
    const user = userEvent.setup();
    render(<FileUpload label="Upload Documents" showPreview />);

    const file = createMockFile('photo.jpg', 1024, 'image/jpeg');
    const input = screen.getByLabelText('Upload Documents') as HTMLInputElement;

    await user.upload(input, file);

    await waitFor(() => {
      const img = screen.getByAltText('photo.jpg');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'data:image/png;base64,mockdata');
    });
  });

  it('does not show preview when showPreview is false', async () => {
    const user = userEvent.setup();
    render(<FileUpload label="Upload Documents" showPreview={false} />);

    const file = createMockFile('photo.jpg', 1024, 'image/jpeg');
    const input = screen.getByLabelText('Upload Documents') as HTMLInputElement;

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText('photo.jpg')).toBeInTheDocument();
    });

    expect(screen.queryByAltText('photo.jpg')).not.toBeInTheDocument();
  });

  it('restricts to single file when multiple is false', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<FileUpload label="Upload Documents" onChange={handleChange} />);

    const file1 = createMockFile('doc1.pdf', 1024, 'application/pdf');
    const file2 = createMockFile('doc2.pdf', 1024, 'application/pdf');
    const input = screen.getByLabelText('Upload Documents') as HTMLInputElement;

    await user.upload(input, [file1, file2]);

    // Should only upload first file
    expect(handleChange).toHaveBeenCalledWith([file1]);
  });
});
