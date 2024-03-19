// errorResponse.ts

export function formatErrorResponse(statusCode: number, errorMessage: string): { error: string } {
	return { error: errorMessage };
}
