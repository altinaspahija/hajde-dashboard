
export interface City {
    _id?: string;
    alternativeName: string;
    name: string;
    coordinates: {
        lat: {
            $numberDecimal: string;
        },
        lng: {
            $numberDecimal: string;
        }
    };
    
}