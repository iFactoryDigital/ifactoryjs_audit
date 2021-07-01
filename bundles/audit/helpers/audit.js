
// import dependencies
const Helper = require('helper');
const dotProp = require('dot-prop');

// require models
const Audit   = model('audit');

/**
 * extend audit helper
 *
 * @extends {helper}
 */
class AuditHelper extends Helper {
  /**
   * construct audit helper
   */
  constructor() {
    // run super
    super();
    
    this._recordAudit = this._recordAudit.bind(this);
  }

  /**
   * logs balance transaction
   *
   */
  async _recordAudit(req, model, origin, updates, subject, message, user=null, client=null, exclude=[], no) {
    const audit = new Audit();

    if (!message && model.__id && updates) {
      message = `[Updated] `;
      // updates
      const updateCheck = (Array.from(updates.values())).filter(u => u !== 'updated_at' && (exclude.length === 0 || !exclude.find(item => item === u)));

      // set set
      for (const key of updateCheck) {
        const originvalue =  dotProp.get(origin.get(), key);
        const modify      =  dotProp.get(model.get(), key);

        if (Array.isArray(originvalue) && originvalue.length > 0) {
          for (let i = 0; i < originvalue.length; i++) {
            if (originvalue !== null && typeof originvalue === 'object') {
              for (const key_ in originvalue[i]) {
                if (modify && modify[i] && modify[i][key_] && originvalue[i][key_] !== modify[i][key_]) {
                  console.log(originvalue[i][key_]+' '+modify[i][key_]);
                  if (typeof originvalue[i][key_] !== 'object') {
                    message += ` ${key_} field: from ${originvalue[i][key_]} to ${modify[i][key_]}`;
                    audit.set(`updates.${key_}`, `from ${originvalue[i][key_]} to ${modify[i][key_]}`);
                  }
                }
              }
            }
          }
        } else if (originvalue !== null && typeof originvalue === 'object') {
          for (const key_ in originvalue) {
            if (modify && originvalue[key_] !== modify[key_]) {
              message += ` ${key_} field: from ${originvalue[key_]} to ${modify[key_]}`;
            }
          }
        } else {
          if (originvalue !== modify) {
            message += ` ${key} field: from ${originvalue} to ${modify}`;
            audit.set(`updates.${key}`, `from ${originvalue} to ${modify}`);
          }
        }
      }
      if (message === `[Updated] ` || !message) return ;
    }
    else if ((subject && subject === 'Create' && !message) || (!message && !model.__id)) {
      message = `[Created] ${no ? no : model.get('_id')}`;
    } else if ((subject && subject === 'Remove' && !message)) {
      message = `[Removed] ${no ? no : model.get('_id')}`;
    }

    if (!message) return ;
    audit.set('by'      , user);
    audit.set('for'     , client);
    audit.set('byname'  , await user.get('username') ? await user.get('username') : await client.get('name') ? await client.get('name') : await user.get('first') ? await user.get('first') + ''+await user.get('last') : '');
    audit.set('forname' , client ? client.get && client.get('name') ? await client.get('name') : await client.get('first') ? await client.get('first') + ''+await client.get('last') : '' : '');
    audit.set('type'    , model.constructor.name);
    audit.set('way'     , subject);
    audit.set('subject' , subject);
    audit.set('targetno', no ? no : model.get('_id'));
    audit.set('targetid', model.get('_id'));
    audit.set('message' , message);

    // save entry
    await audit.save();
  }
}

/**
 * export built audit helper
 *
 * @type {AuditHelper}
 */
module.exports = new AuditHelper();