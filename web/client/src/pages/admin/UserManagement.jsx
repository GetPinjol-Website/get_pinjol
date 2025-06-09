import { useState, useEffect } from 'react';
import AdminPresenter from '../../presenters/AdminPresenter';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import ErrorMessage from '../../components/common/ErrorMessage';
import Spinner from '../../components/common/Spinner';
import Sidebar from '../../components/layout/Sidebar';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations.jsx';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const presenter = new AdminPresenter({
        setLoading: setIsLoading,
        showError: setError,
        setUsers,
    });

    useEffect(() => {
        presenter.getAllUsers();
    }, []);

    const headers = ['Username', 'Email', 'Role', 'Terakhir Diperbarui'];

    const renderRow = (user) => (
        <>
            <td className="px-4 py-2">{user.username}</td>
            <td className="px-4 py-2">{user.email}</td>
            <td className="px-4 py-2">{user.role}</td>
            <td className="px-4 py-2">{new Date(user.updatedAt).toLocaleDateString()}</td>
        </>
    );

    return (
        <motion.div {...pageTransition} className="flex">
            <Sidebar role="admin" />
            <div className="flex-1 p-4 ml-64">
                <h1 className="text-2xl font-bold text-dark-green-900 mb-4">Manajemen Pengguna</h1>
                <ErrorMessage message={error} onClose={() => setError('')} />
                {isLoading && <Spinner />}
                <Card title="Daftar Pengguna">
                    <Table headers={headers} data={users} renderRow={renderRow} />
                </Card>
            </div>
        </motion.div>
    );
}

export default UserManagement;