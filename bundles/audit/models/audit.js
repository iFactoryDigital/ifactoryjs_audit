
// require local dependencies
const Model  = require('model');
const config = require('config');

/**
 * create audit model
 */
class Audit extends Model {
  /**
   * construct audit model
   */
  constructor() {
    // run super
    super(...arguments);

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
      id : this.get('_id') ? this.get('_id').toString() : null
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
