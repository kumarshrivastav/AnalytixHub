import ApiKeyController from '../controllers/ApiKey.controller.js';
import crypto from 'crypto';
import { validationResult } from 'express-validator';
import ErrorHandler from '../utils/ErrorHandle.js';
import { closeRedis, RevokeApiKeyRoutesRedis } from '../config/redis.config.js';
import prisma from '../DB/db.config.js';

jest.mock('../DB/db.config.js',()=>({
    apiKey:{
        findUnique:jest.fn(),
        create:jest.fn()
    }
}));
jest.mock('crypto');
jest.mock('../utils/ErrorHandle.js');
jest.mock('../config/redis.config.js',()=>({
    RevokeApiKeyRoutesRedis:jest.fn(),
    closeRedis:jest.fn()
}));

const mockRequest = (body = {}) => ({ body });
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.set = jest.fn().mockReturnValue(res);
    return res;
};
const mockNext = jest.fn();
jest.mock('express-validator', () => ({
    validationResult: jest.fn()
}));
describe('ApiKeyController Register', () => {
    let callCacheFunction;
    beforeEach(async () => { 
        callCacheFunction = await RevokeApiKeyRoutesRedis.mockImplementation(() => Promise.resolve([{ key: value }]));
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    

    it('should register an app and return an API key', async () => {
        const req = mockRequest({ appName: 'Coursera' });
        const res = mockResponse();

        prisma.apiKey.findUnique.mockResolvedValue(null);
        const mockApiKey = 'generated-api-key';
        crypto.randomBytes.mockReturnValueOnce({ toString: () => mockApiKey });
        const newApp = { appName: 'Coursera', key: mockApiKey };
        prisma.apiKey.create.mockResolvedValue(newApp);
        validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] })
        await ApiKeyController.Register(req, res, mockNext);

        expect(prisma.apiKey.findUnique).toHaveBeenCalledWith({ where: { appName: 'Coursera' } });
        expect(prisma.apiKey.create).toHaveBeenCalledWith({ data: { appName: 'Coursera', key: mockApiKey } });
        expect(res.set).toHaveBeenCalledWith('x-api-key', mockApiKey);
        expect(callCacheFunction).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith({ message: 'New Api-Key Created', NewApp: newApp });
    });

    it('should return 400 if appName is missing', async () => {
        const req = mockRequest({});
        const res = mockResponse();
        const validationError = { isEmpty: () => false, array: () => [{ msg: 'AppName is Required' }] };
        validationResult.mockReturnValue(validationError);

        await ApiKeyController.Register(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(ErrorHandler(400, ['AppName is Required']));
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it('should return 400 if appName already exists', async () => {
        const req = mockRequest({ appName: 'Coursera' });
        const res = mockResponse();
        const existingApp = { appName: 'Coursera', key: 'existing-api-key' };
        prisma.apiKey.findUnique.mockResolvedValue(existingApp);

        await ApiKeyController.Register(req, res, mockNext);

        expect(mockNext).toHaveBeenCalledWith(ErrorHandler(400, 'App Name is already present, Please type another one'));
        expect(prisma.apiKey.create).not.toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    afterAll(async()=>await closeRedis())
});
