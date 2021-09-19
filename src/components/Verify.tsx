import { useState } from "react";
import { IconButton } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import CheckIcon from "@mui/icons-material/Check";

type VerifyProps = {
  index: number;
  onVerify: (index: number) => void;
};
export default function Verify(props: VerifyProps) {
  const [verified, setVerified] = useState(false);

  return (
    <IconButton aria-label="verify" onClick={() => props.onVerify(props.index)}>
      {verified ? <CheckIcon /> : <HelpIcon />}
    </IconButton>
  );
}
