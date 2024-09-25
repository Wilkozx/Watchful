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

    def addAnimeToWatchlist(self, id, user_id, tag_id, englishName, japaneseName, image, episodes, release_date, release_type):
        sql = "INSERT INTO watchlist (mal_id, user_id, tag_id, english_name, japanese_name, image_url, total_episodes, release_date, release_type) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
        try:
            self.cursor.execute(sql, (id, user_id, tag_id, englishName,
                                japaneseName, image, episodes, release_date, release_type,))
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
        json_data = []
        for row in result:
            json_data.append({
                "result_id": row[0],
                "id": row[1],
                "tag_id": row[2],
                "english_name": row[3],
                "japanese_name": row[4],
                "image_url": row[5],
                "total_episodes": row[6],
                "release_date": row[7],
                "release_type": row[8]
            })
        if result:
            return json_data
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
