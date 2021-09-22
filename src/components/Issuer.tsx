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
  onIssue: (issued: string) => void;
  onClick: () => void;
};

export default function Issuer(props: IssuerProps) {
  const [doc, setDoc] = useState(JSON.stringify(expVCDocument, null, 2));
  const [key] = useState(new Bls12381G2KeyPair(expExampleBls12381KeyPair));
  const [err, setErr] = useState("");
  const [errOpen, setErrOpen] = useState(false);

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
    <Card variant="outlined" sx={{ height: "95vh" }}>
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
          <Doc value={doc} onChange={handleChange} onIssue={handleIssue} />
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
