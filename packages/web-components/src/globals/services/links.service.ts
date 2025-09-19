import type { Annotation } from '../models/annotation';
import { ENVIRONMENT } from '../constants';

export class LinksService {
  getHGNC(longId: string): string | null {
    const pattern = /HGNC=(\d+)/;
    const matches = longId.match(pattern);

    if (matches && matches.length > 1) {
      return `HGNC:${matches[1]}`;
    }

    return null;
  }

  getGeneAccession(gene: string): string | null {
    if (!gene) return null;

    const geneId = gene.split(':');
    return geneId.length > 1 ? geneId[1] : null;
  }

  getUniprotLink(gene: string): string {
    if (!gene) return ENVIRONMENT.uniprotUrl;

    const geneId = gene.split(':');
    return geneId.length > 1 ? ENVIRONMENT.uniprotUrl + geneId[1] : ENVIRONMENT.uniprotUrl;
  }

  getFamilyLink(element: Annotation): string {
    if (!element.pantherFamily || !element.longId) return ENVIRONMENT.pantherFamilyUrl;

    return `${ENVIRONMENT.pantherFamilyUrl}book=${encodeURIComponent(element.pantherFamily)}&seq=${encodeURIComponent(element.longId)}`;
  }

  getUCSCBrowserLink(annotation: Annotation): string {
    if (!annotation.coordinatesChrNum || !annotation.coordinatesStart || !annotation.coordinatesEnd)
      return ENVIRONMENT.ucscUrl;

    return `${ENVIRONMENT.ucscUrl}${annotation.coordinatesChrNum}:${annotation.coordinatesStart}-${annotation.coordinatesEnd}`;
  }

  getAGRLink(hgncId: string): string {
    if (!hgncId) return ENVIRONMENT.agrPrefixUrl;

    return ENVIRONMENT.agrPrefixUrl + hgncId;
  }

  getHGNCLink(hgncId: string): string {
    if (!hgncId) return ENVIRONMENT.hgncPrefixUrl;

    return ENVIRONMENT.hgncPrefixUrl + hgncId;
  }

  getNCBIGeneLink(geneSymbol: string): string {
    if (!geneSymbol) return ENVIRONMENT.ncbiGeneUrl;

    return `${ENVIRONMENT.ncbiGeneUrl}(${geneSymbol}%5BPreferred%20Symbol%5D)%20AND%209606%5BTaxonomy%20ID%5D`;
  }

  getPubmedArticleUrl(pmid: string): string {
    if (!pmid) return '';
    const id = pmid?.split(':');
    return id.length > 0 ? ENVIRONMENT.pubmedUrl + id[1] : '';
  }
}