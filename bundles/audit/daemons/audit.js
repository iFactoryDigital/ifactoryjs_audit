
// require daemon
const config  = require('config');
const Daemon  = require('daemon');
const dotProp = require('dot-prop');

// require models
const Audit = model('audit');

/**
 * create audit daemon class
 *
 * @extends Daemon
 */
class AuditDaemon extends Daemon {
  /**
   * construct audit daemon
   */
  constructor(...args) {
    // run super
    super(...args);

    // get audit models
    const models = (config.get('audit.models') || Object.keys(cache('models'))).filter(m => m !== 'audit');

    // add hook
    models.forEach((m) => {
      /**
       * create model monitor method
       *
       * @param  {String} way
       * @param  {String} type
       *
       * @return {Promise}
       */
      const createMonitor = (way, type) => {
        // return function
        return async (subject, { by, updates }) => {
          // create audit entity
          const audit = new Audit({
            by,
            way,
            type,
            subject,
            updates : {},
            // eslint-disable-next-line no-nested-ternary
            message : `${(way === 'create' ? 'Created' : (way === 'update' ? 'Updated' : 'Removed'))} ${subject.constructor.name}`,
          });

          // updates
          const updateCheck = (way === 'update' ? Array.from(updates.values()) : []).filter(u => u !== 'updated_at');

          // don't audit non-changes
          if (way === 'update' && !updateCheck.length) return;

          // data
          const data = { by, updates, subject };

          await this.eden.hook('audit.addFrom', audit, subject, m);

          // await audit check hook
          await this.eden.hook('audit.check', data, () => {
            // prevent
            if (data.prevent) return;

            // set set
            for (const key of updateCheck) {
              // set value
              audit.set(`updates.${key}`, dotProp.get(subject.get(), key));
            }

            // save audit
            audit.save();
          });
        };
      };

      // create hook
      this.eden.pre(`${m}.update`, createMonitor('update', m));
      this.eden.pre(`${m}.remove`, createMonitor('remove', m));
      this.eden.post(`${m}.create`, createMonitor('create', m));
    });
  }
}

/**
 * create audit daemon
 *
 * @type {AuditDaemon}
 */
module.exports = AuditDaemon;
