import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

const correctArticleData = { title: 'Test title', body: 'Test body' };
const updateArticleData = { title: 'Test title', body: 'Test body' };

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

  describe('/api/articles (POST)', () => {
    it('should fail if no token', async () => {
      await request(app.getHttpServer())
        .post('/api/articles')
        .send({ title: 'Test title', body: 'Test body' })
        .expect(401);
    });

    it('should fail if no data', async () => {
      const authResponse = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          email: 'test@test.com',
          password: 'test1234',
          passwordConfirm: 'test1234',
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/articles')
        .set('Authorization', `Bearer ${authResponse.body.accessToken}`)
        .expect(400);
    });

    it('should succeed if correct data', async () => {
      const authResponse = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          email: 'test@test.com',
          password: 'test1234',
          passwordConfirm: 'test1234',
        })
        .expect(201);

      const articleResponse = await request(app.getHttpServer())
        .post('/api/articles')
        .set('Authorization', `Bearer ${authResponse.body.accessToken}`)
        .send(correctArticleData)
        .expect(201);

      expect(articleResponse.body.title).toEqual(correctArticleData.title);
      expect(articleResponse.body.body).toEqual(correctArticleData.body);
    });
  });

  describe('/api/articles (GET)', () => {
    it('should return empty array if no articles', async () => {
      const articlesResponse = await request(app.getHttpServer())
        .get('/api/articles')
        .expect(200);

      expect(articlesResponse.body.length).toEqual(0);
    });

    it('should return array of articles', async () => {
      const authResponse = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          email: 'test@test.com',
          password: 'test1234',
          passwordConfirm: 'test1234',
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/articles')
        .set('Authorization', `Bearer ${authResponse.body.accessToken}`)
        .send(correctArticleData)
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/articles')
        .set('Authorization', `Bearer ${authResponse.body.accessToken}`)
        .send(correctArticleData)
        .expect(201);

      const articlesResponse = await request(app.getHttpServer())
        .get('/api/articles')
        .expect(200);

      expect(articlesResponse.body.length).toEqual(2);
    });
  });

  describe('/api/aricles/:id (GET)', () => {
    it('should return 404 if no article', async () => {
      await request(app.getHttpServer())
        .get('/api/articles/0128930')
        .expect(404);
    });

    it('should return article if exists', async () => {
      const authResponse = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          email: 'test@test.com',
          password: 'test1234',
          passwordConfirm: 'test1234',
        })
        .expect(201);

      const newArticle = await request(app.getHttpServer())
        .post('/api/articles')
        .set('Authorization', `Bearer ${authResponse.body.accessToken}`)
        .send(correctArticleData)
        .expect(201);
      console.log(newArticle.body.id);
      const articleResponse = await request(app.getHttpServer())
        .get(`/api/articles/${newArticle.body.id}`)
        .expect(200);

      expect(articleResponse.body.title).toEqual(correctArticleData.title);
      expect(articleResponse.body.body).toEqual(correctArticleData.body);
    });
  });

  describe('/api/aricles/:id (PUT)', () => {
    it('should return 401 if no token', async () => {
      const authResponse = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          email: 'test@test.com',
          password: 'test1234',
          passwordConfirm: 'test1234',
        })
        .expect(201);

      const articleResponse = await request(app.getHttpServer())
        .post('/api/articles')
        .set('Authorization', `Bearer ${authResponse.body.accessToken}`)
        .send(correctArticleData)
        .expect(201);

      await request(app.getHttpServer())
        .put(`/api/articles/${articleResponse.body.id}`)
        .send(updateArticleData)
        .expect(401);
    });

    it('should return 400 if no data', async () => {
      const authResponse = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          email: 'test@test.com',
          password: 'test1234',
          passwordConfirm: 'test1234',
        })
        .expect(201);

      const articleResponse = await request(app.getHttpServer())
        .post('/api/articles')
        .set('Authorization', `Bearer ${authResponse.body.accessToken}`)
        .send(correctArticleData)
        .expect(201);

      await request(app.getHttpServer())
        .put(`/api/articles/${articleResponse.body.id}`)
        .set('Authorization', `Bearer ${authResponse.body.accessToken}`)
        .expect(400);
    });

    it('should return 403 if user is not an author', async () => {
      const firstPerson = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          email: 'test@test.com',
          password: 'test1234',
          passwordConfirm: 'test1234',
        })
        .expect(201);

      const secondPerson = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          email: 'test1@test.com',
          password: 'test1234',
          passwordConfirm: 'test1234',
        })
        .expect(201);

      const articleResponse = await request(app.getHttpServer())
        .post('/api/articles')
        .set('Authorization', `Bearer ${firstPerson.body.accessToken}`)
        .send(correctArticleData)
        .expect(201);

      await request(app.getHttpServer())
        .put(`/api/articles/${articleResponse.body.id}`)
        .set('Authorization', `Bearer ${secondPerson.body.accessToken}`)
        .send(updateArticleData)
        .expect(403);
    });

    it('should return 404 if no article', async () => {
      await request(app.getHttpServer())
        .get('/api/articles/0128930')
        .expect(404);
    });

    it('should succeed if correct data', async () => {
      const firstPerson = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          email: 'test@test.com',
          password: 'test1234',
          passwordConfirm: 'test1234',
        })
        .expect(201);

      const articleResponse = await request(app.getHttpServer())
        .post('/api/articles')
        .set('Authorization', `Bearer ${firstPerson.body.accessToken}`)
        .send(correctArticleData)
        .expect(201);

      const updatedArticle = await request(app.getHttpServer())
        .put(`/api/articles/${articleResponse.body.id}`)
        .set('Authorization', `Bearer ${firstPerson.body.accessToken}`)
        .send(updateArticleData)
        .expect(200);

      expect(updatedArticle.body.title).toEqual(updateArticleData.title);
      expect(updatedArticle.body.body).toEqual(updateArticleData.body);
    });
  });

  describe('/api/aricles/:id (DELETE)', () => {
    it('should return 401 if no token', async () => {
      const authResponse = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          email: 'test@test.com',
          password: 'test1234',
          passwordConfirm: 'test1234',
        })
        .expect(201);

      const articleResponse = await request(app.getHttpServer())
        .post('/api/articles')
        .set('Authorization', `Bearer ${authResponse.body.accessToken}`)
        .send(correctArticleData)
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/api/articles/${articleResponse.body.id}`)
        .expect(401);
    });

    it('should return 403 if user is not an author', async () => {
      const firstPerson = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          email: 'test@test.com',
          password: 'test1234',
          passwordConfirm: 'test1234',
        })
        .expect(201);

      const secondPerson = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          email: 'test1@test.com',
          password: 'test1234',
          passwordConfirm: 'test1234',
        })
        .expect(201);

      const articleResponse = await request(app.getHttpServer())
        .post('/api/articles')
        .set('Authorization', `Bearer ${firstPerson.body.accessToken}`)
        .send(correctArticleData)
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/api/articles/${articleResponse.body.id}`)
        .set('Authorization', `Bearer ${secondPerson.body.accessToken}`)
        .send(updateArticleData)
        .expect(403);
    });

    it('should return 404 if no article', async () => {
      const authResponse = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          email: 'test@test.com',
          password: 'test1234',
          passwordConfirm: 'test1234',
        })
        .expect(201);

      await request(app.getHttpServer())
        .delete('/api/articles/0128930')
        .set('Authorization', `Bearer ${authResponse.body.accessToken}`)
        .expect(404);
    });

    it('should succeed if user an author', async () => {
      const firstPerson = await request(app.getHttpServer())
        .post('/api/users/register')
        .send({
          email: 'test@test.com',
          password: 'test1234',
          passwordConfirm: 'test1234',
        })
        .expect(201);

      const articleResponse = await request(app.getHttpServer())
        .post('/api/articles')
        .set('Authorization', `Bearer ${firstPerson.body.accessToken}`)
        .send(correctArticleData)
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/api/articles/${articleResponse.body.id}`)
        .set('Authorization', `Bearer ${firstPerson.body.accessToken}`)
        .expect(204);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
