import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
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
import {
  BbsBlsSignatureProofTermwise2020,
  deriveProofMulti,
} from "@yamdan/jsonld-signatures-bbs";

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
  cred: {} | string;
  reveal: {} | string;
  credValidated: boolean;
  revealValidated: boolean;
};

function App() {
  const [issuedVCs, setIssuedVCs] = useState([] as {}[]);
  const [credsAndReveals, setCredsAndReveals] = useState(
    [] as CredAndRevealType[]
  );
  const [credsAndRevealsChecked, setCredsAndRevealsChecked] = useState(
    [] as boolean[]
  );
  const [vP, setVP] = useState({});

  const handleIssue = (issuedVC: {}, _index: number) => {
    let newIssuedVCs = [...issuedVCs];
    newIssuedVCs.push(issuedVC);
    setIssuedVCs(newIssuedVCs);

    let newCredsAndReveals = [...credsAndReveals];
    newCredsAndReveals.push({
      cred: issuedVC,
      reveal: revealTemplate,
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
      .filter((c) => c)
      .map((_, i) => {
        // TODO: check validated's
        const preCred = credsAndReveals[i].cred;
        const cred: {} =
          typeof preCred === "string" ? JSON.parse(preCred) : { ...preCred };
        const preReveal = credsAndReveals[i].reveal;
        const reveal: {} =
          typeof preReveal === "string"
            ? JSON.parse(preReveal)
            : { ...preReveal };
        return [cred, reveal];
      });

    const hiddenUris = JSON.parse(hURIs);

    try {
      const derivedProofs = await deriveProofMulti(documents, hiddenUris, {
        suite: new BbsBlsSignatureProofTermwise2020(),
        documentLoader: customLoader,
      });
      setVP(derivedProofs);
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Paper>
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
              SeLVeS Playground
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Issuer onIssue={handleIssue} />
          </Grid>
          <Grid item xs={6}>
            <Holder
              credsAndReveals={credsAndReveals}
              onCheckboxChange={handleCredsAndRevealsCheckboxChange}
              onCredentialChange={handleCredentialChange}
              onCredentialValidate={handleCredentialValidate}
              onRevealChange={handleRevealChange}
              onRevealValidate={handleRevealValidate}
              onPresent={handlePresent}
            />
          </Grid>
          <Grid item xs={3}>
            <Verifier vP={vP} />
          </Grid>
        </Grid>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
