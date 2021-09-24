import { useState } from "react";
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { orange } from "@mui/material/colors";
import {
  customLoader,
  expExampleBls12381KeyPair,
  expVCDocument,
} from "../data";
import Doc from "./Doc";

import jsigs from "jsonld-signatures";
import {
  Bls12381G2KeyPair,
  BbsBlsSignatureTermwise2020,
} from "@yamdan/jsonld-signatures-bbs";

export type IssuerProps = {
  onIssue: (issued: string) => void;
  onClick: () => void;
};

export default function Issuer(props: IssuerProps) {
  const [doc, setDoc] = useState(JSON.stringify(expVCDocument, null, 2));
  const [key] = useState(new Bls12381G2KeyPair(expExampleBls12381KeyPair));
  const [err, setErr] = useState("");
  const [errOpen, setErrOpen] = useState(false);
  const [validated, setValidated] = useState(true);

  const handleChange = (value: string) => {
    setDoc(value);
  };

  const handleIssue = async () => {
    try {
      const issuedVC = await jsigs.sign(JSON.parse(doc), {
        suite: new BbsBlsSignatureTermwise2020({ key }),
        purpose: new jsigs.purposes.AssertionProofPurpose(),
        documentLoader: customLoader,
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
            disabled={!validated}
            sx={{ bgcolor: orange[500], "&:hover": { bgcolor: orange[600] } }}
          >
            <PlayArrowIcon /> Issue
          </Button>
        </Tooltip>
      </Box>
      <Container>
        <Doc
          value={doc}
          validated={validated}
          onChange={handleChange}
          onIssue={handleIssue}
          onValidate={(v) => setValidated(v)}
        />
      </Container>
      <Snackbar
        open={errOpen}
        autoHideDuration={10000}
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
