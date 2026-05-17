import type { Project, Certificate } from "@/types/database";

export const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    slug: "ekiportfolio",
    title: "Eki Portfolio",
    description: "Personal portfolio web — a living dashboard combining CV, activity tracking, and mini-apps.",
    long_description: "This very website. Built with Next.js 16, TypeScript, Tailwind CSS, shadcn/ui, and Supabase. Features bilingual support, Catppuccin theming, real-time widgets, and a 3D asset viewer.",
    thumbnail_url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=640&h=360&fit=crop&auto=format",
    screenshots: [],
    tech_stack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Framer Motion"],
    website_url: "#",
    source_url: "https://github.com/NeiaKI/Portfolio-Web",
    is_featured: true,
    created_at: "2026-05-16T00:00:00Z",
  },
  {
    id: "2",
    slug: "blender-glb-assets",
    title: "Gamma Game Assets",
    description: "3D asset pack for game developers — low-poly GLB models optimized for real-time rendering.",
    long_description: "A collection of hand-crafted 3D assets made in Blender, exported as GLB with Draco compression. Covers props, environment, and character assets for indie game projects.",
    thumbnail_url: "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=640&h=360&fit=crop&auto=format",
    screenshots: [],
    tech_stack: ["Blender", "Three.js", "GLTF", "Draco"],
    website_url: null,
    source_url: null,
    is_featured: true,
    created_at: "2026-03-01T00:00:00Z",
  },
  {
    id: "3",
    slug: "arch-dotfiles",
    title: "EkiArch Dotfiles",
    description: "Hyprland-based Arch Linux rice — dotfiles for a complete, reproducible desktop setup.",
    long_description: "Personal dotfiles for EkiArch — Hyprland WM, Waybar, Alacritty, and more. Fully documented for easy reproduction on any Arch Linux installation.",
    thumbnail_url: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=640&h=360&fit=crop&auto=format",
    screenshots: [],
    tech_stack: ["Arch Linux", "Hyprland", "Waybar", "Bash", "Nix"],
    website_url: null,
    source_url: "https://github.com/nekidev",
    is_featured: false,
    created_at: "2025-11-01T00:00:00Z",
  },
  {
    id: "4",
    slug: "rest-api-go",
    title: "Go REST API Boilerplate",
    description: "Production-ready REST API starter built with Go, featuring JWT auth, PostgreSQL, and Docker.",
    long_description: "A boilerplate for building REST APIs in Go. Includes JWT authentication, role-based access control, PostgreSQL with migrations, structured logging, and Docker Compose setup.",
    thumbnail_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=640&h=360&fit=crop&auto=format",
    screenshots: [],
    tech_stack: ["Go", "PostgreSQL", "Docker", "JWT", "REST API"],
    website_url: null,
    source_url: "https://github.com/nekidev",
    is_featured: false,
    created_at: "2025-08-15T00:00:00Z",
  },
  {
    id: "5",
    slug: "linux-command-quiz",
    title: "Linux Command Quiz",
    description: "Interactive quiz app for learning Linux commands — supports Bash, vim, and system administration topics.",
    long_description: "A web-based quiz for learning Linux commands. Covers Bash scripting, file system navigation, process management, and vim. Built as a tool for the EkiArch community.",
    thumbnail_url: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=640&h=360&fit=crop&auto=format",
    screenshots: [],
    tech_stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    website_url: "#",
    source_url: "https://github.com/nekidev",
    is_featured: false,
    created_at: "2025-06-01T00:00:00Z",
  },
];

const AWS  = "/icons/aws.svg";
const GOOG = "/icons/google.svg";
const UDEM = "/icons/udemy.svg";
const COUR = "/icons/coursera.svg";
const LINX = "/icons/linux-foundation.svg";

