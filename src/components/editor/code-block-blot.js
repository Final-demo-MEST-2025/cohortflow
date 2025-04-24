// components/editor/CodeBlockBlot.js
import Quill from "quill";

const Block = Quill.import("blots/block");

class CodeBlockBlot extends Block {
  static create() {
    const node = super.create();
    const code = document.createElement("code");
    code.setAttribute("spellcheck", "false");
    node.appendChild(code);
    return node;
  }

  static formats() {
    return true;
  }

  format(name, value) {
    if (name === this.statics.blotName && value) {
      // no-op
    } else {
      super.format(name, value);
    }
  }

  optimize(context) {
    super.optimize(context);
    const code = this.domNode.querySelector("code");
    if (!code) {
      const newCode = document.createElement("code");
      newCode.innerHTML = this.domNode.innerHTML;
      this.domNode.innerHTML = "";
      this.domNode.appendChild(newCode);
    }
  }

  html() {
    return `<pre><code>${
      this.domNode.querySelector("code").innerHTML
    }</code></pre>`;
  }
}

CodeBlockBlot.blotName = "code-block";
CodeBlockBlot.tagName = "pre";
CodeBlockBlot.className = "";

export default CodeBlockBlot;