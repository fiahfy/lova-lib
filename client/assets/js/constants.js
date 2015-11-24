import keyMirror from 'keymirror';

export default {
  ActionTypes: keyMirror({
    CREATE: null,
    LOADED: null,
    FETCH_SERVANTS: null,
    FETCH_PRIZES: null,
    DRAW_PRIZE_LOTS: null
  })
};
