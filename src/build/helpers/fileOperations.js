"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFile = exports.checkFileExists = void 0;
var fs_1 = require("fs");
var errorClasses_1 = require("../classes/errorClasses");
function checkFileExists(filePath) {
    if (!(0, fs_1.existsSync)(filePath)) {
        throw new errorClasses_1.FileNotFoundError('File does not exist.');
    }
}
exports.checkFileExists = checkFileExists;
function readFile(filePath) {
    try {
        checkFileExists(filePath);
        return (0, fs_1.readFileSync)(filePath, 'utf8');
    }
    catch (error) {
        if (error instanceof errorClasses_1.FileNotFoundError) {
            throw new Error("Error reading file: ".concat(error.message));
        }
        else {
            throw new Error("Error reading file: ".concat(error));
        }
    }
}
exports.readFile = readFile;
