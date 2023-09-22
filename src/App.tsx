import { useState, MouseEvent, useMemo } from "react";
import {
  Alert,
  AlertTitle,
  AppBar,
  Box,
  Chip,
  CssBaseline,
  Divider,
  Grid,
  IconButton,
  Link,
  Snackbar,
  Toolbar,
  Typography,
  Tooltip,
  useMediaQuery,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import GitHub from "@mui/icons-material/GitHub";
import Warning from "@mui/icons-material/Warning";
import { ThemeProvider } from "@emotion/react";
import { verify, deriveProof, verifyProof } from "@zkp-ld/jsonld-proofs";

import * as pack from "../package.json";
import Issuer from "./components/Issuer";
import Holder from "./components/Holder";
import Verifier from "./components/Verifier";
import Registry from "./components/Registry";
import {
  customDocumentLoader,
  exampleDIDDocs,
  exampleKeyPairs,
  CONTEXTS,
} from "./data";
import { JsonLd } from "jsonld/jsonld-spec";

export const CREDENTIAL_HEIGHT = "40vh";
const CURRENT_VERSION = `v${pack.version}`;

const VP_CONTEXT = [
  "https://www.w3.org/2018/credentials/v1",
  "https://www.w3.org/ns/data-integrity/v1",
  "https://schema.org",
];

export type ModeType = "light" | "dark";
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

const defaultDocumentLoader = customDocumentLoader(
  new Map(CONTEXTS.map(([k, v]) => [k, JSON.parse(v) as JsonLd]))
);

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [keyPairs, setKeyPairs] = useState(exampleKeyPairs);
  const [keyPairsValidated, setKeyPairsValidated] = useState(true);
  const [didDocs, setDIDDocs] = useState(exampleDIDDocs);
  const [didDocsValidated, setDIDDocsValidated] = useState(true);
  const [contexts, setContexts] = useState(new Map(CONTEXTS));
  const [contextsValidated, setContextsValidated] = useState(
    new Map<string, boolean>(CONTEXTS.map(([k, _]) => [k, true]))
  );
  const [enableRemote, setEnableRemote] = useState(false);
  const [credsAndReveals, setCredsAndReveals] =
    useState<CredAndRevealArrayType>({
      lastIndex: 0,
      value: [],
    });
  const [vP, setVP] = useState("");
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>("Unverified");
  const [issuerOpen, setIssuerOpen] = useState(true);
  const [verifierOpen, setVerifierOpen] = useState(false);
  const [err, setErr] = useState("");
  const [errOpen, setErrOpen] = useState(false);
  const [mode, setMode] = useState(
    prefersDarkMode ? ("dark" as ModeType) : ("light" as ModeType)
  );

  const documentLoader = useMemo(() => {
    try {
      const validatedContexts = [...contexts.entries()].filter(([k, _]) =>
        contextsValidated.get(k)
      );
      const parsedValidatedContextsPairs: [string, JsonLd][] =
        validatedContexts.map(([k, v]) => [k, JSON.parse(v) as JsonLd]);
      const parsedValidatedContexts = new Map(parsedValidatedContextsPairs);

      return customDocumentLoader(parsedValidatedContexts, enableRemote);
    } catch {
      return defaultDocumentLoader;
    }
  }, [contexts, contextsValidated, enableRemote]);

  const handleErrClose = (_: any, reason: string) => {
    if (reason === "clickaway") {
      return;
    }
    setErrOpen(false);
  };

  const handleModeChange = (e: MouseEvent<HTMLElement>, newMode: ModeType) => {
    setMode(newMode);
  };

  const handleIssue = (issuedVC: string) => {
    let newCredsAndReveals = {
      ...credsAndReveals,
      lastIndex: credsAndReveals.lastIndex + 1,
    };

    newCredsAndReveals.value.push({
      index: credsAndReveals.lastIndex,
      cred: issuedVC,
      reveal: issuedVC,
      credValidated: true,
      credStatus: "Unverified",
      revealValidated: true,
      checked: true,
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
      reveal: "{}",
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

  const handleKeyPairsChange = (value: string) => {
    setKeyPairs(value);
  };

  const handleKeyPairsValidate = (validated: boolean) => {
    setKeyPairsValidated(validated);
  };

  const handleDIDDocsChange = (value: string) => {
    setDIDDocs(value);
  };

  const handleDIDDocsValidate = (validated: boolean) => {
    setDIDDocsValidated(validated);
  };

  const handleContextsChange = (id: string, value: string) => {
    setContexts(new Map(contexts.set(id, value)));
  };

  const handleContextsValidate = (id: string, validated: boolean) => {
    setContextsValidated(new Map(contextsValidated.set(id, validated)));
  };

  const handleContextsEnableRemoteChange = (value: boolean) => {
    setEnableRemote(value);
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
      const dids = JSON.parse(didDocs);
      const result = await verify(cred, dids, documentLoader); // TODO: fix it
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
      const vcPairs = credsAndReveals.value
        .filter((cr) => cr.checked)
        .map((cr) => ({
          original: JSON.parse(cr.cred),
          disclosed: JSON.parse(cr.reveal),
        }));
      const nonce = "NONCE"; // TODO: fix
      const dids = JSON.parse(didDocs);
      const derivedProof = await deriveProof(
        vcPairs,
        nonce,
        dids,
        VP_CONTEXT,
        documentLoader
      );

      setVP(JSON.stringify(derivedProof, null, 2));
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
      const derivedProof = JSON.parse(vP);
      const nonce = "NONCE"; // TODO: fix
      const dids = JSON.parse(didDocs);
      const result = await verifyProof(
        derivedProof,
        nonce,
        dids,
        documentLoader
      );
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
    <ThemeProvider theme={mode === "light" ? lightTheme : darkTheme}>
      <CssBaseline />
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography
            variant="h6"
            color="inherit"
            component="div"
            sx={{ mr: 1 }}
          >
            ZKP-LD Playground
          </Typography>

          <Chip label={CURRENT_VERSION} sx={{ mr: 1 }} />

          <Tooltip
            title="Experimental: Do not use in production. Possibly be updated or closed
        without notification."
            sx={{ mr: 1 }}
          >
            <Warning color="warning" />
          </Tooltip>

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title="go back to classic v1">
            <Link
              href="/v1"
              target="_blank"
              rel="noopener"
              variant="body2"
              sx={{ mr: 1 }}
            >
              classic
            </Link>
          </Tooltip>

          <Tooltip title="GitHub repository" sx={{ mr: 1 }}>
            <Link
              href="https://github.com/zkp-ld/zkp-ld-playground/"
              target="_blank"
              rel="noopener"
            >
              <IconButton color="inherit">
                <GitHub />
              </IconButton>
            </Link>
          </Tooltip>

          <ToggleButtonGroup
            value={mode}
            size="small"
            color="primary"
            exclusive
            onChange={handleModeChange}
            aria-label="light or dark mode"
          >
            <ToggleButton value="light" aria-label="light mode">
              <LightModeIcon />
            </ToggleButton>
            <ToggleButton value="dark" aria-label="dark mode">
              <DarkModeIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Toolbar>
      </AppBar>
      <Grid container>
        <Grid item xs={issuerOpen ? 4 : 1}>
          <Issuer
            onClick={() => setIssuerOpen(!issuerOpen)}
            onIssue={handleIssue}
            mode={mode}
            keyPairs={keyPairs}
            keyPairsValidated={keyPairsValidated}
            documentLoader={documentLoader}
          />
        </Grid>
        <Divider orientation="vertical" flexItem sx={{ marginRight: "-1px" }} />
        <Grid
          item
          xs={issuerOpen ? (verifierOpen ? 4 : 7) : verifierOpen ? 7 : 10}
        >
          <Holder
            credsAndReveals={credsAndReveals.value}
            didDocumentsValidated={didDocsValidated}
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
            onDeleteCredAndReveal={handleDeleteCredAndReveal}
            mode={mode}
          />
        </Grid>
        <Divider orientation="vertical" flexItem sx={{ marginRight: "-1px" }} />
        <Grid item xs={verifierOpen ? 4 : 1}>
          <Verifier
            vP={vP}
            didDocumentsValidated={didDocsValidated}
            onVerify={handleVerifyProof}
            status={verificationStatus}
            onChange={handlePresentationChange}
            onClick={() => setVerifierOpen(!verifierOpen)}
            mode={mode}
          />
        </Grid>
        <Grid item xs={12}>
          <Registry
            keyPairs={keyPairs}
            didDocuments={didDocs}
            contexts={contexts}
            onKeyPairsChange={handleKeyPairsChange}
            onKeyPairsValidate={handleKeyPairsValidate}
            onDIDDocumentsChange={handleDIDDocsChange}
            onDIDDocumentsValidate={handleDIDDocsValidate}
            onContextsChange={handleContextsChange}
            onContextsValidate={handleContextsValidate}
            enableRemote={enableRemote}
            onContextsEnableRemoteChange={handleContextsEnableRemoteChange}
            mode={mode}
          />
        </Grid>
        <Divider orientation="vertical" flexItem sx={{ marginRight: "-1px" }} />
        <Grid item xs={6}></Grid>
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
