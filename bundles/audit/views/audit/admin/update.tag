<audit-admin-update-page>
  <div class="page page-admin">

    <admin-header title="Update Audit" preview={ this.preview } on-preview={ onPreview }>
      <yield to="right">
        <a href="/admin/audit" class="btn btn-lg btn-primary mr-2">
          Back
        </a>
        <button class={ 'btn btn-lg' : true, 'btn-primary' : opts.preview, 'btn-success' : !opts.preview } onclick={ opts.onPreview }>
          { opts.preview ? 'Alter Form' : 'Finish Altering' }
        </button>
      </yield>
    </admin-header>

    <div class="container-fluid">
      <form-render action="/admin/audit/{ opts.item.id }/update" method="post" ref="form" form={ opts.form } placement="ifactory.audit" positions={ this.positions } preview={ this.preview } class="d-block mb-3" />
      <div class="text-right">
        <button type="button" onclick={ onSubmit } class={ 'btn btn-success' : true, 'disabled' : this.loading } disabled={ this.loading }>
          { this.loading ? 'Submitting...' : 'Submit' }
        </button>
      </div>
    </div>
    
  </div>

  <script>
    // do mixin
    this.mixin('i18n');

    // set type
    this.type    = opts.item.type || 'raised';
    this.preview = true;
    
    // require uuid
    const uuid = require('uuid');
    
    // set placements
    this.positions = opts.positions || opts.fields.map((field) => {
      // return field
      return {
        'type'     : field.type,
        'uuid'     : uuid(),
        'name'     : field.name,
        'label'    : field.label,
        'force'    : true,
        'multiple' : field.multiple,
        'children' : []
      };
    });
    
    /**
     * on submit
     *
     * @param  {Event} e
     *
     * @return {*}
     */
    async onSubmit (e) {
      // prevent default
      e.preventDefault();
      e.stopPropagation();
      
      // set loading
      this.loading = true;
      
      // update view
      this.update();
      
      // submit form
      await this.refs.form.submit();
      
      // set loading
      this.loading = false;
      
      // update view
      this.update();
    }
    
    /**
     * on preview
     *
     * @param  {Event} e
     *
     * @return {*}
     */
    onPreview (e) {
      // prevent default
      e.preventDefault();
      e.stopPropagation();
      
      // set loading
      this.preview = !this.preview;
      
      // update view
      this.update();
    }

    /**
     * get category
     *
     * @return {Object}
     */
    audit () {
      // return category
      return opts.item;
    }

    /**
     * on language update function
     */
    this.on('update', () => {

    });

  </script>
</audit-admin-update-page>
