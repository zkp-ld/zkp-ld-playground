export const isUri = (uri: string): boolean => {
  try {
    new URL(uri);
  } catch (e) {
    return false;
  }
  return true;
};

export const extractUris = (docs: any[]): string[] => {
  const _extractUris = (doc: any, res: string[]): void => {
    for (const v of Object.values(doc)) {
      if (typeof v === "object") {
        _extractUris(v, res);
      } else if (typeof v === "string") {
        if (isUri(v)) res.push(v);
      }
    }
  };

  return Array.from(
    new Set(
      docs.flatMap((doc) => {
        let d = { ...doc };
        delete d["@context"];
        delete d["proof"];
        let res: string[] = [];
        _extractUris(d, res);
        return res;
      })
    )
  );
};
