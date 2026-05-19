export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          long_description: string | null;
          thumbnail_url: string | null;
          screenshots: string[];
          tech_stack: string[];
          website_url: string | null;
          source_url: string | null;
          is_featured: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["projects"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      };
      certificates: {
        Row: {
          id: string;
          title: string;
          issuer: string;
          thumbnail_url: string | null;
          certificate_url: string | null;
          credential_id: string | null;
          issued_date: string;
        };
        Insert: Omit<Database["public"]["Tables"]["certificates"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["certificates"]["Insert"]>;
      };
      profile: {
        Row: {
          id: string;
          full_name: string;
          username: string;
          avatar_url: string | null;
          bio: string | null;
          tagline: string | null;
          cv_url: string | null;
          social_links: Json;
          is_open_to_work: boolean;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profile"]["Row"], "id" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profile"]["Insert"]>;
      };
      post_views: {
        Row: {
          slug: string;
          views: number;
          updated_at: string;
        };
        Insert: { slug: string; views?: number; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["post_views"]["Insert"]>;
      };
      api_cache: {
        Row: {
          key: string;
          data: Json;
          expires_at: string;
        };
        Insert: { key: string; data: Json; expires_at: string };
        Update: Partial<Database["public"]["Tables"]["api_cache"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      increment_post_views: {
        Args: { post_slug: string };
        Returns: number;
      };
    };
    Enums: Record<string, never>;
  };
}

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type Certificate = Database["public"]["Tables"]["certificates"]["Row"];
export type Profile = Database["public"]["Tables"]["profile"]["Row"];
export type PostView = Database["public"]["Tables"]["post_views"]["Row"];
