import { City } from "../cities/City";

export interface Country {
  _id: string;
  name: string;
  abbv: string;
  prefix: string;
  capital: {
    name: string;
    alternativeName: string;
  };
  cities: City[];
  currency: string;
  transportPrice: { type: Number; required: true; };
  coordinates: {
    lat: {
      $numberDecimal: string;
    },
    lng: {
      $numberDecimal: string;
    }
  }
}
