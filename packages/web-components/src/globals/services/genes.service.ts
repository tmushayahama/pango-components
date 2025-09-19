import type { Annotation } from '../models/annotation';
import type { GroupedTerms, Term } from '../models/term';
import { GOAspect } from '../models/annotation';

export class GenesService {
  private groupTermsByAspect(terms: Term[]): Record<string, Term[]> {
    return terms.reduce((acc, term) => {
      const aspect = term.aspect?.toLowerCase();
      if (!acc[aspect]) {
        acc[aspect] = [];
      }
      acc[aspect].push(term);
      return acc;
    }, {} as Record<string, Term[]>);
  }

  transformTerms(annotations: Annotation[], maxTerms = 2): GroupedTerms {
    const terms = annotations.map((annotation: Annotation) => {
      return {
        ...annotation.term,
        evidenceType: annotation.evidenceType,
      } as Term;
    }).filter(term => term && term.id); // Filter out undefined terms

    const grouped = this.groupTermsByAspect(terms);

    return {
      mfs: grouped[GOAspect.MOLECULAR_FUNCTION.toLowerCase()] || [],
      bps: grouped[GOAspect.BIOLOGICAL_PROCESS.toLowerCase()] || [],
      ccs: grouped[GOAspect.CELLULAR_COMPONENT.toLowerCase()] || [],
      maxTerms,
      expanded: false,
    };
  }

  formatGeneSymbol(geneSymbol: string): string {
    if (!geneSymbol) return '';
    return geneSymbol.trim().toUpperCase();
  }

  extractGeneId(longId: string): string | null {
    if (!longId) return null;

    // Extract gene ID from formats like "UniProtKB:P12345" or "HGNC:123"
    const parts = longId.split(':');
    return parts.length > 1 ? parts[1] : longId;
  }

  validateGeneId(geneId: string): boolean {
    if (!geneId || typeof geneId !== 'string') return false;

    // Basic validation for gene ID format
    return geneId.trim().length > 0 && !/^\s*$/.test(geneId);
  }

  getGeneDisplayName(annotation: Annotation): string {
    return annotation.geneName || annotation.geneSymbol || annotation.gene || 'Unknown Gene';
  }
}