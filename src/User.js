const { fetch } = require('undici')
const Item = require('./Item')

/**
 * Represents a user
 */
class User {
  /**
   * @param {Client} client The client that instantiated the object
   * @param {Object} raw The raw data of the user
   */
  constructor(client, raw) {
    Object.defineProperty(this, 'client', { value: client })
    this.coins = raw.coins
    this.creation_date = new Date(raw.creation_date)
    this.current_foe = raw.current_foe
    this.hp = raw.current_hp
    this.maxHP = raw.maximum_hp
    this.items = raw.inventory.map(item => new Item(this.client, item))
    this.items.current = this.items.find(item => item.id === raw.currently_equipped_weapon.id)
    this.name = raw.display_name
    this.inBattle = raw.in_battle
    this.location = raw.in_game_location
    this.roles = raw.roles
    this.warnings = raw.warnings
    this.xp = raw.xp
  }
  /**
   * Refetches the user
   * @returns {Promise<User>}
   */
  async refetch() {
    let raw = await fetch(`https://rpg.dart.gay/api/user/${this.name}`).then(res => res.json())

    this.coins = raw.coins
    this.creation_date = new Date(raw.creation_date)
    this.current_foe = raw.current_foe
    this.hp = raw.current_hp
    this.maxHP = raw.maximum_hp
    this.items = raw.inventory.map(item => new Item(this.client, item))
    this.items.current = this.items.find(item => item.id === raw.currently_equipped_weapon.id)
    this.name = raw.display_name
    this.inBattle = raw.in_battle
    this.location = raw.in_game_location
    this.roles = raw.roles
    this.warnings = raw.warnings
    this.xp = raw.xp

    return this
  }
  /**
   * Get a user by name.
   * @param {string} name The name of the user.
   * @param {Client} [client] The client to use.
   * @returns {Promise<User>}
   */
  static async getUser(name, client = null) {
    let raw = await fetch(`https://rpg.dart.gay/api/user/${name}`).then(res => res.json())

    return new User(client, raw)
  }

}


module.exports = User