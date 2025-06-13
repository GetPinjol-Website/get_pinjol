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
        <div className="flex bg-pinjol-light-1">
            <Sidebar role="admin" />
            <div className="bg-pinjol-light-1 w-full py-18 sm:py-8">
                <motion.div {...pageTransition} className="container mx-auto px-4 pt-20" initial="hidden" animate="visible">
                    <motion.h1 className="text-3xl font-bold text-pinjol-dark-3 mb-6 flex items-center" variants={pageTransition}>
                        <i className="fas fa-users mr-3"></i> Manajemen Pengguna
                    </motion.h1>
                    <ErrorMessage message={error} onClose={() => setError('')} />
                    {isLoading && <Spinner />}
                    <Card title="Daftar Pengguna">
                        <div className="overflow-x-auto">
                            <Table headers={headers} data={users} renderRow={renderRow} />
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}

export default UserManagement;