import datetime
import psycopg2

import dotenv
import os
dotenv.load_dotenv()


class UserModel:
    def __init__(self):
        self.db_url = os.getenv('DATABASE_URL')
        self.connection = psycopg2.connect(self.db_url)
        self.cursor = self.connection.cursor()

    def __del__(self):
        self.connection.close()
        self.cursor.close()

    def createUser(self, username, password):
        sql = "INSERT INTO users (user_name, password, join_date) VALUES (%s, %s, %s)"
        try:
            self.cursor.execute(
                sql, (username, password, datetime.datetime.now(),))
            self.connection.commit()
            return True
        except Exception as e:
            self.connection.rollback()
            print(f"Error creating user: {username} + {e}")
            return False

    def deleteUser(self, username):
        sql = "DELETE FROM users WHERE user_name %s"
        try:
            self.cursor.execute(sql, (username,))
            self.connection.commit()
            return True
        except Exception as e:
            self.connection.rollback()
            print(f"Error deleting user: {username} + {e}")
            return False

    def getUsernameFromToken(self, token):
        sql = "SELECT user_name FROM users WHERE user_id = (SELECT user_id FROM tokens WHERE token = %s)"
        self.cursor.execute(sql, (token,))
        result = self.cursor.fetchone()
        if result == None:
            return None
        else:
            username = result[0]
            return username

    def getIdFromUsername(self, username):
        sql = "SELECT user_id FROM users WHERE user_name = %s"
        self.cursor.execute(sql, (username,))
        result = self.cursor.fetchone()[0]
        return result

    def getProfileFromUsername(self, username):
        sql = "SELECT user_name, display_name, join_date FROM users WHERE user_name = %s"
        self.cursor.execute(sql, (username,))
        result = self.cursor.fetchone()
        jsonResult = {
            "username": result[0],
            "display_name": result[1],
            "join_date": result[2].strftime("%b %d, %Y")
        }
        return jsonResult

    def updateProfile(self, token, username, display_name):
        sql = "UPDATE users SET display_name = %s, user_name = %s WHERE user_id = (SELECT user_id FROM tokens WHERE token = %s)"
        try:
            self.cursor.execute(sql, (display_name, username, token,))
            self.connection.commit()
            return True
        except Exception as e:
            self.connection.rollback()
            print(f"Error updating profile: {username} + {e}")

    def doesUserExist(self, username):
        sql = "SELECT * FROM users WHERE user_name = %s"
        self.cursor.execute(sql, (username,))
        result = self.cursor.fetchone()
        if result:
            return True
        else:
            return False

    def doesPasswordMatch(self, username, password):
        sql = "SELECT password FROM users WHERE user_name = %s"
        self.cursor.execute(sql, (username,))
        result = self.cursor.fetchone()[0]
        if result == password:
            return True
        else:
            return False
