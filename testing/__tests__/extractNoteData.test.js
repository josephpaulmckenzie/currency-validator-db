const lambdaHandler = require("../../handler");

describe("validateData Lambda Function", () => {
    let event;
    let serialNumber;
    let denomination
    beforeEach(() => {
        event = {
            body: JSON.stringify({
                denomination: "$20",
                serialNumber: "PC78646654A",
                federalReserveIndicator: "C3",
                federalReserveBank:'Philadelphia, PA',
                notePosition: "B2",
                frontPlateNumber: "B38",
                backPlateNumber: "47",
                fortWorthNote: false,
                
            }),
        };
    });

    it("should validate and return all entered data successfully", async () => {
        const result = await lambdaHandler.validateData(event);

        expect(result.statusCode).toBe(200);
        expect(result.body).toBeDefined();

        const parsedBody = JSON.parse(result.body);
        expect(parsedBody).toHaveProperty("validatedData");
        // Add more specific checks for validated data properties if needed
    });

    it("should handle invalid denomination", async () => {
        const updatedEvent = { ...event };
        updatedEvent.body = JSON.stringify({
            ...JSON.parse(updatedEvent.body),
            denomination: "$580",
        });

        const result = await lambdaHandler.validateData(updatedEvent);

        const invalidDenomination = {
            statusCode: 400,
            body: "Invalid denomination. Please provide a valid denomination ($1, $2, $5, $10, $20, $50, or $100).",
        };

        expect(result).toMatchObject(invalidDenomination);
    });

    it("should handle invalid serials", async () => {
        const updatedEvent = { ...event };
        updatedEvent.body = JSON.stringify({
            ...JSON.parse(updatedEvent.body),
            denomination: "$1",
            serialNumber: "A11111"
        });
    
        const result = await lambdaHandler.validateData(updatedEvent);
    
        const updatedBody = JSON.parse(updatedEvent.body);
        const invalidSerial = {
            statusCode: 400,
            body: `Invalid Serial Number Format. The format for the serial number ${updatedBody.serialNumber} does not match for the denomination ${updatedBody.denomination}.`,
        };
    
        expect(result.statusCode).toBe(invalidSerial.statusCode);
        expect(result.body).toBe(invalidSerial.body);
    });
    
    

    it('should retrieve additional details from the mapping table based on a valid denomination and serial number', async () => {
        const updatedEvent = { ...event };
        updatedEvent.body = JSON.stringify({
            ...JSON.parse(updatedEvent.body),
            denomination: "$20",
            serialNumber: "PC78646654A"
        });
    
        const expectedProperties = [
            'denomination',
            'serialNumber',
            'seriesYear',
            'treasurer',
            'secretary'
        ];
    
        const result = await lambdaHandler.validateData(updatedEvent);
        const parsedBody = JSON.parse(result.body);
    
        expect(result.statusCode).toBe(200);
        expect(result.body).toBeDefined();
    
        // Check if at least the expected properties exist in the response body
        expectedProperties.forEach(property => {
            expect(parsedBody.validatedData).toHaveProperty(property);
        });
    }); 
    
    it("should throw on a invalid note position", async () => {
        const updatedEvent = { ...event };
        updatedEvent.body = JSON.stringify({
            ...JSON.parse(updatedEvent.body),
            notePosition: "V890",
        });

        const result = await lambdaHandler.validateData(updatedEvent);

        const invalidDenomination = {
            statusCode: 400,
            body: "Invalid Note position Format. Please enter a valid note position ((A-L)-(1-5) e.g; A5) for most denominations).",
        };

        expect(result).toMatchObject(invalidDenomination);
    });
    
    it("should throw an error on an invalid front plate number", async () => {
        const updatedEvent = { ...event };
        updatedEvent.body = JSON.stringify({
            ...JSON.parse(updatedEvent.body),
            frontPlateNumber: "420",
        });

        const result = await lambdaHandler.validateData(updatedEvent);

        const invalidFrontPlateNumber = {
            statusCode: 400,
            body: "Invalid Front Plate Number Format.",
        };

        expect(result).toMatchObject(invalidFrontPlateNumber);
    });

    it("should throw an error on an invalid back plate number", async () => {
        const updatedEvent = { ...event };
        updatedEvent.body = JSON.stringify({
            ...JSON.parse(updatedEvent.body),
            backPlateNumber: "A23452",
        });

        const result = await lambdaHandler.validateData(updatedEvent);

        const invalidBackPlateNumber = {
            statusCode: 400,
            body: "Invalid Back Plate Number Format.",
        };

        expect(result).toMatchObject(invalidBackPlateNumber);
    });

    it("should return a matched pattern type for the serial number", async () => {
        const updatedEvent = { ...event };
        updatedEvent.body = JSON.stringify({
            ...JSON.parse(updatedEvent.body),
            uniqueSerialNumberType: 'Detected a 420 note',
        });

        const result = await lambdaHandler.validateData(updatedEvent);

        // const invalidFrontPlateNumber = {
        //     statusCode: 400,
        //     body: "Invalid Back Plate Number Format.",
        // };

        // expect(result).toMatchObject(invalidFrontPlateNumber);
    });
});