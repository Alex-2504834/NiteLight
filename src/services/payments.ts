import { apiFetch } from "./api";

export type TestPaymentSheetResponse = {
  paymentIntentClientSecret: string;
  amount: number;
  currency: string;
};

export async function createTestPaymentSheet() {
  return apiFetch("/payments/test-payment-sheet", {
    method: "POST",
    body: JSON.stringify({}),
  }) as Promise<TestPaymentSheetResponse>;
}
