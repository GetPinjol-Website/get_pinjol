import { useState, useEffect } from 'react';
import AdminPresenter from '../../presenters/AdminPresenter';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import ErrorMessage from '../../components/common/ErrorMessage';
import Spinner from '../../components/common/Spinner';
import Sidebar from '../../components/layout/Sidebar';
import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations';

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
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{new Date(user.updatedAt).toLocaleDateString()}</td>
        </>
    );

    return (
        <motion.div {...pageTransition} className="flex">
            <Sidebar role="admin" />
            <div className="content-with-sidebar">
                <h1>Manajemen Pengguna</h1>
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