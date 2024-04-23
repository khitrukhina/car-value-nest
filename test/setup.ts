import { rm } from 'fs/promises';
import { join } from 'path';

// delete test database before each e2e test statement
global.beforeEach(async () => {
    try {
        await rm(join(__dirname, '..', 'test.sqlite'));
    } catch (e) {}
});