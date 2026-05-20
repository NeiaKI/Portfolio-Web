import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Serialize objek JSON-LD untuk dimasukkan ke <script>. JSON.stringify tidak
// meng-escape "<", sehingga "</script>" pada data bisa menutup tag lebih awal.
// Escape "<" → "<" mencegah breakout tanpa mengubah arti JSON.
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
