import { jest } from '@jest/globals';
import { getGroceryPrices } from '../src/controllers/GroceryPriceController.js';

let mockReq;
let mockRes;

beforeEach(() => {
  jest.clearAllMocks();
  mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    setHeader: jest.fn(),
    flushHeaders: jest.fn(),
    write: jest.fn(),
    end: jest.fn(),
  };
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("AT 8.2 Backend", () => {

  // Missing body
  test("returns 400 when ingredients field is absent", async () => {
    mockReq = { body: {} };
    await getGroceryPrices(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "ingredients array is required" });
  });

  // Empty array
  test("returns 400 when ingredients is an empty array", async () => {
    mockReq = { body: { ingredients: [] } };
    await getGroceryPrices(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "ingredients array is required" });
  });

  // Missing API key
  test("returns 500 when GEMINI_API_KEY is not configured", async () => {
    const savedKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    mockReq = { body: { ingredients: ["flour", "butter", "chicken"] } };
    await getGroceryPrices(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "AI service not configured" });

    if (savedKey !== undefined) process.env.GEMINI_API_KEY = savedKey;
  });
});
