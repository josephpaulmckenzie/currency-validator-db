import { Result, ValidationError } from 'express-validator';
import { Options, StorageEngine } from 'multer';

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
		serialNumberPrefix: string;
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
	seriesYear: string | undefined;
	treasurer: string | undefined;
	secretary: string | undefined;
}

/**
 * Interface representing details of a banknote denomination.
 */
// interface DenominationDetail {
// 	pattern: any;
// 	serialNumberPrefix: string;
// 	seriesYear: string;
// 	treasurer: string;
// 	secretary: string;
// }

interface DenominationDetail {
	serialNumberPrefix: string;
	pattern?: RegExp | string;
	seriesYear?: string;
	treasurer?: string;
	secretary?: string;
}
interface BoundingBox {
	Width: number;
	Height: number;
	Left: number;
	Top: number;
}

interface WordDetection {
	text: string;
	boundingBox: BoundingBox;
}

/**
 * Interface representing a polygon.
 */
interface Polygon {
	X: number;
	Y: number;
}

// /**
//  * Common properties interface
//  */
// interface CommonProperties {
// 	s3Url: string;
// 	validDenomination: string;
// 	frontPlateId: string;
// 	SerialPatternMatch: string;
// 	serialNumber: string;
// 	federalReserveId: string;
// 	notePositionId: string;
// 	seriesYear: string;
// 	treasurer: string;
// 	secretary: string;
// 	federalReserveLocation: string;
// }

/**
 * Combined response interface
 */
interface MockedDynamoDbResponse {
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
	fileExists(filePath: string): boolean;

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

interface WordDetails {
	[word: string]: {
		// boundingBox: {
		Width: number;
		Height: number;
		Left: number;
		Top: number;
		// };
	};
}

interface DetectedText {
	validDenomination: TextWithBoundingBox | string;
	frontPlateId: TextWithBoundingBox | string;
	SerialPatternMatch: TextWithBoundingBox | string;
	serialNumber: TextWithBoundingBox | string;
	federalReserveId: TextWithBoundingBox | string;
	federalReserveLocation: string;
	notePositionId: TextWithBoundingBox | string;
	seriesYear: string;
	treasurer: TextWithBoundingBox | string;
	secretary: TextWithBoundingBox | string;
}

interface TextWithBoundingBox {
	text: string;
	boundingBox?: BoundingBox; // Make boundingBox optional
}

interface BoundingBox {
	Width: number;
	Height: number;
	Left: number;
	Top: number;
}

interface UploadData {
	validdenomination: TextWithBoundingBox | string;
	frontPlateId: TextWithBoundingBox | string;
	serialPatternMatch: TextWithBoundingBox | string;
	serialNumber: TextWithBoundingBox | string;
	federalReserveId: TextWithBoundingBox | string;
	federalReserveLocation: string;
	notePositionId: TextWithBoundingBox | string;
	seriesYear: string;
	treasurer: TextWithBoundingBox | string;
	secretary: TextWithBoundingBox | string;
	s3Url: string;
	validSerialNumberPattern: TextWithBoundingBox | string;
}

interface NoteDetailsItem {
	text: string;
	boundingBox: {
		Width: number;
		Height: number;
		Left: number;
		Top: number;
	};
}

type DatabaseErrorType = '23505' | '42P01';

interface NoteDetail {
	s3Url: string;
	validdenomination: TextWithBoundingBox | string;
	frontPlateId: TextWithBoundingBox | string;
	serialPatternMatch: TextWithBoundingBox | string;
	serialNumber: TextWithBoundingBox | string;
	federalReserveId: TextWithBoundingBox | string;
	notePositionId: TextWithBoundingBox | string;
	seriesYear: string;
	treasurer: TextWithBoundingBox | string;
	secretary: TextWithBoundingBox | string;
	federalReserveLocation: string;
}

interface DatabaseError {
	code: DatabaseErrorType;
	constraint?: string;
	table?: string;
}
type ValidationResult = Result<ValidationError>;

// Define custom multer options
interface CustomMulterOptions extends Options {
	storage: StorageEngine;
}

interface CustomError {
	error: string;
	statusCode: number;
}

export {
	RegExValidators,
	SerialNumberMappings,
	NoteDetails,
	MatchedDetail,
	DenominationDetail,
	DetectedText,
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
	BoundingBox,
	Polygon,
	WordDetection,
	WordDetails,
	NoteDetail,
	NoteDetailsItem,
	DatabaseError,
	ValidationResult,
	CustomMulterOptions,
	CustomError,
};
