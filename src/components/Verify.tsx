import { Chip, Tooltip } from "@mui/material";
import { VerificationStatus } from "../App";

type VerifyProps = {
  index?: number;
  onVerify: (index?: number) => void;
  status: VerificationStatus;
};

export default function Verify(props: VerifyProps) {
  let disabled = true;
  let chip = "unverified";
  let chip_color: "default" | "primary" | "error" | "warning" = "default";
  switch (props.status) {
    case "Accepted":
      disabled = false;
      chip = "accepted";
      chip_color = "primary";
      break;
    case "Rejected":
      disabled = false;
      chip = "rejected";
      chip_color = "error";
      break;
    case "Unverified":
      disabled = false;
      chip = "unverified";
      chip_color = "warning";
      break;
    default:
      break;
  }

  return (
    <Tooltip title="verify">
      <Chip
        label={chip}
        color={chip_color}
        onClick={() => props.onVerify(props.index)}
        disabled={disabled}
      />
    </Tooltip>
  );
}
