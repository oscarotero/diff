var v = Object.defineProperty;
var o = (s, t) => v(s, "name", { value: t, configurable: !0 });
var u = class extends HTMLElement {
  constructor() {
    super(),
      this.tabFocus = 0,
      this.tabs = this.querySelectorAll('[role="tab"]'),
      this.tabList = this.querySelector('[role="tablist"]'),
      this.buttonBoundListener = this.handleTabChange.bind(this),
      this.keydownBoundListener = this.handleKeyPress.bind(this);
  }
  connectedCallback() {
    this.tabs.forEach((t) => {
      t.addEventListener("click", this.buttonBoundListener);
    }), this.tabList.addEventListener("keydown", this.keydownBoundListener);
  }
  handleKeyPress(t) {
    (t.keyCode === 39 || t.keyCode === 37) &&
      (this.tabs[this.tabFocus].setAttribute("tabindex", -1),
        t.keyCode === 39
          ? (this.tabFocus++,
            this.tabFocus >= this.tabs.length && (this.tabFocus = 0))
          : t.keyCode === 37 &&
            (this.tabFocus--,
              this.tabFocus < 0 && (this.tabFocus = this.tabs.length - 1)),
        this.tabs[this.tabFocus].setAttribute("tabindex", 0),
        this.tabs[this.tabFocus].focus());
  }
  handleTabChange(t) {
    let e = t.target,
      n = e.parentNode.parentNode,
      l = e.getAttribute("aria-controls");
    n.querySelectorAll('[aria-selected="true"]').forEach((r) => {
      r !== e &&
        (r.setAttribute("aria-selected", !1),
          r.setAttribute("tabindex", -1),
          r.classList.remove("is-active"));
    }),
      e.setAttribute("aria-selected", !0),
      e.setAttribute("tabindex", 0),
      e.classList.add("is-active"),
      n.parentNode.querySelectorAll('[role="tabpanel"]').forEach((r) => {
        r.id === l ? r.removeAttribute("hidden") : r.setAttribute("hidden", !0);
      });
  }
};
o(u, "LumeCode");
var m,
  d = class extends HTMLElement {
    static get observedAttributes() {
      return ["index"];
    }
    constructor() {
      super(), this.scrollBehavior = "smooth", this.history = "push";
    }
    connectedCallback() {
      if (
        L(this, "position") === "static" && (this.style.position = "relative"),
          this.addEventListener("keydown", (t) => {
            switch (t.keyCode) {
              case 37:
                this.index -= 1, t.preventDefault();
                break;
              case 39:
                this.index += 1, t.preventDefault();
                break;
            }
          }),
          k(this),
          E(this),
          this.querySelector(":scope > [id]")
      ) {
        self.addEventListener(
          "popstate",
          () => p(this, document.location.hash),
        ),
          document.location.hash
            ? p(this, document.location.hash)
            : this.children[0] && y(this.children[0], this.history);
        let t,
          e = o(() => {
            clearTimeout(t),
              t = setTimeout(() => {
                let i = this.target;
                y(i, this.history), this.lastTarget = i;
              }, 50);
          }, "handleScroll");
        this.addEventListener("scroll", e, !1);
      }
      window.ResizeObserver && (m || (m = new ResizeObserver((t) => {
        for (let e of t) {
          let i = e.target;
          if (i.lastTarget) {
            let n = i.scrollBehavior;
            i.scrollBehavior = "auto",
              i.target = i.lastTarget,
              i.scrollBehavior = n;
          }
        }
      })),
        m.observe(this));
    }
    disconnectedCallback() {
      m && m.unobserve(this);
    }
    attributeChangedCallback(t, e, i) {
      if (t === "index") {
        this.index = parseInt(i);
        return;
      }
    }
    next(t = 1) {
      this.scrollFromLeft += this.clientWidth * t;
    }
    prev(t = 1) {
      this.scrollFromLeft -= this.clientWidth * t;
    }
    get index() {
      let t = this.children.length - 1, e = this.children;
      for (let i = 0; i < t; i++) {
        let n = e[i], l = Math.round(n.offsetLeft - this.clientWidth / 2);
        if (
          this.scrollLeft >= l && this.scrollLeft <= l + n.clientWidth
        ) return i;
      }
      return t;
    }
    set index(t) {
      if (typeof t != "number" || Math.round(t) !== t) {
        throw new Error(
          "Invalid index value. It must be an integer",
        );
      }
      let e = this.children;
      t = Math.min(Math.max(t, 0), e.length - 1), this.target = e[t];
    }
    get target() {
      return this.children[this.index];
    }
    set target(t) {
      if (t.parentElement !== this) {
        throw new Error(
          "The target must be a direct child of this element",
        );
      }
      let e = Math.round(
        t.offsetLeft - this.clientWidth / 2 + t.clientWidth / 2,
      );
      this.scrollFromLeft = Math.max(0, e), this.lastTarget = t;
    }
    get scrollFromLeft() {
      return this.scrollLeft;
    }
    set scrollFromLeft(t) {
      try {
        this.scroll({ left: t, behavior: this.scrollBehavior });
      } catch {
        this.scrollLeft = t;
      }
    }
    get scrollFromRight() {
      return this.scrollWidth - this.clientWidth - this.scrollLeft;
    }
    set scrollFromRight(t) {
      this.scrollFromLeft = this.scrollWidth - this.clientWidth - t;
    }
  };
