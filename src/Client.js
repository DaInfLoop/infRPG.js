const { fetch } = require('undici');
const Item = require('./Item');

class Client {
  /**
   * @param {string} sessionID - The session ID of the user
   * @param {object} clientOpts - The options for the client
   */
  constructor(sessionID, clientOpts = {}) {
      this.options = clientOpts;
      Object.defineProperty(this, 'sessionID', { value: sessionID })
      this.user = null; // With the current setup of infRPG API you can't get the current authenticated user
  }
  /**
   * Open a lootbox
   * @returns {Promise<{lootboxes: number, chosen_item: Item}>}
   */
  async openLootbox() {
      if (!this.sessionID) throw new Error('unauthenticated')

      let lootboxInfo = await fetch("https://rpg.dart.gay/gamble/api", {
          headers: {
              Cookie: `session=${this.sessionID}`,
          },
          body: JSON.stringify({
              command: "roll"
          }),
          method: "POST"
      }).then(response => response.json());

      if (lootboxInfo.msg == "noboxes") {
          throw new Error('you have no lootboxes');
      }

      let item = (await Item.allItems(this)).filter(item => item.name == lootboxInfo.pick && item.rarity == lootboxInfo.pick_rarity);

      return {
          lootboxes: lootboxInfo.lootboxes,
          chosen_item: item[0]
      }
  }

  /**
   * Buy a lootbox
   * @returns {Promise<Object>}
   */
  async buyLootbox() {
      // Currently, you can only buy 1 lootbox at a time
      if (!this.sessionID) throw new Error('unauthenticated')

      let lootboxBuy = await fetch("https://rpg.dart.gay/gamble/api", {
          headers: {
              Cookie: `session=${this.sessionID}`,
          },
          body: JSON.stringify({
              command: "buy"
          }),
          method: "POST"
      }).then(response => response.json());

      return lootboxBuy;
  }

  /**
   * Claim a promocode
   * @param {string} promocode
   * @returns {Promise<boolean>}
   */
  async claimPromocode(promocode) {
    if (!this.sessionID) throw new Error('unauthenticated')

    let promocodeClaim = await fetch("https://rpg.dart.gay/promo-submit", {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `code=${promocode}`,
      method: "POST"
    }).then(response => response.text());

    if (promocodeClaim == "code redeemed :)") {
      return true;
    } else {
      return false;
    }
  }

}


module.exports = Client