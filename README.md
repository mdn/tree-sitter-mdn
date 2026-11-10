# tree-sitter-mdn

MDN's macro grammar for [tree-sitter](https://github.com/tree-sitter/tree-sitter).

## Macro syntax

```
{{name}}
{{name("positional", 1, 1.5, true)}}
{{name("positional", , "after an omitted argument")}}
{{name("positional", key="named argument")}}
```

Named arguments (`key=value`) are parsed as `named_arg` nodes with `name` and `value` fields. The grammar accepts them in any position; consumers are expected to reject positional arguments after named ones, as well as duplicate names.
