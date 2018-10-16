import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '../stylesheets/shared-styles.js';
import '../components/ra-form-socialparticipation.js';

class SocialParticipation extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
      </style>

      <form action="#" method-"post">
        <ra-form-socialparticipation></ra-form-socialparticipation>
      </form>
    `;
  }
}

window.customElements.define('ra-socialparticipation', SocialParticipation);