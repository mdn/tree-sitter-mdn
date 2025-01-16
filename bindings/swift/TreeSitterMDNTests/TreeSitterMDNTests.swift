import XCTest
import SwiftTreeSitter
import TreeSitterMDN

final class TreeSitterMDNTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_mdn())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading MDN grammar")
    }
}
