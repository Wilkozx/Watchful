from app import create_app
from app.middleware import loggerMiddleware

app = create_app()
app.wsgi_app = loggerMiddleware(app.wsgi_app)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