o(d, "Carousel");
function p(s, t) {
  if (!t) return;
  let e = s.querySelector(`:scope > ${t}`);
  e && (s.target = e);
}
o(p, "handleTarget");
function y(s, t) {
  if (!(!s.id || document.location.hash === `#${s.id}`)) {
    switch (t) {
      case "push":
        history.pushState({}, null, `#${s.id}`);
        break;
      case "replace":
        history.replaceState({}, null, `#${s.id}`);
        break;
    }
  }
}
o(y, "handleHistory");
function L(s, t) {
  let e = getComputedStyle(s)[t];
  if (e && e.replace(/none/g, "").trim()) return e;
}
o(L, "getStyleValue");
function k(s) {
  "scroll" in s && "scrollBehavior" in s.style ||
    console.info(
      "@oom/carusel [compatibility]:",
      'Missing smooth scrolling support. Consider using a polyfill like "smoothscroll-polyfill"',
    );
}
o(k, "checkScrollSupport");
function E(s) {
  s.getAttribute("role") !== "region" &&
  console.info(
    "@oom/carusel [accesibility]:",
    'Missing role="region" attribute in the carousel element',
  ),
    s.hasAttribute("aria-label") ||
    console.info(
      "@oom/carusel [accesibility]:",
      "Missing aria-label attribute in the carousel element",
    ),
    s.hasAttribute("tabindex") ||
    console.info(
      "@oom/carusel [accesibility]:",
      'Missing tabindex="0" attribute in the carousel element',
    );
}
o(E, "checkA11y");
var f = class extends HTMLElement {
  connectedCallback() {
    let t = this.querySelectorAll("button"),
      e = document.querySelector(this.getAttribute("target"));
    t.forEach((l) => {
      l.addEventListener("click", () => {
        l.value === "next" ? e.next() : e.prev();
      });
    });
    let i;
    e.addEventListener("scroll", () => {
      clearTimeout(i), i = setTimeout(n, 50);
    }, !1), e.addEventListener("mouseenter", n);
    function n() {
      t.forEach((l) => {
        switch (l.value) {
          case "next":
            l.disabled = e.scrollFromRight < 5;
            break;
          case "prev":
            l.disabled = e.scrollFromLeft < 5;
            break;
        }
      });
    }
    o(n, "showHideButtons"), n();
  }
};
o(f, "LumeCode");
var b = class extends HTMLElement {
  connectedCallback() {
    let t = this.querySelector("form"),
      e = this.querySelectorAll(":scope > ul > li"),
      i = new URLSearchParams(window.location.search);
    for (let r of i.keys()) {
      let c = t[r];
      c && (c.checked = !0);
    }
    t.addEventListener("submit", (r) => {
      n(), r.preventDefault();
    }),
      t.addEventListener("input", n),
      n();
    function n() {
      t.querySelectorAll("input[type='checkbox']").forEach((h) => {
        let a = h.closest(".button");
        a && a.classList.toggle("is-active", h.checked);
      });
      let r = new FormData(t);
      l(r);
      let c = new URLSearchParams(r).toString();
      if (c !== document.location.search) {
        let h = c ? `?${c}` : document.location.pathname;
        history.pushState({}, null, h);
      }
    }
    o(n, "onChange");
    function l(r) {
      let c = [], h;
      for (let [a, g] of r.entries()) {
        if (a === "status") {
          h = g;
          continue;
        }
        c.push(a);
      }
      e.forEach((a) => {
        switch (h) {
          case "enabled":
            if (!a.classList.contains("is-enabled")) {
              a.hidden = !0;
              return;
            }
            break;
          case "disabled":
            if (a.classList.contains("is-enabled")) {
              a.hidden = !0;
              return;
            }
            break;
        }
        a.hidden = c.length &&
          c.every((g) => !a.dataset.tags.split(",").includes(g));
      });
    }
    o(l, "filter");
  }
};
o(b, "LumeFilter");
customElements.define("lume-code", u);
customElements.define("lume-carousel", d);
customElements.define("lume-carousel-controls", f);
customElements.define("lume-filter", b);
var x = navigator.userAgent, A = x.indexOf("Chrome") > -1;
A && new ReportingObserver((t) => {
  for (let e of t) console.log(e.type, e.url, e.body);
}, { buffered: !0 }).observe();
