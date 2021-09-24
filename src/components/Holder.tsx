import {
  Avatar,
  Stack,
  Tooltip,
  Badge,
  Box,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import CredAndReveal from "./CredAndReveal";
import { CredAndRevealType } from "../App";
import HiddenURIs from "./HiddenURIs";

export type HolderProps = {
  credsAndReveals: CredAndRevealType[];
  hiddenURIs: string[];
  onCheckboxChange: (index: number, checked: boolean) => void;
  onCredentialChange: (index: number, value: string) => void;
  onCredentialValidate: (index: number, validated: boolean) => void;
  onRevealChange: (index: number, value: string) => void;
  onRevealValidate: (index: number, validated: boolean) => void;
  onVerify: (index: number) => void;
  onPresent: () => void;
  onClick: () => void;
  onSelectedHiddenURIsChange: (selected: string[]) => void;
  onDeleteCredAndReveal: (index: number) => void;
};

export default function Holder(props: HolderProps) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: "flex", margin: 2, alignItems: "center" }}>
          <Button
            color="inherit"
            onClick={(_: any) => props.onClick()}
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
              flexGrow: 1,
              color: blue[500],
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Badge
                badgeContent={props.credsAndReveals.filter((cr) => cr).length}
                color="primary"
              >
                <Avatar sx={{ bgcolor: blue[500] }} aria-label="holder">
                  <PhoneAndroidIcon />
                </Avatar>
              </Badge>
              <Typography>Holder</Typography>
            </Stack>
          </Button>
          <Tooltip title="present">
            <Button
              variant="contained"
              aria-label="present"
              onClick={() => props.onPresent()}
              disabled={
                props.credsAndReveals.some(
                  (cr) =>
                    cr.checked && !(cr.credValidated && cr.revealValidated)
                ) || props.credsAndReveals.every((cr) => !cr.checked)
              }
              sx={{ bgcolor: blue[500], "&:hover": { bgcolor: blue[600] } }}
            >
              Present
            </Button>
          </Tooltip>
        </Box>
      </Grid>
      <Grid item xs={12} sx={{ height: "60vh", overflow: "auto" }}>
        {props.credsAndReveals
          .filter((cr) => cr)
          .map((credAndReveal) => (
            <CredAndReveal
              key={credAndReveal.index}
              index={credAndReveal.index}
              credAndReveal={credAndReveal}
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
            />
          ))}
      </Grid>
      <Grid item xs={12} sx={{ height: "20vh", overflow: "auto" }}>
        <HiddenURIs
          vCs={props.credsAndReveals
            .filter((cr) => cr)
            .map((credAndReveal) => credAndReveal.cred)}
          onSelectedHiddenURIsChange={(selected) =>
            props.onSelectedHiddenURIsChange(selected)
          }
        />
      </Grid>
    </Grid>
  );
}
