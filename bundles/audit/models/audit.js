
// require local dependencies
const Model = require('model');

/**
 * create audit model
 */
class Audit extends Model {
  /**
   * construct audit model
   */
  constructor(...args) {
    // run super
    super(...args);

    // bind methods
    this.sanitise = this.sanitise.bind(this);
  }

  /**
   * sanitises acl class
   *
   * @return {*}
   */
  async sanitise() {
    // return object
    const sanitised = {
      id         : this.get('_id') ? this.get('_id').toString() : '',
      by         : this.get('by') ? this.get('by') : '',
      for        : this.get('for') ? this.get('for') : '',
      subject    : this.get('subject') ? this.get('subject') : '',
      way        : this.get('way') ? this.get('way') : '',
      type       : this.get('type') ? this.get('type') : '',
      message    : this.get('message') ? this.get('message') : '',
      created_at : this.get('created_at'),
      updated_at : this.get('updated_at'),
    };

    // return sanitised
    return sanitised;
  }
}

/**
 * export Audit model
 *
 * @type {Audit}
 */
module.exports = Audit;
