import {
  Avatar,
  Stack,
  Box,
  Button,
  Typography,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
} from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TuneIcon from "@mui/icons-material/Tune";
import { blue } from "@mui/material/colors";
import Presentation from "./Presentation";
import { ModeType, VerificationStatus } from "../App";
import { useState } from "react";
import { Editor } from "@monaco-editor/react";

type VerifierProps = {
  vP: string;
  didDocumentsValidated: boolean;
  vpContext: string;
  status: VerificationStatus;
  challenge: string;
  domain: string;
  onVerify: () => void;
  onChange: (value: string) => void;
  onClick: () => void;
  onVpContextChange: (value: string) => void;
  onChallengeChange: (value: string) => void;
  onDomainChange: (value: string) => void;
  mode: ModeType;
};

export default function Verifier(props: VerifierProps) {
  const [validated, setValidated] = useState(true);
  const [vpContextValidated, setVpContextValidated] = useState(true);

  const handleChallengeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.onChallengeChange(e.target.value);
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.onDomainChange(e.target.value);
  };

  return (
    <Stack>
      <Box sx={{ display: "flex", margin: 1, alignItems: "center" }}>
        <Button
          color="inherit"
          onClick={(_: any) => props.onClick()}
          sx={{
            justifyContent: "flex-start",
            textTransform: "none",
            flexGrow: 1,
            color: blue[500],
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: blue[500] }} aria-label="verifier">
              <VerifiedUserIcon />
            </Avatar>
            <Typography>Verifier</Typography>
          </Stack>
        </Button>
        <Button
          variant="contained"
          aria-label="verify"
          onClick={() => props.onVerify()}
          disabled={
            !validated || !vpContextValidated || !props.didDocumentsValidated
          }
          sx={{ bgcolor: blue[500], "&:hover": { bgcolor: blue[600] } }}
        >
          Verify
        </Button>
      </Box>
      <Accordion sx={{ margin: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <TuneIcon sx={{ marginRight: "8px" }} /> Options
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Tooltip
              title="Specify the challenge (a one-time random string) that the Holder should use when creating their blind sign request, which will be embedded within the Verifiable Presentation."
              sx={{ mr: 1 }}
            >
              <TextField
                label="Challenge"
                size="small"
                value={props.challenge}
                onChange={handleChallengeChange}
                InputLabelProps={{ shrink: true }}
              />
            </Tooltip>
            <TextField
              label="Domain"
              size="small"
              value={props.domain}
              onChange={handleDomainChange}
              InputLabelProps={{ shrink: true }}
            />
            <Typography>Context for VP</Typography>
            <Editor
              height="12vh"
              defaultLanguage="json"
              value={props.vpContext}
              theme={props.mode === "light" ? "light" : "vs-dark"}
              options={{
                lineNumbers: "off",
                minimap: { enabled: false },
              }}
              onChange={(value, _) => value && props.onVpContextChange(value)}
              onValidate={(markers) => {
                setVpContextValidated(markers.length === 0);
              }}
            />
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Box sx={{ height: "80vh", overflow: "auto" }}>
        <Box sx={{ padding: 2 }}>
          <Presentation
            vP={props.vP}
            status={props.status}
            validated={validated}
            onVerify={() => props.onVerify()}
            onChange={(value) => props.onChange(value)}
            onValidate={(v) => setValidated(v)}
            mode={props.mode}
          />
        </Box>
      </Box>
    </Stack>
  );
}
