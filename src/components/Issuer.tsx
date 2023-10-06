import { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TuneIcon from "@mui/icons-material/Tune";
import { orange } from "@mui/material/colors";
import { sign, blindSign, verifyBlindSignRequest } from "@zkp-ld/jsonld-proofs";

import { ModeType, TOOLTIP_ENTERDELAY } from "../App";
import CredentialDraft from "./CredentialDraft";
import { DocumentLoader } from "@zkp-ld/jsonld-proofs/lib/types";
import { exampleDocs } from "../data/doc";

export type IssuerProps = {
  onIssue: (issued: string, isBlind: boolean) => void;
  onClick: () => void;
  onChallengeChange: (value: string) => void;
  challenge: string;
  commitment: string;
  pokForCommitment: string;
  mode: ModeType;
  keyPairs: string;
  keyPairsValidated: boolean;
  documentLoader: DocumentLoader;
};

export default function Issuer(props: IssuerProps) {
  const [doc, setDoc] = useState("");
  const [err, setErr] = useState("");
  const [errOpen, setErrOpen] = useState(false);
  const [docValidated, setDocValidated] = useState(true);
  const [isBlind, setIsBlind] = useState(false);

  const handleDocChange = (value: string) => {
    setDoc(value);
  };

  const handleExampleChange = (value: string) => {
    setDoc(JSON.stringify(exampleDocs.get(value), null, 2));
  };

  const handleIssue = async () => {
    try {
      const issuedVC = isBlind
        ? await handleBlindIssue()
        : await sign(
            JSON.parse(doc),
            JSON.parse(props.keyPairs),
            props.documentLoader
          );
      props.onIssue(JSON.stringify(issuedVC, null, 2), isBlind);
    } catch (e: any) {
      setErr(e.message);
      setErrOpen(true);
    }
  };

  const handleBlindIssue = async () => {
    const verified = await verifyBlindSignRequest(
      props.commitment,
      props.pokForCommitment,
      props.challenge
    );
    if (verified.verified === false && verified.error) {
      setErr(verified.error);
      setErrOpen(true);
    } else {
      return await blindSign(
        props.commitment,
        JSON.parse(doc),
        JSON.parse(props.keyPairs),
        props.documentLoader
      );
    }
  };

  const handleChallengeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.onChallengeChange(e.target.value);
  };

  const handleErrClose = (_: any, reason: string) => {
    if (reason === "clickaway") {
      return;
    }
    setErrOpen(false);
  };

  const handleIsBlindChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsBlind(e.target.checked);
  };

  return (
    <Stack>
      <Box sx={{ display: "flex", margin: 1, alignItems: "center" }}>
        <Button
          onClick={(_: any) => props.onClick()}
          sx={{
            justifyContent: "flex-start",
            textTransform: "none",
            flexGrow: 1,
            color: orange[500],
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: orange[500] }} aria-label="issuer">
              <CreateIcon />
            </Avatar>
            <Typography>Issuer</Typography>
          </Stack>
        </Button>
        <Button
          variant="contained"
          aria-label="issue"
          onClick={handleIssue}
          disabled={!docValidated || !props.keyPairsValidated}
          sx={{ bgcolor: orange[500], "&:hover": { bgcolor: orange[600] } }}
        >
          Issue
        </Button>
      </Box>
      <Accordion sx={{ margin: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <TuneIcon sx={{ marginRight: "8px" }} /> Options
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Tooltip
              enterDelay={TOOLTIP_ENTERDELAY}
              title="Specify the challenge (a one-time random string) that the Holder should use when creating their blind sign request."
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
              label="Commitment"
              size="small"
              value={props.commitment}
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Proof for commitment"
              size="small"
              value={props.pokForCommitment}
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  inputProps={{ "aria-label": "controlled" }}
                  checked={isBlind}
                  onChange={handleIsBlindChange}
                />
              }
              label="Issue with blind sign request"
            />
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Box sx={{ padding: 2 }}>
        <CredentialDraft
          value={doc}
          validated={docValidated}
          mode={props.mode}
          onChange={handleDocChange}
          onIssue={handleIssue}
          onValidate={(v) => setDocValidated(v)}
          onExampleChange={handleExampleChange}
        />
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={errOpen}
        onClose={handleErrClose}
      >
        <Alert onClose={() => setErrOpen(false)} severity="error">
          <AlertTitle>Error</AlertTitle>
          {err}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
