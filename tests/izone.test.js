const mockPromise = jest.fn();

jest.doMock('aws-sdk', () => {
    return {
        ...jest.requireActual("aws-sdk"),
        DynamoDB: {
            DocumentClient: jest.fn(() => ({update: () => ({promise: mockPromise})}))
        }
    }
});

const AWS = require("aws-sdk");
const izone = require('../repositories/izone');

beforeEach(() => {
    jest.clearAllMocks();
});

test('Update lastId success', async () => {
    await izone.updateLastId({id: 'id'}, 0);
    expect(mockPromise).toBeCalled();
});

test('When lastId is -Infinity, do not update', async () => {
    await izone.updateLastId({id: 'id'}, -Infinity);
    expect(mockPromise.mock.calls.length).toBe(0);
});
