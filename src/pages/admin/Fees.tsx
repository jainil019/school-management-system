import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  getStudents,
  type Student,
} from "../../services/studentService";

import {
  getFees,
  createFee,
  updateFee,
  deleteFee,
  type Fee,
} from "../../services/feeService";

function Fees() {
  const [students, setStudents] = useState<Student[]>([]);
  const [fees, setFees] = useState<Fee[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingFee, setEditingFee] = useState<Fee | null>(null);

  const [form, setForm] = useState({
    studentId: "",
    feeType: "Tuition Fee",
    amount: "",
    paidAmount: "",
    dueDate: "",
    academicYear: "2026-27",
    paymentDate: "",
    paymentMethod: "Cash",
    notes: "",
  });

  // -----------------------------
  // LOAD DATA
  // -----------------------------

  const loadData = async () => {
    try {
      setLoading(true);

      const [studentsData, feesData] = await Promise.all([
        getStudents(),
        getFees(),
      ]);

      setStudents(studentsData);
      setFees(feesData);
    } catch (error) {
      console.error("Failed to load fees:", error);
      alert("Failed to load fee records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // -----------------------------
  // HELPERS
  // -----------------------------

  const getStudent = (studentId: string) => {
    return students.find(
      (student) => String(student.id) === String(studentId)
    );
  };

  const getRemaining = (fee: Fee) => {
    return Math.max(
      0,
      Number(fee.amount) - Number(fee.paidAmount)
    );
  };

  const getStatus = (fee: Fee) => {
    if (Number(fee.paidAmount) >= Number(fee.amount)) {
      return "Paid";
    }

    if (Number(fee.paidAmount) > 0) {
      return "Partial";
    }

    return "Pending";
  };

  const getStatusStyle = (status: string) => {
    if (status === "Paid") {
      return "bg-green-50 text-green-700";
    }

    if (status === "Partial") {
      return "bg-yellow-50 text-yellow-700";
    }

    return "bg-red-50 text-red-700";
  };

  // -----------------------------
  // FILTER
  // -----------------------------

  const filteredFees = useMemo(() => {
    return fees.filter((fee) => {
      const student = getStudent(fee.studentId);

      if (!student) return false;

      const searchText = search.toLowerCase();

      const matchesSearch =
        student.name.toLowerCase().includes(searchText) ||
        student.email.toLowerCase().includes(searchText) ||
        String(student.rollNo).includes(searchText) ||
        fee.feeType.toLowerCase().includes(searchText);

      const status = getStatus(fee);

      const matchesStatus =
        statusFilter === "All" ||
        status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [fees, students, search, statusFilter]);

  // -----------------------------
  // SUMMARY
  // -----------------------------

  const totalFees = fees.reduce(
    (sum, fee) => sum + Number(fee.amount),
    0
  );

  const totalCollected = fees.reduce(
    (sum, fee) =>
      sum +
      Math.min(
        Number(fee.paidAmount),
        Number(fee.amount)
      ),
    0
  );

  const totalPending = Math.max(
    0,
    totalFees - totalCollected
  );

  const paidCount = fees.filter(
    (fee) => getStatus(fee) === "Paid"
  ).length;

  // -----------------------------
  // FORM
  // -----------------------------

  const resetForm = () => {
    setForm({
      studentId: "",
      feeType: "Tuition Fee",
      amount: "",
      paidAmount: "",
      dueDate: "",
      academicYear: "2026-27",
      paymentDate: "",
      paymentMethod: "Cash",
      notes: "",
    });
  };

  const openAddModal = () => {
    setEditingFee(null);
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (fee: Fee) => {
    setEditingFee(fee);

    setForm({
      studentId: String(fee.studentId),
      feeType: fee.feeType,
      amount: String(fee.amount),
      paidAmount: String(fee.paidAmount),
      dueDate: fee.dueDate,
      academicYear: fee.academicYear,
      paymentDate: fee.paymentDate,
      paymentMethod: fee.paymentMethod,
      notes: fee.notes,
    });

    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingFee(null);
    resetForm();
  };

  // -----------------------------
  // CREATE / UPDATE
  // -----------------------------

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const amount = Number(form.amount);
    const paidAmount = Number(form.paidAmount);

    if (!form.studentId) {
      alert("Please select a student.");
      return;
    }

    if (!amount || amount <= 0) {
      alert("Please enter a valid fee amount.");
      return;
    }

    if (paidAmount < 0 || paidAmount > amount) {
      alert(
        "Paid amount cannot be greater than total amount."
      );
      return;
    }

    const feeData: Fee = {
      studentId: form.studentId,
      feeType: form.feeType,
      amount,
      paidAmount,
      dueDate: form.dueDate,
      academicYear: form.academicYear,
      paymentDate: form.paymentDate,
      paymentMethod: form.paymentMethod,
      notes: form.notes,
    };

    try {
      setSaving(true);

      if (editingFee?.id) {
        const updatedFee = await updateFee(
          editingFee.id,
          feeData
        );

        setFees((currentFees) =>
          currentFees.map((fee) =>
            fee.id === editingFee.id
              ? updatedFee
              : fee
          )
        );
      } else {
        const newFee = await createFee(feeData);

        setFees((currentFees) => [
          ...currentFees,
          newFee,
        ]);
      }

      closeModal();
    } catch (error) {
      console.error("Failed to save fee:", error);
      alert("Failed to save fee record.");
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------
  // DELETE
  // -----------------------------

  const handleDelete = async (id?: string) => {
    if (!id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this fee record?"
    );

    if (!confirmed) return;

    try {
      await deleteFee(id);

      setFees((currentFees) =>
        currentFees.filter((fee) => fee.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete fee:", error);
      alert("Failed to delete fee record.");
    }
  };

  // -----------------------------
  // UI
  // -----------------------------

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Fees Management
          </h1>

          <p className="text-slate-500 mt-1">
            Manage student fees and payment records
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Add Fee
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
            <DollarSign
              size={22}
              className="text-blue-600"
            />
          </div>

          <p className="text-sm text-slate-500 mt-4">
            Total Fees
          </p>

          <p className="text-2xl font-bold text-slate-900 mt-1">
            ₹{totalFees.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Collected */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
            <CheckCircle
              size={22}
              className="text-green-600"
            />
          </div>

          <p className="text-sm text-slate-500 mt-4">
            Total Collected
          </p>

          <p className="text-2xl font-bold text-green-600 mt-1">
            ₹{totalCollected.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="w-11 h-11 rounded-xl bg-yellow-50 flex items-center justify-center">
            <Clock
              size={22}
              className="text-yellow-600"
            />
          </div>

          <p className="text-sm text-slate-500 mt-4">
            Total Pending
          </p>

          <p className="text-2xl font-bold text-yellow-600 mt-1">
            ₹{totalPending.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Paid Records */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">
            <CheckCircle
              size={22}
              className="text-purple-600"
            />
          </div>

          <p className="text-sm text-slate-500 mt-4">
            Paid Records
          </p>

          <p className="text-2xl font-bold text-slate-900 mt-1">
            {paidCount}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search student, email, roll no or fee type..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Partial">Partial</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            Fee Records
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {filteredFees.length} records found
          </p>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-slate-500">
              Loading fee records...
            </div>
          ) : (
            <>
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-5 py-4 text-sm font-semibold text-slate-600">
                      Student
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-slate-600">
                      Fee Type
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-slate-600">
                      Amount
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-slate-600">
                      Paid
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-slate-600">
                      Pending
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold text-slate-600">
                      Due Date
                    </th>

                    <th className="text-center px-5 py-4 text-sm font-semibold text-slate-600">
                      Status
                    </th>

                    <th className="text-center px-5 py-4 text-sm font-semibold text-slate-600">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredFees.map((fee) => {
                    const student = getStudent(
                      fee.studentId
                    );

                    const status = getStatus(fee);

                    const remaining =
                      getRemaining(fee);

                    return (
                      <tr
                        key={fee.id}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900">
                            {student?.name ||
                              "Unknown Student"}
                          </p>

                          <p className="text-xs text-slate-500 mt-1">
                            Roll No:{" "}
                            {student?.rollNo || "-"}{" "}
                            · Class:{" "}
                            {student?.className || "-"}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-slate-700">
                          {fee.feeType}
                        </td>

                        <td className="px-5 py-4 font-semibold text-slate-900">
                          ₹
                          {Number(
                            fee.amount
                          ).toLocaleString("en-IN")}
                        </td>

                        <td className="px-5 py-4 font-semibold text-green-600">
                          ₹
                          {Number(
                            fee.paidAmount
                          ).toLocaleString("en-IN")}
                        </td>

                        <td className="px-5 py-4 font-semibold text-red-600">
                          ₹
                          {remaining.toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          {fee.dueDate || "-"}
                        </td>

                        <td className="px-5 py-4 text-center">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                              status
                            )}`}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() =>
                                openEditModal(fee)
                              }
                              className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(fee.id)
                              }
                              className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredFees.length === 0 && (
                <div className="py-14 text-center">
                  <DollarSign
                    size={40}
                    className="mx-auto text-slate-300 mb-3"
                  />

                  <h3 className="text-lg font-semibold text-slate-700">
                    No fee records found
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Add a fee record or change your
                    search/filter.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingFee
                    ? "Edit Fee"
                    : "Add Fee"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Enter student fee and payment
                  details
                </p>
              </div>

              <button
                onClick={closeModal}
                disabled={saving}
                className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Student */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Student *
                  </label>

                  <select
                    value={form.studentId}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        studentId:
                          e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">
                      Select student
                    </option>

                    {students
                      .filter(
                        (student) =>
                          student.status ===
                          "Active"
                      )
                      .map((student) => (
                        <option
                          key={student.id}
                          value={student.id}
                        >
                          {student.name} - Roll No{" "}
                          {student.rollNo}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Fee Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fee Type *
                  </label>

                  <select
                    value={form.feeType}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        feeType:
                          e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>
                      Tuition Fee
                    </option>
                    <option>
                      Admission Fee
                    </option>
                    <option>Exam Fee</option>
                    <option>
                      Transport Fee
                    </option>
                    <option>
                      Library Fee
                    </option>
                    <option>
                      Computer Fee
                    </option>
                    <option>
                      Sports Fee
                    </option>
                    <option>Other</option>
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Total Amount *
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={form.amount}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        amount:
                          e.target.value,
                      })
                    }
                    placeholder="Enter total amount"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Paid */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Paid Amount *
                  </label>

                  <input
                    type="number"
                    min="0"
                    max={
                      form.amount || undefined
                    }
                    value={form.paidAmount}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        paidAmount:
                          e.target.value,
                      })
                    }
                    placeholder="Enter paid amount"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Due Date
                  </label>

                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        dueDate:
                          e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Payment Date */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Payment Date
                  </label>

                  <input
                    type="date"
                    value={form.paymentDate}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        paymentDate:
                          e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Academic Year */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Academic Year
                  </label>

                  <input
                    type="text"
                    value={form.academicYear}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        academicYear:
                          e.target.value,
                      })
                    }
                    placeholder="2026-27"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Payment Method
                  </label>

                  <select
                    value={form.paymentMethod}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        paymentMethod:
                          e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Cash</option>
                    <option>Online</option>
                    <option>UPI</option>
                    <option>
                      Bank Transfer
                    </option>
                    <option>Cheque</option>
                  </select>
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Notes
                  </label>

                  <textarea
                    value={form.notes}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        notes: e.target.value,
                      })
                    }
                    rows={3}
                    placeholder="Optional notes..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

              {/* Remaining */}
              {form.amount && (
                <div className="mt-5 p-4 rounded-xl bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      Remaining Amount
                    </span>

                    <span className="text-lg font-bold text-red-600">
                      ₹
                      {Math.max(
                        0,
                        Number(form.amount) -
                          Number(
                            form.paidAmount || 0
                          )
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-slate-200">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving
                    ? "Saving..."
                    : editingFee
                    ? "Update Fee"
                    : "Save Fee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Fees;