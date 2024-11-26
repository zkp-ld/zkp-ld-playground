import {
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import { memo, useEffect, useState } from "react";
import Markdown from "react-markdown";
import DescriptionMD from "../docs/DESCRIPTION.md";


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
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
});
