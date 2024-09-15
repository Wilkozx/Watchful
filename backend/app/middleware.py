import datetime


class loggerMiddleware:
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        current_time = datetime.datetime.now().strftime("%H:%M:%S")
        print(
            f"{[current_time]} Request method: {environ['REQUEST_METHOD']} | Request path: {environ['PATH_INFO']}")
        return self.app(environ, start_response)
