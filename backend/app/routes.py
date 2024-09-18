import re
from flask import Blueprint, jsonify, request
import requests
import random
from .Models import userModel, tokenModel, animeListModel, watchListModel

userModel = userModel.UserModel()
tokenModel = tokenModel.TokenModel()
animeListModel = animeListModel.AnimelistModel()
watchListModel = watchListModel.WatchlistModel()


def setup_routes(app):
    main = Blueprint('main', __name__)

    # Routes for the anime API
    @main.route('/search/<query>', methods=['GET', 'POST'])
    def search(query):
        url = "https://api.jikan.moe/v4/anime?q=" + query + "&sfw=true"
        response = requests.get(url)
        return response.json()

    @main.route('/season/now', methods=['GET'])
    def searchSeason():
        url = "https://api.jikan.moe/v4/seasons/now?sfw=true"
        response = requests.get(url)
        return response.json()

    @main.route('/api/v1/user/username', methods=['GET'])
    def getUsername():
        token = request.headers.get('Authorization')
        if (validateToken(token)):
            username = userModel.getUsernameFromToken(token)
            if (username == None):
                return "Error getting username", 500
        return username, 200

    @main.route('/api/v1/user/login', methods=['POST'])
    def loginUser():
        try:
            username = request.form['username']
            password = request.form['password']
        except:
            return "Invalid request", 400
        if (validateString(username) == False):
            return "Invalid username", 400
        if (validateString(password) == False):
            return "Invalid password", 400
        if (userModel.doesUserExist(username)):
            if (userModel.doesPasswordMatch(username, password)):
                token = generateToken()
                if (tokenModel.doesTokenExist(token)):
                    tokenModel.deleteToken(token)
                user_id = userModel.getIdFromUsername(username)
                tokenModel.createToken(user_id, token)
                return token, 201
            else:
                return "Invalid password", 403
        else:
            return "Invalid username", 403

    @main.route('/api/v1/user/register', methods=['POST'])
    def registerUser():
        try:
            username = request.form['username']
            password = request.form['password']
        except:
            return "Invalid request", 400
        if (validateString(username) == False):
            return "Invalid username", 400
        if (validateString(password) == False):
            return "Invalid password", 400
        if (userModel.doesUserExist(username)):
            return "User already exists", 403
        userModel.createUser(username, password)
        token = generateToken()
        if (tokenModel.doesTokenExist(token)):
            tokenModel.deleteToken(token)
        user_id = userModel.getIdFromUsername(username)
        tokenModel.createToken(user_id, token)
        return token, 201

    @main.route('/api/v1/user/logout', methods=['POST'])
    def logoutUser():
        token = request.headers.get('Authorization')
        if (validateToken(token)):
            tokenModel.deleteToken(token)
            return "Logged out", 200
        return "Invalid token provided", 403

    # TODO: change just username return to full profile data lol
    @main.route('/api/v1/user/profile', methods=['GET'])
    def getProfile():
        token = request.headers.get('Authorization')
        if (validateToken(token)):
            username = userModel.getUsernameFromToken(token)
            if (username == None):
                return "Error getting username", 500
            profile = userModel.getProfileFromUsername(username)
            if (profile == None):
                return "Error getting profile", 500
            count = watchListModel.countWatchList(
                userModel.getIdFromUsername(username))
            profile['watchlist_count'] = count
            return jsonify(profile), 200
        return "Invalid token provided", 403

    @main.route('/api/v1/user/profile', methods=['PUT'])
    def updateProfile():
        token = request.headers.get('Authorization')
        if (validateToken(token) == False):
            return "Invalid token provided", 403
        username = request.get_json(
        )['username'] if 'username' in request.get_json() else None
        if (username == None):
            return "Invalid request", 400
        if (validateString(username) == False):
            return "Invalid username", 400
        if (username != userModel.getUsernameFromToken(token)):
            if (userModel.doesUserExist(username)):
                return "User already exists", 404
        display_name = request.get_json(
        )['display_name'] if 'display_name' in request.get_json() else None
        if (display_name == None):
            return "Invalid request", 400
        if (userModel.updateProfile(token, username, display_name)):
            return "Profile updated", 200
        return "Error updating profile", 500

    @main.route('/api/v1/watchlist/add', methods=['POST'])
    def addToWatchList():
        token = request.headers.get('Authorization')
        if (validateToken(token)):
            username = userModel.getUsernameFromToken(token)
            if (username == None):
                return "Error getting username", 500

            post_data = {
                "mal_id": request.get_json()['mal_id'] if 'mal_id' in request.get_json() else None,
                "english_name": request.get_json()['english_name'] if 'english_name' in request.get_json() else None,
                "japanese_name": request.get_json()['japanese_name'] if 'japanese_name' in request.get_json() else None,
                "image_url": request.get_json()['image_url'] if 'image_url' in request.get_json() else None,
                "total_episodes": request.get_json()['total_episodes'] if 'total_episodes' in request.get_json() else None,
                "release_date": request.get_json()['release_date'] if 'release_date' in request.get_json() else None,
                "release_type": request.get_json()['release_type'] if 'release_type' in request.get_json() else None,
            }

            if (animeListModel.addAnime(post_data['mal_id'], post_data['english_name'], post_data['japanese_name'], post_data['image_url'], post_data['total_episodes'], post_data['release_date'], post_data['release_type'])):
                user_id = userModel.getIdFromUsername(username)
                if (user_id == None):
                    return "Error getting user id", 500
                if (watchListModel.addAnimeToWatchlist(post_data['mal_id'], user_id)):
                    return "Anime added to watchlist", 201
                else:
                    return "Error adding anime to watchlist", 500
            else:
                return "Error adding anime to database", 500
        return "Invalid token provided", 403

    @main.route('/api/v1/watchlist/remove', methods=['POST'])
    def removeFromWatchList():
        token = request.headers.get('Authorization')
        if (validateToken(token)):
            username = userModel.getUsernameFromToken(token)
            if (username == None):
                return "Error getting username", 500
            mal_id = request.get_json(
            )['mal_id'] if 'mal_id' in request.get_json() else None

            user_id = userModel.getIdFromUsername(username)
            if (user_id == None):
                return "Error getting user id", 500
            if (watchListModel.removeAnimeFromWatchlist(user_id, mal_id)):
                return "Anime removed from watchlist", 200
            else:
                return "Error removing anime from watchlist", 500
        return "Invalid token provided", 403

    @main.route('/api/v1/watchlist', methods=['GET'])
    def getWatchList():
        token = request.headers.get('Authorization')
        if (validateToken(token)):
            username = userModel.getUsernameFromToken(token)
            user_id = userModel.getIdFromUsername(username)
            if (user_id == None):
                return "Error getting user id", 500
            watchlist = watchListModel.getWatchlist(user_id)
            if (watchlist == None):
                return "Error getting watchlist", 500
            return jsonify(watchlist), 200
        return "Invalid token provided", 403

    @main.route('/api/v1/watchlist/check', methods=['POST'])
    def checkWatchList():
        token = request.headers.get('Authorization')
        if (validateToken(token)):
            username = userModel.getUsernameFromToken(token)
            if (username == None):
                return "Error getting username", 500
            user_id = userModel.getIdFromUsername(username)
            if (user_id == None):
                return "Error getting user id", 500
            mal_id = request.get_json(
            )['mal_id'] if 'mal_id' in request.get_json() else None
            if (mal_id == None):
                return "Invalid request", 400
            if (watchListModel.checkWatchlist(user_id, mal_id)):
                return "Anime is in watchlist", 200
            else:
                return "Anime is not in watchlist", 404
        return "Invalid token provided", 403

    @main.route('/api/v1/anime/background/<query>', methods=['GET'])
    def getBackground(query):
        url = "https://kitsu.io/api/edge/anime?filter[text]=" + query
        response = requests.get(url)
        try:
            kitsu_id = response.json()['data'][0]['id']
            cover_image = response.json(
            )['data'][0]['attributes']['coverImage']['original']
        except:
            cover_image = ""
        json_response = {
            "kitsu_id": kitsu_id,
            "cover_image": cover_image
        }
        return json_response, 200

    @main.route('/api/v1/anime/episodes/<kitsu_id>', methods=['GET'])
    def getEpisodes(kitsu_id):
        url = "https://kitsu.io/api/edge/anime/" + \
            kitsu_id + "/episodes?page[limit]=20"
        response = requests.get(url)
        return response.json()

    @main.route('/api/v1/anime/get/<mal_id>', methods=['GET'])
    def getAnime(mal_id):
        url = "https://api.jikan.moe/v4/anime/" + mal_id
        response = requests.get(url)
        return response.json()


    @main.route('/api/v2/anime/search/<query>', methods=['GET'])
    def searchV2(query):
        url = "https://kitsu.io/api/edge/anime?filter[text]=" + query
        response = requests.get(url)
        custom_json = []
        try:
            for i in range(len(response.json()['data'])):
                custom_json.append({
                    "id": response.json()['data'][i]['id'] if 'id' in response.json()['data'][i] else None,
                    "type": response.json()['data'][i]['type'] if 'type' in response.json()['data'][i] else None,
                    "slug": response.json()['data'][i]['attributes']['slug'] if 'slug' in response.json()['data'][i]['attributes'] else None,
                    "englishTitle": response.json()['data'][i]['attributes']['titles']['en'] if 'en' in response.json()['data'][i]['attributes']['titles'] else None,
                    "japaneseTitle": response.json()['data'][i]['attributes']['titles']['ja_jp'] if 'ja_jp' in response.json()['data'][i]['attributes']['titles'] else None,
                    "posterImage": response.json()['data'][i]['attributes']['posterImage']['original'] if 'posterImage' in response.json()['data'][i]['attributes'] else None,
                    "releaseYear": response.json()['data'][i]['attributes']['startDate'] if 'startDate' in response.json()['data'][i]['attributes'] else None,
                    "episodeCount": response.json()['data'][i]['attributes']['episodeCount'] if 'episodeCount' in response.json()['data'][i]['attributes'] else None,
                    "showType": response.json()['data'][i]['attributes']['showType'] if 'showType' in response.json()['data'][i]['attributes'] else None,
                })
        except:
            return "error", 400
        return custom_json, 200

    @main.route('/api/v2/anime/<id>', methods=['GET'])
    def getAnimeV2(id):
        url = "https://kitsu.io/api/edge/anime/" + id
        response = requests.get(url)
        if (response.json()['data'] == None):
            return "error", 400
        if (response.json()['data']['attributes'] == None):
            return "error", 400
        custom_json = {}
        if (response.json()['data']['attributes']['posterImage'] == None):
            custom_json['posterImage'] = ""
        else:
            custom_json['posterImage'] = response.json(
            )['data']['attributes']['posterImage']['original'] or None
        if (response.json()['data']['attributes']['coverImage'] == None):
            custom_json['coverImage'] = ""
        else:
            custom_json['coverImage'] = response.json(
            )['data']['attributes']['coverImage']['original'] or None
        if (response.json()['data']['attributes']['titles'] == None):
            custom_json['titles'] = ""
        else:
            custom_json['englishTitle'] = response.json(
            )['data']['attributes']['titles']['en'] or None
        custom_json['id'] = response.json()['data']['id'] or None
        custom_json['type'] = response.json()['data']['type'] or None
        custom_json['subtype'] = response.json(
        )['data']['attributes']['subtype'] or None
        custom_json['slug'] = response.json(
        )['data']['attributes']['slug'] or None
        custom_json['canonicalTitle'] = response.json(
        )['data']['attributes']['canonicalTitle'] or None
        custom_json['synopsis'] = response.json(
        )['data']['attributes']['synopsis'] or None
        custom_json['averageRating'] = response.json(
        )['data']['attributes']['averageRating'] or None
        custom_json['ageRating'] = response.json(
        )['data']['attributes']['ageRating'] or None
        custom_json['ageRatingGuide'] = response.json(
        )['data']['attributes']['ageRatingGuide'] or None
        custom_json['episodeCount'] = response.json(
        )['data']['attributes']['episodeCount'] or None
        custom_json['episodeLength'] = response.json(
        )['data']['attributes']['episodeLength'] or None
        custom_json['youtubeVideoId'] = response.json(
        )['data']['attributes']['youtubeVideoId'] or None
        custom_json['status'] = response.json(
        )['data']['attributes']['status'] or None
        custom_json['startDate'] = response.json(
        )['data']['attributes']['startDate'] or None
        custom_json['endDate'] = response.json(
        )['data']['attributes']['endDate'] or None
        custom_json['nextRelease'] = response.json(
        )['data']['attributes']['nextRelease'] or None
        custom_json['nsfw'] = response.json(
        )['data']['attributes']['nsfw'] or None
        return custom_json, 200

    @main.route('/api/v2/anime/<id>/episodes', methods=['GET'])
    def getEpisodesV2(id):
        url = "https://kitsu.io/api/edge/anime/" + \
            id + "/episodes?page[limit]=20"
        response = requests.get(url)
        custom_json_list = []
        for i in range(len(response.json()['data'])):
            custom_json = {}
            if (response.json()['data'] == None):
                return "error", 400
            else:
                episode = response.json()['data'][i]
            custom_json["id"] = episode['id'] or None
            custom_json["type"] = episode['type'] or None
            if (response.json()['data'][i]['attributes'] == None):
                return "error", 400
            else:
                custom_json["title"] = episode['attributes']['canonicalTitle'] or None
                custom_json["number"] = episode['attributes']['number'] or None
            if (response.json()['data'][i]['attributes']['thumbnail'] == None):
                custom_json["thumbnail"] = ""
            else:
                custom_json["thumbnail"] = episode['attributes']['thumbnail']['original'] or None
            custom_json_list.append(custom_json)
        return custom_json_list, 200

    app.register_blueprint(main)


def validateToken(token):
    if (token == None):
        return "No token provided", 403
    if (token == ""):
        return "Empty token provided", 403
    if not tokenModel.doesTokenExist(token):
        return "Invalid token provided", 403
    return True


def generateToken():
    token = "token" + str(random.randint(100000, 999999))
    return token


def validateString(string):
    if (re.match("^[A-Za-z][A-Za-z0-9_]{0,49}$", string)):
        return True
    return False
