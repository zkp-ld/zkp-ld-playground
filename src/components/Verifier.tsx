import Editor from "@monaco-editor/react";
import {
  Grid,
  Card,
  CardHeader,
  Avatar,
  CardContent,
  Button,
} from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { green } from "@mui/material/colors";
import Presentation from "./Presentation";

type VerifierProps = {
  vP: {};
};

export default function Verifier(props: VerifierProps) {
  return (
    <Card variant="outlined">
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: green[500] }} aria-label="verifier">
            <VerifiedUserIcon />
          </Avatar>
        }
        title="Verifier"
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Presentation vP={props.vP} />
          </Grid>
          <Grid item xs={12}>
            <Card elevation={6}>
              <CardHeader
                title="Verification Result"
                titleTypographyProps={{ variant: "subtitle1" }}
              />
              <CardContent>
                <Editor
                  height="10vh"
                  defaultLanguage="json"
                  defaultValue=""
                  theme="vs-dark"
                  options={{ lineNumbers: false }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
