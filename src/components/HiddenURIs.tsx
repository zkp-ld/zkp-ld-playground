import { Card, CardContent, CardHeader } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ModeType } from "../App";

type HiddenURIsProps = {
  vCs: string[];
  onSelectedHiddenURIsChange: (selected: string[]) => void;
  mode: ModeType;
};

export default function HiddenURIs(props: HiddenURIsProps) {
  const isUri = (uri: string): boolean => {
    try {
      new URL(uri);
    } catch (e) {
      return false;
    }
    return true;
  };

  const extractUris = (doc: any): string[] => {
    const _extractUris = (doc: any, res: string[]): void => {
      for (const v of Object.values(doc)) {
        if (typeof v === "object") {
          _extractUris(v, res);
        } else if (typeof v === "string") {
          if (isUri(v)) res.push(v);
        }
      }
    };
    let d: any = { ...doc };
    delete d["@context"];
    delete d["proof"];
    let res: string[] = [];
    _extractUris(d, res);
    return res;
  };

  const rowSet = new Set(
    props.vCs.flatMap((vc) => {
      let vcObj = {};
      try {
        vcObj = JSON.parse(vc);
      } catch (e: unknown) {
        return [];
      }
      return extractUris(vcObj);
    })
  );
  const rowArray = Array.from(rowSet);
  const rows = rowArray.map((v, i) => ({ id: i, col1: v }));

  const columns: GridColDef[] = [
    { field: "col1", headerName: "URI", width: 600 },
  ];

  return (
    <Card elevation={3}>
      <CardHeader
        title="URIs to be hidden"
        titleTypographyProps={{ variant: "subtitle1" }}
      />
      <CardContent>
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          rowHeight={25}
          checkboxSelection
          onSelectionModelChange={(selectionModel) =>
            props.onSelectedHiddenURIsChange(
              selectionModel.map((i) => rowArray[i.valueOf() as number])
            )
          }
          style={{
            color:
              props.mode.mui.palette.mode === "light"
                ? "rgba(0,0,0,.85)"
                : "rgba(255,255,255,0.85)",
          }}
        />
      </CardContent>
    </Card>
  );
}
