/**
 * @typedef {Object} GameSettings
 * @property {Number} maxGridSize
 * @property {Number} minGridSize
 * @property {Number} gridSize
 * @property {Number} maxSideLength
 * @property {Number} minSideLength
 * @property {Number} sideLength
 * @property {Number} gameMode
 */

/**
 * @typedef {Object} GamemodeInfo
 * @property {Number} id - Gamemode ID
 * @property {String} scene - Gamemode scene
 * @property {String} text - Gamemode display text
 */

/**
 * @typedef {Object} Gamemode
 * @property {Object} SOLO - Solo
 * @property {Number} SOLO.id
 * @property {String} SOLO.scene
 * @property {String} SOLO.text
 * @property {Number} TWO_PLAYER - Two Player
 * @property {Number} TWO_PLAYER.id
 * @property {String} TWO_PLAYER.scene
 * @property {String} TWO_PLAYER.text
 * @property {Number} RACE - Race
 * @property {Number} RACE.id
 * @property {String} RACE.scene
 * @property {String} RACE.text
 * @property {Number} CHASE - Chase
 * @property {Number} CHASE.id
 * @property {String} CHASE.scene
 * @property {String} CHASE.text
 * @property {Number} ESCAPE - Escape
 * @property {Number} ESCAPE.id
 * @property {String} ESCAPE.scene
 * @property {String} ESCAPE.text
 */
export const GAMEMODES = {
  SOLO: {
    id: 0,
    scene: 'GamemodeSolo',
    text: 'Solo'
  },
};

/**
 *
 * @param {Number} id - The gamemode ID
 * @returns {GamemodeInfo}
 */
export function getGamemodeInfo(id) {
  if (id === 0) {
    return GAMEMODES.SOLO;
  } else {
    return {};
  }
}

/**
 * Returns custom dimensions for the game instance
 * @param {Phaser.Game} game - The Phaser Game object
 * @returns {Object} - The custom dimensions object
 */
export function getDimensions(game) {
  const screenLength = game.config.width;
  return {
    screenLength,
    screenSpaceUnit: screenLength / 20,
    screenCenter: screenLength / 2,
    textSize1: screenLength / 10,
    textSize2: screenLength / 15,
    textSize3: screenLength / 18,
    textSize4: screenLength / 22
  };
}

/**
 * The initial settings for the game (game configs)
 * @returns {GameSettings} - The initial/default settings for the game configurations
 */
export function initSettings() {
  return {
    maxGridSize: 100,
    minGridSize: 4,
    gridSize: 48,
    maxSideLength: 15,
    minSideLength: 1,
    sideLength: 3,
    gameMode: GAMEMODES.SOLO.id
  };
}
