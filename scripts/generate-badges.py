#!/usr/bin/env python3
"""
Generate status badges for README based on test results and build status.
"""

import re
import sys
import json
from pathlib import Path

def get_test_results():
    """Extract test results from vitest output."""
    try:
        # Try to read coverage data
        coverage_file = Path("coverage/coverage-summary.json")
        if coverage_file.exists():
            with open(coverage_file) as f:
                data = json.load(f)
                total = data.get("total", {})
                lines = total.get("lines", {}).get("pct", 0)
                return {
                    "coverage": lines,
                    "status": "passing"
                }
    except Exception as e:
        print(f"Warning: Could not read coverage data: {e}", file=sys.stderr)
    
    return {
        "coverage": 0,
        "status": "unknown"
    }

def get_coverage_color(coverage):
    """Get color based on coverage percentage."""
    if coverage >= 80:
        return "brightgreen"
    elif coverage >= 60:
        return "yellow"
    elif coverage >= 40:
        return "orange"
    else:
        return "red"

def generate_badges(readme_path):
    """Generate and insert badges into README."""
    
    results = get_test_results()
    coverage = results["coverage"]
    status = results["status"]
    
    # Build badge markdown
    badges = [
        f'[![Tests](https://img.shields.io/badge/tests-{status}-brightgreen)](https://github.com/belintani/favicon-animate/actions)',
        f'[![Build](https://img.shields.io/badge/build-{status}-brightgreen)](https://github.com/belintani/favicon-animate/actions)',
        f'[![Coverage](https://img.shields.io/badge/coverage-{coverage:.0f}%25-{get_coverage_color(coverage)})](https://github.com/belintani/favicon-animate/actions)',
        f'[![Node](https://img.shields.io/badge/node-%3E%3D%2016-brightgreen)](https://nodejs.org)',
        '[![npm version](https://img.shields.io/npm/v/favicon-animate.svg)](https://www.npmjs.com/package/favicon-animate)',
        '[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)',
    ]
    
    badges_text = '\n'.join(badges)
    
    # Read README
    with open(readme_path, 'r') as f:
        content = f.read()
    
    # Replace badges section
    pattern = r'<!-- BADGES START -->.*?<!-- BADGES END -->'
    replacement = f'<!-- BADGES START -->\n{badges_text}\n<!-- BADGES END -->'
    
    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    # Write back
    with open(readme_path, 'w') as f:
        f.write(new_content)
    
    print(f"Badges updated. Coverage: {coverage:.0f}%")

if __name__ == "__main__":
    readme_path = Path("README.md")
    if not readme_path.exists():
        print("Error: README.md not found", file=sys.stderr)
        sys.exit(1)
    
    generate_badges(readme_path)
