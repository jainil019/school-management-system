import api from "./api";

export interface Fee {
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

export async function getFees() {
  const response = await api.get("/fees/");
  return response.data;
}

export async function getFee(id: string) {
  const response = await api.get(`/fees/${id}`);
  return response.data;
}

export async function createFee(fee: Fee) {
  const response = await api.post("/fees/", fee);
  return response.data;
}

export async function updateFee(
  id: string,
  fee: Fee
) {
  const response = await api.put(
    `/fees/${id}`,
    fee
  );

  return response.data;
}

export async function deleteFee(id: string) {
  const response = await api.delete(
    `/fees/${id}`
  );

  return response.data;
}