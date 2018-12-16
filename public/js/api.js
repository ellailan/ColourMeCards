const api = {};

api.reqJson = async function (url, method = 'GET', data = null) {
  // set fetch options
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  };

  // add body if content exists
  if (data) {
    options.body = JSON.stringify(data);
  }

  // await the fetch from the url
  const res = await fetch(url, options);

  // await until the json promise is resolved
  const json = await res.json();
  return json;
};


api.getScores = async function (cb = null) {
  const scores = await api.reqJson('/v1/scores');
  // cb
  return cb ? cb(scores) : null;
};

api.setScore = async function (options, cb) {
  const success = await api.reqJson('/v1/scores/new', 'POST', options);
  // cb
  return cb ? cb(success) : null;
};

api.makeUser = async function (cb) {
  const user = await api.reqJson('/v1/users/new', 'POST');
  // cb
  return cb ? cb(user) : null;
};
