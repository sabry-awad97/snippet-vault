import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Snippet } from '@/lib/schemas/snippet';
import { motion } from 'framer-motion';
import SnippetForm from './SnippetForm';

interface SnippetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (snippet: Snippet) => Promise<void>;
  initialData?: Snippet | null;
  isEditMode: boolean;
}

const SnippetDialog: React.FC<SnippetDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditMode,
}) => {
  const handleSubmit = async (values: Snippet) => {
    await onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Edit Snippet' : 'Create New Snippet'}
            </DialogTitle>
          </DialogHeader>
          <SnippetForm
            snippet={initialData ?? undefined}
            onSubmit={handleSubmit}
          />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default SnippetDialog;
