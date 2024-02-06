interface RegExValidators {
  [key: string]: RegExp;
}

interface SerialNumberMappings {
  [key: string]: {
    pattern: RegExp;
    denomination: string;
    seriesYear: string;
    treasurer: string;
    secretary: string;
  }[];
}

interface FederalReserveMapping {
  [key: string]: string;
}


interface NoteDetails {
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

interface MatchedDetail {
  seriesYear: string;
  treasurer: string;
  secretary: string;
}

interface DenominationDetail {
  pattern: RegExp | string;
  seriesYear: string;
  treasurer: string;
  secretary: string;
}

interface DynamoDBItem {
  [key: string]: any;
}

interface result {
  validDenomination: string;
  frontPlateId: string;
  SerialPatternMatch: string;
  serialNumber: string;
  federalReserveId: string;
  federalReserveLocation: string;
  notePositionId: string;
  seriesYear: string;
  treasurer: string;
  secretary: string;
  s3Url: String;
};

// Export all interfaces together
// Export all interfaces together
export {
  RegExValidators,
  SerialNumberMapping,
  SerialNumberMappings,
  NoteDetails,
  MatchedDetail,
  DenominationDetail,
  DynamoDBItem,
  result,
  federalReserveMapping,
};
