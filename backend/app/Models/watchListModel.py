import psycopg2

import dotenv
import os
dotenv.load_dotenv()


class WatchlistModel:
    def __init__(self):
        self.db_url = os.getenv('DATABASE_URL')
        self.connection = psycopg2.connect(self.db_url)
        self.cursor = self.connection.cursor()

    def __del__(self):
        self.connection.close()
        self.cursor.close()

    def addAnimeToWatchlist(self, mal_id, user_id):
        sql = "INSERT INTO watchlist (mal_id, user_id) VALUES (%s, %s)"
        try:
            self.cursor.execute(sql, (mal_id, user_id,))
            self.connection.commit()
            return True
        except Exception as e:
            self.connection.rollback()
            print("Error adding anime to watchlist: + {e}")
            return False

    def removeAnimeFromWatchlist(self, mal_id, user_id):
        sql = "DELETE FROM watchlist WHERE (mal_id, user_id) VALUES (%s, %s)"
        try:
            self.cursor.execute(sql, (mal_id, user_id,))
            self.connection.commit()
            return True
        except Exception as e:
            self.connection.rollback()
            print("Error removing anime from watchlist: + {e}")
            return False

    def getWatchlist(self, user_id):
        sql = "SELECT * FROM watchlist WHERE user_id = %s"
        self.cursor.execute(sql, (user_id,))
        result = self.cursor.fetchall()
        if result:
            return result
        else:
            return None

    def checkWatchlist(self, mal_id, user_id):
        sql = "SELECT * FROM watchlist WHERE (mal_id, user_id) VALUES (%s, %s)"
        self.cursor.execute(sql, (mal_id, user_id,))
        result = self.cursor.fetchone()
        if result:
            return True
        else:
            return False

    def countWatchList(self, user_id):
        sql = "SELECT COUNT(*) FROM watchlist WHERE user_id = %s"
        self.cursor.execute(sql, (user_id,))
        result = self.cursor.fetchone()[0]
        return result
