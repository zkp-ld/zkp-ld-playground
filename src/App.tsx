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

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export type CredAndReveal = {
  cred: {};
  reveal: {};
};

function App() {
  const [issuedVCs, setIssuedVCs] = useState([] as {}[]);
  const [credsAndReveals, setCredsAndReveals] = useState([] as CredAndReveal[]);

  const onIssue = (issuedVC: {}, index: number) => {
    let newIssuedVCs = [...issuedVCs];
    newIssuedVCs.push(issuedVC);
    setIssuedVCs(newIssuedVCs);

    let newCredsAndReveals = [...credsAndReveals];
    newCredsAndReveals.push({ cred: issuedVC, reveal: {} });
    setCredsAndReveals(newCredsAndReveals);
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
              SeLVeS
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Issuer onIssue={onIssue} />
          </Grid>
          <Grid item xs={6}>
            <Holder credsAndReveals={credsAndReveals} />
          </Grid>
          <Grid item xs={3}>
            <Verifier />
          </Grid>
        </Grid>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
