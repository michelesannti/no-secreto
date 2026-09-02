import { Resend } from "resend";

export function getResend() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("A chave RESEND_API_KEY não está configurada.");
  }

  return new Resend(apiKey);
}