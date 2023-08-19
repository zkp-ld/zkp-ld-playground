import { useState } from "react";
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import { orange } from "@mui/material/colors";
import { sign } from "@zkp-ld/jsonld-proofs";

import { ModeType } from "../App";
import CredentialDraft from "./CredentialDraft";
import { Person1, Person2, City, Place } from "../data/doc";

export type IssuerProps = {
  onIssue: (issued: string) => void;
  onClick: () => void;
  mode: ModeType;
  keyPairs: string;
  keyPairsValidated: boolean;
};

export const exampleDocs: { [key: string]: {} } = {
  Person1: Person1,
  Person2: Person2,
  City: City,
  Place: Place,
};

export default function Issuer(props: IssuerProps) {
  const [doc, setDoc] = useState("");
  const [err, setErr] = useState("");
  const [errOpen, setErrOpen] = useState(false);
  const [docValidated, setDocValidated] = useState(true);

  const handleDocChange = (value: string) => {
    setDoc(value);
  };

  const handleExampleChange = (value: string) => {
    setDoc(JSON.stringify(exampleDocs[value], null, 2));
  };

  const handleIssue = async () => {
    try {
      const issuedVC = await sign(JSON.parse(doc), JSON.parse(props.keyPairs));
      props.onIssue(JSON.stringify(issuedVC, null, 2));
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
