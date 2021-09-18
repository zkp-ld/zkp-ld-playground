import Editor from "@monaco-editor/react";
import {
  Grid,
  Card,
  CardHeader,
  Avatar,
  CardContent,
  Button,
} from "@mui/material";
import { green } from "@mui/material/colors";

export default function Verifier() {
  return (
    <Card variant="outlined">
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: green[500] }} aria-label="verifier">
            V
          </Avatar>
        }
        title="Verifier"
      />
      <CardContent>
        <Button>Verify</Button>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card elevation={6}>
              <CardHeader subheader="Verifiable Presentation" />
              <CardContent>
                <Editor
                  height="80vh"
                  defaultLanguage="json"
                  defaultValue='{ "foo4": "bar4" }'
                  theme="vs-dark"
                  options={{ lineNumbers: false }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card elevation={6}>
              <CardHeader subheader="Verification Result" />
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
