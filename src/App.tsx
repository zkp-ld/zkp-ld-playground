import { useState, ChangeEvent } from "react";
import {
  Alert,
  AlertTitle,
  AppBar,
  CssBaseline,
  Divider,
  Grid,
  Snackbar,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import { createTheme, Theme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { ThemeProvider } from "@emotion/react";
import Issuer from "./components/Issuer";
import Holder from "./components/Holder";
import Verifier from "./components/Verifier";
import ModeSwitch from "./components/ModeSwitch";
import { customLoader } from "./data";
import { revealTemplate } from "./data/template";
import jsigs from "jsonld-signatures";
import {
  BbsBlsSignatureProofTermwise2020,
  BbsBlsSignatureTermwise2020,
  deriveProofMulti,
  verifyProofMulti,
} from "@yamdan/jsonld-signatures-bbs";

export const CREDENTIAL_HEIGHT = "40vh";

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
export type ModeType = {
  mui: Theme;
  monaco: "light" | "vs-dark";
};

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
  const [mode, setMode] = useState({
    mui: lightTheme,
    monaco: "light",
  } as ModeType);

  const handleErrClose = (_: any, reason: string) => {
    if (reason === "clickaway") {
      return;
    }
    setErrOpen(false);
  };

  const handleModeChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setMode({ mui: darkTheme, monaco: "vs-dark" });
    } else {
      setMode({ mui: lightTheme, monaco: "light" });
    }
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

  const handleCredentialAdd = () => {
    let newCredsAndReveals = {
      ...credsAndReveals,
      lastIndex: credsAndReveals.lastIndex + 1,
    };

    newCredsAndReveals.value.push({
      index: credsAndReveals.lastIndex,
      cred: "{}",
      reveal: JSON.stringify(revealTemplate, null, 2),
      credValidated: true,
      credStatus: "Unverified",
      revealValidated: true,
      checked: false,
    });
    setCredsAndReveals(newCredsAndReveals);
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
    <ThemeProvider theme={mode.mui}>
      <CssBaseline />
      <AppBar position="static" color="transparent" elevation={0}>
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
          <ModeSwitch onChange={handleModeChange} />
        </Toolbar>
      </AppBar>
      <Grid container>
        <Grid item xs={issuerOpen ? 4 : 1}>
          <Issuer
            onClick={() => setIssuerOpen(!issuerOpen)}
            onIssue={handleIssue}
            mode={mode}
          />
        </Grid>
        <Divider orientation="vertical" flexItem sx={{ marginRight: "-1px" }} />
        <Grid
          item
          xs={issuerOpen ? (verifierOpen ? 4 : 7) : verifierOpen ? 7 : 10}
        >
          <Holder
            credsAndReveals={credsAndReveals.value}
            onCredentialAdd={handleCredentialAdd}
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
            onSelectedHiddenURIsChange={(selected) => {
              console.log(selected);
              setHiddenURIs(selected);
            }}
            onDeleteCredAndReveal={handleDeleteCredAndReveal}
            mode={mode}
          />
        </Grid>
        <Divider orientation="vertical" flexItem sx={{ marginRight: "-1px" }} />
        <Grid item xs={verifierOpen ? 4 : 1}>
          <Verifier
            vP={vP}
            onVerify={handleVerifyProof}
            status={verificationStatus}
            onChange={handlePresentationChange}
            onClick={() => setVerifierOpen(!verifierOpen)}
            mode={mode}
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
