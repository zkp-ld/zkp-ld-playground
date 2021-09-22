import {
  Card,
  CardHeader,
  Avatar,
  CardContent,
  CardActionArea,
  Stack,
} from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { green } from "@mui/material/colors";
import Presentation from "./Presentation";
import { VerificationStatus } from "../App";

type VerifierProps = {
  vP: string;
  onVerify: () => void;
  status: VerificationStatus;
  onChange: (value: string) => void;
  onClick: () => void;
};

export default function Verifier(props: VerifierProps) {
  return (
    <Card variant="outlined" sx={{ height: "95vh" }}>
      <CardActionArea onClick={(_) => props.onClick()}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: green[500] }} aria-label="verifier">
              <VerifiedUserIcon />
            </Avatar>
          }
          title="Verifier"
        />
      </CardActionArea>
      <CardContent>
        <Stack spacing={3}>
          <Presentation
            vP={props.vP}
            onVerify={() => props.onVerify()}
            status={props.status}
            onChange={(value) => props.onChange(value)}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
