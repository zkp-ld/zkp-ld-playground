import { useState } from "react";
import {
  Stack,
  Box,
  Avatar,
  Typography,
  Grid,
} from "@mui/material";
import { brown } from "@mui/material/colors";
import Key from "@mui/icons-material/Key";

import { ModeType } from "../App";
import KeyPairs from "./KeyPairs";
import DIDDocuments from "./DIDDocuments";

export type RegistryProps = {
  keyPairs: string;
  didDocuments: string;
  onKeyPairsChange: (value: string) => void;
  onKeyPairsValidate: (validated: boolean) => void;
  onDIDDocumentsChange: (value: string) => void;
  onDIDDocumentsValidate: (validated: boolean) => void;
  mode: ModeType;
};

export default function Registry(props: RegistryProps) {
  return (
    <Stack>
      <Box sx={{ display: "flex", margin: 1, alignItems: "center" }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: brown[500] }} aria-label="issuer">
            <Key />
          </Avatar>
          <Typography color={brown[500]}>Registry</Typography>
        </Stack>
      </Box>

      <Box sx={{ padding: 1 }}>
        <Grid container>
          <Grid item xs={6}>
            <KeyPairs
              value={props.keyPairs}
              mode={props.mode}
              onChange={props.onKeyPairsChange}
              onValidate={props.onKeyPairsValidate}
            />
          </Grid>
          <Grid item xs={6}>
            <DIDDocuments
              value={props.didDocuments}
              mode={props.mode}
              onChange={props.onDIDDocumentsChange}
              onValidate={props.onDIDDocumentsValidate}
            />
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
}
