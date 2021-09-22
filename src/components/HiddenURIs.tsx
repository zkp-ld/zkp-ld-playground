import { DataGrid, GridColDef } from "@mui/x-data-grid";

type HiddenURIsProps = {
  vcs: string[];
  onSelectedHiddenURIsChange: (selected: string[]) => void;
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
    props.vcs.flatMap((vc) => extractUris(JSON.parse(vc)))
  );
  const rowArray = Array.from(rowSet);
  const rows = rowArray.map((v, i) => ({ id: i, col1: v }));

  const columns: GridColDef[] = [
    { field: "col1", headerName: "URI to be hidden", width: 500 },
  ];

  return (
    <div style={{ height: "40vh" }}>
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
      />
    </div>
  );
}
