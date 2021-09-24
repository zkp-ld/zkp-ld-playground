import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";
import Issuer from "./components/Issuer";
import Holder from "./components/Holder";
import Verifier from "./components/Verifier";
import { useState } from "react";
import { revealTemplate, customLoader } from "./data";
import jsigs from "jsonld-signatures";
import {
  BbsBlsSignatureProofTermwise2020,
  BbsBlsSignatureTermwise2020,
  deriveProofMulti,
  verifyProofMulti,
} from "@yamdan/jsonld-signatures-bbs";
import {
  Alert,
  AlertTitle,
  AppBar,
  CssBaseline,
  Grid,
  Snackbar,
} from "@mui/material";

export const MATERIAL_THEME = "light";
export const EDITOR_THEME = "light";
// export const MATERIAL_THEME = "dark";
// export const EDITOR_THEME = "vs-dark";

export const CREDENTIAL_HEIGHT = "40vh";

const materialTheme = createTheme({
  palette: {
    mode: MATERIAL_THEME,
  },
});

export type CredAndRevealArrayType = {
  lastIndex: number;
  value: CredAndRevealType[];
};

export type CredAndRevealType = {
  index: number;
  cred: string;
  credValidated: boolean;
  credStatus: VerificationStatus;
  reveal: string;
  revealValidated: boolean;
  checked: boolean;
};

export type VerificationStatus =
  | "Accepted"
  | "Rejected"
  | "Unverified"
  | "Disabled";

