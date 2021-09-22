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

export const CREDENTIAL_HEIGHT = "40vh";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const hURIs = `[
  "http://example.org/credentials/1234",
  "http://example.org/credentials/9876",
  "http://example.org/credentials/abcd",
  "did:example:holder1",
  "did:example:cityA"
]`;

export type CredAndRevealType = {
  cred: string;
  reveal: string;
  credValidated: boolean;
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
  const [issuedVCs, setIssuedVCs] = useState([] as string[]);
  const [credsAndReveals, setCredsAndReveals] = useState(
    [] as CredAndRevealType[]
  );
  const [credsAndRevealsChecked, setCredsAndRevealsChecked] = useState(
    [] as boolean[]
  );
  const [vP, setVP] = useState("");
  const [verificationStatus, setVerificationStatus] = useState(
    "Disabled" as VerificationStatus
  );
  const [err, setErr] = useState("");
  const [errOpen, setErrOpen] = useState(false);

  const handleErrClose = (_: any, reason: string) => {
    if (reason === "clickaway") {
      return;
    }
    setErrOpen(false);
  };

  const handleIssue = (issuedVC: string, _index: number) => {
    let newIssuedVCs = [...issuedVCs];
    newIssuedVCs.push(issuedVC);
    setIssuedVCs(newIssuedVCs);

    let newCredsAndReveals = [...credsAndReveals];
    newCredsAndReveals.push({
      cred: issuedVC,
      reveal: JSON.stringify(revealTemplate, null, 2),
      credValidated: true,
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

    const hiddenUris = JSON.parse(hURIs);

    try {
      const derivedProofs: any[] = await deriveProofMulti(
        documents,
        hiddenUris,
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
  };

  const handleVerifyProof = async () => {
    const proof = JSON.parse(vP);
    try {
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
    <ThemeProvider theme={darkTheme}>
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
            onCheckboxChange={handleCredsAndRevealsCheckboxChange}
            onCredentialChange={handleCredentialChange}
            onCredentialValidate={handleCredentialValidate}
            onRevealChange={handleRevealChange}
            onRevealValidate={handleRevealValidate}
            onPresent={handlePresent}
            onClick={() => {
              setIssuerOpen(false);
              setVerifierOpen(false);
            }}
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
        autoHideDuration={10000}
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
