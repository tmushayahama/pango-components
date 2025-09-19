import { Component, Element, Host, Prop, State, h } from '@stencil/core';
import { ASPECT_ORDER, ENVIRONMENT, ASPECT_MAP, EVIDENCE_TYPE_MAP, EvidenceType, TermType } from '../../globals/constants';
import { Annotation } from '../../globals/models/annotation';
import { GroupedTerms } from '../../globals/models/term';
import { ApiService } from '../../globals/services/api.service';
import { GenesService } from '../../globals/services/genes.service';
import { LinksService } from '../../globals/services/links.service';

@Component({
  tag: 'pango-gene',
  styleUrl: 'pango-gene.scss',
  shadow: true,
})
export class PangoGene {
  @Element() el!: HTMLElement;

  @Prop() geneId!: string;

  @State() annotations: Annotation[] = [];
  @State() groupedTerms: GroupedTerms | null = null;
  @State() isLoading: boolean = true;
  @State() error: string | null = null;
  @State() expandedSections: Record<string, boolean> = {
    'Molecular Function': true,
    'Biological Process': true,
    'Cellular Component': true,
  };
  @State() isMobile: boolean = false;

  private apiService = new ApiService();
  private linksService = new LinksService();
  private genesService = new GenesService();

  async componentWillLoad() {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));

    if (this.geneId) {
      await this.loadGeneData();
    }
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.checkScreenSize.bind(this));
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 768; // 768px is the md breakpoint
  }

  private async loadGeneData() {
    try {
      this.isLoading = true;
      const filterArgs = { geneIds: [this.geneId] };
      const pageArgs = { page: 0, size: 200 };

      const annotationsData = await this.apiService.getAnnotations({
        filterArgs,
        pageArgs,
      });

      this.annotations = [...(annotationsData?.annotations || [])].sort((a, b) => {
        const aspectA = a.term?.aspect?.toLowerCase() || '';
        const aspectB = b.term?.aspect?.toLowerCase() || '';
        return (ASPECT_ORDER[aspectA] || 999) - (ASPECT_ORDER[aspectB] || 999);
      });

      // Use genesService to transform terms
      this.groupedTerms = this.genesService.transformTerms(this.annotations, 150);

      this.isLoading = false;
    } catch (error) {
      console.error('Error loading gene data:', error);
      this.error = 'Failed to load gene data';
      this.isLoading = false;
    }
  } private handleExternalLinkClick(href: string) {
    // Analytics tracking can be implemented here
    console.log('External link clicked:', href);
  }

  private toggleSection(section: string) {
    this.expandedSections = {
      ...this.expandedSections,
      [section]: !this.expandedSections[section],
    };
  }

  private renderEvidenceIcon(evidenceType: string) {
    switch (evidenceType) {
      case EvidenceType.DIRECT:
        return (
          <svg class="evidence-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 3v15h3V6h4l-7-3z" />
          </svg>
        );
      case EvidenceType.HOMOLOGY:
        return (
          <svg class="evidence-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L7 7V22h10V7l-5-5z" />
          </svg>
        );
      default:
        return (
          <svg class="evidence-icon" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" opacity="0.3" />
          </svg>
        );
    }
  }

  private renderTerms(terms: any[], maxTerms: number, onToggleExpand: () => void) {
    if (!terms || terms.length === 0) return null;

    return (
      <div class="terms-container">
        {terms.slice(0, maxTerms).map((term, idx) => (
          <div
            key={idx}
            class="term-item"
            style={{
              backgroundColor: ASPECT_MAP[term.aspect]?.color + '20',
            }}
          >
            <div class="term-evidence">
              <div
                class="evidence-tooltip"
                title={EVIDENCE_TYPE_MAP[term.evidenceType]?.iconTooltip}
              >
                {this.renderEvidenceIcon(term.evidenceType)}
              </div>
            </div>
            <div class="term-content">
              <a
                href={`${ENVIRONMENT.amigoTermUrl}${term.id}`}
                target="_blank"
                rel="noopener noreferrer"
                class="term-link"
                onClick={() => this.handleExternalLinkClick(`${ENVIRONMENT.amigoTermUrl}${term.id}`)}
              >
                {term.name || term.label}
              </a>
            </div>
          </div>
        ))}
        {terms.length > maxTerms && (
          <button
            onClick={onToggleExpand}
            class="view-more-btn"
          >
            — View {terms.length - maxTerms} more terms
          </button>
        )}
      </div>
    );
  }

  private renderGeneSummary() {
    if (!this.groupedTerms) return null;

    const sections = [
      {
        title: 'Molecular Function',
        terms: this.groupedTerms.mfs,
      },
      {
        title: 'Biological Process',
        terms: this.groupedTerms.bps,
      },
      {
        title: 'Cellular Component',
        terms: this.groupedTerms.ccs,
      },
    ];

    if (this.isMobile) {
      return (
        <div class="gene-summary-mobile">
          <div class="mobile-sections">
            {sections.map(({ title, terms }) => (
              <div key={title} class="mobile-section">
                <button
                  onClick={() => this.toggleSection(title)}
                  class="mobile-section-header"
                >
                  <div class="section-header-content">
                    <svg
                      class={`chevron-icon${this.expandedSections[title] ? ' expanded' : ''}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <polyline points="9,18 15,12 9,6" />
                    </svg>
                    <span class="section-title-mobile">{title}</span>
                    <span class="section-count">
                      {(terms || []).length}
                    </span>
                  </div>
                </button>
                {this.expandedSections[title] && (
                  <div class="mobile-section-content">
                    {this.renderTerms(
                      terms || [],
                      this.groupedTerms.maxTerms || 500,
                      () => this.toggleSection(title)
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Desktop view
    return (
      <div class="gene-summary-desktop">
        <div class="summary-table">
          <table>
            <thead>
              <tr class="table-header-row">
                <th class="header-cell">Molecular Functions</th>
                <th class="header-cell">Biological Processes</th>
                <th class="header-cell">Cellular Components</th>
              </tr>
            </thead>
            <tbody>
              <tr class="table-content-row">
                <td class="term-cell">
                  {this.renderTerms(
                    this.groupedTerms.mfs || [],
                    this.groupedTerms.maxTerms || 500,
                    () => { }
                  )}
                </td>
                <td class="term-cell">
                  {this.renderTerms(
                    this.groupedTerms.bps || [],
                    this.groupedTerms.maxTerms || 500,
                    () => { }
                  )}
                </td>
                <td class="term-cell">
                  {this.renderTerms(
                    this.groupedTerms.ccs || [],
                    this.groupedTerms.maxTerms || 500,
                    () => { }
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  private renderInfoRow(label: string, value: string, href?: string) {
    return (
      <div class="info-row">
        <span class="info-label">{label}:</span>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => this.handleExternalLinkClick(href)}
            class="info-link"
          >
            {value}
            <svg class="external-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15,3 21,3 21,9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        ) : (
          <span class="info-value">{value}</span>
        )}
      </div>
    );
  }

  private renderStatBlock(number: number, label: string, sublabel?: string) {
    return (
      <div class="stat-block">
        <span class="stat-number">{number}</span>
        <div class="stat-labels">
          <div class="stat-label">{label}</div>
          {sublabel && <div class="stat-sublabel">{sublabel}</div>}
        </div>
      </div>
    );
  }

  private renderGeneHeader() {
    if (!this.annotations.length) return null;

    const annotation = this.annotations[0];
    const hgncId = this.linksService.getHGNC(annotation?.longId || '');

    return (
      <div class="gene-header">
        <h1 class="gene-title">
          <span class="gene-symbol">{annotation.geneSymbol}</span>: PAN-GO functions and evidence
        </h1>

        <div class="gene-info-container">
          {/* Gene Information Column */}
          <div class="gene-info-column">
            <h2 class="section-title">Gene Information</h2>
            <div class="info-section">
              {this.renderInfoRow('Gene', annotation.geneSymbol)}
              {this.renderInfoRow('Protein', annotation.geneName)}
              {this.renderInfoRow(
                'GO annotations from all sources',
                annotation?.gene,
                ENVIRONMENT.amigoGPUrl + annotation.gene
              )}
              {this.renderInfoRow(
                'PAN-GO evolutionary model for this family',
                annotation.pantherFamily,
                ENVIRONMENT.pantreeUrl + annotation.pantherFamily
              )}
            </div>
          </div>

          {/* External Links Column */}
          <div class="external-links-column">
            <h2 class="section-title">External Links</h2>
            <div class="info-section">
              {this.renderInfoRow(
                'UniProt',
                annotation?.gene,
                this.linksService.getUniprotLink(annotation.gene)
              )}
              {this.renderInfoRow(
                'PANTHER Tree Viewer',
                annotation.pantherFamily,
                this.linksService.getFamilyLink(annotation)
              )}
              {annotation.coordinatesChrNum &&
                this.renderInfoRow(
                  'UCSC Genome Browser',
                  `chr${annotation.coordinatesChrNum}:${annotation.coordinatesStart}-${annotation.coordinatesEnd}`,
                  this.linksService.getUCSCBrowserLink(annotation)
                )
              }
              {hgncId && (
                <div>
                  {this.renderInfoRow(
                    'Alliance of Genome Resources',
                    hgncId,
                    this.linksService.getAGRLink(hgncId)
                  )}
                  {this.renderInfoRow(
                    'HUGO Gene Nomenclature Committee',
                    hgncId,
                    this.linksService.getHGNCLink(hgncId)
                  )}
                </div>
              )}
              {this.renderInfoRow(
                'NCBI Gene',
                annotation.geneSymbol,
                this.linksService.getNCBIGeneLink(annotation.geneSymbol)
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  private renderStatsHeader() {
    if (!this.annotations.length) return null;

    const knownTermTypes = this.annotations.filter(a => a.termType === TermType.KNOWN).length;
    const unknownTermTypes = this.annotations.filter(a => a.termType === TermType.UNKNOWN).length;

    return (
      <div class="stats-header">
        <div class="stats-container">
          <div class="stats-title-section">
            <h2 class="stats-title">Function Summary</h2>
          </div>
          {this.renderStatBlock(
            knownTermTypes,
            'Annotations',
            '(functional characteristics)'
          )}
          {this.renderStatBlock(unknownTermTypes, 'Unknown function aspects')}
        </div>
      </div>
    );
  }

  private renderAnnotationTable() {
    if (!this.annotations.length) return null;

    return (
      <div class="annotation-table-container">
        <div class="table-header">
          <h2 class="table-title">Function Details</h2>
        </div>
        <div class="annotation-table">
          <table>
            <thead>
              <tr>
                <th class="evidence-col"></th>
                <th class="term-col">Term</th>
                <th class="category-col">GO Function Category</th>
                <th class="evidence-details-col">Evidence</th>
                <th class="contributors-col">Contributors</th>
              </tr>
            </thead>
            <tbody>
              {this.annotations.map((annotation, index) => (
                <tr key={index} class="annotation-row">
                  <td class="evidence-icon-cell">
                    <div
                      class="evidence-tooltip"
                      title={EVIDENCE_TYPE_MAP[annotation.evidenceType]?.iconTooltip}
                    >
                      {this.renderEvidenceIcon(annotation.evidenceType)}
                    </div>
                  </td>
                  <td class="term-cell">
                    <div class="term-display">
                      <span
                        class="aspect-badge"
                        style={{
                          borderColor: ASPECT_MAP[annotation.term?.aspect]?.color,
                          color: ASPECT_MAP[annotation.term?.aspect]?.color,
                          backgroundColor: `${ASPECT_MAP[annotation.term?.aspect]?.color}20`,
                        }}
                      >
                        {ASPECT_MAP[annotation.term?.aspect]?.shorthand}
                      </span>
                      <div class="term-link-container">
                        <a
                          href={`${ENVIRONMENT.amigoTermUrl}${annotation.term?.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="term-link"
                        >
                          {annotation.term?.label || annotation.term?.name}
                        </a>
                      </div>
                    </div>
                  </td>
                  <td class="slim-terms-cell">
                    {annotation.slimTerms?.map((term, termIdx) => (
                      <div key={termIdx} class="slim-term-item">
                        <span
                          class="aspect-badge"
                          style={{
                            borderColor: ASPECT_MAP[term.aspect]?.color,
                            color: ASPECT_MAP[term.aspect]?.color,
                            backgroundColor: `${ASPECT_MAP[term.aspect]?.color}20`,
                          }}
                        >
                          {ASPECT_MAP[term.aspect]?.shorthand}
                        </span>
                        <a
                          href={`${ENVIRONMENT.amigoTermUrl}${term.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="slim-term-link"
                        >
                          {term.label || term.name}
                        </a>
                      </div>
                    ))}
                  </td>
                  <td class="evidence-details-cell">
                    {annotation.evidence?.slice(0, 2).map((evidence, evidenceIdx) => (
                      <div key={evidenceIdx} class="evidence-item">
                        {evidence.withGeneId && (
                          <div class="with-gene-info">
                            {evidence.withGeneId} ({evidence.withGeneId.geneSymbol}) (
                            <a
                              href={ENVIRONMENT.taxonApiUrl + evidence.withGeneId.taxonId}
                              target="_blank"
                              rel="noopener noreferrer"
                              class="taxon-link"
                            >
                              {evidence.withGeneId.taxonAbbr}
                            </a>
                            )
                            <div class="gene-name">{evidence.withGeneId.geneName}</div>
                          </div>
                        )}
                        <div class="references-container">
                          {evidence.references?.slice(0, 2).map((ref, refIdx) => (
                            <div key={refIdx} class="reference-item">
                              <a
                                href={this.linksService.getPubmedArticleUrl(ref.pmid)}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="pmid-link"
                              >
                                {ref.pmid}
                              </a>
                              <div class="reference-details">
                                {ref.title} <span class="reference-date">({ref.date})</span>
                              </div>
                            </div>
                          ))}
                          {evidence.references && evidence.references.length > 2 && (
                            <div class="more-references">
                              + {evidence.references.length - 2} more reference(s)
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {annotation.evidence && annotation.evidence.length > 2 && (
                      <div class="more-evidence">
                        + {annotation.evidence.length - 2} more evidence
                      </div>
                    )}
                  </td>
                  <td class="contributors-cell">
                    {annotation.detailedGroups?.map((group, groupIdx) =>
                      group && (
                        <a
                          key={groupIdx}
                          href={group.id}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="contributor-link"
                        >
                          {group.label}
                        </a>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  render() {
    if (this.isLoading) {
      return (
        <Host>
          <div class="loading">Loading gene data...</div>
        </Host>
      );
    }

    if (this.error) {
      return (
        <Host>
          <div class="error">{this.error}</div>
        </Host>
      );
    }

    if (!this.annotations.length) {
      return (
        <Host>
          <div class="no-data">No gene data found</div>
        </Host>
      );
    }

    return (
      <Host>
        <div class="pango-gene-container">
          {this.renderGeneHeader()}
          {this.renderStatsHeader()}
          {this.renderGeneSummary()}
          {this.renderAnnotationTable()}
        </div>
      </Host>
    );
  }
}