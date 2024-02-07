"use strict";
//index.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTextDetections = void 0;
var client_rekognition_1 = require("@aws-sdk/client-rekognition");
var additional_mapping_1 = require("./mappings/additional_mapping");
var serialPatterns_1 = require("./services/serialPatterns");
function getTextDetections(imageData, fileName) {
    return __awaiter(this, void 0, void 0, function () {
        var command, response, noteDetails, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    if (!imageData || (typeof imageData === 'string' && imageData.length === 0) || (Buffer.isBuffer(imageData) && imageData.length === 0)) {
                        throw new Error('Image data is empty or undefined.');
                    }
                    command = new client_rekognition_1.DetectTextCommand({
                        Image: {
                            Bytes: Buffer.isBuffer(imageData) ? imageData : Buffer.from(imageData, 'base64'),
                        },
                        Filters: {
                            WordFilter: {
                                MinConfidence: 50,
                            },
                        },
                    });
                    return [4 /*yield*/, new client_rekognition_1.RekognitionClient({ region: 'us-east-1' }).send(command)];
                case 1:
                    response = _a.sent();
                    if (!response.TextDetections || response.TextDetections.length === 0) {
                        throw new Error('No text detections found in the response.');
                    }
                    return [4 /*yield*/, checkRegexPatterns(response.TextDetections, fileName)];
                case 2:
                    noteDetails = _a.sent();
                    return [2 /*return*/, noteDetails];
                case 3:
                    error_1 = _a.sent();
                    if (error_1 instanceof Error) {
                        throw new Error("Error processing image: ".concat(error_1.message));
                    }
                    else {
                        throw new Error('Unknown error occurred');
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getTextDetections = getTextDetections;
function getAdditionalDetails(denomination, serialNumber) {
    try {
        if (!denomination) {
            throw new Error('Denomination of the note was not detected or provided.');
        }
        var matchedDetail = denomination.find(function (detail) {
            // Checks if the pattern is already a RegExp or if it is a string creates a RegExp object
            var regex = typeof detail.pattern === 'string' ? new RegExp(detail.pattern) : detail.pattern;
            return regex.test(serialNumber.charAt(0));
        });
        if (!matchedDetail) {
            throw new Error('No matching detail found');
        }
        return {
            seriesYear: matchedDetail.seriesYear,
            treasurer: matchedDetail.treasurer,
            secretary: matchedDetail.secretary,
        };
    }
    catch (error) {
        throw {
            status: 400,
            error: "Error obtaining additionalDetails: ".concat(error),
            inputDetails: {},
            validator: 'additionalDetails',
        };
    }
}
function checkRegexPatterns(textDetections, fileName) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var matchedWordsHash, _i, textDetections_1, text, detectedText, correctedText, correctedWord, patternKey, pattern, patternKey, pattern, denomination, serialNumber, additionalDetails, details;
        return __generator(this, function (_b) {
            try {
                matchedWordsHash = {};
                for (_i = 0, textDetections_1 = textDetections; _i < textDetections_1.length; _i++) {
                    text = textDetections_1[_i];
                    detectedText = (_a = text.DetectedText) === null || _a === void 0 ? void 0 : _a.replace(/ /g, '');
                    if (detectedText) {
                        correctedText = detectedText;
                        correctedWord = checkPotentialMistakenLetter(detectedText);
                        if (correctedWord) {
                            correctedText = correctedWord;
                        }
                        // Check for unique serial number patterns
                        for (patternKey in serialPatterns_1.serialNumberPatterns) {
                            pattern = new RegExp(serialPatterns_1.serialNumberPatterns[patternKey]);
                            if (pattern.test(correctedText)) {
                                matchedWordsHash['SerialPatternMatch'] = patternKey;
                            }
                        }
                        // Check to make sure that all detected identifiers match the expected format
                        for (patternKey in serialPatterns_1.noteValidators) {
                            pattern = new RegExp(serialPatterns_1.noteValidators[patternKey]);
                            if (pattern.test(correctedText)) {
                                matchedWordsHash[patternKey] = correctedText;
                            }
                        }
                    }
                }
                denomination = matchedWordsHash.validDenomination;
                serialNumber = matchedWordsHash.validSerialNumberPattern;
                additionalDetails = getAdditionalDetails((0, additional_mapping_1.createSerialNumberMappings)('./src/mappings/additionalMappingDetails.txt')["$".concat(denomination)], serialNumber);
                details = {
                    validDenomination: matchedWordsHash.validDenomination,
                    frontPlateId: matchedWordsHash.frontPlateId,
                    SerialPatternMatch: matchedWordsHash.SerialPatternMatch,
                    serialNumber: matchedWordsHash.validSerialNumberPattern,
                    federalReserveId: matchedWordsHash.federalReserveId,
                    federalReserveLocation: '',
                    notePositionId: matchedWordsHash.notePositionId,
                    seriesYear: additionalDetails === null || additionalDetails === void 0 ? void 0 : additionalDetails.seriesYear,
                    treasurer: additionalDetails === null || additionalDetails === void 0 ? void 0 : additionalDetails.treasurer,
                    secretary: additionalDetails === null || additionalDetails === void 0 ? void 0 : additionalDetails.secretary,
                    s3Url: '',
                };
                if (matchedWordsHash.federalReserveId && additional_mapping_1.federalReserveMapping[matchedWordsHash.federalReserveId]) {
                    details.federalReserveLocation = additional_mapping_1.federalReserveMapping[matchedWordsHash.federalReserveId];
                }
                return [2 /*return*/, details];
            }
            catch (error) {
                throw new Error("Error in checkRegexPatterns ".concat(JSON.stringify(error)));
            }
            return [2 /*return*/];
        });
    });
}
function checkPotentialMistakenLetter(detectedText) {
    if (/[A-L]\s?[i]/.test(detectedText)) {
        return detectedText.replace(/Ei/g, 'E1');
    }
    return null;
}
// getTextDetections('./MK.jpeg');
