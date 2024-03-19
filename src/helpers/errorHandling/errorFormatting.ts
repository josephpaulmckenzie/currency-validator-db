// errorResponse.ts

export function formatErrorResponse(errorMessage: string, statusCode: number): { error: string; status: string | number } {
	return { error: errorMessage, status: statusCode };
}
