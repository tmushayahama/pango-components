export const ENVIRONMENT = {
  apiUrl: 'https://functionome.geneontology.org/api/',
  contactUrl:
    'https://docs.google.com/forms/d/e/1FAIpQLScX_caoY-mqsyK5Y6M2bof7EXVG0UY5DhOQ67zBMoAKKlRF4Q/viewform?usp=sharing',
  contactPrefillUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScX_caoY-mqsyK5Y6M2bof7EXVG0UY5DhOQ67zBMoAKKlRF4Q/viewform?usp=pp_url',
  amigoTermUrl: 'http://amigo.geneontology.org/amigo/term/',
  amigoGPUrl: 'http://amigo.geneontology.org/amigo/gene_product/',
  pubmedUrl: 'https://www.ncbi.nlm.nih.gov/pubmed/',
  taxonApiUrl: 'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=',
  ucscUrl:
    'https://genome.ucsc.edu/cgi-bin/hgTracks?db=hg38&lastVirtModeType=default&lastVirtModeExtraState=&virtModeType=default&virtMode=0&nonVirtPosition=&position=chr',
  pantherFamilyUrl: 'https://enrichment.functionome.org/treeViewer/treeViewer.jsp?',
  overrepApiUrl: 'https://enrichment.functionome.org/webservices/go/overrep.jsp',
  uniprotUrl: 'https://www.uniprot.org/uniprotkb/',
  agrPrefixUrl: 'https://www.alliancegenome.org/gene/',
  hgncPrefixUrl: 'https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/',
  ncbiGeneUrl: 'https://www.ncbi.nlm.nih.gov/gene/?term=',
  pantreeUrl: 'https://pantree.functionome.org/tree/family.jsp?accession=',
  downloadAllDataCSVUrl: 'https://functionome.geneontology.org/download/export_annotations.zip',
  downloadAllDataJSONUrl:
    'https://functionome.geneontology.org/download/export_annotations.json.gz',
  downloadAnnotationsGAFUrl:
    'https://functionome.geneontology.org/download/functionome_release.gaf.gz',
  downloadEvolutionaryModelsGAFUrl: 'https://functionome.geneontology.org/download/IBD.gaf',
  downloadOntologyFilesUrl: 'https://release.geneontology.org/2022-03-22/ontology/index.html',
  overrepDocsApiUrl: 'https://geneontology.org/docs/go-enrichment-analysis/',
  paperUrl: 'https://www.nature.com/articles/s41586-025-08592-0',
};

export enum AspectType {
  MOLECULAR_FUNCTION = 'molecular function',
  BIOLOGICAL_PROCESS = 'biological process',
  CELLULAR_COMPONENT = 'cellular component',
}

export enum TermType {
  KNOWN = 'known',
  UNKNOWN = 'unknown',
}

export enum EvidenceType {
  DIRECT = 'direct',
  HOMOLOGY = 'homology',
  NA = 'n/a',
}

export const ASPECT_ORDER: Record<string, number> = {
  'molecular function': 1,
  'biological process': 2,
  'cellular component': 3,
};

export interface TermMapType {
  id: string;
  label: string;
  hint: string;
  description: string;
  color: string;
}

export interface AspectMapType {
  id: string;
  icon: string;
  shorthand: string;
  label: string;
  description: string;
  color: string;
}

export interface EvidenceMapType {
  id: string;
  label: string;
  hint: string;
  description: string;
  color: string;
  shorthand: string;
  iconTooltip: string;
}

export const ASPECT_MAP: { [key: string]: AspectMapType } = {
  [AspectType.MOLECULAR_FUNCTION]: {
    id: AspectType.MOLECULAR_FUNCTION,
    icon: 'coverage-4',
    shorthand: 'MF',
    label: 'Molecular Function',
    description: 'Activities that occur at the molecular level',
    color: '#0ea5e9', // sky-500
  },
  [AspectType.BIOLOGICAL_PROCESS]: {
    id: AspectType.BIOLOGICAL_PROCESS,
    icon: 'timeline',
    shorthand: 'BP',
    label: 'Biological Process',
    description: 'A series of molecular events with a defined beginning and end',
    color: '#10b981', // emerald-500
  },
  [AspectType.CELLULAR_COMPONENT]: {
    id: AspectType.CELLULAR_COMPONENT,
    icon: 'scatter_plot',
    shorthand: 'CC',
    label: 'Cellular Component',
    description: 'A location relative to cellular structures',
    color: '#f59e0b', // amber-500
  },
};

export const TERM_TYPE_MAP: { [key: string]: TermMapType } = {
  [TermType.KNOWN]: {
    id: TermType.KNOWN,
    label: 'Known',
    hint: 'Functional characteristics',
    description: 'Genes with known functional annotations',
    color: '#10b981', // emerald-500
  },
  [TermType.UNKNOWN]: {
    id: TermType.UNKNOWN,
    label: 'Unknown',
    hint: 'Unknown function aspects',
    description: 'Genes with unknown or predicted functional annotations',
    color: '#6b7280', // gray-500
  },
};

export const EVIDENCE_TYPE_MAP: { [key: string]: EvidenceMapType } = {
  [EvidenceType.DIRECT]: {
    id: EvidenceType.DIRECT,
    label: 'Direct',
    hint: 'Direct experimental evidence',
    description: 'Evidence from direct experimental studies',
    color: '#10b981', // emerald-500
    shorthand: 'DIR',
    iconTooltip: 'Direct evidence from experimental studies',
  },
  [EvidenceType.HOMOLOGY]: {
    id: EvidenceType.HOMOLOGY,
    label: 'Homology',
    hint: 'Evidence by homology',
    description: 'Evidence inferred from sequence or structural similarity',
    color: '#0ea5e9', // sky-500
    shorthand: 'HOM',
    iconTooltip: 'Evidence inferred from homology',
  },
  [EvidenceType.NA]: {
    id: EvidenceType.NA,
    label: 'N/A',
    hint: 'Not applicable',
    description: 'Evidence type not applicable or not specified',
    color: '#6b7280', // gray-500
    shorthand: 'N/A',
    iconTooltip: 'Evidence type not specified',
  },
};