import { useState, ChangeEvent, useMemo } from "react";
import {
  Alert,
  AlertTitle,
  AppBar,
  Chip,
  CssBaseline,
  Divider,
  Grid,
  Snackbar,
  Toolbar,
  Typography,
  Container,
  Tooltip,
  Link,
} from "@mui/material";
import { createTheme, Theme } from "@mui/material/styles";
import Warning from "@mui/icons-material/Warning";
import { ThemeProvider } from "@emotion/react";
import jsigs from "jsonld-signatures";
import {
  BbsTermwiseSignature2021,
  BbsTermwiseSignatureProof2021,
  deriveProofMulti,
  verifyProofMulti,
} from "@yamdan/jsonld-signatures-bbs";

import Issuer from "./components/Issuer";
import Holder from "./components/Holder";
import Verifier from "./components/Verifier";
import ModeSwitch from "./components/ModeSwitch";
import { customLoader, builtinDIDDocs, builtinContexts } from "./data";
import { revealTemplate } from "./data/template";
import Registry from "./components/Registry";

export const CREDENTIAL_HEIGHT = "40vh";
const VERSION = "v0.1.8";

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
  const [didDocs, setDIDDocs] = useState(builtinDIDDocs);
  const [didDocsValidated, setDIDDocsValidated] = useState(
    new Map([...builtinDIDDocs.keys()].map((k) => [k, true]))
  );
  const [contexts, setContexts] = useState(builtinContexts);
  const [contextsValidated, setContextsValidated] = useState(
    new Map([...builtinContexts.keys()].map((k) => [k, true]))
  );
  const [hiddenURIs, setHiddenURIs] = useState([] as string[]);
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
  const [mode, setMode] = useState<ModeType>({
    mui: lightTheme,
    monaco: "light",
  });

  const documentLoader: (documents: any) => any = useMemo(() => {
    const validatedDIDDocs = [...didDocs.entries()].filter(([k, _]) =>
      didDocsValidated.get(k)
    );
    const parsedValidatedDIDDocs: [string, any][] = validatedDIDDocs.map(
      ([id, value]) => [id, JSON.parse(value)]
    );
    const validatedContexts = [...contexts.entries()].filter(([k, _]) =>
      contextsValidated.get(k)
    );
    const parsedValidatedContexts: [string, any][] = validatedContexts.map(
      ([id, value]) => [id, JSON.parse(value)]
    );
    const validatedDocs = new Map([
      ...parsedValidatedDIDDocs,
      ...parsedValidatedContexts,
    ]);
    return customLoader(validatedDocs);
  }, [didDocs, didDocsValidated, contexts, contextsValidated]);

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

  const handleDIDDocsChange = (id: string, value: string) => {
    setDIDDocs(new Map(didDocs.set(id, value)));
  };

  const handleDIDDocsValidate = (id: string, validated: boolean) => {
    setDIDDocsValidated(new Map(didDocsValidated.set(id, validated)));
  };

  const handleContextsChange = (id: string, value: string) => {
    setContexts(new Map(contexts.set(id, value)));
  };

  const handleContextsValidate = (id: string, validated: boolean) => {
    setContextsValidated(new Map(contextsValidated.set(id, validated)));
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
        suite: new BbsTermwiseSignature2021(),
        purpose: new jsigs.purposes.AssertionProofPurpose(),
        documentLoader,
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

      const derivedProofs: any[] = await deriveProofMulti(documents, {
        hiddenUris: hiddenURIs,
        suite: new BbsTermwiseSignatureProof2021(),
        documentLoader,
      });

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
      const derivedProofs = JSON.parse(vP);
      const result = await verifyProofMulti(derivedProofs, {
        suite: new BbsTermwiseSignatureProof2021(),
        purpose: new jsigs.purposes.AssertionProofPurpose(),
        documentLoader,
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ZKP-LD Playground
            <Tooltip
              title="Experimental: Do not use in production. Possibly be updated or closed
        without notification."
            >
              <Warning color="warning" />
            </Tooltip>
          </Typography>
          <Chip label={VERSION} />
          <ModeSwitch onChange={handleModeChange} />
        </Toolbar>
      </AppBar>
      <Grid container>
        <Grid item xs={issuerOpen ? 4 : 1}>
          <Issuer
            onClick={() => setIssuerOpen(!issuerOpen)}
            onIssue={handleIssue}
            mode={mode}
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
            documentLoader={documentLoader}
          />
        </Grid>
        <Grid item xs={6}>
          <Container>
            <Registry
              name="DIDDocuments"
              extDocs={didDocs}
              mode={mode}
              onChange={handleDIDDocsChange}
              onValidate={handleDIDDocsValidate}
            />
          </Container>
        </Grid>
        <Divider orientation="vertical" flexItem sx={{ marginRight: "-1px" }} />
        <Grid item xs={6}>
          <Container>
            <Registry
              name="Contexts"
              extDocs={contexts}
              mode={mode}
              onChange={handleContextsChange}
              onValidate={handleContextsValidate}
            />
          </Container>
        </Grid>
      </Grid>
      <Typography variant="body2" color="text.secondary" align="center">
        <Link
          color="inherit"
          href="https://github.com/yamdan/zkp-ld-playground"
        >
          Source code
        </Link>
      </Typography>
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
