"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextDetectionsError = exports.FileNotFoundError = void 0;
class FileNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'FileNotFoundError';
    }
}
exports.FileNotFoundError = FileNotFoundError;
class TextDetectionsError extends Error {
    constructor(message) {
        super(message);
        this.name = 'Text Detetction Error';
    }
}
exports.TextDetectionsError = TextDetectionsError;
//# sourceMappingURL=errorClasses.js.map