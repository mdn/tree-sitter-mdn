module.exports = grammar({
  name: 'mdn',

  word: ($) => $.ident,

  rules: {
    doc: ($) => repeat(choice($.macro_tag, $.text)),

    macro_tag: ($) =>
      seq(token.immediate('{{'), $.ident, optional($.args), '}}'),

    text: (_$) =>
      token(
        repeat1(
          choice(
            /[^{]/, // any non-brace
            /\\\{/, // escaped open brace
            /\{\{ *\}\}/, // {{ }}
            /\{[^{]/, // single {
          ),
        ),
      ),
    // ---------------------------------------------------------------------------
    // Function calls and arguments
    // ---------------------------------------------------------------------------

    // This could be straight forward but in order to yield none for empty arguments
    // we need to split this up.
    args: ($) =>
      choice(
        seq('(', optional($._arg), ')'), // one explicit or zero arguments.
        seq(
          choice(seq('(', $.none), seq('(', $._arg, ',')), // first explicit or implicit argument.
          optional(repeat(choice(seq($._arg, ','), $.none))), // all up to the last.
          choice(
            // the last explitict or implitit or both.
            seq($._arg, $.none, ')'),
            seq($._arg, ')'),
            seq($.none, ')', alias(')', $.none)),
          ),
        ),
      ),
    _arg: ($) =>
      choice(
        alias(choice('""', '\'\''), $.none),
        $.string,
        $.float,
        $.int,
        $.boolean,
      ),

    boolean: (_$) => choice('true', 'false'),
    none: (_$) => prec(1, ','),

    // ---------------------------------------------------------------------------
    // Identifiers
    // ---------------------------------------------------------------------------

    ident: (_$) => /[a-zA-Z_][a-zA-Z0-9_\-]*/,

    // ---------------------------------------------------------------------------
    // Numbers
    // ---------------------------------------------------------------------------

    int: (_$) => token(choice(/-?0/, /-?[1-9]\d*/)),

    float: (_$) => token(choice(/-?0\.\d+/, /-?[1-9]\d*\.\d+/)),

    // ---------------------------------------------------------------------------
    // Strings
    // ---------------------------------------------------------------------------

    string: ($) =>
      choice(
        $.double_quoted_string,
        $.single_quoted_string,
        $.backquoted_quoted_string,
      ),

    double_quoted_string: ($) => seq('"', repeat($._dq_char), '"'),

    single_quoted_string: ($) => seq('\'', repeat($._sq_char), '\''),

    backquoted_quoted_string: ($) => seq('`', repeat($._bq_char), '`'),

    // ---------------------------------------------------------------------------
    // String content chars
    // ---------------------------------------------------------------------------

    // dq_char = {
    //    !("\"" | "\\") ~ ANY
    //    | "\\" ~ ("\"" | "\\" | "/" | "b" | "f" | "n" | "r" | "t")
    //    | "\\" ~ ("u" ~ ASCII_HEX_DIGIT{4})
    // }
    //
    // In Tree-sitter, it’s typical to make these immediate tokens
    // so that once we've started a string, we parse char-by-char.
    _dq_char: (_$) =>
      token.immediate(
        choice(
          /[^"\\\n]/,
          seq('\\', choice('"', '\'', '`', '\\', '/', 'b', 'f', 'n', 'r', 't')),
          seq('\\u', /[0-9A-Fa-f]{4}/),
        ),
      ),

    // sq_char analogous
    _sq_char: (_$) =>
      token.immediate(
        choice(
          /[^'\\\n]/,
          seq('\\', choice('"', '\'', '`', '\\', '/', 'b', 'f', 'n', 'r', 't')),
          seq('\\u', /[0-9A-Fa-f]{4}/),
        ),
      ),

    // bq_char analogous
    _bq_char: (_$) =>
      token.immediate(
        choice(
          /[^`\\\n]/,
          seq('\\', choice('"', '\'', '`', '\\', '/', 'b', 'f', 'n', 'r', 't')),
          seq('\\u', /[0-9A-Fa-f]{4}/),
        ),
      ),
  },
});
