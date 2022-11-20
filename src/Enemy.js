const { fetch } = require('undici')

/**
 * Represents an enemy
 */
class Enemy {
  /**
   * @param {Client} client The client instance
   * @param {Object} raw The raw enemy data
   */
  constructor(client, raw) {
    Object.defineProperty(this, 'client', { value: client })
    this.name = raw.name
    this.levelRange = raw.lvl_range
    this.hp = raw.HP
    this.xpGain = [raw.XP_min, raw.XP_max]
    this.attacks = raw.attacks.map(attack => {
      return {
        damage: [attack.DMG_min, attack.DMG_max],
        ability: attack.ability,
        name: attack.name
      }
    })
    this.description = raw.desc
  }
}
