import { useEffect, useState } from "react";
import {
  IndianRupee,
  Loader2,
  Receipt,
} from "lucide-react";

import { getParentFees } from "../../services/parentPortalService";

interface Fee {
  id?: string;
  amount: number;
  paidAmount?: number;
  status?: string;
  dueDate?: string;
  description?: string;
}

export default function ParentFees() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFees();
  }, []);

  const loadFees = async () => {
    try {
      const id = localStorage.getItem(
        "school_parent_student_id"
      );

      if (!id) return;

      const data = await getParentFees(id);
      setFees(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  const total = fees.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const paid = fees.reduce(
    (sum, item) => sum + Number(item.paidAmount || 0),
    0
  );

  const due = Math.max(total - paid, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Fees
        </h1>

        <p className="text-slate-500 mt-1">
          View your child's fee information.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Stat title="Total Fees" value={`₹${total}`} />
        <Stat title="Paid" value={`₹${paid}`} />
        <Stat title="Pending" value={`₹${due}`} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b flex items-center gap-2">
          <Receipt className="text-blue-600" />
          <h2 className="font-bold">Fee Details</h2>
        </div>

        {fees.length === 0 ? (
          <p className="p-8 text-center text-slate-400">
            No fee records found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-5 py-4">
                    Description
                  </th>

                  <th className="text-left px-5 py-4">
                    Amount
                  </th>

                  <th className="text-left px-5 py-4">
                    Paid
                  </th>

                  <th className="text-left px-5 py-4">
                    Due
                  </th>

                  <th className="text-left px-5 py-4">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {fees.map((item, index) => {
                  const itemDue =
                    Number(item.amount || 0) -
                    Number(item.paidAmount || 0);

                  return (
                    <tr key={item.id || index}>
                      <td className="px-5 py-4">
                        {item.description || "School Fee"}
                      </td>

                      <td className="px-5 py-4">
                        ₹{item.amount}
                      </td>

                      <td className="px-5 py-4">
                        ₹{item.paidAmount || 0}
                      </td>

                      <td className="px-5 py-4">
                        ₹{Math.max(itemDue, 0)}
                      </td>

                      <td className="px-5 py-4">
                        {item.status || "Pending"}
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
  value: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
        <IndianRupee size={20} />
      </div>

      <p className="text-sm text-slate-500 mt-3">
        {title}
      </p>

      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function Loading() {
  return (
    <div className="min-h-[60vh] flex justify-center items-center gap-3">
      <Loader2 className="animate-spin" />
      Loading fees...
    </div>
  );
}