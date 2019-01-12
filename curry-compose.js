const R = require("ramda");

// create and shuffle deck

const suits = ["hearts", "spades", "clubs", "diamonds"];
const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "K", "Q", "A"];

const toTuple = R.curry((a, b) => [a, b]);
const combine = R.compose(
  R.concat,
  R.map
);

const deck = (suits, values) =>
  R.reduce(
    (deck, suit) => {
      return combine(toTuple(suit), values)(deck);
    },
    [],
    suits
  );

const shuffle = deck => {
  const newDeck = R.clone(deck);
  for (let i = 0; i < 1000; i++) {
    let card1 = Math.floor(Math.random() * newDeck.length);
    let card2 = Math.floor(Math.random() * newDeck.length);
    let temp = newDeck[card1];

    newDeck[card1] = newDeck[card2];
    newDeck[card2] = temp;
  }
  return newDeck;
};

const readyGameDeck = R.compose(
  shuffle,
  deck
);

const gameDeck = readyGameDeck(suits, values);

// deal cards to players
const players = [
  { name: "player1", cards: [], points: 0, action: "" },
  { name: "player2", cards: [], points: 0, action: "" }
];

const _dealCard = R.curry((gameDeck, player) => {
  player.cards = R.append(gameDeck.pop(), player.cards);
  return player;
});

const determinePoints = card => {
  const value = card[1];
  if (typeof value === "number") {
    return value;
  } else if (value === "J" || value === "Q" || value === "K") {
    return 10;
  } else if (value === "A") {
    return 11;
  }
};

const setPoints = player => {
  player.points = R.reduce(
    (a, b) => R.add(a, b),
    0,
    R.map(determinePoints, player.cards)
  );
  return player;
};

const dealCard = R.compose(
  setPoints,
  _dealCard(gameDeck)
);

const dealCardToEach = players => {
  return R.map(dealCard, players);
};

const dealHand = R.compose(
  dealCardToEach,
  dealCardToEach
);

dealHand(players);

// gameplay

const turn = player => {
  switch (player.action) {
    case "hit":
      dealCard(player);
      return player;
    case "stay":
      return player;
  }
};

const checkPoints = player => {
  if (player.points > 21) {
    return false;
  }
  return true;
};

const _hit = player => {
  player.action = "hit";
  return player;
};

const hit = R.compose(
  checkPoints,
  turn,
  _hit
);

const _stay = player => {
  player.action = "stay";
  return player;
};

const stay = R.compose(
  checkPoints,
  turn,
  _stay
);

const player1Turn = hit(players[0]);
const player2Turn = hit(players[1]);

console.log(players[0], player1Turn);
console.log(players[1], player2Turn);
