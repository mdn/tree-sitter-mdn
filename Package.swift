// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "TreeSitterMDN",
    products: [
        .library(name: "TreeSitterMDN", targets: ["TreeSitterMDN"]),
    ],
    dependencies: [
        .package(url: "https://github.com/tree-sitter/swift-tree-sitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterMDN",
            dependencies: [],
            path: ".",
            sources: [
                "src/parser.c",
                // NOTE: if your language has an external scanner, add it here.
            ],
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterMDNTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterMDN",
            ],
            path: "bindings/swift/TreeSitterMDNTests"
        )
    ],
    cLanguageStandard: .c11
)
