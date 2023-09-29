import Person1 from "./Person1.json";
import Person2 from "./Person2.json";
import Person3 from "./Person3.json";
import PersonWithChildren from "./PersonWithChildren.json";
import City from "./City.json";
import Place from "./Place.json";
import Vaccine from "./Vaccine.json";

export const exampleDocs = new Map<string, Object>([
  ["Person1", Person1],
  ["City", City],
  ["Person2", Person2],
  ["Person3", Person3],
  ["Place", Place],
  ["Vaccine", Vaccine],
  ["Person with Children", PersonWithChildren],
]);
