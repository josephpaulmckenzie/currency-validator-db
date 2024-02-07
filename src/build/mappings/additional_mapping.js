"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSerialNumberMappings = exports.federalReserveMapping = void 0;
var fileOperations_1 = require("../helpers/fileOperations");
var federalReserveMapping = {
    A1: 'Boston, MA',
    B2: 'New York City, NY',
    C3: 'Philadelphia, PA',
    D4: 'Cleveland, OH',
    E5: 'Richmond, VA',
    F6: 'Atlanta, GA',
    G7: 'Chicago, IL',
    H8: 'St. Louis, MO',
    I9: 'Minneapolis, ME',
    J10: 'Kansas City, MO',
    K11: 'Dallas, TX',
    L12: 'San Francisco, CAs',
};
exports.federalReserveMapping = federalReserveMapping;
function createSerialNumberMappings(filePath) {
    try {
        var lines = (0, fileOperations_1.readFile)(filePath).split('\n');
        var serialNumberMappings_1 = {};
        lines.forEach(function (line) {
            if (line.trim() !== '') {
                var _a = line.trim().split(/\s+/), denomination = _a[0], secretary = _a[1], treasurer = _a[2], seriesYear = _a[3], serialNumberPrefix = _a[4];
                if (denomination && serialNumberPrefix) {
                    if (!serialNumberMappings_1[denomination]) {
                        serialNumberMappings_1[denomination] = [];
                    }
                    var escapedPrefix = serialNumberPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    serialNumberMappings_1[denomination].push({
                        pattern: new RegExp("^".concat(escapedPrefix)),
                        denomination: denomination,
                        seriesYear: seriesYear,
                        treasurer: treasurer,
                        secretary: secretary,
                    });
                }
            }
        });
        return serialNumberMappings_1;
    }
    catch (error) {
        throw {
            status: 400,
            error: "Error creating Serial Number Mappings ".concat(error, " "),
            inputDetails: {},
            validator: 'createSerialNumberMappings',
        };
    }
}
exports.createSerialNumberMappings = createSerialNumberMappings;
