import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiToggleLeft, FiToggleRight, FiShield } from 'react-icons/fi';
import DataTable from '../../components/admin/DataTable';
import Badge from '../../components/common/Badge';
import api from '../../api/axios';
import { formatDate, getInitials } from '../../utils/helpers';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  const fetchUsers = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (search) params.search = search;
      const res = await api.get('/admin/users', { params });
      setUsers(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await api.put(`/admin/users/${id}`, { is_active: currentStatus ? 0 : 1 });
      toast.success(`User ${currentStatus ? 'deactivated' : 'activated'}`);
      fetchUsers(pagination.page);
    } catch { toast.error('Failed to update user status'); }
  };

  const handleToggleRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change this user's role to "${newRole}"?`)) return;
    try {
      await api.put(`/admin/users/${id}`, { role: newRole });
      toast.success('User role updated');
      fetchUsers(pagination.page);
    } catch { toast.error('Failed to update role'); }
  };

  const columns = [
    {
      key: 'name', header: 'User',
      render: (v, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary-700 overflow-hidden">
            {row.avatar ? <img src={row.avatar} alt="" className="w-full h-full object-cover" /> : getInitials(v)}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{v}</p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      )
    },
    { key: 'phone', header: 'Phone', render: v => <span className="text-sm text-slate-600">{v || 'â€'}</span> },
    { key: 'role', header: 'Role', render: (v, row) => (
      <button onClick={() => handleToggleRole(row.id, v)} className="flex items-center gap-1.5 group" title="Click to toggle role">
        <FiShield className={`text-sm ${v === 'admin' ? 'text-purple-500' : 'text-slate-400'}`} />
        <Badge variant={v === 'admin' ? 'purple' : 'default'} size="sm">{v}</Badge>
      </button>
    )},
    { key: 'is_verified', header: 'Verified', render: v => <Badge variant={v ? 'success' : 'warning'} size="sm">{v ? 'Yes' : 'No'}</Badge> },
    { key: 'is_active', header: 'Status', render: (v, row) => (
      <button onClick={() => handleToggleActive(row.id, v)} className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full transition-colors">
        {v ? <><FiToggleRight className="text-emerald-500" /><span className="text-emerald-700">Active</span></> : <><FiToggleLeft className="text-slate-400" /><span className="text-slate-500">Inactive</span></>}
      </button>
    )},
    { key: 'created_at', header: 'Joined', render: v => <span className="text-xs text-slate-400">{formatDate(v)}</span> },
  ];

  return (
    <>
      <Helmet><title>Users - Admin | Amit R. Medical</title></Helmet>
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 font-heading">Users</h1>
          <p className="text-slate-500 text-sm">{pagination.total} registered users</p>
        </div>

        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          pagination={pagination}
          onPageChange={p => fetchUsers(p)}
          searchable
          onSearch={q => fetchUsers(1, q)}
          emptyMessage="No users found"
        />
      </div>
    </>
  );
};

export default AdminUsers;

