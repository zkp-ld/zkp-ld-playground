import { Card, CardContent, CardHeader } from "@mui/material";
import { DataGrid, GridColDef, GridSelectionModel } from "@mui/x-data-grid";
import { ModeType } from "../App";
import { extractUris } from "../utils/uri";

type HiddenURIsProps = {
  vCs: string[];
  onSelectedHiddenURIsChange: (selected: string[]) => void;
  mode: ModeType;
};

export default function HiddenURIs(props: HiddenURIsProps) {
  const vCs = props.vCs.map((vC) => {
    try {
      return JSON.parse(vC);
    } catch (e: unknown) {
      return {};
    }
  });

  const rowArray = extractUris(vCs);
  const rows = rowArray.map((v, i) => ({ id: i, col1: v }));

  const columns: GridColDef[] = [
    { field: "col1", headerName: "URI", width: 600 },
  ];

  const handleSelectionModelChange = (selectedIDs: GridSelectionModel) => {
    props.onSelectedHiddenURIsChange(
      rowArray.filter((_, i) => selectedIDs.includes(i))
    );
  };

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
          onSelectionModelChange={handleSelectionModelChange}
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
