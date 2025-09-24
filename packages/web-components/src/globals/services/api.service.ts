import { ENVIRONMENT } from '../constants';
import type { AnnotationsQueryArgs, AnnotationsApiResponse } from '../models/annotation';

export class ApiService {
  private baseUrl: string;
  private apiVersion: string;

  constructor() {
    this.baseUrl = ENVIRONMENT.apiUrl;
    this.apiVersion = 'pango-1'; // Default API version
  }

  private async makeGraphQLRequest(query: string, variables?: Record<string, any>): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Version': this.apiVersion,
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.errors) {
        throw new Error(`GraphQL error: ${result.errors.map((e: any) => e.message).join(', ')}`);
      }

      return result.data;
    } catch (error) {
      console.error('GraphQL request failed:', error);
      throw error;
    }
  }

  async getAnnotations(queryArgs: AnnotationsQueryArgs): Promise<AnnotationsApiResponse> {
    const query = `
      query GetAnnotations($filterArgs: AnnotationFilterArgs, $pageArgs: PageArgs) {
        annotations(filterArgs: $filterArgs, pageArgs: $pageArgs) {
          gene
          geneName
          geneSymbol
          longId
          pantherFamily
          taxonAbbr
          taxonId
          coordinatesChrNum
          coordinatesStart
          coordinatesEnd
          coordinatesStrand
          term {
            id
            aspect
            isGoslim
            label
            displayId
          }
          termType
          slimTerms {
            aspect
            id
            isGoslim
            label
            displayId
          }
          evidenceType
          evidence {
            withGeneId {
              gene
              geneName
              geneSymbol
              taxonAbbr
              taxonId
              taxonLabel
              coordinatesChrNum
              coordinatesStart
              coordinatesEnd
              coordinatesStrand
            }
            references {
              pmid
              title
              date
              authors
            }
          }
          groups
        }
      }
    `;

    const variables = {
      filterArgs: {
        geneIds: queryArgs.filterArgs?.geneIds || [],
        termIds: queryArgs.filterArgs?.termIds || [],
        termTypeIds: queryArgs.filterArgs?.termTypeIds || [],
        slimTermIds: queryArgs.filterArgs?.slimTermIds || [],
        evidenceTypeIds: queryArgs.filterArgs?.evidenceTypeIds || [],
        aspectIds: queryArgs.filterArgs?.aspectIds || [],
        withGeneIds: queryArgs.filterArgs?.withGeneIds || [],
        referenceIds: queryArgs.filterArgs?.referenceIds || [],
      },
      pageArgs: {
        page: queryArgs.pageArgs?.page || 0,
        size: queryArgs.pageArgs?.size || 50,
      },
    };

    const data = await this.makeGraphQLRequest(query, variables);
    return { annotations: data.annotations || [] };
  }

  async getAnnotationsCount(filterArgs?: any): Promise<{ total: number }> {
    const query = `
      query GetAnnotationsCount($filterArgs: AnnotationFilterArgs) {
        annotationsCount(filterArgs: $filterArgs) {
          total
        }
      }
    `;

    const variables = {
      filterArgs: filterArgs || {},
    };

    const data = await this.makeGraphQLRequest(query, variables);
    return data.annotationsCount || { total: 0 };
  }

  async getAnnotationStats(filterArgs?: any): Promise<any> {
    const query = `
      query GetAnnotationsStats($filterArgs: AnnotationFilterArgs) {
        annotationStats(filterArgs: $filterArgs) {
          termTypeFrequency {
            buckets {
              docCount
              key
            }
          }
          slimTermFrequency {
            buckets {
              docCount
              key
              meta {
                id
                aspect
                label
                displayId
              }
            }
          }
        }
      }
    `;

    const variables = {
      filterArgs: filterArgs || {},
    };

    const data = await this.makeGraphQLRequest(query, variables);
    return data.annotationStats;
  }

  async getSlimTermsAutocomplete(keyword: string): Promise<any> {
    const query = `
      query GetSlimTermAutocomplete($keyword: String!, $filterArgs: AnnotationFilterArgs) {
        slimTermsAutocomplete(keyword: $keyword, filterArgs: $filterArgs) {
          label
          id
          aspect
          count
          displayId
        }
      }
    `;

    const variables = {
      keyword,
      filterArgs: {},
    };

    const data = await this.makeGraphQLRequest(query, variables);
    return data.slimTermsAutocomplete;
  }

  setApiVersion(version: string) {
    this.apiVersion = version;
  }
}