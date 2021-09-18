import { useState } from "react";
import {
  Alert,
  AlertTitle,
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Snackbar,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { red } from "@mui/material/colors";
import {
  customLoader,
  expExampleBls12381KeyPair,
  expVCDocument,
  documentTemplate as docTemplate,
} from "../data";
import Doc from "./Doc";

import jsigs from "jsonld-signatures";
import {
  Bls12381G2KeyPair,
  BbsBlsSignature2020,
} from "@yamdan/jsonld-signatures-bbs";

export type IssuerProps = {
  onIssue: (issued: any, index: number) => void;
};

export default function Issuer(props: IssuerProps) {
  const [docs, setDocs] = useState([expVCDocument as {} | string]);
  const [key] = useState(new Bls12381G2KeyPair(expExampleBls12381KeyPair));
  const [err, setErr] = useState("");
  const [errOpen, setErrOpen] = useState(false);

  const onChange = (index: number, value: {} | string) => {
    let newDocs = [...docs];
    newDocs[index] = value;
    setDocs(newDocs);
  };

  const onIssue = async (index: number) => {
    const doc = docs[index];
    const d: {} = typeof doc === "string" ? JSON.parse(doc) : { ...doc };
    try {
      const issuedVC = await jsigs.sign(d, {
        suite: new BbsBlsSignature2020({ key }),
        purpose: new jsigs.purposes.AssertionProofPurpose(),
        documentLoader: customLoader,
        expansionMap: false,
        compactProof: true,
      });
      props.onIssue(issuedVC, index);
    } catch (e: any) {
      setErr(e.message);
      setErrOpen(true);
    }
  };

  const addDoc = () => {
    let newDocs = [...docs];
    newDocs.push({ ...docTemplate });
    setDocs(newDocs);
  };

  const handleErrClose = (_: any, reason: string) => {
    if (reason === "clickaway") {
      return;
    }

    setErrOpen(false);
  };

  return (
    <Card variant="outlined">
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="issuer">
            I
          </Avatar>
        }
        title="Issuer"
      />
      <CardContent>
        <Stack spacing={2}>
          {docs.map((doc, index) => (
            <Doc
              key={index}
              index={index}
              value={doc}
              onChange={onChange}
              onIssue={onIssue}
            />
          ))}
          <Button onClick={addDoc}>
            <AddIcon />
          </Button>
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
