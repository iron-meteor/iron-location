var Url = Iron.Url;

State = function (url, state) {
  this.state = state || {};
  _.extend(this, Url.parse(url));
};

State.prototype.equals = function (other) {
  if (!other)
    return false;

  if (!(other instanceof State))
    return false;

  if (this.originalUrl == other.originalUrl && EJSON.equals(this.state, other.state))
    return true;

  return false;
};

State.prototype.isCancelled = function () {
  return !!this._isCancelled;
};

State.prototype.cancelUrlChange = function () {
  this._isCancelled = true;
};
