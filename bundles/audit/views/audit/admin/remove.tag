<audit-admin-remove-page>
  <div class="page page-admin">

    <admin-header title="Remove Audit" preview={ this.preview } on-preview={ onPreview }>
      <yield to="right">
        <a href="/admin/audit" class="btn btn-lg btn-primary mr-2">
          Back
        </a>
      </yield>
    </admin-header>

    <div class="container-fluid">
      <form method="post" action="/admin/audit/{ opts.item.id }/remove">
        <div class="card">
          <div class="card-body">
            Are you sure you want to remove <b>{ opts.item.id }</b>?
          </div>
          <div class="card-footer text-right">
            <button type="submit" class="btn btn-success">Remove Audit</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</audit-admin-remove-page>
