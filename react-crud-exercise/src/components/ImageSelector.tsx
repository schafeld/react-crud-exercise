interface ImageSelectorProps {
  existingImages?: string[];
  onRemoveExistingImage?: (index: number) => void;
  onFilesChange: (files: FileList | null) => void;
  selectedFiles?: FileList | File[];
  label?: string;
  multiple?: boolean;
  uploadProgress?: number;
}

export default function ImageSelector({
  existingImages = [],
  onRemoveExistingImage,
  onFilesChange,
  selectedFiles,
  label = "Select files",
  multiple = true,
  uploadProgress,
}: ImageSelectorProps) {
  return (
    <div>
      {existingImages.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Current Images</p>
          <div className="flex flex-wrap gap-4">
            {existingImages.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Listing image ${index}`}
                  className="w-24 h-24 object-cover rounded-md"
                />
                {onRemoveExistingImage && (
                  <button
                    type="button"
                    onClick={() => onRemoveExistingImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label
          htmlFor="images"
          className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
        >
          {label}
        </label>
        <input
          type="file"
          id="images"
          onChange={e => onFilesChange(e.target.files)}
          accept="image/*"
          multiple={multiple}
          className="hidden"
        />
        {selectedFiles && (selectedFiles instanceof FileList ? selectedFiles.length > 0 : selectedFiles.length > 0) && (
          <ul className="list-disc list-inside text-gray-700">
            {Array.from(selectedFiles).map((file: File, index: number) => (
              <li key={index} className="text-sm">
                {file.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {uploadProgress !== undefined && uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mt-2">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Uploading: {Math.round(uploadProgress)}%</p>
        </div>
      )}
    </div>
  );
}