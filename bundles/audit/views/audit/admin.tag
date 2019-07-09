<audit-admin-page>
  <div class="page page-fundraiser">

    <admin-header title="Manage Audits">
      <yield to="right">
      
      </yield>
    </admin-header>
    
    <div class="container-fluid">
    
      <div class="card">
        <div class="card-body">
          <grid ref="grid" grid={ opts.grid } table-class="table table-striped table-bordered" title="Audit Grid" />
        </div>
      </div>
    
    </div>
  </div>
</audit-admin-page>
