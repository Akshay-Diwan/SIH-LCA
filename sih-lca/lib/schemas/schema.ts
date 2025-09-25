import { z } from "zod";

// ---------------- Projects ----------------
export const ProjectSchema = z.object({
  id: z.number().int().optional(),
  user_id: z.number().int().default(123),
  name: z.string().min(1).default("process"),
  description: z.string().nullable().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

// ---------------- Product Systems ----------------
export const ProductSystemSchema = z.object({
  id: z.number().int().optional(),
  project_id: z.number().int(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

// ---------------- Processes (Nodes) ----------------
export const ProcessSchema = z.object({
  id: z.number().int().optional(),
  product_system_id: z.number().int(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  reference_flow: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  technology: z.string().nullable().optional(),
  valid_from: z.date().nullable().optional(),
  valid_to: z.date().nullable().optional(),
  data_source: z.string().nullable().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

// ---------------- Process Links (Graph Edges) ----------------
export const ProcessLinkSchema = z.object({
  id: z.number().int().optional(),
  from_process_id: z.number().int(),
  to_process_id: z.number().int(),
  description: z.string().nullable().optional(),
  created_at: z.date().optional(),
});

// ---------------- Input Params ----------------
export const InputParamSchema = z.object({
  id: z.number().int().optional(),
  process_id: z.number().int().default(123),
  type: z.enum(["material", "energy", "auxiliary", "infrastructure"]).default("material"),
  name: z.string().min(1).default("process"),
  amount: z.number().default(1),
  unit: z.string().min(1).default("kWt"),
  source: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  uncertainty_low: z.number().nullable().optional(),
  uncertainty_high: z.number().nullable().optional(),
  allocation_method: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

// ---------------- Process Params ----------------
export const ProcessParamSchema = z.object({
  id: z.number().int().optional(),
  process_id: z.number().int(),
  name: z.string().min(1),
  value: z.number(),
  unit: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  uncertainty_low: z.number().nullable().optional(),
  uncertainty_high: z.number().nullable().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

// ---------------- Output Params ----------------
export const OutputParamSchema = z.object({
  id: z.number().int().optional(),
  process_id: z.number().int(),
  type: z.enum(["product", "co-product", "emission_air", "emission_water", "waste"]),
  name: z.string().min(1),
  amount: z.number(),
  unit: z.string().min(1),
  location: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  uncertainty_low: z.number().nullable().optional(),
  uncertainty_high: z.number().nullable().optional(),
  notes: z.string().nullable().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});
