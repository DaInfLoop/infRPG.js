const { fetch } = require('undici')

/**
 * Represents an item
 */
class Item {
  /**
   * @param {Object} rawData The raw item data
   * @param {Client} client The client
   */
  constructor(rawData, client) {
    Object.defineProperty(this, 'client', { value: client })
    this.description = rawData.desc;
    this.name = rawData.name;
    this.rarity = rawData.rarity;
    this.type = rawData.type;
    this.id = rawData.id;    
    if (rawData.type == "weapon") {
      this.weapon_type = rawData.weapon_type;
      this.dmg = [rawData.DMG_min, rawData.DMG_max];
      this.ability = rawData.ability ? {
        name: rawData.ability,
        chance: rawData.ability_chance,
        damage: rawData.ability_damage,
        message: rawData.ability_message
      } : null;
    } else if (rawData.type == "armor") {
      this.armor_amount = rawData.armor_amount;
    } else if (rawData.type == "medicine") {
      this.heal_amount = rawData.heal_amount;
    } else if (rawData.type == "ingredient") {
      this.drop_rate = rawData.drop_rate;
      this.drops = rawData.from;
    } else if (rawData.type == "pet") {
      this.abiltity = rawData.ability ? {} : null;
      this.atk = rawData.atk;
      this.def = rawData.def;
      this.level = rawData.level;
    } else if (rawData.type == "tool") {
      this.craftable = rawData.craftable;
      this.efficiency = rawData.efficiency;
      this.miningLevel = rawData.mining_level;
      this.miningLevelMax = rawData.mining_level_max;
      this.upgradable = rawData.upgradeable;
      this.toolType = rawData.tool_type;
      this.recipe = rawData.recipe;
    } else if (rawData.type == "lootbox") {
      this.craftable = rawData.craftable;
      this.lootboxType = rawData.lootbox_type;
      this.upgradable = rawData.upgradeable;
    } else {
      throw new Error(`unknown data type "${this.type}" - this may be a new item type, please wait for a lib update`)
    }  
  }
  /**
   * Fetches all items
   * @param {Client} client The client
   * @returns {Promise<Item[]>}
   */
  static async allItems(client = null) {
    return await fetch(`https://rpg.dart.gay/items`).then(res => res.json()).then(data => {
      let e = []
      Object.values(data).forEach((item, index) => {
        if (item.type == undefined) return;
        item.id = `${index}`
        e.push(new Item(item, client))
      })

      return e
    })
  }
}


module.exports = Item