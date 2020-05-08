
// require daemon
const config  = require('config');
const Daemon  = require('daemon');
const dotProp = require('dot-prop');

// require models
const Audit = model('audit');

// require helpers
const auditHelper    = helper('audit');

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

          await this.eden.hook('audit.addFrom', audit, subject, m);

          // data
          const data = { by, updates, subject, audit };

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

  /**
   * audit hook
   *
   * @param  {req} req
   * @param  {Object} object
   *
   * @pre audit.record
   */
  async record(req, { model, modelold, updates, update , message, client, excloude, no }) {
    console.log('record start');
    await auditHelper._recordAudit(model, modelold, updates, (update && typeof update !== "boolean") ? update : update ? 'Update' : 'Create', message, req.user, model.get(client) ? await model.get(client) : '', excloude, model.get(no));
    console.log('record end');
  }
}

/**
 * create audit daemon
 *
 * @type {AuditDaemon}
 */
module.exports = AuditDaemon;
