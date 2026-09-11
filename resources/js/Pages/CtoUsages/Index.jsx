import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SearchableSelect from '@/Components/SearchableSelect';
import DateSelectorWithHalfDays from '@/Components/DateSelectorWithHalfDays';

export default function CtoUsagesIndex({ usages, employees, filters }) {
    const [showModal, setShowModal] = useState(false);
    const { data, setData, post, reset, errors } = useForm({
        employee_id: '',
        purpose_reason: '',
        time_off_dates_used: '',
        hours_used: '',
        remarks: ''
    });

    const employeeOptions = employees.map(emp => ({
        value: emp.id,
        label: `${emp.full_name} (ID: ${emp.id})`
    }));

    const handleDateChange = (formattedDates) => {
        setData('time_off_dates_used', formattedDates);
    };

    const handleHoursChange = (totalHours) => {
        setData('hours_used', totalHours);
    };

    const openModal = () => {
        reset();
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();

        // Find selected employee
        const selectedEmployee = employees.find(emp => emp.id === data.employee_id);
        const currentBalance = selectedEmployee ? selectedEmployee.balance : 0;
        const requestedHours = parseFloat(data.hours_used) || 0;

        // If insufficient balance, ask for confirmation
        if (requestedHours > currentBalance) {
            const confirmMessage = `Insufficient balance.\n\nAvailable: ${currentBalance} hours\nRequested: ${requestedHours} hours\n\nContinue anyway? (Balance will become negative)`;
            if (!confirm(confirmMessage)) {
                return; // Cancel submission
            }
        }

        // Proceed with submission
        post(route('cto-usages.store'), {
            onSuccess: () => closeModal(),
            onError: (err) => {
                if (err.hours_used) alert(err.hours_used);
            }
        });
    };

    const deleteUsage = (usage) => {
        if (confirm('Delete this CTO usage entry?')) {
            router.delete(route('cto-usages.destroy', usage.id));
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800">CTO Usage</h2>}>
            <Head title="CTO Usages" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between mb-4">
                                <input
                                    type="text"
                                    placeholder="Search by employee..."
                                    className="border-gray-300 rounded-md shadow-sm px-3 py-2"
                                    defaultValue={filters.search}
                                    onKeyUp={(e) => {
                                        if (e.key === 'Enter') {
                                            router.get(route('cto-usages.index'), { search: e.target.value });
                                        }
                                    }}
                                />
                                <PrimaryButton onClick={openModal}>Add Usage</PrimaryButton>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Employee</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Purpose/Reason</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Time Off Dates</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Hours Used</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Remarks</th>
                                            <th className="px-6 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usages.data.map(usage => (
                                            <tr key={usage.id}>
                                                <td className="px-6 py-4">{usage.employee?.full_name}</td>
                                                <td className="px-6 py-4">{usage.purpose_reason}</td>
                                                <td className="px-6 py-4">{usage.time_off_dates_used}</td>
                                                <td className="px-6 py-4 font-semibold text-red-600">{usage.hours_used}</td>
                                                <td className="px-6 py-4">{usage.remarks || '-'}</td>
                                                <td className="px-6 py-4">
                                                    <DangerButton onClick={() => deleteUsage(usage)}>Delete</DangerButton>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {usages.links && (
                                <div className="mt-4 flex justify-center space-x-2">
                                    {usages.links.map((link, i) => (
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

            <Modal show={showModal} onClose={closeModal} maxWidth="2xl">
                <div className="max-h-[80vh] overflow-y-auto p-3">
                    <form onSubmit={submit}>
                        <h2 className="text-base font-medium mb-2">Record CTO Usage</h2>
                        <div className="space-y-2">
                            <div>
                                <SearchableSelect
                                    label="Employee"
                                    options={employeeOptions}
                                    value={data.employee_id}
                                    onChange={(val) => setData('employee_id', val)}
                                    placeholder="Search employee..."
                                />
                                {errors.employee_id && <div className="text-red-500 text-xs mt-0.5">{errors.employee_id}</div>}
                            </div>
                            <div>
                                <InputLabel value="Purpose/Reason" />
                                <TextInput
                                    className="mt-0.5 w-full text-sm"
                                    value={data.purpose_reason}
                                    onChange={e => setData('purpose_reason', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <InputLabel value="Time Off Dates Used" />
                                <DateSelectorWithHalfDays
                                    value={data.time_off_dates_used}
                                    onChange={handleDateChange}
                                    onHoursChange={handleHoursChange}
                                />
                                {errors.time_off_dates_used && <div className="text-red-500 text-xs mt-0.5">{errors.time_off_dates_used}</div>}
                            </div>
                            <input type="hidden" name="hours_used" value={data.hours_used} />
                            <div>
                                <InputLabel value="Remarks" />
                                <TextInput
                                    className="mt-0.5 w-full text-sm"
                                    value={data.remarks}
                                    onChange={e => setData('remarks', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mt-3 flex justify-end space-x-2">
                            <PrimaryButton type="submit">Save</PrimaryButton>
                            <button type="button" onClick={closeModal} className="bg-gray-500 text-white px-3 py-1.5 rounded text-sm">Cancel</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
