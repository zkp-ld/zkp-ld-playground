import { useState } from "react";
import {
  Alert,
  AlertTitle,
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Snackbar,
  Stack,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
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
  onIssue: (issued: string, index: number) => void;
  onClick: () => void;
};

export default function Issuer(props: IssuerProps) {
  const [docs, setDocs] = useState([JSON.stringify(expVCDocument, null, 2)]);
  const [key] = useState(new Bls12381G2KeyPair(expExampleBls12381KeyPair));
  const [err, setErr] = useState("");
  const [errOpen, setErrOpen] = useState(false);

  const handleChange = (index: number, value: string) => {
    let newDocs = [...docs];
    newDocs[index] = value;
    setDocs(newDocs);
  };

  const handleIssue = async (index: number) => {
    const doc = docs[index];
    const d: {} = JSON.parse(doc);
    try {
      const issuedVC = await jsigs.sign(d, {
        suite: new BbsBlsSignatureTermwise2020({ key }),
        purpose: new jsigs.purposes.AssertionProofPurpose(),
        documentLoader: customLoader,
        expansionMap: false,
        compactProof: true,
      });
      props.onIssue(JSON.stringify(issuedVC, null, 2), index);
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
    <Card variant="outlined">
      <CardActionArea onClick={(_: any) => props.onClick()}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: orange[500] }} aria-label="issuer">
              <CreateIcon />
            </Avatar>
          }
          title="Issuer"
        />
      </CardActionArea>
      <CardContent>
        <Stack spacing={2}>
          {docs.map((doc, index) => (
            <Doc
              key={index}
              index={index}
              value={doc}
              onChange={handleChange}
              onIssue={handleIssue}
            />
          ))}
        </Stack>
      </CardContent>
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
    </Card>
  );
}
