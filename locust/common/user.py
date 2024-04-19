import logging
import random
import string

from locust import SequentialTaskSet

from .common import Common

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class CreateTestUser(SequentialTaskSet, Common):
    headers: dict = {}
    user_id: str
    user_uuid: str
    user_email: str
    token: str

    def create_user(self, target_host):
        self.email = f"{self.get_random_string(10)}@email.com"
        body = {
            'email': self.email,
            'password': "test1234",
            'firstName': 'test',
            'lastName': 'user',
            'profileImage': 'https://www.google.com',
        }

        with self.client.post(f'{target_host}/user', catch_response=True, json=body, headers=self.headers) as response3:
            if response3.status_code in [200, 201]:
                response3.success()
                data3 = response3.json()
                # self.user_id = data3['data']['userId']
                # logger.info(f'User ID: {self.user_id}')
                
    def login_user(self, target_host):
        login_body = {
            "email": self.email,
            "password": "test1234"
        }
        with self.client.post(f'{target_host}/user/login', catch_response=True, json=login_body, headers=self.headers) as response3:
            if response3.status_code in [200, 201]:
                response3.success()
                data3 = response3.json()
                self.token = data3['accessToken']
                self.headers = {'Authorization': f'Bearer {self.token}'}
                # logger.info(f'User ID: {self.user_id}')
                
    def get_user_info(self, target_host):
        with self.client.get(f'{target_host}/user', catch_response=True, headers=self.headers) as response3:
            if response3.status_code in [200, 201]:
                response3.success()
                # logger.info(f'User ID: {self.user_id}')
                
    def create_space(self, target_host):
        create_space_body = {
            "name": "교실",
            "logo": "교실.png",
            "roleList": [{"name": "조교", "permission":"admin"}, {"name": "학생", "permission": "member"}]
        }
        with self.client.post(f'{target_host}/space', catch_response=True, json=create_space_body, headers=self.headers) as response3:
            if response3.status_code in [200, 201]:
                response3.success()
                self.headers = {'Authorization': f'Bearer {self.token}'}        

    def get_random_string(self, length):
        letters = string.ascii_lowercase
        result_str = ''.join(random.choice(letters) for i in range(length))
        return result_str

    def stop(self):
        self.user.environment.runner.quit()
