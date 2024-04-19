import * as request from 'supertest';
import { ADMIN_EMAIL, ADMIN_PASSWORD, API_URL } from 'src/util/test/contest';

describe('User Module', () => {
  const app = API_URL;
  let apiToken: string;

  beforeAll(async () => {
    await request(app)
      .post('/user/login')
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
      .then(({ body }) => {
        apiToken = body.accessToken;
      });
  });

  it('GET /user/login', () => {
    return request(app)
      .get('/user')
      .auth(apiToken, { type: 'bearer' })
      .expect(200);
  });
});
