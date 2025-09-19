import { Component, Prop, h, State, Element } from '@stencil/core';

// Import images
//import goLogo from '/assets/images/go-logo-yellow.png';
//import pantherLogo from './../../assets/images/panther-logo-yellow.png';

@Component({
  tag: 'pango-toolbar',
  styleUrl: 'pango-toolbar.scss',
  shadow: true,
  assetsDirs: ['assets']
})
export class PangoToolbar {
  @Element() el: HTMLElement;

  @Prop() headerTitle: string = 'PAN-GO';
  @Prop() headerSubTitle: string = 'Human Functionome';
  @Prop() pangoHome: string = '/';

  @State() isDropdownOpen: boolean = false;

  render() {
    return (
      <div class="pango-toolbar">
        <div class="pango-toolbar__container">
          <div class="pango-toolbar__logo-container">
            <a href={this.pangoHome} class="pango-toolbar__logo-link">
              <span class="pango-toolbar__logo-text">{this.headerTitle}</span>
            </a>
            <a href={this.pangoHome} class="pango-toolbar__logo-link">
              <span class="pango-toolbar__header-text">{this.headerSubTitle}</span>
            </a>
          </div>

          <div class="pango-toolbar__actions">
            <div class="pango-toolbar__social-links">
              <a href="https://github.com/pantherdb/pango" target="_blank" class="pango-toolbar__menu-button" rel="noopener noreferrer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>

            <div class="pango-toolbar__action-buttons">
              <pango-dropdown>
                <span slot="trigger">Download</span>
                <div slot="content" class="dropdown-content">
                  <a href="https://functionome.org/download/export_annotations.zip">As CSV</a>
                  <a href="https://functionome.org/download/export_annotations.json.gz">As JSON</a>
                </div>
              </pango-dropdown>
              <a href={`${this.pangoHome}/about`} class="pango-toolbar__action-link">About</a>
            </div>

            <div class="pango-toolbar__logo-section">
              <div class="pango-toolbar__logo-divider">
                <a href="http://geneontology.org/" target="_blank" rel="noopener noreferrer" class="pango-toolbar__partner-logo">
                  <img src={'goLogo'} alt="GO Logo" class="pango-toolbar__logo-image" />
                </a>
              </div>
              <div class="pango-toolbar__logo-divider">
                <a href="http://pantherdb.org" target="_blank" rel="noopener noreferrer" class="pango-toolbar__partner-logo">
                  <img src={'pantherLogo'} alt="Panther Logo" class="pango-toolbar__logo-image" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}