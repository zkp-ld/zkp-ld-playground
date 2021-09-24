import {
  Avatar,
  Stack,
  Box,
  Button,
  Typography,
  Tooltip,
  Container,
} from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { green } from "@mui/material/colors";
import Presentation from "./Presentation";
import { VerificationStatus } from "../App";
import { useState } from "react";

type VerifierProps = {
  vP: string;
  status: VerificationStatus;
  onVerify: () => void;
  onChange: (value: string) => void;
  onClick: () => void;
};

export default function Verifier(props: VerifierProps) {
  const [validated, setValidated] = useState(true);

  return (
    <Stack>
      <Box sx={{ display: "flex", margin: 2, alignItems: "center" }}>
        <Button
          color="inherit"
          onClick={(_: any) => props.onClick()}
          sx={{
            justifyContent: "flex-start",
            textTransform: "none",
            flexGrow: 1,
            color: green[500],
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: green[500] }} aria-label="verifier">
              <VerifiedUserIcon />
            </Avatar>
            <Typography>Verifier</Typography>
          </Stack>
        </Button>
        <Tooltip title="verify">
          <Button
            variant="contained"
            aria-label="verify"
            onClick={() => props.onVerify()}
            disabled={!validated}
            sx={{ bgcolor: green[500], "&:hover": { bgcolor: green[600] } }}
          >
            <PlayArrowIcon /> Verify
          </Button>
        </Tooltip>
      </Box>
      <Container>
        <Presentation
          vP={props.vP}
          status={props.status}
          validated={validated}
          onVerify={() => props.onVerify()}
          onChange={(value) => props.onChange(value)}
          onValidate={(v) => setValidated(v)}
        />
      </Container>
    </Stack>
  );
}
