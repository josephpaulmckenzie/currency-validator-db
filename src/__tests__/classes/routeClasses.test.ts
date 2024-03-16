import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../helpers/errorHandling/errorHandler';
import { RouteNotFound } from '../../classes/routeClasses';

describe('Error Handler', () => {
  // Define types for mock objects
  type MockResponse = Partial<Response<string, Record<string, any>>> & {
    sendStatus: jest.Mock<MockResponse, [number]>;
    status: jest.Mock<MockResponse, [number]>;
    json: jest.Mock<MockResponse, [any]>;
  };

  let mockRequest: Request;
  let mockResponse: MockResponse;
  let mockNext: jest.Mock<NextFunction>;

  beforeEach(() => {
    mockRequest = {} as Request;
    mockResponse = {
      sendStatus: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  it('should handle RouteNotFound error and send a 404 response with "Resource Not Found"', () => {
    const routeNotFoundError = new RouteNotFound('Route not found', 404);

    errorHandler(routeNotFoundError, mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Resource Not Found' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle other errors and send a 500 response with "Internal Server Error"', () => {
    const genericError = new Error('Internal Server Error');

    errorHandler(genericError, mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
