const R = require("ramda");
const Maybe = require("folktale/maybe");
const Result = require("folktale/result");

const model = {
  user: "",
  decisions: []
};

const username = "jake";

const isNothing = value => value == undefined || value == null;

const maybe = value => {
  if (isNothing(value)) {
    return Maybe.Nothing();
  }
  return Maybe.Just(value);
};

const tupleHeadTail = name => {
  return [R.head(name), R.tail(name)];
};

const toUpperFirst = tuple => {
  return tuple.map((value, index) => {
    if (index === 0) {
      return R.toUpper(value);
    }
    return value;
  });
};

const concatHeadTail = R.reduce((a, b) => R.concat(a, b), "");

const matchWith = m =>
  m.matchWith({
    Just: x => x,
    Nothing: () => "nothing"
  });

const formatUsername = R.compose(
  matchWith,
  R.map(concatHeadTail),
  R.map(toUpperFirst),
  R.map(tupleHeadTail),
  R.map(R.toLower),
  R.map(R.trim),
  maybe
);

result = formatUsername(username);
console.log(result);
