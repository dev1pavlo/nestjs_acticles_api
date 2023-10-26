import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('api');
    await app.init();
  });

  describe('/api/users/login (POST)', () => {
    it('should fail if no data', async () => {
      return await request(app.getHttpServer())
        .post('/api/users/login')
        .expect(400);
    });

    it('should fail if invalid password', async () => {
      return await request(app.getHttpServer())
        .post('/api/users/login')
        .send({ email: 'admin@gmail.com', password: 'incorrect' })
        .expect(400);
    });

    it('should fail if invalid email', async () => {
      return await request(app.getHttpServer())
        .post('/api/users/login')
        .send({ email: 'incorrect@gmail.com', password: 'admin' })
        .expect(400);
    });

    it('should succeed if correct data', async () => {
      const registerResponse = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          email: 'test@test.com',
          password: 'test1234',
          passwordConfirm: 'test1234',
        })
        .expect(201);
      const loginResponse = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({ email: 'test@test.com', password: 'test1234' })
        .expect(200);
      expect(loginResponse.body.user.email).toEqual(
        registerResponse.body.user.email,
      );
      expect(loginResponse.body.user.id).toEqual(registerResponse.body.user.id);
    });
  });

  describe('/api/users/register (POST)', () => {
    it('should fail if no data', async () => {
      await request(app.getHttpServer())
        .post('/api/users/register')
        .expect(400);
    });

    it('should fail if incorrect email', async () => {
      await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          email: 'test',
          password: 'test1234',
          passwordConfirm: 'test1234',
        })
        .expect(400);
    });

    it('should fail if password missmatch', async () => {
      await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          email: 'test@gmail.com',
          password: 'test1234',
          passwordConfirm: 'incorrect',
        })
        .expect(400);
    });

    it('should fail if user exists', async () => {
      await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          email: 'test1@gmail.com',
          password: 'test1234',
          passwordConfirm: 'test1234',
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          email: 'test1@gmail.com',
          password: 'test1234',
          passwordConfirm: 'test1234',
        })
        .expect(400);
    });

    it('should succeed if correct data', async () => {
      await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          email: 'test2@gmail.com',
          password: 'test1234',
          passwordConfirm: 'test1234',
        })
        .expect(201);
    });
  });

  describe('/api/users/me (get)', () => {
    it('should fail if no token', async () => {
      await request(app.getHttpServer()).get('/api/users/me').expect(401);
    });

    it('should fail if incorrect token', async () => {
      await request(app.getHttpServer())
        .get('/api/users/me')
        .set('Authorization', 'Bearer invalid.token')
        .expect(401);
    });

    it('should succeed if correct token', async () => {
      const registerResponse = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          email: 'test1234@gmail.com',
          password: 'test1234',
          passwordConfirm: 'test1234',
        })
        .expect(201);

      const userResponse = await request(app.getHttpServer())
        .get('/api/users/me')
        .set('Authorization', `Bearer ${registerResponse.body.accessToken}`)
        .expect(200);

      expect(userResponse.body.id).toEqual(userResponse.body.id);
      expect(userResponse.body.email).toEqual(userResponse.body.email);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
