package tree_sitter_mdn_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_mdn "github.com/mdn/tree-sitter-mdn/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_mdn.Language())
	if language == nil {
		t.Errorf("Error loading MDN grammar")
	}
}
