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
import jsigs from "jsonld-signatures";
import {
  Bls12381G2KeyPair,
  BbsTermwiseSignature2021,
} from "@zkp-ld/jsonld-signatures-bbs";

import { ModeType } from "../App";
import Doc from "./Doc";
import IssuerKey from "./IssuerKey";
import { Person1, Person2, City, Place } from "../data/doc";
import {
  exampleBls12381KeyPair1,
  exampleBls12381KeyPair2,
  exampleBls12381KeyPair3,
} from "../data/key";

export type IssuerProps = {
  documentLoader: (documents: any) => any;
  onIssue: (issued: string) => void;
  onClick: () => void;
  mode: ModeType;
};

export const exampleDocs: { [key: string]: {} } = {
  Person1: Person1,
  Person2: Person2,
  City: City,
  Place: Place,
};

export const exampleKeys: { [key: string]: {} } = {
  "did:example:issuer1#bbs-bls-key1": exampleBls12381KeyPair1,
  "did:example:issuer2#bbs-bls-key1": exampleBls12381KeyPair2,
  "did:example:issuer3#bbs-bls-key1": exampleBls12381KeyPair3,
};

export default function Issuer(props: IssuerProps) {
  const [doc, setDoc] = useState("");
  const [key, setKey] = useState(
    JSON.stringify(exampleKeys["did:example:issuer1#bbs-bls-key1"], null, 2)
  );
  const [err, setErr] = useState("");
  const [errOpen, setErrOpen] = useState(false);
  const [docValidated, setDocValidated] = useState(true);
  const [keyValidated, setKeyValidated] = useState(true);

  const handleDocChange = (value: string) => {
    setDoc(value);
  };

  const handleKeyChange = (value: string) => {
    setKey(value);
  };

  const handleExampleChange = (value: string) => {
    setDoc(JSON.stringify(exampleDocs[value], null, 2));
  };

  const handleKeyExampleChange = (value: string) => {
    setKey(JSON.stringify(exampleKeys[value], null, 2));
  };

  const handleIssue = async () => {
    try {
      const keyObj = new Bls12381G2KeyPair(JSON.parse(key));
      const issuedVC = await jsigs.sign(JSON.parse(doc), {
        suite: new BbsTermwiseSignature2021({ key: keyObj }),
        purpose: new jsigs.purposes.AssertionProofPurpose(),
        documentLoader: props.documentLoader,
        expansionMap: false,
        compactProof: true,
      });
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
      <Box sx={{ display: "flex", margin: 2, alignItems: "center" }}>
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
            disabled={!docValidated || !keyValidated}
            sx={{ bgcolor: orange[500], "&:hover": { bgcolor: orange[600] } }}
          >
            Issue
          </Button>
        </Tooltip>
      </Box>
      <Box sx={{ padding: 2 }}>
        <Doc
          value={doc}
          validated={docValidated}
          mode={props.mode}
          onChange={handleDocChange}
          onIssue={handleIssue}
          onValidate={(v) => setDocValidated(v)}
          onExampleChange={handleExampleChange}
        />
      </Box>
      <Box sx={{ padding: [0, 2] }}>
        <IssuerKey
          value={key}
          mode={props.mode}
          onChange={handleKeyChange}
          onValidate={(v) => setKeyValidated(v)}
          onExampleChange={handleKeyExampleChange}
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
