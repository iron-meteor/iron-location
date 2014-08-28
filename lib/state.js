var Url = Iron.Url;

State = function (url, options) {
  _.extend(this, Url.parse(url), {options: options});
};

State.prototype.equals = function (other) {
  if (!other)
    return false;

  if (!(other instanceof State))
    return false;

  if (other.pathname == this.pathname &&
     other.search == this.search &&
     other.hash == this.hash)
    return true;

  return false;
};

State.prototype.isCancelled = function () {
  return !!this._isCancelled;
};

State.prototype.cancelUrlChange = function () {
  this._isCancelled = true;
};