export const MOCK_CERTIFICATES: Certificate[] = [
  // AWS — Dec 2025
  { id: "1",  title: "AWS Amplify Getting Started",                                        issuer: "Amazon Web Services (AWS)", thumbnail_url: AWS,  certificate_url: null, credential_id: null, issued_date: "2025-12-01" },
  { id: "2",  title: "AWS Command Line Interface (CLI) Basics",                            issuer: "Amazon Web Services (AWS)", thumbnail_url: AWS,  certificate_url: null, credential_id: null, issued_date: "2025-12-01" },
  { id: "3",  title: "Introduction to Amazon CloudFront",                                  issuer: "Amazon Web Services (AWS)", thumbnail_url: AWS,  certificate_url: null, credential_id: null, issued_date: "2025-12-01" },
  { id: "4",  title: "Job Roles in the Cloud",                                             issuer: "Amazon Web Services (AWS)", thumbnail_url: AWS,  certificate_url: null, credential_id: null, issued_date: "2025-12-01" },
  { id: "5",  title: "Official Practice Question Set: AWS Certified Cloud Practitioner (CLF-C02)", issuer: "Amazon Web Services (AWS)", thumbnail_url: AWS, certificate_url: null, credential_id: null, issued_date: "2025-12-01" },
  // Frontend Masters — Nov 2025
  { id: "6",  title: "Course Completed: AWS For Front-End Engineers, v2",                 issuer: "Frontend Masters",          thumbnail_url: null, certificate_url: null, credential_id: null, issued_date: "2025-11-01" },
  // AWS — Jul 2025
  { id: "7",  title: "AWS Educate Introduction to Generative AI",                         issuer: "Amazon Web Services (AWS)", thumbnail_url: AWS,  certificate_url: null, credential_id: null, issued_date: "2025-07-01" },
  // Dicoding — May 2025
  { id: "8",  title: "Financial Literacy 101",                                             issuer: "Dicoding Indonesia",        thumbnail_url: null, certificate_url: null, credential_id: null, issued_date: "2025-05-01" },
  // Google — Feb 2025
  { id: "9",  title: "Automate Data Capture at Scale with Document AI",                   issuer: "Google",                    thumbnail_url: GOOG, certificate_url: null, credential_id: null, issued_date: "2025-02-01" },
  { id: "10", title: "Boost Productivity with Gemini in BigQuery",                        issuer: "Google",                    thumbnail_url: GOOG, certificate_url: null, credential_id: null, issued_date: "2025-02-01" },
  // Page 2
  { id: "11", title: "React and TypeScript",                                              issuer: "Frontend Masters",          thumbnail_url: null, certificate_url: null, credential_id: null, issued_date: "2025-01-15" },
  { id: "12", title: "Introduction to Go Programming",                                    issuer: "Udemy",                     thumbnail_url: UDEM, certificate_url: null, credential_id: null, issued_date: "2024-12-10" },
  { id: "13", title: "Docker & Kubernetes: The Practical Guide",                          issuer: "Udemy",                     thumbnail_url: UDEM, certificate_url: null, credential_id: null, issued_date: "2024-11-20" },
  { id: "14", title: "Belajar Dasar Pemrograman Web",                                     issuer: "Dicoding Indonesia",        thumbnail_url: null, certificate_url: null, credential_id: null, issued_date: "2024-10-05" },
  { id: "15", title: "PostgreSQL for Everybody",                                          issuer: "Coursera",                  thumbnail_url: COUR, certificate_url: null, credential_id: null, issued_date: "2024-09-01" },
  { id: "16", title: "Blender 3D: Your First 3D Character",                              issuer: "Udemy",                     thumbnail_url: UDEM, certificate_url: null, credential_id: null, issued_date: "2024-08-10" },
  { id: "17", title: "Introduction to Linux",                                             issuer: "Linux Foundation",          thumbnail_url: LINX, certificate_url: null, credential_id: null, issued_date: "2024-07-01" },
  { id: "18", title: "Belajar Fundamental Aplikasi Back-End",                             issuer: "Dicoding Indonesia",        thumbnail_url: null, certificate_url: null, credential_id: null, issued_date: "2024-06-15" },
  { id: "19", title: "Complete Next.js Developer in 2024",                                issuer: "Udemy",                     thumbnail_url: UDEM, certificate_url: null, credential_id: null, issued_date: "2024-05-20" },
  { id: "20", title: "Google Cloud Fundamentals: Core Infrastructure",                   issuer: "Google",                    thumbnail_url: GOOG, certificate_url: null, credential_id: null, issued_date: "2024-04-10" },
];
