"""
Data verifiers for admin UI components.

Run:  python verifiers/verify_dock_btn.py
"""

from dataclasses import dataclass
from typing import Literal
import re
import sys


@dataclass(frozen=True)
class DockBtnSpec:
    active_value: str
    label: str
    aria_role: str = "button"


DOCK_BTNS: list[DockBtnSpec] = [
    DockBtnSpec(active_value="pages", label="PAGES"),
    DockBtnSpec(active_value="sections", label="SECTIONS"),
    DockBtnSpec(active_value="preview", label="PREVIEW"),
]

VALID_ACTIVE_VALUES = {"pages", "sections", "preview", None}

SVELTE_FILE = "src/lib/admin/MobileDock.svelte"
SHELL_FILE = "src/lib/admin/AdminShell.svelte"
PAGE_FILE = "src/routes/admin/+page.svelte"


def read(path: str) -> str:
    with open(path) as f:
        return f.read()


def verify_dock_btn_count(src: str) -> list[str]:
    errors: list[str] = []
    count = len(re.findall(r'class="dock-btn"', src))
    if count != len(DOCK_BTNS):
        errors.append(f"Expected {len(DOCK_BTNS)} dock-btn elements, found {count}")
    return errors


def verify_dock_btn_active_classes(src: str) -> list[str]:
    errors: list[str] = []
    active_classes = re.findall(r"class:dock-btn--active=\{([^}]+)\}", src)
    if len(active_classes) != len(DOCK_BTNS):
        errors.append(
            f"Expected {len(DOCK_BTNS)} dock-btn--active bindings, found {len(active_classes)}"
        )
    for binding in active_classes:
        if not re.search(r"active\s*===", binding):
            errors.append(
                f"Active binding '{binding}' must use strict equality (===) against 'active' prop"
            )
    return errors


def verify_dock_btn_labels(src: str) -> list[str]:
    errors: list[str] = []
    for spec in DOCK_BTNS:
        pattern = rf'<span class="dock-label">{spec.label}</span>'
        if not re.search(pattern, src):
            errors.append(f"Missing dock-label '{spec.label}'")
    return errors


def verify_dock_btn_type_buttons(src: str) -> list[str]:
    errors: list[str] = []
    buttons = re.findall(r'<button([^>]*)class="dock-btn"', src)
    for attrs in buttons:
        if 'type="button"' not in attrs:
            errors.append("dock-btn missing type='button' — must be explicit")
    return errors


def verify_single_active_state(src: str) -> list[str]:
    errors: list[str] = []
    bindings = re.findall(r"class:dock-btn--active=\{active\s*===\s*\'(\w+)\'\}", src)
    if len(bindings) != len(set(bindings)):
        errors.append(
            "Duplicate active values detected — each dock-btn must have unique active value"
        )
    if set(bindings) != {spec.active_value for spec in DOCK_BTNS}:
        expected = {spec.active_value for spec in DOCK_BTNS}
        errors.append(f"Active values {set(bindings)} don't match expected {expected}")
    return errors


def verify_shell_integration(shell_src: str, page_src: str) -> list[str]:
    errors: list[str] = []
    if "MobileDock" not in shell_src:
        errors.append("AdminShell doesn't import MobileDock")
    if "activeMobileSheet" not in shell_src:
        errors.append("AdminShell doesn't pass activeMobileSheet to MobileDock")

    shell_active_type = re.findall(
        r"activeMobileSheet:\s*'(pages|sections|preview)\s*\|\s*(pages|sections|preview)\s*\|\s*(pages|sections|preview)\s*\|\s*null'",
        shell_src,
    )
    if not shell_active_type and "activeMobileSheet" in shell_src:
        pass

    dispatched_events = {"openpages", "opensections", "openpreview"}
    for event in dispatched_events:
        if f"on:{event}" not in page_src:
            errors.append(f"Admin page missing on:{event} handler for MobileDock")
        if f"activeMobileSheet = " not in page_src:
            errors.append("Admin page doesn't update activeMobileSheet on dock events")
            break

    return errors


def verify_mutual_exclusion(page_src: str) -> list[str]:
    errors: list[str] = []
    assignments = re.findall(
        r"activeMobileSheet\s*=\s*'(pages|sections|preview)'", page_src
    )
    null_assignments = re.findall(r"activeMobileSheet\s*=\s*null", page_src)
    if not null_assignments:
        errors.append(
            "activeMobileSheet never reset to null — dock will show stale active state"
        )

    for val in assignments:
        if val not in {spec.active_value for spec in DOCK_BTNS}:
            errors.append(f"activeMobileSheet set to unknown value '{val}'")

    return errors


def main() -> None:
    errors: list[str] = []

    try:
        dock_src = read(SVELTE_FILE)
    except FileNotFoundError:
        print(f"FAIL: {SVELTE_FILE} not found")
        sys.exit(1)

    try:
        shell_src = read(SHELL_FILE)
    except FileNotFoundError:
        shell_src = ""

    try:
        page_src = read(PAGE_FILE)
    except FileNotFoundError:
        page_src = ""

    errors += verify_dock_btn_count(dock_src)
    errors += verify_dock_btn_active_classes(dock_src)
    errors += verify_dock_btn_labels(dock_src)
    errors += verify_dock_btn_type_buttons(dock_src)
    errors += verify_single_active_state(dock_src)
    errors += verify_shell_integration(shell_src, page_src)
    errors += verify_mutual_exclusion(page_src)

    if errors:
        print(f"FAIL — {len(errors)} verifier(s):")
        for e in errors:
            print(f"  ✗ {e}")
        sys.exit(1)
    else:
        print("PASS — all dock-btn verifiers OK")
        sys.exit(0)


if __name__ == "__main__":
    main()
