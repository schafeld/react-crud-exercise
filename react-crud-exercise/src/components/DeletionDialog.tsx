import { Dialog } from 'primereact/dialog';

interface DeletionDialogProps {
  visible: boolean;
  onCancel: () => void;
  onDelete: () => void;
  deleting: boolean;
}

export default function DeletionDialog({
  visible,
  onCancel,
  onDelete,
  deleting,
}: DeletionDialogProps) {
  return (
    <Dialog
      header="Confirm Deletion"
      visible={visible}
      style={{ width: '350px' }}
      onHide={onCancel}
      footer={
        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
            onClick={onCancel}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            onClick={onDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      }
      modal
      draggable={false}
      maskClassName="custom-dialog-mask"
      className="custom-dialog-content"
    >
      <p>Do you really want to delete this listing?</p>
    </Dialog>
  );
}