export interface RegExValidators {
    [key: string]: RegExp;
}
export interface SerialNumberMapping {
    pattern: RegExp;
    denomination: string;
    seriesYear: string;
    treasurer: string;
    secretary: string;
}
export interface SerialNumberMappings {
    [key: string]: SerialNumberMapping[];
}
export interface NoteDetails {
    validDenomination: string;
    frontPlateId: string;
    SerialPatternMatch: string;
    validSerialNumberPattern: string;
    federalReserveId: string;
    notePositionId: string;
    seriesYear: string;
    treasurer: string;
    secretary: string;
    federalReserveLocation?: string;
}
