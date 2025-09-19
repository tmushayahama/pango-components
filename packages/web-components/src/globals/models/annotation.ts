import type { Term, TermType } from './term';

export enum GOAspect {
  MOLECULAR_FUNCTION = 'molecular function',
  BIOLOGICAL_PROCESS = 'biological process',
  CELLULAR_COMPONENT = 'cellular component',
}

export interface Gene {
  id: string
  geneSymbol: string
  geneName: string
  longId: string
  pantherFamily: string
  taxonAbbr: string
  taxonLabel: string
  taxonId: string
}

export interface Reference {
  pmid: string
  title: string
  authors: string[]
  date: string
}

export interface Evidence {
  withGeneId?: Gene
  references: Reference[]
}

export interface Group {
  label: string
  id: string
  shorthand: string
}

export interface Annotation {
  gene: string
  geneSymbol: string
  geneName: string
  longId: string
  pantherFamily: string
  taxonAbbr: string
  taxonLabel: string
  taxonId: string
  coordinatesChrNum?: string
  coordinatesStart?: number
  coordinatesEnd?: number
  coordinatesStrand?: number
  term?: Term
  termType: TermType
  slimTerms: Term[]
  evidenceType?: string
  evidence?: Evidence[]
  groups: string[]
  detailedGroups: Group[]
}

export interface FilterArgs {
  termIds?: string[]
  termTypeIds?: string[]
  slimTermIds?: string[]
  evidenceTypeIds?: string[]
  geneIds?: string[]
  aspectIds?: string[]
  withGeneIds?: string[]
  referenceIds?: string[]
}

export interface PageArgs {
  page: number
  size: number
}

export interface AnnotationsQueryArgs {
  filterArgs: FilterArgs
  pageArgs: PageArgs
}

export interface AnnotationsApiResponse {
  annotations: Annotation[]
  total?: number
}

export interface Bucket {
  key: string
  docCount: number
  meta?: any
}

export interface Frequency {
  buckets: Bucket[]
}

export interface AnnotationStats {
  distinctGeneCount: number
  termFrequency: Frequency
  termTypeFrequency: Frequency
  aspectFrequency: Frequency
  evidenceTypeFrequency: Frequency
  slimTermFrequency: Frequency
}