"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var multer_1 = __importDefault(require("multer"));
var _1 = require(".");
var awsFunctions_1 = require("./helpers/awsFunctions");
var app = (0, express_1.default)();
app.set('view engine', 'ejs');
// Configure multer for handling file uploads
var storage = multer_1.default.diskStorage({
    /**
     * Determines the destination directory for storing uploaded files.
     * @param {Express.Request} req - The Express request object.
     * @param {Express.Multer.File} file - The uploaded file object.
     * @param {(error: Error | null, destination: string) => void} cb - The callback function to be invoked when the destination is determined.
     */
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    /**
     * Generates the filename for storing the uploaded file.
     * @param {Express.Request} req - The Express request object.
     * @param {Express.Multer.File} file - The uploaded file object.
     * @param {(error: Error | null, filename: string) => void} cb - The callback function to be invoked when the filename is generated.
     */
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original filename
    },
});
/**
 * Multer configuration for handling file uploads.
 */
var upload = (0, multer_1.default)({ storage: storage });
/**
 * The data URL representing the uploaded file.
 * @type {string}
 */
var dataURL;
/**
 * The buffer containing the uploaded file data.
 * @type {Buffer}
 */
var buffer;
/**
 * The filename of the uploaded file.
 * @type {string}
 */
var fileName;
/**
 * The detected text from the uploaded image.
 * @type {DetectedText}
 */
var detectedText;
/**
 * Middleware to parse urlencoded bodies.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {Function} next - The next middleware function in the stack.
 */
app.use(body_parser_1.default.urlencoded({ extended: false }));
/**
 * Middleware to serve static files from the 'public' directory.
 * @param {string} 'public' - The directory from which to serve static files.
 */
app.use(express_1.default.static('public'));
/**
 * Route for serving the HTML form.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
app.get('/', function (req, res) {
    res.sendFile(path_1.default.join(__dirname, 'public', 'index.html'));
});
/**
 * Route for handling file upload.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
app.post('/upload', upload.single('image'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            if (!req.file) {
                throw res.status(400).json({ message: 'No file uploaded' });
            }
            // Read file and convert to data URL
            fileName = req.file.filename;
            buffer = fs_1.default.readFileSync(req.file.path);
            dataURL = "data:image/jpeg;base64,".concat(buffer.toString('base64'));
            res.json({ success: true, dataURL: dataURL });
        }
        catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: "Failed to upload image ".concat(fileName) });
        }
        return [2 /*return*/];
    });
}); });
/**
 * Route for rendering the success page.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
app.get('/success', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, _1.getTextDetections)(buffer, "uploads/".concat(fileName))];
            case 1:
                // Detect text in the uploaded image
                detectedText = _a.sent();
                res.render('success', { detectedText: detectedText, dataURL: dataURL });
                return [2 /*return*/];
        }
    });
}); });
/**
 * Route for saving data to AWS and responding with the results.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
app.post('/save', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var awsUploadResults, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, awsFunctions_1.awsUpload)(detectedText, fileName)];
            case 1:
                awsUploadResults = _a.sent();
                res.json({ success: true, awsUploadResults: awsUploadResults });
                console.log('AWS Upload Results:', awsUploadResults);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Error:', error_1);
                res.status(500).json({ message: "Failed to upload image ".concat(fileName) });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Start the server
app.listen(3000, function () {
    console.log("Server is running on port ".concat(3000));
});
