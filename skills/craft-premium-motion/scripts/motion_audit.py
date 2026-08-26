#!/usr/bin/env python3
"""Read-only static inventory for web motion code.

Reports leads, not definitive failures. Confirm each finding in runtime context.
"""

from __future__ import annotations

import argparse
import json
import re
from collections import Counter
from pathlib import Path

SOURCE_EXTENSIONS = {".js", ".jsx", ".ts", ".tsx", ".vue", ".svelte", ".css", ".scss"}
IGNORED_DIRS = {".git", ".next", ".nuxt", ".svelte-kit", "node_modules", "dist", "build", "coverage", "out", "vendor", ".turbo"}
LIBRARIES = {
    "gsap": ("gsap", "@gsap/react"),
    "motion": ("motion", "framer-motion"),
    "lenis": ("lenis", "@studio-freight/lenis"),
    "three": ("three", "@react-three/fiber", "@react-three/drei"),
    "lottie": ("lottie-web", "lottie-react"),
    "rive": ("@rive-app/react-canvas", "@rive-app/canvas"),
}
PATTERNS = {
    "transition-all": re.compile(r"\btransition-all\b|transition\s*:\s*all\b"),
    "will-change": re.compile(r"\bwill-change\b|\bwillChange\b"),
    "infinite-animation": re.compile(r"animation(?:IterationCount)?[^\n]{0,100}\binfinite\b", re.I),
    "request-animation-frame": re.compile(r"\brequestAnimationFrame\s*\("),
    "scroll-listener": re.compile(r"addEventListener\s*\(\s*['\"]scroll['\"]"),
    "intersection-observer": re.compile(r"\bIntersectionObserver\b"),
    "reduced-motion": re.compile(r"prefers-reduced-motion|useReducedMotion|matchMedia\([^\n]*reduced-motion"),
    "gsap-context": re.compile(r"useGSAP|gsap\.context\s*\("),
    "cleanup-call": re.compile(r"\.kill\s*\(|\.revert\s*\(|cancelAnimationFrame\s*\(|removeEventListener\s*\("),
}


def iter_sources(root: Path):
    for path in root.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in SOURCE_EXTENSIONS:
            continue
        if any(part in IGNORED_DIRS for part in path.relative_to(root).parts):
            continue
        yield path


def load_dependencies(root: Path) -> dict[str, str]:
    package_file = root / "package.json"
    if not package_file.exists():
        return {}
    try:
        package = json.loads(package_file.read_text(encoding="utf-8"))
    except (OSError, UnicodeDecodeError, json.JSONDecodeError):
        return {}
    merged = {}
    for key in ("dependencies", "devDependencies", "peerDependencies"):
        merged.update(package.get(key, {}))
    return merged


def main() -> int:
    parser = argparse.ArgumentParser(description="Inventory motion-related web code without modifying it.")
    parser.add_argument("root", nargs="?", default=".", help="Project root (default: current directory)")
    parser.add_argument("--json", action="store_true", help="Emit machine-readable JSON")
    args = parser.parse_args()
    root = Path(args.root).expanduser().resolve()
    if not root.is_dir():
        parser.error(f"not a directory: {root}")

    dependencies = load_dependencies(root)
    engines = {label: {name: dependencies[name] for name in names if name in dependencies} for label, names in LIBRARIES.items()}
    engines = {label: found for label, found in engines.items() if found}
    counts: Counter[str] = Counter()
    locations: dict[str, list[str]] = {name: [] for name in PATTERNS}
    scanned = unreadable = 0

    for path in iter_sources(root):
        scanned += 1
        try:
            source = path.read_text(encoding="utf-8", errors="replace")
        except OSError:
            unreadable += 1
            continue
        rel = str(path.relative_to(root))
        for name, pattern in PATTERNS.items():
            matches = pattern.findall(source)
            if matches:
                counts[name] += len(matches)
                if len(locations[name]) < 12:
                    locations[name].append(rel)

    leads = []
    if counts["transition-all"]:
        leads.append({"severity": "review", "message": "Broad transitions can animate unintended properties.", "pattern": "transition-all"})
    if counts["infinite-animation"]:
        leads.append({"severity": "review", "message": "Confirm continuous animations pause offscreen and under reduced motion.", "pattern": "infinite-animation"})
    if counts["request-animation-frame"] and not counts["cleanup-call"]:
        leads.append({"severity": "review", "message": "RAF usage was found without an obvious cleanup call.", "pattern": "request-animation-frame"})
    if counts["scroll-listener"]:
        leads.append({"severity": "review", "message": "Confirm scroll listeners are efficient and passive where suitable.", "pattern": "scroll-listener"})
    has_motion = bool(engines) or any(counts[name] for name in counts if name != "reduced-motion")
    if has_motion and not counts["reduced-motion"]:
        leads.append({"severity": "important", "message": "No obvious reduced-motion handling was found.", "pattern": "reduced-motion"})
    if len(engines) >= 3:
        leads.append({"severity": "review", "message": "Several motion engines are installed; verify ownership and bundle justification.", "pattern": "dependencies"})

    result = {
        "root": str(root), "files_scanned": scanned, "unreadable_files": unreadable,
        "engines": engines, "pattern_counts": dict(sorted(counts.items())),
        "locations": {key: value for key, value in locations.items() if value},
        "leads": leads, "note": "Static heuristics only; confirm findings in runtime and component context.",
    }
    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(f"Motion audit: {root}")
        print(f"Scanned: {scanned} source files")
        print("Engines: " + (", ".join(engines) if engines else "none detected in package.json"))
        print("Patterns:")
        for name, count in sorted(counts.items()):
            print(f"  {name}: {count}")
        print("Review leads:")
        if not leads:
            print("  none from static heuristics")
        for lead in leads:
            print(f"  [{lead['severity']}] {lead['message']}")
        print(result["note"])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
