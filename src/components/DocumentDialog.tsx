import {
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { memo, useEffect, useState } from "react";
import Markdown from "react-markdown";
import DescriptionMD from "../docs/DESCRIPTION.md";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const ImageRenderer = ({
  src,
  alt,
}: {
  src: string | undefined;
  alt: string | undefined;
}) => {
  return <img width="100%" src={src} alt={alt} />;
};

export type DocumentDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default memo(({ open, onClose }: DocumentDialogProps) => {
  const [postMarkdown, setPostMarkdown] = useState("");

  useEffect(() => {
    fetch(DescriptionMD)
      .then((response) => response.text())
      .then((text) => {
        setPostMarkdown(text);
      });
  }, []);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      maxWidth="xl"
      fullWidth
    >
      <DialogContent>
        <Markdown
          components={{
            h1: ({ children }) => (
              <Typography variant="h4">{children}</Typography>
            ),
            img: ({ src, alt }) => (
              <ImageRenderer src={src} alt={alt as string} />
            ),
          }}
        >
          {postMarkdown}
        </Markdown>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer fileUrl="/document.pdf" />
        </Worker>
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
});
