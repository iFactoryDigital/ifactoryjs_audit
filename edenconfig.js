// create config object
const config = {};

// default company config
config.audit = {
  fields : [
    {
      name   : 'by',
      grid   : false,
      type   : 'user',
      label  : 'By',
    },
    {
      name  : 'for',
      grid  : true,
      type  : 'text',
      label : 'For',
    },
    {
      name   : 'subject',
      grid   : false,
      type   : 'text',
      label  : 'Subject',
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
      name  : 'message',
      grid  : true,
      type  : 'text',
      label : 'Message',
    },
  ],
};

// export config
module.exports = config;
