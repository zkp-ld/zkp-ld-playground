import React from "react";
import {
  Avatar,
  Stack,
  Tooltip,
  Badge,
  Box,
  Typography,
  Button,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { green } from "@mui/material/colors";
import Add from "@mui/icons-material/Add";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TuneIcon from "@mui/icons-material/Tune";
import CredAndReveal from "./CredAndReveal";
import { CredAndRevealType, ModeType } from "../App";

export type HolderProps = {
  credsAndReveals: CredAndRevealType[];
  didDocumentsValidated: boolean;
  secret: string;
  commitSecret: boolean;
  commitment: string;
  blinding: string;
  pokForCommitment: string;
  onCredentialAdd: () => void;
  onCheckboxChange: (index: number, checked: boolean) => void;
  onCredentialChange: (index: number, value: string) => void;
  onCredentialValidate: (index: number, validated: boolean) => void;
  onRevealChange: (index: number, value: string) => void;
  onRevealValidate: (index: number, validated: boolean) => void;
  onVerify: (index: number) => void;
  onPresent: () => void;
  onClick: () => void;
  onCommit: () => void;
  onDeleteCredAndReveal: (index: number) => void;
  onSecretChange: (value: string) => void;
  onCommitSecretChange: (checked: boolean) => void;
  mode: ModeType;
};

export default function Holder(props: HolderProps) {
  const handleSecretChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.onSecretChange(e.target.value);
  };
  const handleCommitSecretChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onCommitSecretChange(e.target.checked);
  };

  return (
    <Stack>
      <Box sx={{ display: "flex", margin: 1, alignItems: "center" }}>
        <Button
          color="inherit"
          onClick={() => props.onClick()}
          sx={{
            justifyContent: "flex-start",
            textTransform: "none",
            flexGrow: 1,
            color: green[500],
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Badge
              badgeContent={props.credsAndReveals.filter((cr) => cr).length}
              showZero={true}
              color="primary"
            >
              <Avatar sx={{ bgcolor: green[500] }} aria-label="holder">
                <PhoneAndroidIcon />
              </Avatar>
            </Badge>
            <Typography>Holder</Typography>
          </Stack>
        </Button>
        <Tooltip title="Compose a verifiable presentation from the checked verifiable credentials.">
          <span>
            <Button
              variant="contained"
              aria-label="present"
              onClick={() => props.onPresent()}
              sx={{ bgcolor: green[500], "&:hover": { bgcolor: green[600] } }}
            >
              Present
            </Button>
          </span>
        </Tooltip>
      </Box>
      <Accordion sx={{ margin: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <TuneIcon sx={{ marginRight: "8px" }} /> Options
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Tooltip title="A secret known only to the Holder. By embedding it within the bound credential, it prevents others who do not know the secret from presenting the credential.">
              <TextField
                label="Secret"
                size="small"
                value={props.secret}
                onChange={handleSecretChange}
                InputLabelProps={{ shrink: true }}
              />
            </Tooltip>
            <Tooltip title="To have the Issuer issue a bound credential, press the 'commit' button to generate a blind sign request.">
              <Button
                variant="contained"
                aria-label="generate blind sign request"
                onClick={() => props.onCommit()}
                sx={{ bgcolor: green[500], "&:hover": { bgcolor: green[600] } }}
              >
                generate blind sign request
              </Button>
            </Tooltip>
            <TextField
              label="Commitment"
              size="small"
              value={props.commitment}
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Proof for commitment"
              size="small"
              value={props.pokForCommitment}
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Blinding"
              size="small"
              value={props.blinding}
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  inputProps={{ "aria-label": "controlled" }}
                  checked={props.commitSecret}
                  onChange={handleCommitSecretChange}
                />
              }
              label="Include blind sign request in VP"
            />
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Box sx={{ height: "76vh", overflow: "auto", padding: 2 }}>
        <Grid container spacing={2}>
          {props.credsAndReveals
            .filter((cr) => cr)
            .map((credAndReveal) => (
              <CredAndReveal
                key={credAndReveal.index}
                index={credAndReveal.index}
                credAndReveal={credAndReveal}
                didDocumentsValidated={props.didDocumentsValidated}
                onCheckboxChange={(index, checked) =>
                  props.onCheckboxChange(index, checked)
                }
                onCredentialChange={(index, value) =>
                  props.onCredentialChange(index, value)
                }
                onCredentialValidate={(index, validated) =>
                  props.onCredentialValidate(index, validated)
                }
                onRevealChange={(index, value) =>
                  props.onRevealChange(index, value)
                }
                onRevealValidate={(index, validated) =>
                  props.onRevealValidate(index, validated)
                }
                onVerify={(index) => props.onVerify(index)}
                onDelete={(index) => props.onDeleteCredAndReveal(index)}
                mode={props.mode}
              />
            ))}
          <Grid item xs={12}>
            <Button fullWidth onClick={() => props.onCredentialAdd()}>
              <Add />
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
}
