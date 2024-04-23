import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('handles sign up request', () => {
        const emailString = 'somemail@mail.com';
        return request(app.getHttpServer())
            .post('/auth/signup')
            .send({
                password: 'qwerty',
                email: emailString,
            })
            .expect(201)
            .then(res => {
                const { id, email } = res.body;
                expect(id).toBeDefined();
                expect(email).toEqual(emailString);
            })
    });

    it('sign up as a new user then get the currently logged user', async () => {
        const emailString = 'somenewmail@mail.com';
        const res = await request(app.getHttpServer())
            .post('/auth/signup')
            .send({
                password: 'qwerty',
                email: emailString,
            })
            .expect(201);
        const cookie = res.get('Set-Cookie');
        const { body } = await request(app.getHttpServer())
            .get('/auth/current')
            .set('Cookie', cookie)
            .expect(200);

        expect(body.email).toEqual(emailString);
    });
});
