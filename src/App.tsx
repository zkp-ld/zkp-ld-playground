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

export type CredAndRevealType = {
  cred: string;
  credValidated: boolean;
  credStatus: VerificationStatus;
  reveal: string;
  revealValidated: boolean;
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
  const [credsAndReveals, setCredsAndReveals] = useState(
    [] as CredAndRevealType[]
  );
  const [credsAndRevealsChecked, setCredsAndRevealsChecked] = useState(
    [] as boolean[]
  );
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
    let newCredsAndReveals = [...credsAndReveals];
    newCredsAndReveals.push({
      cred: issuedVC,
      reveal: JSON.stringify(revealTemplate, null, 2),
      credValidated: true,
      credStatus: "Unverified",
      revealValidated: true,
    });
    setCredsAndReveals(newCredsAndReveals);

    let newCredsAndRevealsChecked = [...credsAndRevealsChecked];
    newCredsAndRevealsChecked.push(false);
    setCredsAndRevealsChecked(newCredsAndRevealsChecked);

    setIssuerOpen(true);
    setVerifierOpen(false);
  };

  const handleCredsAndRevealsCheckboxChange = (
    index: number,
    checked: boolean
  ) => {
    let newCredsAndRevealsChecked = [...credsAndRevealsChecked];
    newCredsAndRevealsChecked[index] = checked;
    setCredsAndRevealsChecked(newCredsAndRevealsChecked);
  };

  const handleCredentialChange = (index: number, value: string) => {
    let newCredsAndReveals = [...credsAndReveals];
    newCredsAndReveals[index].cred = value;
    newCredsAndReveals[index].credStatus = "Unverified";
    setCredsAndReveals(newCredsAndReveals);
  };

  const handleCredentialValidate = (index: number, validated: boolean) => {
    let newCredsAndReveals = [...credsAndReveals];
    newCredsAndReveals[index].credValidated = validated;
    setCredsAndReveals(newCredsAndReveals);
  };

  const handleRevealChange = (index: number, value: string) => {
    let newCredsAndReveals = [...credsAndReveals];
    newCredsAndReveals[index].reveal = value;
    setCredsAndReveals(newCredsAndReveals);
  };

  const handleRevealValidate = (index: number, validated: boolean) => {
    let newCredsAndReveals = [...credsAndReveals];
    newCredsAndReveals[index].revealValidated = validated;
    setCredsAndReveals(newCredsAndReveals);
  };

  const handleVerifyCredential = async (index: number) => {
    const newCredsAndReveals = [...credsAndReveals];
    try {
      const cred = JSON.parse(credsAndReveals[index].cred);
      const result = await jsigs.verify(cred, {
        suite: new BbsBlsSignatureTermwise2020(),
        purpose: new jsigs.purposes.AssertionProofPurpose(),
        documentLoader: customLoader,
        expansionMap: false,
        compactProof: true,
      });
      console.log(result);

      if (result.verified === true) {
        newCredsAndReveals[index].credStatus = "Accepted";
      } else {
        newCredsAndReveals[index].credStatus = "Rejected";
      }
      setCredsAndReveals(newCredsAndReveals);
    } catch (e: any) {
      newCredsAndReveals[index].credStatus = "Rejected";
      setCredsAndReveals(newCredsAndReveals);
      console.log(e);
      setErr(e.message);
      setErrOpen(true);
    }
  };

  const handlePresent = async () => {
    const documents: [any, any][] = credsAndRevealsChecked
      .map<[boolean, number]>((c, i) => [c, i])
      .filter(([c, _]) => c)
      .map(([_, i]) => {
        // TODO: check validated's
        const cred: {} = JSON.parse(credsAndReveals[i].cred);
        const reveal: {} = JSON.parse(credsAndReveals[i].reveal);
        return [cred, reveal];
      });

    try {
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

  const handlePresentationChange = (value: string) => {
    setVP(value);
    setVerificationStatus("Unverified");
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
            credsAndReveals={credsAndReveals}
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
