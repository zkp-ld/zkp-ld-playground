import { Chip, Tooltip } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";
import HelpIcon from "@mui/icons-material/Help";
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
  let chip_icon = <ErrorIcon />;
  let chip_variant: "outlined" | "filled" = "outlined";
  switch (props.status) {
    case "Accepted":
      disabled = false;
      chip = "accepted";
      chip_color = "primary";
      chip_icon = <CheckIcon />;
      chip_variant = "filled";
      break;
    case "Rejected":
      disabled = false;
      chip = "rejected";
      chip_color = "error";
      chip_icon = <ErrorIcon />;
      break;
    case "Unverified":
      disabled = false;
      chip = "unverified";
      chip_color = "warning";
      chip_icon = <HelpIcon />;
      break;
    default:
      break;
  }

  return (
    <Tooltip title="verify">
      <Chip
        variant={chip_variant}
        icon={chip_icon}
        label={chip}
        color={chip_color}
        onClick={() => props.onVerify(props.index)}
        disabled={disabled}
      />
    </Tooltip>
  );
}
