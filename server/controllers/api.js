const axios = require('axios')

/**
 * GET /api/steam
 * Steam API example.
 */
exports.getSteam = async (req, res, next) => {
  const steamId = req.user.steam
  const params = { l: 'english', steamid: steamId, key: process.env.STEAM_KEY }

  // makes a url with search query
  const makeURL = (baseURL, params) => {
    const url = new URL(baseURL)
    const urlParams = new URLSearchParams(params)
    url.search = urlParams.toString()
    return url.toString()
  }
  // get the list of the recently played games, pick the most recent one and get its achievements
  const getPlayerAchievements = () => {
    const recentGamesURL = makeURL(
      'http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/',
      params
    )
    return axios
      .get(recentGamesURL)
      .then(({ data }) => {
        // handle if player owns no games
        if (Object.keys(data.response).length === 0) {
          return null
        }
        // handle if there are no recently played games
        if (data.response.total_count === 0) {
          return null
        }
        params.appid = data.response.games[0].appid
        const achievementsURL = makeURL(
          'http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/',
          params
        )
        return axios.get(achievementsURL).then(({ data }) => {
          // handle if there are no achievements for most recent game
          if (!data.playerstats.achievements) {
            return null
          }
          return data.playerstats
        })
      })
      .catch((err) => {
        if (err.response) {
          // handle private profile or invalid key
          if (err.response.status === 403) {
            return null
          }
        }
        return Promise.reject(
          new Error('There was an error while getting achievements')
        )
      })
  }
  const getPlayerSummaries = () => {
    params.steamids = steamId
    const url = makeURL(
      'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/',
      params
    )
    return axios
      .get(url)
      .then(({ data }) => data)
      .catch(() =>
        Promise.reject(
          new Error('There was an error while getting player summary')
        )
      )
  }
  const getOwnedGames = () => {
    params.include_appinfo = 1
    params.include_played_free_games = 1
    const url = makeURL(
      'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/',
      params
    )
    return axios
      .get(url)
      .then(({ data }) => data)
      .catch(() =>
        Promise.reject(
          new Error('There was an error while getting owned games')
        )
      )
  }
  try {
    const playerstats = await getPlayerAchievements()
    const playerSummaries = await getPlayerSummaries()
    const ownedGames = await getOwnedGames()
    res.render('api/steam', {
      title: 'Steam Web API',
      ownedGames: ownedGames.response,
      playerAchievements: playerstats,
      playerSummary: playerSummaries.response.players[0],
    })
  } catch (err) {
    next(err)
  }
}
