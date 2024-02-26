import { Pool, QueryResult } from 'pg';

// Define an interface for the note detail data structure
interface NoteDetail {
	s3url: string;
	validdenomination: string; // Assuming this is a number
	frontPlateId: string;
	serialPatternMatch: string;
	serialNumber: string;
	federalReserveId: string;
	notePositionId: string;
	seriesYear: string;
	treasurer: string;
	secretary: string;
	federalReserveLocation: string;
}

interface BoundingBox {
	serialNumber: string;
	width: number;
	height: number;
	boxLeft: number;
	top: number;
}

/**
 * A pool of clients for managing connections to the PostgreSQL database.
 */
const pool = new Pool({
	user: 'josephmckenzie',
	host: 'localhost',
	database: 'currencydb',
	password: 'Bubbadog1907',
	port: 5432,
});

/**
 * Inserts a new note detail into the note_details table.
 * @param noteDetail The note detail data to insert.
 * @returns A Promise representing the result of the query.
 */
async function insertNoteDetail(noteDetail: NoteDetail): Promise<QueryResult> {
	console.log('i love you here i am ', noteDetail);
	const query = `
        INSERT INTO note_details
            (serialnumber, validdenomination ,federalreserveid ,federalreservelocation ,frontplateid ,notepositionid ,serialpatternmatch ,
             seriesyear ,treasurer ,secretary ,s3url )  
        VALUES
            ($1, $2, $3, $4, $5,  $6, $7, $8, $9, $10, $11)
    `;
	return pool.query(query, [
		noteDetail.serialNumber,
		noteDetail.validdenomination,
		noteDetail.federalReserveId,
		noteDetail.federalReserveLocation,
		noteDetail.frontPlateId,
		noteDetail.notePositionId,
		noteDetail.serialPatternMatch,
		noteDetail.seriesYear,
		noteDetail.treasurer,
		noteDetail.secretary,
		noteDetail.s3url,
	]);
}

/**
 * Inserts a new bounding box into the bounding_boxes table.
 * @param boundingBox The bounding box data to insert.
 * @returns A Promise representing the result of the query.
 */
// async function insertBoundingBox(boundingBox: BoundingBox): Promise<QueryResult> {
// 	const query = `
//         INSERT INTO bounding_boxes
//             (serialnumber, width, height, box_left, top)
//         VALUES
//             ($1, $2, $3, $4, $5)
//     `;
// 	const values = [boundingBox.serialNumber, boundingBox.width, boundingBox.height, boundingBox.boxLeft, boundingBox.top];
// 	return pool.query(query, values);
// }

export { pool, insertNoteDetail };
