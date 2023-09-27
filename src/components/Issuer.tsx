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
import { sign } from "@zkp-ld/jsonld-proofs";

import { ModeType } from "../App";
import CredentialDraft from "./CredentialDraft";
import { Person1, Person2, Person3, City, Place } from "../data/doc";
import { DocumentLoader } from "@zkp-ld/jsonld-proofs/lib/types";
import { blindSign } from "@zkp-ld/jsonld-proofs/lib/api";

export type IssuerProps = {
  onIssue: (issued: string, isBlind: boolean) => void;
  onClick: () => void;
  mode: ModeType;
  keyPairs: string;
  keyPairsValidated: boolean;
  documentLoader: DocumentLoader;
};

export const exampleDocs = new Map<string, Object>([
  ["Person1", Person1],
  ["City", City],
  ["Person2", Person2],
  ["Person3", Person3],
  ["Place", Place],
]);

export default function Issuer(props: IssuerProps) {
  const [doc, setDoc] = useState("");
  const [err, setErr] = useState("");
  const [errOpen, setErrOpen] = useState(false);
  const [docValidated, setDocValidated] = useState(true);
  const [commitment, setCommitment] = useState("");
  const [isBlind, setIsBlind] = useState(false);

  const handleDocChange = (value: string) => {
    setDoc(value);
  };

  const handleExampleChange = (value: string) => {
    setDoc(JSON.stringify(exampleDocs[value], null, 2));
  };

  const handleIssue = async () => {
    try {
      const issuedVC = isBlind
        ? await blindSign(
            commitment,
            JSON.parse(doc),
            JSON.parse(props.keyPairs),
            props.documentLoader
          )
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

  const handleErrClose = (_: any, reason: string) => {
    if (reason === "clickaway") {
      return;
    }
    setErrOpen(false);
  };

  const handleCommitmentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCommitment(e.target.value);
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
        <Tooltip title="issue">
          <Button
            variant="contained"
            aria-label="issue"
            onClick={handleIssue}
            disabled={!docValidated || !props.keyPairsValidated}
            sx={{ bgcolor: orange[500], "&:hover": { bgcolor: orange[600] } }}
          >
            Issue
          </Button>
        </Tooltip>
      </Box>
      <Accordion sx={{ margin: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <TuneIcon sx={{ marginRight: "8px" }} /> Options
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={1}>
            <TextField
              label="Commitment"
              size="small"
              value={commitment}
              onChange={handleCommitmentChange}
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
              label="Blindly issue with commitment"
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
