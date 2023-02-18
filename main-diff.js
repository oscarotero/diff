import diff from "./diff.js";

console.log("START!");

document.addEventListener("click", (ev) => {
  if (ev.target.matches("a")) {
    applyDiff(ev.target.href);
    ev.preventDefault();
  }
});

async function applyDiff(url) {
  const response = await fetch(url);
  const html = await response.text();
  const parser = new DOMParser();
  const document2 = parser.parseFromString(html, "text/html");

  diff(document, document2);
}

class Custom extends HTMLElement {
  static get observedAttributes() {
    return ["foo"];
  }

  connectedCallback() {
    console.log("Connected", this);
  }

  disconnectedCallback() {
    console.log("Disconnected", this);
  }

  adoptedCallback() {
    console.log("Adopted", this);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log("Attribute changed", { name, oldValue, newValue }, this);
  }
}

customElements.define("my-custom", Custom);
