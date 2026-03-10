import { useRef, useState, type DragEvent } from 'react';

interface LogoUploaderProps {
  label: string;
  value?: string;
  onChange: (value?: string) => void;
  accept?: string;
}

const readFileAsDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result));
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

export const LogoUploader = ({ label, value, onChange, accept = 'image/*' }: LogoUploaderProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState('');

  const processFile = async (file?: File) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }

    setError('');
    const dataUrl = await readFileAsDataUrl(file);
    onChange(dataUrl);
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    await processFile(file);
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-[#6e6e73]">{label}</p>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-[#d2d2d7] bg-[#f5f5f7] p-4 text-center transition hover:border-[#80bfff]"
      >
        {value ? (
          <img src={value} alt={`${label} preview`} className="max-h-24 w-auto rounded-md object-contain" />
        ) : (
          <span className="text-xs text-[#8e8e93]">Drag and drop or click to upload</span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={async (event) => processFile(event.target.files?.[0])}
      />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-lg border border-[#d2d2d7] px-3 py-1.5 text-xs font-medium text-[#3a3a3c] hover:border-[#a1a1a6]"
        >
          Upload
        </button>
        {value ? (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-medium text-rose-700 hover:border-rose-400"
          >
            Remove
          </button>
        ) : null}
      </div>

      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  );
};
