/*!
 * Bornomala Script Pack
 * Copyright (c) 2025 Mohammad Mahfuz Rahman. All rights reserved.
 * This extension is proprietary software and may not be copied, modified,
 * redistributed, or sold without explicit permission from the author.
 */

const vscode = require("vscode");

function activate(context) {
  console.log("Bornomala Script Pack is now active!");

  const legend = new vscode.SemanticTokensLegend(
    ["keyword", "function", "variable", "class", "property", "operator"],
    []
  );

  context.subscriptions.push(
    vscode.languages.registerDocumentSemanticTokensProvider(
      { language: "bornomalascript" },
      new BornomalaScriptSemanticProvider(),
      legend
    )
  );
}

class BornomalaScriptSemanticProvider {
  async provideDocumentSemanticTokens(document) {
    const builder = new vscode.SemanticTokensBuilder();
    const lines = document.getText().split(/\r?\n/);

    for (let line = 0; line < lines.length; line++) {
      const text = lines[line];

      // ---------------- Keywords ----------------
      const pinkKeywords = /\b(jodi|othoba|nahole|jokhon|tokhon|jotokkhon|totokkhon|thamo|choluk|erModdhe|dekho|arNahole|object)\b/g;
      let match;
      while ((match = pinkKeywords.exec(text)) !== null) {
        builder.push(
          new vscode.Range(
            new vscode.Position(line, match.index),
            new vscode.Position(line, match.index + match[0].length)
          ),
          "keyword"
        );
      }

      // Special blue keywords
      const blueKeywords = /\b(ferotDao|dhoro|inputNao|lekho)\b|\$\{.*?\}/g;
      let matchBlue;
      while ((matchBlue = blueKeywords.exec(text)) !== null) {
        builder.push(
          new vscode.Range(
            new vscode.Position(line, matchBlue.index),
            new vscode.Position(line, matchBlue.index + matchBlue[0].length)
          ),
          "operator" // using operator/keyword for blue
        );
      }

      // ---------------- Functions ----------------
      const funcDecl = /\b[kK]aj\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
      let matchFunc;
      while ((matchFunc = funcDecl.exec(text)) !== null) {
        const start = matchFunc.index + matchFunc[0].indexOf(matchFunc[1]);
        builder.push(
          new vscode.Range(
            new vscode.Position(line, start),
            new vscode.Position(line, start + matchFunc[1].length)
          ),
          "function"
        );
      }

      // ---------------- Classes / Objects ----------------
      const classDecl = /\bobject\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
      let matchClass;
      while ((matchClass = classDecl.exec(text)) !== null) {
        const start = matchClass.index + matchClass[0].indexOf(matchClass[1]);
        builder.push(
          new vscode.Range(
            new vscode.Position(line, start),
            new vscode.Position(line, start + matchClass[1].length)
          ),
          "class"
        );
      }

      // ---------------- Variables ----------------
      const varDecl = /\bdhoro\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
      let matchVar;
      while ((matchVar = varDecl.exec(text)) !== null) {
        const start = matchVar.index + "dhoro ".length;
        builder.push(
          new vscode.Range(
            new vscode.Position(line, start),
            new vscode.Position(line, start + matchVar[1].length)
          ),
          "variable"
        );
      }

      // ---------------- Function Calls ----------------
      const funcCall = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
      let matchCall;
      while ((matchCall = funcCall.exec(text)) !== null) {
        const name = matchCall[1];
        const start = matchCall.index;

        // Avoid re-highlighting declarations
        if (!text.slice(0, start).includes("kaj") && !text.slice(0, start).includes("object")) {
          builder.push(
            new vscode.Range(
              new vscode.Position(line, start),
              new vscode.Position(line, start + name.length)
            ),
            "function"
          );
        }
      }

      // ---------------- Object Properties ----------------
      const propRegex = /\.([a-zA-Z_][a-zA-Z0-9_]*)/g;
      let matchProp;
      while ((matchProp = propRegex.exec(text)) !== null) {
        const start = matchProp.index + 1; // skip dot
        builder.push(
          new vscode.Range(
            new vscode.Position(line, start),
            new vscode.Position(line, start + matchProp[1].length)
          ),
          "property"
        );
      }
    }

    return builder.build();
  }
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
