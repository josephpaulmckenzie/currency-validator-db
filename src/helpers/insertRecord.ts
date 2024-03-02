import { Pool, QueryResult } from 'pg';
import { handleDatabaseError } from './errorHandlers';
import { NoteDetail } from '../interfaces/interfaces';
import { config } from 'dotenv';
config();

const pool = new Pool({
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	port: Number(process.env.DB_PORT),
});

async function insertNoteDetail(noteDetail: NoteDetail): Promise<QueryResult<any>> {
	const query = `
        INSERT INTO note_details
            (serialnumber, validdenomination, federalreserveid, federalreservelocation, frontplateid, notepositionid, serialpatternmatch,
            seriesyear, treasurer, secretary, s3url)  
        VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `;
	try {
		return await pool.query(query, [
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
	} catch (error) {
		handleDatabaseError(error);
		throw error;
	}
}

export { pool, insertNoteDetail };
