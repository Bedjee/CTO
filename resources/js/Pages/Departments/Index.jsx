import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function DepartmentsIndex({ departments }) {
    const [showModal, setShowModal] = useState(false);
    const [editingDept, setEditingDept] = useState(null);
    const { data, setData, post, put, reset, errors } = useForm({
        name: ''
    });

    const openModal = (dept = null) => {
        if (dept) {
            setEditingDept(dept);
            setData({ name: dept.name });
        } else {
            setEditingDept(null);
            reset();
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        reset();
        setEditingDept(null);
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingDept) {
            put(route('departments.update', editingDept.id), {
                onSuccess: () => closeModal()
            });
        } else {
            post(route('departments.store'), {
                onSuccess: () => closeModal()
            });
        }
    };

    const deleteDept = (dept) => {
        if (confirm('Delete department? It cannot have employees.')) {
            router.delete(route('departments.destroy', dept.id));
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800">Department Management</h2>}>
            <Head title="Departments" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-end mb-4">
                                <PrimaryButton onClick={() => openModal()}>Add Department</PrimaryButton>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Department Name</th>
                                            <th className="px-6 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {departments.data.map(dept => (
                                            <tr key={dept.id}>
                                                <td className="px-6 py-4">{dept.id}</td>
                                                <td className="px-6 py-4">{dept.name}</td>
                                                <td className="px-6 py-4 space-x-2">
                                                    <button onClick={() => openModal(dept)} className="text-blue-600 hover:text-blue-800">Edit</button>
                                                    <DangerButton onClick={() => deleteDept(dept)}>Delete</DangerButton>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {departments.links && (
                                <div className="mt-4 flex justify-center space-x-2">
                                    {departments.links.map((link, i) => (
                                        <button
                                            key={i}
                                            onClick={() => router.get(link.url)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-3 py-1 rounded ${link.active ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onClose={closeModal}>
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-medium mb-4">{editingDept ? 'Edit Department' : 'Add Department'}</h2>
                    <div>
                        <InputLabel value="Department Name" />
                        <TextInput className="mt-1 w-full" value={data.name} onChange={e => setData('name', e.target.value)} required />
                        {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                    </div>
                    <div className="mt-6 flex justify-end space-x-2">
                        <PrimaryButton type="submit">Save</PrimaryButton>
                        <button type="button" onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
