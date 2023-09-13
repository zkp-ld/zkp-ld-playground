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
import { green } from "@mui/material/colors";
import Add from "@mui/icons-material/Add";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import CredAndReveal from "./CredAndReveal";
import { CredAndRevealType, ModeType } from "../App";

export type HolderProps = {
  credsAndReveals: CredAndRevealType[];
  didDocumentsValidated: boolean;
  onCredentialAdd: () => void;
  onCheckboxChange: (index: number, checked: boolean) => void;
  onCredentialChange: (index: number, value: string) => void;
  onCredentialValidate: (index: number, validated: boolean) => void;
  onRevealChange: (index: number, value: string) => void;
  onRevealValidate: (index: number, validated: boolean) => void;
  onVerify: (index: number) => void;
  onPresent: () => void;
  onClick: () => void;
  onDeleteCredAndReveal: (index: number) => void;
  mode: ModeType;
};

export default function Holder(props: HolderProps) {
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
        <Tooltip title="present">
          <span>
            <Button
              variant="contained"
              aria-label="present"
              onClick={() => props.onPresent()}
              disabled={
                props.credsAndReveals.some(
                  (cr) =>
                    cr.checked && !(cr.credValidated && cr.revealValidated)
                ) ||
                props.credsAndReveals.every((cr) => !cr.checked) ||
                !props.didDocumentsValidated
              }
              sx={{ bgcolor: green[500], "&:hover": { bgcolor: green[600] } }}
            >
              Present
            </Button>
          </span>
        </Tooltip>
      </Box>
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
