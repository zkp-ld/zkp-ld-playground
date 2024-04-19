import { useState } from "react";

export const useDocumentDialog = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  return { openDialog, handleOpenDialog, handleCloseDialog };
};
