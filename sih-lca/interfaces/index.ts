import { InputParamSchema, OutputParamSchema, ProcessLinkSchema, ProcessParamSchema, ProcessSchema, ProductSystemSchema, ProjectSchema } from "@/lib/schemas/schema"
import z from "zod"

  export interface NodeData{
    name: string,
    input_params?: Array<InputRow>,
    output_params?: Array<string>,
    description?: Array<string>,
    previous_process?: string,
    next_process?:string
  }
  export interface InputRow{
      name: string,
      amount: number,
      scale: string,
      category: string
  }
  export enum TableType{
      INPUT="input_params",
      PROCESS="process_params",
      OUTPUT="output_params"
  }
  export interface Node{
  id: string,
  position: {
    x: number,
    y: number
  },
  data: {
    label: string
  },
  type: string
}
export interface Edge{
  id: string,
  source: string,
  target: string,
  sourceHandle: string,
  targetHandle: string
}
  export type InputParams = z.infer<typeof InputParamSchema> 
  export type OutputParams = z.infer<typeof OutputParamSchema>
  export type ProcessParams = z.infer<typeof ProcessParamSchema>
  export type Process = z.infer<typeof ProcessSchema>
  export type ProcessLink = z.infer<typeof ProcessLinkSchema>
  export type ProductSystem = z.infer<typeof ProductSystemSchema>
  export type Project = z.infer<typeof ProjectSchema>
  