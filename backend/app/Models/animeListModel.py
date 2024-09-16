import psycopg2

import dotenv
import os
dotenv.load_dotenv()


class AnimelistModel:
    def __init__(self):
        self.db_url = os.getenv('DATABASE_URL')
        self.connection = psycopg2.connect(self.db_url)
        self.cursor = self.connection.cursor()

    def __del__(self):
        self.connection.close()
        self.cursor.close()

    def addAnime(self, mal_id, english_name, japanese_name, image_url, total_episodes, release_date, release_type):
        sql = "INSERT INTO animelist (mal_id, english_name, japanese_name, image_url, total_episodes, release_date, release_type) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        try:
            self.cursor.execute(sql, (mal_id, english_name, japanese_name,
                                      image_url, total_episodes, release_date, release_type,))
            self.connection.commit()
            return True
        except Exception as e:
            self.connection.rollback()
            print("Error adding anime to database: + {e}")
            return False

    def removeAnime(self, mal_id):
        sql = "DELETE FROM animelist WHERE mal_id = %s"
        try:
            self.cursor.execute(sql, (mal_id,))
            self.connection.commit()
            return True
        except Exception as e:
            self.connection.rollback()
            print("Error removing anime from database: + {e}")
            return False

    def doesAnimeExist(self, mal_id):
        sql = "SELECT * FROM animelist WHERE mal_id = %s"
        self.cursor.execute(sql, (mal_id,))
        result = self.cursor.fetchone()
        if result:
            return True
        else:
            return False
