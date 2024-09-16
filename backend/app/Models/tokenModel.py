import psycopg2

import dotenv
import os
dotenv.load_dotenv()


class TokenModel:
    def __init__(self):
        self.db_url = os.getenv('DATABASE_URL')
        self.connection = psycopg2.connect(self.db_url)
        self.cursor = self.connection.cursor()

    def __del__(self):
        self.connection.close()
        self.cursor.close()

    def createToken(self, user_id, token):
        sql = "INSERT INTO tokens (user_id, token) VALUES (%s, %s)"
        try:
            self.cursor.execute(sql, (user_id, token,))
            self.connection.commit()
            return True
        except Exception as e:
            self.connection.rollback()
            print(f"Error creating token: {token} + {e}")
            return False

    def deleteToken(self, token):
        sql = "DELETE FROM tokens WHERE token = %s"
        try:
            self.cursor.execute(sql, (token,))
            self.connection.commit()
            return True
        except Exception as e:
            self.connection.rollback()
            print(f"Error deleting token: {token} + {e}")
            return False

    def doesTokenExist(self, token):
        sql = "SELECT * FROM tokens WHERE token = %s"
        self.cursor.execute(sql, (token,))
        result = self.cursor.fetchone()
        if result:
            return True
        else:
            return False
