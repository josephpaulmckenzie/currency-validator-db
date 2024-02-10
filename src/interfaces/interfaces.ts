// interfaces.ts

/**
 * Interface representing regular expression validators.
 */
interface RegExValidators {
	[key: string]: RegExp;
}

/**
 * Interface representing mappings of serial numbers.
 */
interface SerialNumberMappings {
	[key: string]: {
		pattern: RegExp;
		denomination: string;
		seriesYear: string;
		treasurer: string;
		secretary: string;
	}[];
}

/**
 * Interface representing mappings of Federal Reserve IDs.
 */
interface FederalReserveMapping {
	[key: string]: string;
}

/**
 * Interface representing details of a banknote.
 */
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

/**
 * Interface representing matched details of a banknote.
 */
interface MatchedDetail {
	seriesYear: string;
	treasurer: string;
	secretary: string;
}

/**
 * Interface representing details of a banknote denomination.
 */
interface DenominationDetail {
	pattern: RegExp | string;
	seriesYear: string;
	treasurer: string;
	secretary: string;
}

/**
 * Interface representing detected text on an image.
 */
interface DetectedText {
	/** Valid denomination detected in the text. */
	validDenomination: string;
	/** Front plate ID detected in the text. */
	frontPlateId: string;
	/** Serial pattern match detected in the text. */
	SerialPatternMatch: string;
	/** Serial number detected in the text. */
	serialNumber: string;
	/** Federal reserve ID detected in the text. */
	federalReserveId: string;
	/** Note position ID detected in the text. */
	notePositionId: string;
}

/**
 * Interface representing mapped data based on detected text.
 */
interface MappedData {
	/** Series year mapped from detected text. */
	seriesYear: string;
	/** Treasurer mapped from detected text. */
	treasurer: string;
	/** Secretary mapped from detected text. */
	secretary: string;
	/** Federal reserve location mapped from detected text. */
	federalReserveLocation: string;
}

/**
 * Interface representing extended detected text including mapped data.
 * @extends DetectedText
 * @extends MappedData
 */
interface ExtendedDetectedText extends DetectedText, MappedData {}

/**
 * Interface representing data to be uploaded to DynamoDB.
 * @extends ExtendedDetectedText
 */
interface UploadData extends ExtendedDetectedText {
	/** URL of the image stored in Amazon S3. */
	s3Url: string;
}

/**
 * Common properties interface
 */
interface CommonProperties {
	s3Url: string;
	validDenomination: string;
	frontPlateId: string;
	SerialPatternMatch: string;
	serialNumber: string;
	federalReserveId: string;
	notePositionId: string;
	seriesYear: string;
	treasurer: string;
	secretary: string;
	federalReserveLocation: string;
}

/**
 * Combined response interface
 */
interface MockedDynamoDbResponse extends CommonProperties {
	item(item: UploadData): unknown;
	status: string;
}

/**
 * Function return type
 */
type DynamoDbResponse = {
	status: string;
	item: UploadData;
};

interface FileChecker {
	/**
	 * Checks if a file exists at the specified path.
	 * @param {string} filePath - The path of the file to check.
	 * @returns {boolean} True if the file exists, false otherwise.
	 * @throws {FileNotFoundError} Throws an error if the file does not exist.
	 */
	checkFileExists(filePath: string): boolean;
}

/**
 * Interface representing a file reader.
 */
interface FileReader {
	/**
	 * Reads the contents of a file.
	 * @param {string} filePath - The path of the file to read.
	 * @returns {string} The content of the file as a string.
	 * @throws {Error} Throws an error if there are any issues reading the file.
	 */
	readFile(filePath: string): string;
}

interface AWSService {
	insertIntoDynamo: (item: UploadData) => Promise<AWS.DynamoDB.DocumentClient.PutItemOutput>;
	saveToS3: (filePath: string, Key: string) => Promise<string>;
}

interface RouteErrors extends Error {
	status: number; // HTTP status code
}

/**
 * Interface representing file operations.
 */
interface FileOperations {
	/**
	 * Checks if a file exists at the specified path.
	 * @param {string} filePath - The path of the file to check.
	 * @returns {boolean} True if the file exists, false otherwise.
	 * @throws {FileNotFoundError} Throws an error if the file does not exist.
	 */
	checkFileExists(filePath: string): boolean;

	/**
	 * Reads the contents of a file.
	 * @param {string} filePath - The path of the file to read.
	 * @returns {string} The content of the file as a string.
	 * @throws {Error} Throws an error if there are any issues reading the file.
	 */
	readFile(filePath: string): string;
}

// Define a custom error class RouteError that extends Error
class RouteError extends Error {
	status: number; // Add a status property to the custom error class

	constructor(message: string, status: number) {
		super(message);
		this.status = status;
	}
}

export {
	RegExValidators,
	SerialNumberMappings,
	NoteDetails,
	MatchedDetail,
	DenominationDetail,
	DetectedText,
	ExtendedDetectedText,
	UploadData,
	FederalReserveMapping,
	FileChecker,
	FileReader,
	AWSService,
	RouteErrors,
	MockedDynamoDbResponse,
	DynamoDbResponse,
	FileOperations,
	RouteError,
};
