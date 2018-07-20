module.exports = class PullRequest {
  constructor(prNum, prName, prLink, createdDate, updatedDate, kind, status, isLgtm, isApproved, responsibleSig, isMerged, author){

      this._prNum = prNum;
      this._prName = prName;
      this._prLink = prLink;
      this._createdDate = createdDate;
      this._updatedDate = updatedDate;
      this._kind = kind;
      this._status = status;
      this._isLgtm = isLgtm;
      this._isApproved = isApproved;
      this._responsibleSig = responsibleSig;
      this._isMerged = isMerged;
      this._author = author;
  }
};