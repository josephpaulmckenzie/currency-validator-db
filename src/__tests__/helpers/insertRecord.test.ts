import { Pool, QueryResult } from 'pg';
import { insertNoteDetail } from '../../helpers/insertRecord'; // Update with your file path
import { DatabaseError } from '../../classes/errorClasses';

jest.mock('dotenv', () => ({
	config: jest.fn(),
}));

describe('insertNoteDetail', () => {
	const mockNoteDetail = {
		serialNumber: '12345',
		validdenomination: '10',
		federalReserveId: '123',
		federalReserveLocation: 'New York',
		frontPlateId: '678',
		notePositionId: '1',
		serialPatternMatch: 'ABC',
		seriesYear: '2022',
		treasurer: 'John Doe',
		secretary: 'Jane Doe',
		s3Url: 'https://example.com/image.jpg',
	};

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should insert note detail into the database', async () => {
		const mockQueryResult: QueryResult = {
			rowCount: 1,
			rows: [],
			command: '',
			fields: [],
			oid: 0,
		};

		const mockPoolQuery = jest.fn().mockResolvedValueOnce(mockQueryResult);
		jest.spyOn(Pool.prototype, 'query').mockImplementation(mockPoolQuery);

		await expect(insertNoteDetail(mockNoteDetail)).resolves.toEqual(mockQueryResult);

		expect(mockPoolQuery).toHaveBeenCalledWith(expect.any(String), [
			mockNoteDetail.serialNumber,
			mockNoteDetail.validdenomination,
			mockNoteDetail.federalReserveId,
			mockNoteDetail.federalReserveLocation,
			mockNoteDetail.frontPlateId,
			mockNoteDetail.notePositionId,
			mockNoteDetail.serialPatternMatch,
			mockNoteDetail.seriesYear,
			mockNoteDetail.treasurer,
			mockNoteDetail.secretary,
			mockNoteDetail.s3Url,
		]);
	});

	it('should throw DatabaseError when database query fails', async () => {
		const mockDatabaseError = new DatabaseError('Database connection failed', '500');

		const mockPoolQuery = jest.fn().mockRejectedValueOnce(mockDatabaseError);
		jest.spyOn(Pool.prototype, 'query').mockImplementation(mockPoolQuery);

		await expect(insertNoteDetail(mockNoteDetail)).rejects.toThrow(DatabaseError);

		expect(mockPoolQuery).toHaveBeenCalledWith(expect.any(String), expect.any(Array));
	});

	it('should throw the original error if it is not an instance of DatabaseError', async () => {
		const mockError = new Error('Some error');
		const mockPoolQuery = jest.fn().mockRejectedValueOnce(mockError);

		jest.spyOn(Pool.prototype, 'query').mockImplementation(mockPoolQuery);
		await expect(insertNoteDetail(mockNoteDetail)).rejects.toThrow(mockError);
		expect(mockPoolQuery).toHaveBeenCalledWith(expect.any(String), expect.any(Array));
	});
});
