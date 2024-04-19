import * as request from 'supertest';
import { ADMIN_EMAIL, ADMIN_PASSWORD, API_URL } from 'src/util/test/contest';

describe('Space Module', () => {
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

  it('POST /space', () => {
    return request(app)
      .post('/space')
      .auth(apiToken, { type: 'bearer' })
      .send({
        name: '교실',
        logo: '교실.png',
        roleList: [
          { name: '조교', permission: 'admin' },
          { name: '학생', permission: 'member' },
        ],
      })
      .expect(201)
      .then(({ body }) => {
        console.log(body);
      });
  });

  it('GET /space', () => {
    return request(app)
      .get('/space/join')
      .auth(apiToken, { type: 'bearer' })
      .expect(200);
  });

  it('POST /space/join', () => {
    return request(app)
      .post('/space/join')
      .auth(apiToken, { type: 'bearer' })
      .send({ inviteCode: '6NX8CE0x' })
      .expect(400);
  });
});
