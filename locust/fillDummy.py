from common.user import CreateTestUser
from config.url import *

from locust import HttpUser, between, task

api = api_local

class fillDummy(CreateTestUser):
    @task
    def create_test_user(self):
        self.create_user(api)
        
    @task
    def login_test_user(self):
        self.login_user(api)
        
    @task
    def get_user_test_info(self):
        self.get_user_info(api)
        
    @task
    def create_test_space(self):
        self.create_space(api)        
class User(HttpUser):
    wait_time = between(1, 2)
    tasks = [fillDummy]
