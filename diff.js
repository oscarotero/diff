export default function diff(document1, document2) {
  // nodes(document1.documentElement, document2.documentElement);
  nodes(document1.body, document2.body);
}

function nodes(el1, el2) {
  attributes(el1, el2);

  let child1 = el1.firstChild;
  let child2 = el2.firstChild;

  while (child1 || child2) {
    // There're no children in el1, move all remaining children from el2
    if (!child1) {
      while (child2) {
        el1.appendChild(child2);
        child2 = el2.firstChild;
      }

      break;
    }

    // There're no children in el2, remove all remaining children of el1
    if (!child2) {
      if (child1) {
        let last = el1.lastChild;

        while (last !== child1) {
          el1.removeChild(last);
          last = el1.lastChild;
        }

        el1.removeChild(child1);
      }
      break;
    }

    // Handle same-id elements
    if (child2.id && child2.id !== child1.id) {
      const exists1 = getNodeEquivalent(child1, child2);

      if (exists1) {
        child1 = el1.insertBefore(exists1, child1);
      }
    } else if (child1.id) {
      const exists2 = getNodeEquivalent(child2, child1);

      if (exists2) {
        while (child2 !== exists2) {
          el1.insertBefore(child2, child1);
          child2 = el2.firstChild;
        }
      }
    }

    switch (child2.nodeType) {
      case Node.TEXT_NODE:
      case Node.COMMENT_NODE:
        // Both are texts or comments, just update the value
        if (child1.nodeType === child2.nodeType) {
          if (child1.nodeValue !== child2.nodeValue) {
            child1.nodeValue = child2.nodeValue;
          }
          el2.removeChild(child2);
          break;
        }

        // Otherwise, replace the node
        el1.replaceChild(child2, child1);
        child1 = child2;
        break;

      case Node.ELEMENT_NODE:
        // If they are the same element type (DIV === DIV), merge it
        if (
          child1.nodeType === Node.ELEMENT_NODE &&
          child1.tagName === child2.tagName
        ) {
          nodes(child1, child2);
          el2.removeChild(child2);
          break;
        }

        // Otherwise, replace the node
        el1.replaceChild(child2, child1);
        child1 = child2;
        break;
      default:
        console.log(child2);
    }

    child1 = child1.nextSibling;
    child2 = el2.firstChild;
  }
}

function attributes(el1, el2) {
  for (const { name } of el1.attributes) {
    if (!el2.hasAttribute(name)) {
      el1.removeAttribute(name);
      continue;
    }

    if (el1.getAttribute(name) !== el2.getAttribute(name)) {
      el1.setAttribute(name, el2.getAttribute(name));
    }
  }

  for (const { name, value } of el2.attributes) {
    if (!el1.hasAttribute(name)) {
      el1.setAttribute(name, value);
    }
  }
}

function getNodeEquivalent(el1, el2) {
  const exists = el1.ownerDocument.getElementById(el2.id);

  return (exists && exists.parentNode === el1.parentNode && exists.tagName &&
      el2.tagName)
    ? exists
    : undefined;
}