function App() {
  const [issuerOpen, setIssuerOpen] = useState(true);
  const [verifierOpen, setVerifierOpen] = useState(false);
  const [hiddenURIs, setHiddenURIs] = useState([] as string[]);
  const [credsAndReveals, setCredsAndReveals] = useState({
    lastIndex: 0,
    value: [],
  } as CredAndRevealArrayType);
  const [vP, setVP] = useState("");
  const [verificationStatus, setVerificationStatus] = useState(
    "Unverified" as VerificationStatus
  );
  const [err, setErr] = useState("");
  const [errOpen, setErrOpen] = useState(false);

  const handleErrClose = (_: any, reason: string) => {
    if (reason === "clickaway") {
      return;
    }
    setErrOpen(false);
  };

  const handleIssue = (issuedVC: string) => {
    let newCredsAndReveals = {
      ...credsAndReveals,
      lastIndex: credsAndReveals.lastIndex + 1,
    };

    newCredsAndReveals.value.push({
      index: credsAndReveals.lastIndex,
      cred: issuedVC,
      reveal: JSON.stringify(revealTemplate, null, 2),
      credValidated: true,
      credStatus: "Unverified",
      revealValidated: true,
      checked: false,
    });
    setCredsAndReveals(newCredsAndReveals);

    setIssuerOpen(true);
    setVerifierOpen(false);
  };

  const handleCredsAndRevealsCheckboxChange = (
    index: number,
    checked: boolean
  ) => {
    let newCredsAndReveals = { ...credsAndReveals };
    newCredsAndReveals.value[index].checked = checked;
    setCredsAndReveals(newCredsAndReveals);
  };

  const handleCredentialChange = (index: number, value: string) => {
    let newCredsAndReveals = { ...credsAndReveals };
    newCredsAndReveals.value[index].cred = value;
    newCredsAndReveals.value[index].credStatus = "Unverified";
    setCredsAndReveals(newCredsAndReveals);
  };

  const handleCredentialValidate = (index: number, validated: boolean) => {
    let newCredsAndReveals = { ...credsAndReveals };
    newCredsAndReveals.value[index].credValidated = validated;
    setCredsAndReveals(newCredsAndReveals);
  };

  const handleRevealChange = (index: number, value: string) => {
    let newCredsAndReveals = { ...credsAndReveals };
    newCredsAndReveals.value[index].reveal = value;
    setCredsAndReveals(newCredsAndReveals);
  };

  const handleRevealValidate = (index: number, validated: boolean) => {
    let newCredsAndReveals = { ...credsAndReveals };
    newCredsAndReveals.value[index].revealValidated = validated;
    setCredsAndReveals(newCredsAndReveals);
  };

  const handlePresentationChange = (value: string) => {
    setVP(value);
    setVerificationStatus("Unverified");
  };

  const handleDeleteCredAndReveal = (index: number) => {
    let newCredsAndReveals = { ...credsAndReveals };
    delete newCredsAndReveals.value[index];
    setCredsAndReveals(newCredsAndReveals);
  };

  const handleVerifyCredential = async (index: number) => {
    const newCredsAndReveals = { ...credsAndReveals };
    try {
      const cred = JSON.parse(credsAndReveals.value[index].cred);
      const result = await jsigs.verify(cred, {
        suite: new BbsBlsSignatureTermwise2020(),
        purpose: new jsigs.purposes.AssertionProofPurpose(),
        documentLoader: customLoader,
        expansionMap: false,
        compactProof: true,
      });
      console.log(result);

      if (result.verified === true) {
        newCredsAndReveals.value[index].credStatus = "Accepted";
      } else {
        newCredsAndReveals.value[index].credStatus = "Rejected";
      }
      setCredsAndReveals(newCredsAndReveals);
    } catch (e: any) {
      newCredsAndReveals.value[index].credStatus = "Rejected";
      setCredsAndReveals(newCredsAndReveals);
      console.log(e);
      setErr(e.message);
      setErrOpen(true);
    }
  };

  const handlePresent = async () => {
    try {
      const documents: [any, any][] = credsAndReveals.value
        .filter((cr) => cr.checked)
        .map((cr) => [JSON.parse(cr.cred), JSON.parse(cr.reveal)]);

      const derivedProofs: any[] = await deriveProofMulti(
        documents,
        hiddenURIs,
        {
          suite: new BbsBlsSignatureProofTermwise2020(),
          documentLoader: customLoader,
        }
      );
      setVP(JSON.stringify(derivedProofs, null, 2));
      setVerificationStatus("Unverified");
      setIssuerOpen(false);
      setVerifierOpen(true);
    } catch (e: any) {
      console.log(e);
      setErr(e.message);
      setErrOpen(true);
      setVP("");
    }
  };

  const handleVerifyProof = async () => {
    try {
      const proof = JSON.parse(vP);
      const result = await verifyProofMulti(proof, {
        suite: new BbsBlsSignatureProofTermwise2020(),
        purpose: new jsigs.purposes.AssertionProofPurpose(),
        documentLoader: customLoader,
        expansionMap: false,
        compactProof: true,
      });
      console.log(result);
      if (result.verified === true) {
        setVerificationStatus("Accepted");
      } else {
        setVerificationStatus("Rejected");
      }
    } catch (e: any) {
      setVerificationStatus("Rejected");
      console.log(e);
      setErr(e.message);
      setErrOpen(true);
    }
  };

  return (
    <ThemeProvider theme={materialTheme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ZKP-LD Playground
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid container>
        <Grid item xs={issuerOpen ? 4 : 1}>
          <Issuer
            onClick={() => setIssuerOpen(!issuerOpen)}
            onIssue={handleIssue}
          />
        </Grid>
        <Grid
          item
          xs={issuerOpen ? (verifierOpen ? 4 : 7) : verifierOpen ? 7 : 10}
        >
          <Holder
            credsAndReveals={credsAndReveals.value}
            hiddenURIs={hiddenURIs}
            onCheckboxChange={handleCredsAndRevealsCheckboxChange}
            onCredentialChange={handleCredentialChange}
            onCredentialValidate={handleCredentialValidate}
            onRevealChange={handleRevealChange}
            onRevealValidate={handleRevealValidate}
            onVerify={handleVerifyCredential}
            onPresent={handlePresent}
            onClick={() => {
              setIssuerOpen(false);
              setVerifierOpen(false);
            }}
            onSelectedHiddenURIsChange={(selected) => setHiddenURIs(selected)}
            onDeleteCredAndReveal={handleDeleteCredAndReveal}
          />
        </Grid>
        <Grid item xs={verifierOpen ? 4 : 1}>
          <Verifier
            vP={vP}
            onVerify={handleVerifyProof}
            status={verificationStatus}
            onChange={handlePresentationChange}
            onClick={() => setVerifierOpen(!verifierOpen)}
          />
        </Grid>
      </Grid>
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
    </ThemeProvider>
  );
}

export default App;
