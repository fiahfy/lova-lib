export default class DeckUtils {
  static getMana(cards) {
    const fill = _.range(0, 6).every((index) => {
      return !!cards[index];
    });
    return fill ? 30 : 0;
  }
  static getBonusMana(cards) {
    const mana = DeckUtils.getMana(cards);
    if (!mana) {
      return 0;
    }
    const tribeIds = _.range(0, 6).reduce((previous, current) => {
      const card = cards[current];
      if (!card) {
        return previous;
      }
      if (previous.indexOf(card.tribe_id) === -1) {
        previous.push(card.tribe_id);
      }
      return previous;
    }, []);
    switch (tribeIds.length) {
      case 1:
        return 10;
      case 2:
        return 5;
      default:
        return 0;
    }
  }
  static getTotalMana(cards) {
    return _.range(0, 6).reduce((previous, current) => {
      const card = cards[current];
      if (!card) {
        return previous;
      }
      return previous + card.cost;
    }, 0);
  }
  static getHash(cards) {
    const cardIds = _.range(0, 8).map((index) => {
      const card = cards[index];
      if (!card) {
        return 0;
      }
      return card.id;
    });
    console.log(cardIds);
    return window.btoa(JSON.stringify(cardIds));
  }
}
