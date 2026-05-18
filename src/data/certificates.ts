import type { Certificate } from "@/types/database";

const AWS  = "/icons/aws.svg";
const GOOG = "/icons/google.svg";
const UDEM = "/icons/udemy.svg";
const COUR = "/icons/coursera.svg";
const LINX = "/icons/linux-foundation.svg";
const FEM  = "/icons/frontend-masters.svg";
const DICO = "/icons/dicoding.svg";

export const CERTIFICATES: Certificate[] = [
  // AWS — Dec 2025
  { id: "1",  title: "AWS Amplify Getting Started",                                         issuer: "Amazon Web Services", thumbnail_url: AWS,  certificate_url: null, credential_id: null, issued_date: "2025-12-01" },
  { id: "2",  title: "AWS Command Line Interface (CLI) Basics",                             issuer: "Amazon Web Services", thumbnail_url: AWS,  certificate_url: null, credential_id: null, issued_date: "2025-12-01" },
  { id: "3",  title: "Introduction to Amazon CloudFront",                                   issuer: "Amazon Web Services", thumbnail_url: AWS,  certificate_url: null, credential_id: null, issued_date: "2025-12-01" },
  { id: "4",  title: "Job Roles in the Cloud",                                              issuer: "Amazon Web Services", thumbnail_url: AWS,  certificate_url: null, credential_id: null, issued_date: "2025-12-01" },
  { id: "5",  title: "AWS Certified Cloud Practitioner — Practice Question Set (CLF-C02)", issuer: "Amazon Web Services", thumbnail_url: AWS,  certificate_url: null, credential_id: null, issued_date: "2025-12-01" },
  // Frontend Masters — Nov 2025
  { id: "6",  title: "AWS For Front-End Engineers, v2",                                     issuer: "Frontend Masters",    thumbnail_url: FEM,  certificate_url: null, credential_id: null, issued_date: "2025-11-01" },
  // AWS — Jul 2025
  { id: "7",  title: "AWS Educate Introduction to Generative AI",                          issuer: "Amazon Web Services", thumbnail_url: AWS,  certificate_url: null, credential_id: null, issued_date: "2025-07-01" },
  // Dicoding — May 2025
  { id: "8",  title: "Financial Literacy 101",                                              issuer: "Dicoding Indonesia",  thumbnail_url: DICO, certificate_url: null, credential_id: null, issued_date: "2025-05-01" },
  // Google — Feb 2025
  { id: "9",  title: "Automate Data Capture at Scale with Document AI",                    issuer: "Google",              thumbnail_url: GOOG, certificate_url: null, credential_id: null, issued_date: "2025-02-01" },
  { id: "10", title: "Boost Productivity with Gemini in BigQuery",                         issuer: "Google",              thumbnail_url: GOOG, certificate_url: null, credential_id: null, issued_date: "2025-02-01" },
  // Frontend Masters — Jan 2025
  { id: "11", title: "React and TypeScript",                                                issuer: "Frontend Masters",    thumbnail_url: FEM,  certificate_url: null, credential_id: null, issued_date: "2025-01-15" },
  // Udemy — Dec 2024
  { id: "12", title: "Introduction to Go Programming",                                     issuer: "Udemy",               thumbnail_url: UDEM, certificate_url: null, credential_id: null, issued_date: "2024-12-10" },
  // Udemy — Nov 2024
  { id: "13", title: "Docker & Kubernetes: The Practical Guide",                           issuer: "Udemy",               thumbnail_url: UDEM, certificate_url: null, credential_id: null, issued_date: "2024-11-20" },
  // Dicoding — Oct 2024
  { id: "14", title: "Belajar Dasar Pemrograman Web",                                      issuer: "Dicoding Indonesia",  thumbnail_url: DICO, certificate_url: null, credential_id: null, issued_date: "2024-10-05" },
  // Coursera — Sep 2024
  { id: "15", title: "PostgreSQL for Everybody",                                            issuer: "Coursera",            thumbnail_url: COUR, certificate_url: null, credential_id: null, issued_date: "2024-09-01" },
  // Udemy — Aug 2024
  { id: "16", title: "Blender 3D: Your First 3D Character",                               issuer: "Udemy",               thumbnail_url: UDEM, certificate_url: null, credential_id: null, issued_date: "2024-08-10" },
  // Linux Foundation — Jul 2024
  { id: "17", title: "Introduction to Linux",                                               issuer: "Linux Foundation",    thumbnail_url: LINX, certificate_url: null, credential_id: null, issued_date: "2024-07-01" },
  // Dicoding — Jun 2024
  { id: "18", title: "Belajar Fundamental Aplikasi Back-End",                              issuer: "Dicoding Indonesia",  thumbnail_url: DICO, certificate_url: null, credential_id: null, issued_date: "2024-06-15" },
  // Udemy — May 2024
  { id: "19", title: "Complete Next.js Developer in 2024",                                 issuer: "Udemy",               thumbnail_url: UDEM, certificate_url: null, credential_id: null, issued_date: "2024-05-20" },
  // Google — Apr 2024
  { id: "20", title: "Google Cloud Fundamentals: Core Infrastructure",                    issuer: "Google",              thumbnail_url: GOOG, certificate_url: null, credential_id: null, issued_date: "2024-04-10" },
];
