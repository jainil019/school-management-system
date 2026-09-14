import { useEffect, useMemo, useState } from "react";
import {
  IndianRupee,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { getStudentFees } from "../../services/studentPortalService";

interface Fee {
  id?: string;
  studentId: string;
  feeType: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  academicYear: string;
  paymentDate: string;
  paymentMethod: string;
  notes: string;
}

export default function StudentFees() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFees() {
      try {
        const studentId = localStorage.getItem(
          "school_current_student_id"
        );

        if (!studentId) return;

        const data = await getStudentFees(studentId);
        setFees(data);
      } catch (error) {
        console.error("Failed to load fees:", error);
      } finally {
        setLoading(false);
      }
    }

    loadFees();
  }, []);

  const totals = useMemo(() => {
    const amount = fees.reduce(
      (sum, fee) => sum + fee.amount,
      0
    );

    const paid = fees.reduce(
      (sum, fee) => sum + fee.paidAmount,
      0
    );

    return {
      amount,
      paid,
      due: Math.max(0, amount - paid),
    };
  }, [fees]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          My Fees
        </h1>

        <p className="text-slate-500 mt-1">
          View your fee payments and outstanding balance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Stat
          title="Total Fees"
          value={totals.amount}
        />

        <Stat
          title="Paid"
          value={totals.paid}
        />

        <Stat
          title="Due"
          value={totals.due}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="font-bold text-slate-900">
            Fee Records
          </h2>
        </div>

        {fees.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            No fee records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-4 text-sm text-slate-600">
                    Fee Type
                  </th>

                  <th className="text-left p-4 text-sm text-slate-600">
                    Amount
                  </th>

                  <th className="text-left p-4 text-sm text-slate-600">
                    Paid
                  </th>

                  <th className="text-left p-4 text-sm text-slate-600">
                    Due
                  </th>

                  <th className="text-left p-4 text-sm text-slate-600">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {fees.map((fee) => {
                  const due = Math.max(
                    0,
                    fee.amount - fee.paidAmount
                  );

                  return (
                    <tr
                      key={fee.id}
                      className="border-t border-slate-100"
                    >
                      <td className="p-4 font-semibold text-slate-900">
                        {fee.feeType}
                      </td>

                      <td className="p-4">
                        ₹{fee.amount.toLocaleString("en-IN")}
                      </td>

                      <td className="p-4 text-green-600 font-semibold">
                        ₹
                        {fee.paidAmount.toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td className="p-4 text-red-600 font-semibold">
                        ₹{due.toLocaleString("en-IN")}
                      </td>

                      <td className="p-4">
                        {due === 0 ? (
                          <span className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                            <CheckCircle size={16} />
                            Paid
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-orange-600 text-sm font-semibold">
                            <AlertCircle size={16} />
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
        <IndianRupee size={22} />
      </div>

      <p className="text-sm text-slate-500 mt-4">
        {title}
      </p>

      <p className="text-2xl font-bold text-slate-900 mt-1">
        ₹{value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}

function Loading() {
  return (
    <div className="bg-white rounded-2xl p-10 text-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-slate-500 mt-4">
        Loading fees...
      </p>
    </div>
  );
}