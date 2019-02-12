// create config object
const config = {};

// default company config
config.audit = {
  fields : [
    {
      name   : 'by',
      grid   : true,
      type   : 'user',
      label  : 'By',
      format : (col) => {
        // return name
        return col ? `<a href="/admin/user/${col.get('_id').toString()}/update">${col.name()}</a>` : '<i>N/A</i>';
      },
      filter : async (param, grid) => {
        // require dependencies
        const User = model('user');
        const escapeRegex = require('escape-string-regexp');

        // get users
        const users = await User.match('username', new RegExp(escapeRegex(param.toString().toLowerCase()), 'i')).find();

        // map user
        grid.in('user.id', users.map(user => user.get('_id').toString()));
      },
    },
    {
      name   : 'subject',
      grid   : true,
      type   : 'text',
      label  : 'Subject',
      format : (col) => {
        // return name
        return col ? `${col.constructor.name} #${col.get('_id').toString()}` : '<i>N/A</i>';
      },
      filter : async (param, grid) => {
        // require dependencies
        const escapeRegex = require('escape-string-regexp');

        // map user
        grid.match('subject.id', new RegExp(escapeRegex(param.toString().toLowerCase()), 'i'));
      },
    },
    {
      name  : 'way',
      grid  : true,
      type  : 'text',
      label : 'Way',
    },
    {
      name  : 'type',
      type  : 'text',
      grid  : true,
      label : 'Model',
    },
    {
      name   : 'message',
      grid   : true,
      type   : 'text',
      label  : 'Message',
      format : (col, row) => {
        // add append
        const append = row.get('way') === 'update' ? ` fields "${Object.keys(row.get('updates')).join(', ')}"` : '';

        // return name
        return col ? `${col.toString()}${append}` : '<i>N/A</i>';
      },
    },
  ],
};

// export config
module.exports = config;
