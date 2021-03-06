import { PolymerElement, html } from "@polymer/polymer/polymer-element.js"
import "../stylesheets/shared-styles.js"
import "./ra-risk-assessment.js"
import { setNewLocalStorage } from "../helpers/setNewLocalStorage.js"
import { getLocalStorageValue } from "../helpers/getLocalStorageValue.js"
import { setValueToFactor } from "../helpers/setValueToFactor.js"

class FormLaw extends PolymerElement {
  static get template() {
    return html`
      <style  include="shared-styles">

      </style>

        <div class="riskAssessment">
            <ra-risk-assessment></ra-risk-assessment>
        </div>
        
      <fieldset>
        <legend>Justitie</legend>
            <div class="inputForm">
                <label for="crime">Kind in het verleden verdacht geweest van een delict</label>
                <select on-change="onChangeSelect" name="crime" id="crime">
                    <option value="no">Nee</option>
                    <option value="yes">Ja</option>
                </select>
            </div>

            <div class="inputForm">
                <label for="halt">Kind in aanraking geweest met bureau HALT voor een delict</label>
                <select on-change="onChangeSelect" name="halt" id="halt">
                    <option value="no">Nee</option>
                    <option value="yes">Ja</option>
                </select>
            </div>

            <div class="inputForm">
                <label for="crimeParents">Vader of moeder verdacht van delict in het verleden</label>
                <select on-change="onChangeSelect" name="crimeParents" id="crimeParents">
                    <option value="no">Nee</option>
                    <option value="yes">Ja</option>
                </select>
            </div>

            <div class="inputForm">
                <label for="crimeFather">Vader verdacht van delict in het verleden</label>
                <select on-change="onChangeSelect" name="crimeFather" id="crimeFather">
                    <option value="no">Nee</option>
                    <option value="yes">Ja</option>
                </select>
            </div>

            <div class="inputForm">
                <label for="crimeMother">Moeder verdacht van delict in het verleden</label>
                <select on-change="onChangeSelect" name="crimeMother" id="crimeMother">
                    <option value="no">Nee</option>
                    <option value="yes">Ja</option>
                </select>
            </div>
        </fieldset> 


    `
  }
  onChangeSelect (event) {
    const { target } = event
    const { options } = target
    const { name: inputName } = target
    const selectedValue = options[target.selectedIndex].value

    setNewLocalStorage(inputName, selectedValue, "law")

    if (inputName === "crime") {
        if (selectedValue === "no") {
            setValueToFactor(inputName, 0)
        } else {
            setValueToFactor(inputName, 0.94737545)
        }
    } else if (inputName === "halt") {
        if (selectedValue === "no") {
            setValueToFactor(inputName, 0)
        } else {
            setValueToFactor(inputName, 0.36448201)
        }
    } else if (inputName === "crimeParents") {
        if (selectedValue === "no") {
            setValueToFactor(inputName, 0)
        } else {
            setValueToFactor(inputName, 0.50027131)
        }
    } else {
        setValueToFactor(inputName, 0)
    }

    try {
        window.localStorage.setItem("factors", JSON.stringify(window.factors))
        // triggers an event, which in this case is fake
        document.dispatchEvent(new Event ("launchEvent"))
    } catch (error) {
        throw new Error (error)
    }
  }

  ready () {
    super.ready()

    const inputNames = [
        "crime",
        "halt",
        "crimeParents",
        "crimeFather",
        "crimeMother"
    ]

    // loop over inputNames, get all inputNames
    inputNames.map(inputNames => {
        // acces via shadowRoot html elements with inputNames
        const select = this.shadowRoot.getElementById(inputNames)
        // get local storage 
        const valueLocalStorage = getLocalStorageValue("law", inputNames)
        console.log(valueLocalStorage)

        if (valueLocalStorage) {
            select.value = valueLocalStorage
        }
    })
}

}

window.customElements.define("ra-form-law", FormLaw);
