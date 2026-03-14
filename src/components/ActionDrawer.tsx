import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ActionDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function ActionDrawer({ open, onClose, title, children }: ActionDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            className="drawer-panel p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="page-header">{title}</h2>
              <button onClick={onClose} className="p-1 rounded-sm hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
