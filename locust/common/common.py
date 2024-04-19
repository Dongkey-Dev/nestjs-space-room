import traceback
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class Common():
    def handle_request(self, api, url, method, **kwargs):
        with method(url, **kwargs) as response:
            if response.status_code in [200, 201]:
                response.success()
                return response
            else:
                stack_trace = ''.join(traceback.format_stack())
                print('=====================================')
                logger.error(
                    f'{url}\n' + f' {response.status_code} {response.text}\n')
                logger.error(f'Stack Trace:\n{stack_trace}')
                print('=====================================')
                self.delete_user(api)
                self.stop()
                return 0
