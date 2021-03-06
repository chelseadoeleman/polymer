import { PolymerElement, html } from "@polymer/polymer/polymer-element.js"
import { setPassiveTouchGestures, setRootPath } from "@polymer/polymer/lib/utils/settings.js"
import "@polymer/app-layout/app-drawer/app-drawer.js"
import "@polymer/app-layout/app-drawer-layout/app-drawer-layout.js"
import "@polymer/app-layout/app-header/app-header.js"
import "@polymer/app-layout/app-header-layout/app-header-layout.js"
import "@polymer/app-layout/app-scroll-effects/app-scroll-effects.js"
import "@polymer/app-layout/app-toolbar/app-toolbar.js"
import "@polymer/app-route/app-location.js"
import "@polymer/app-route/app-route.js"
import "@polymer/iron-pages/iron-pages.js"
import "@polymer/iron-selector/iron-selector.js"
import "@polymer/paper-icon-button/paper-icon-button.js"
import "./components/my-icons.js"
import { riskAssessmentToWindow } from "./helpers/RiskAssessmentToWindow.js"

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true)

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MyAppGlobals.rootPath)

// Shoutout to Maikel van Veen
// on page load set data and factors in localStorage
window.addEventListener("load", () => {
  const data = window.localStorage.getItem("data") || []

  // when the data array is not longer than 0 set these inputs into localStorage.
  if (!data.length > 0) {
    const dataInput = [
      {
        "id": 1,
        "general": {
          "firstname": "",
          "surname": "",
          "email": "",
          "genderKid": "",
          "ageKid": "",
          "help": ""
        },
        "birth": {
          "ageMotherBirth": "",
          "ageFatherBirth": "",
          "ageDifference": "",
          "ethnicity": ""
        },
        "career": {
          "education": "",
          "educationNow": "",
          "educationChange": "",
          "dropout": "",
          "educationLevelFather": "",
          "educationLevelMother": ""
        },
        "household": {
          "housing": "",
          "household": "",
          "seperated": ""
        },
        "mentalHealth": {
          "support": ""
        },
        "socialParticipation": {
          "socialParticipationFather": "",
          "socialParticipationMother": "",
          "statusFather": "",
          "statusMother": ""
        },
        "law": {
          "crime": "",
          "halt": "",
          "crimeParents": "",
          "crimeFather": "",
          "crimeMother": ""
        }

      }
  ]

    window.localStorage.setItem("data", JSON.stringify(dataInput))
  
  }
  // add riskAssessmentToWindow function, fires also on load
  riskAssessmentToWindow() 

})

class RisicoApp extends PolymerElement {
  // initialize shadow Dom template
  static get template() {
    return html`
      <style>
        .app-drawer-list {
          background-color: #a9bed8;
        }

        :host {
          --app-primary-color: lightblue;
          --app-secondary-color: black;
          display: block;
        }

        app-drawer {
          --app-drawer-content-container: {
            background-color: #a9bed8!important;
          }
        }

        app-drawer-layout:not([narrow]) [drawer-toggle] {
          display: none;
        }

        app-header {
          color: black;
          background-color: white;
        }

        app-header paper-icon-button {
          --paper-icon-button-ink-color: white;
        }

        app-toolbar {
          color: #2c4370;
          font-family: mono45-headline, monospace;
          font-size: 1.5em;
        }

        .drawer-list {
          margin: 0 20px;
        }

        .drawer-list a {
          display: block;
          padding: 0 16px;
          text-decoration: none;
          color: white;
          line-height: 40px;
        }

        .drawer-list a.iron-selected {
          color: white;
          font-weight: bold;
        }
      </style>

      <app-location route="{{route}}" url-space-regex="^[[rootPath]]">
      </app-location>

      <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}">
      </app-route>

      <app-drawer-layout fullbleed="" narrow="{{narrow}}">
        <!-- Drawer content -->
        <app-drawer id="drawer" slot="drawer" swipe-open="[[narrow]]">
          <app-toolbar>Categorieën</app-toolbar>
          <iron-selector selected="[[page]]" attr-for-selected="name" class="drawer-list" role="navigation">
            <a name="home" href="[[rootPath]]home">Home</a>
            <a name="general" href="[[rootPath]]general">Algemeen</a>
            <a name="birth" href="[[rootPath]]birth">Geboorte kind</a>
            <a name="career" href="[[rootPath]]career">Werk & opleiding</a>
            <a name="household" href="[[rootPath]]household">Huishouden</a>
            <a name="mentalHealth" href="[[rootPath]]mentalHealth">Geestelijke gezondheid</a>
            <a name="socialParticipation" href="[[rootPath]]socialParticipation">Maatschappelijke participatie</a>
            <a name="law" href="[[rootPath]]law">Justitie</a>
          </iron-selector>
        </app-drawer>

        <!-- Main content -->
        <app-header-layout has-scrolling-region="">

          <app-header slot="header" condenses="" reveals="" effects="waterfall">
            <app-toolbar>
              <paper-icon-button icon="my-icons:menu" drawer-toggle=""></paper-icon-button>
              <div main-title="">Risicotaxatie berekenen voor jeugdhulpverleners</div>
            </app-toolbar>
          </app-header>

          <iron-pages 
              selected="[[page]]" 
              attr-for-selected="name" 
              role="main">
            <ra-home name="home"></ra-home>
            <ra-general name="general"></ra-general>
            <ra-birth name="birth"></ra-birth>
            <ra-career name="career"></ra-career>
            <ra-household name="household"></ra-household>
            <ra-mentalHealth name="mentalHealth"></ra-mentalHealth>
            <ra-socialParticipation name="socialParticipation"></ra-socialParticipation>
            <ra-law name="law"></ra-law>
            <ra-404 name="404"></ra-404>
          </iron-pages>
        </app-header-layout>
      </app-drawer-layout>
    `
  }

  // declare properties
  static get properties() {
    return {
      page: {
        type: String,
        reflectToAttribute: true,
        observer: '_pageChanged'
      },
      routeData: Object,
      subroute: Object
    };
  }

  static get observers() {
    return [
      "_routePageChanged(routeData.page)"
    ];
  }

  _routePageChanged(page) {
     // Show the corresponding page according to the route.
     //
     // If no page was found in the route data, page will be an empty string.
     // Show 'home' in that case. And if the page doesn't exist, show 'view404'.
    if (!page) {
      this.page = "home";
    } else if (["home", "general", "birth", "career", "household", "mentalHealth", "socialParticipation", "law"].indexOf(page) !== -1) {
      this.page = page
    } else {
      this.page = "404"
    }

    // Close a non-persistent drawer when the page & route are changed.
    if (!this.$.drawer.persistent) {
      this.$.drawer.close()
    }
  }

  _pageChanged(page) {
    switch (page) {
      case "home":
        import("./views/ra-home.js")
        break
      case "general":
        import("./views/ra-general.js")
        break
      case "birth":
        import("./views/ra-birth.js")
        break
      case "career":
        import("./views/ra-career.js")
        break
      case "household":
        import("./views/ra-household.js")
        break
      case "mentalHealth":
        import("./views/ra-mentalhealth.js")
        break
      case "socialParticipation":
        import("./views/ra-socialparticipation.js")
        break
      case "law":
        import("./views/ra-law.js")
        break
      case "404":
        import("./views/ra-404.js")
        break
    }
  }
}

window.customElements.define("my-app", RisicoApp)
