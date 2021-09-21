import { Chip, IconButton, Tooltip } from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { VerificationStatus } from "../App";

type VerifyProps = {
  index?: number;
  onVerify: (index?: number) => void;
  status: VerificationStatus;
};

export default function Verify(props: VerifyProps) {
  let disabled = true;
  let chip = "";
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
    <>
      {chip && <Chip label={chip} color={chip_color} />}
      <Tooltip title="verify">
        <span>
          <IconButton
            aria-label="verify"
            onClick={() => props.onVerify(props.index)}
            disabled={disabled}
          >
            <PlayCircleIcon />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
}
