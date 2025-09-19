import { Component, h, State, Prop, Event, EventEmitter } from '@stencil/core';

export interface OntologyOption {
  id: string;
  label: string;
}

export interface FormSubmitEvent {
  geneIds: string;
  ontology: string;
  species: string;
  testType: string;
}

@Component({
  tag: 'overrep-form',
  styleUrl: 'overrep-form.scss',
  shadow: true
})
export class OverrepForm {
  // Props for configuration
  @Prop() ontologyOptions: OntologyOption[] = [];
  @Prop() exampleGenes: string[] = [];
  @Prop() submitUrl: string = '/api/overrep';
  @Prop() species: string = 'HUMAN';
  @Prop() testType: string = 'FISHER';
  @Prop() textareaRows: number = 3;
  @Prop() submitLabel: string = 'Launch';
  @Prop() examplesLabel: string = 'Examples';
  @Prop() geneIdsLabel: string = 'Your Gene IDs';
  @Prop() ontologyLabel: string = 'Ontology';
  @Prop() hint: string = 'can use UniProt ID/AC, Gene Name, Gene Symbols';
  @Prop() showHint: boolean = true;

  // Optional callback event
  @Event() overrepSubmit: EventEmitter<FormSubmitEvent>;

  @State() formData = {
    geneIds: '',
    ontology: ''
  };

  private handleSubmit = (e: Event) => {
    e.preventDefault();

    const payload: FormSubmitEvent = {
      geneIds: this.formData.geneIds,
      ontology: this.formData.ontology,
      species: this.species,
      testType: this.testType
    };

    // Emit event for parent components to handle
    this.overrepSubmit.emit(payload);

    // If submitUrl is provided, also handle default behavior
    if (this.submitUrl) {
      const params = new URLSearchParams({
        input: payload.geneIds,
        ontology: payload.ontology,
        species: payload.species,
        test_type: payload.testType
      });

      window.open(`${this.submitUrl}?${params.toString()}`, '_blank');
    }
  }

  private setExample = () => {
    this.formData = {
      ...this.formData,
      geneIds: this.exampleGenes.join('\n')
    };
  }

  private handleGeneIdsChange = (event: Event) => {
    const input = event.target as HTMLTextAreaElement;
    this.formData = {
      ...this.formData,
      geneIds: input.value
    };
  }

  private handleOntologyChange = (event: Event) => {
    const select = event.target as HTMLSelectElement;
    this.formData = {
      ...this.formData,
      ontology: select.value
    };
  }

  componentWillLoad() {
    if (this.ontologyOptions.length > 0) {
      this.formData.ontology = this.ontologyOptions[0].id;
    }
  }

  render() {
    return (
      <form class="overrep-form" onSubmit={this.handleSubmit}>
        <div class="form-group">
          <label class="form-label">{this.geneIdsLabel}</label>
          <textarea
            rows={this.textareaRows}
            value={this.formData.geneIds}
            onInput={this.handleGeneIdsChange}
            class="form-textarea"
          />
          {this.showHint && (
            <small class="hint">
              <strong>Hint:</strong> {this.hint}
            </small>
          )}
        </div>

        <div class="form-group">
          <label class="form-label">{this.ontologyLabel}</label>
          <select
            class="form-select"
            onInput={this.handleOntologyChange}
          >
            {this.ontologyOptions.map(option => (
              <option
                key={option.id}
                value={option.id}
                selected={this.formData.ontology === option.id}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div class="button-group">
          <button
            type="button"
            onClick={this.setExample}
            class="button button--secondary"
          >
            {this.examplesLabel}
          </button>

          <button
            type="submit"
            class="button button--primary"
          >
            {this.submitLabel}
            <span class="chevron-right">›</span>
          </button>
        </div>


      </form>
    );
  }
}