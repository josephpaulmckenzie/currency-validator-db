interface RegExValidators {
  [key: string]: RegExp;
}

interface SerialNumberMapping {
  pattern: RegExp;
  denomination: string;
  seriesYear: string;
  treasurer: string;
  secretary: string;
}

interface SerialNumberMappings {
  [key: string]: SerialNumberMapping[];
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

// Export all interfaces together
export {
  RegExValidators,
  SerialNumberMapping,
  SerialNumberMappings,
  NoteDetails,
  MatchedDetail,
  DenominationDetail,
  DynamoDBItem,
};
