declare function getTextDetections(filePath: string): Promise<{
    validDenomination: string;
    frontPlateId: string;
    SerialPatternMatch: string;
    validSerialNumberPattern: string;
    federalReserveId: string;
    federalReserveLocation: string;
    notePositionId: string;
    seriesYear: any;
    treasurer: any;
    secretary: any;
}>;
export { getTextDetections };
