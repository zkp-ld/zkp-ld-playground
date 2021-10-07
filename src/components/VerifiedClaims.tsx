import { useEffect, useState } from "react";
import jsonld from "jsonld";
import Editor from "@monaco-editor/react";
import {
  Card,
  CardHeader,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { ModeType, VerificationStatus } from "../App";
import { customLoader } from "../data";
import { extractUris } from "../utils/uri";

type VerifiedClaimsProps = {
  vP: string;
  mode: ModeType;
  status: VerificationStatus;
};

export default function VerifiedClaims(props: VerifiedClaimsProps) {
  const [selectedURI, setSelectedURI] = useState("");
  const [framedClaims, setFramedClaims] = useState({});

  useEffect(() => {
    setSelectedURI("");
    setFramedClaims({});
  }, [props.vP]);

  useEffect(() => {
    if (props.status !== "Accepted") {
      setSelectedURI("");
      setFramedClaims({});
    }
  }, [props.status]);

  let uris: string[] = [];
  if (props.status === "Accepted") {
    try {
      const derivedProofs = JSON.parse(props.vP);
      uris = extractUris(derivedProofs);
    } catch {
      uris = [];
    }
  }

  const handleFrameIDChange = async (event: SelectChangeEvent) => {
    const uri = event.target.value;
    setSelectedURI(uri);

    let claims: any;
    try {
      const derivedProofs = JSON.parse(props.vP);
      claims = await jsonld.frame(
        derivedProofs,
        {
          "@context": derivedProofs[0]["@context"],
          id: uri,
        },
        { documentLoader: customLoader }
      );
    } catch {
      claims = {};
    }
    setFramedClaims(claims);
  };

  return (
    <Card elevation={3} sx={{ height: "85vh" }}>
      <CardHeader
        title="Verified Claims"
        titleTypographyProps={{ variant: "subtitle1" }}
      />
      <CardContent>
        <FormControl fullWidth sx={{ minWidth: 120 }}>
          <InputLabel id="ids-for-framing-label">URIs for Framing</InputLabel>
          <Select
            labelId="ids-for-framing-label"
            id="ids-for-framing"
            value={selectedURI}
            label="URIs for Framing"
            onChange={handleFrameIDChange}
            autoWidth
            style={{
              color:
                props.mode.mui.palette.mode === "light"
                  ? "rgba(0,0,0,.85)"
                  : "rgba(255,255,255,0.85)",
            }}
            disabled={props.status !== "Accepted"}
          >
            {uris.map((uri) => (
              <MenuItem key={uri} value={uri}>
                {uri}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Editor
          height="80vh"
          defaultLanguage="json"
          value={JSON.stringify(framedClaims, null, 2)}
          theme={props.mode.monaco}
          options={{
            lineNumbers: false,
            minimap: { enabled: false },
            readOnly: true,
          }}
        />
      </CardContent>
    </Card>
  );
}
