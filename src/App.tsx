import * as React from "react";
import MuiDrawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { createTheme, CSSObject, styled, Theme } from "@mui/material/styles";
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
import { AppBar, Box, CssBaseline } from "@mui/material";

export const DOCUMENT_HEIGHT = "60vh";
export const CREDENTIAL_HEIGHT = "40vh";
export const PRESENTATION_HEIGHT = "60vh";
const DRAWER_WIDTH = "30vw";
const CLOSED_DRAWER_WIDTH = "10vw";

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
  const [issuerOpen, setIssuerOpen] = useState(false);
  const [verifierOpen, setVerifierOpen] = useState(false);
  const [issuedVCs, setIssuedVCs] = useState([] as string[]);
  const [credsAndReveals, setCredsAndReveals] = useState(
    [] as CredAndRevealType[]
  );
  const [credsAndRevealsChecked, setCredsAndRevealsChecked] = useState(
    [] as boolean[]
  );
  const [vP, setVP] = useState("[{}]");

  const [verificationStatus, setVerificationStatus] = useState(
    "Disabled" as VerificationStatus
  );

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
    } catch (e: any) {
      console.log(e);
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
    }
  };

  // Mini variant drawer
  const openedMixin = (theme: Theme): CSSObject => ({
    width: DRAWER_WIDTH,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
  });

  const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: CLOSED_DRAWER_WIDTH,
  });

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    width: DRAWER_WIDTH,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  }));

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
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
        <Drawer variant="permanent" anchor="left" open={issuerOpen}>
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <Issuer
              onClick={() => setIssuerOpen(!issuerOpen)}
              onIssue={handleIssue}
            />
          </Box>
        </Drawer>
        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
          <Toolbar />
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
        </Box>
        {/* <Box sx={{ overflow: "auto" }}>
          <Verifier
            vP={vP}
            onVerify={handleVerifyProof}
            status={verificationStatus}
            onChange={handlePresentationChange}
            onClick={() => setVerifierOpen(!verifierOpen)}
          />
        </Box> */}
        <Drawer variant="permanent" anchor="right" open={verifierOpen}>
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <Verifier
              vP={vP}
              onVerify={handleVerifyProof}
              status={verificationStatus}
              onChange={handlePresentationChange}
              onClick={() => setVerifierOpen(!verifierOpen)}
            />
          </Box>
        </Drawer>
      </Box>
    </ThemeProvider>
  );
}

export default App;
