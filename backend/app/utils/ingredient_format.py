"""Format ingredient strings for human-readable display with proper spacing between metric and name."""

from __future__ import annotations

import re

# Stray leading slash: "/2磅" -> "2磅", "/8茶匙" -> "1/8茶匙" (1/8 is a common fraction, "1" often dropped)
_LEADING_SLASH_FRACTION = re.compile(r"^/\s*(8|4|3|16)\s*")
_LEADING_SLASH_STRIP = re.compile(r"^/\s*(\d+)")

# Common units (Chinese and Latin) that follow a numeric amount. Order matters: longer first.
_UNITS = [
    "汤匙", "茶匙", "大匙", "小匙",  # tablespoons, teaspoons
    "毫升", "升", "克", "千克", "磅", "盎司",  # ml, L, g, kg, lb, oz
    "杯", "瓣", "个", "片", "块", "根", "枝", "适量",
    "tbsp", "tsp", "cup", "cups", "g", "kg", "ml", "lb", "oz", "clove", "cloves",
]

_UNITS_PATTERN = "|".join(re.escape(u) for u in _UNITS)

# Match: optional number (e.g. 1, 1/2, 0.5) + optional spaces + unit + (capture rest of line)
# so we can insert a single space between unit and the ingredient name.
_METRIC_THEN_INGREDIENT = re.compile(
    r"(\d*\.?\d*(?:\s*/\s*\d+)?)\s*(" + _UNITS_PATTERN + r")(\S.*)?$",
    re.IGNORECASE,
)


def _normalize_leading_slash(line: str) -> str:
    """Fix stray leading slash on Chinese ingredient lines: '/2磅' -> '2磅', '/8茶匙' -> '1/8茶匙'."""
    stripped = line.strip()
    if not stripped.startswith("/"):
        return line
    leading = line[: len(line) - len(line.lstrip())]
    trailing = line[len(line.rstrip()) :]
    # "/8茶匙" -> "1/8茶匙", "/4杯" -> "1/4杯" (common fraction denominators)
    m = _LEADING_SLASH_FRACTION.match(stripped)
    if m:
        num = m.group(1)
        rest = stripped[m.end() :]
        new_stripped = "1/" + num + rest
        return leading + new_stripped + trailing
    # "/2磅" -> "2磅", "/2汤匙" -> "2汤匙" (strip erroneous leading slash)
    m2 = _LEADING_SLASH_STRIP.match(stripped)
    if m2:
        num = m2.group(1)
        rest = stripped[m2.end() :]
        new_stripped = num + rest
        return leading + new_stripped + trailing
    return line


def format_ingredient_display(line: str) -> str:
    """
    Ensure exactly one space between the metric (number + unit) and the ingredient name.
    Normalizes stray leading slash: '/2磅' -> '2磅', '/8茶匙' -> '1/8茶匙'.

    Examples:
        "1汤匙新鲜欧芹,切碎" -> "1汤匙 新鲜欧芹,切碎"
        "/2磅三文鱼片,切成4片" -> "2磅 三文鱼片,切成4片"
        "/8茶匙黑胡椒,现磨" -> "1/8茶匙 黑胡椒,现磨"
    """
    if not line or not line.strip():
        return line
    line = _normalize_leading_slash(line)
    stripped = line.strip()
    m = _METRIC_THEN_INGREDIENT.match(stripped)
    if not m:
        return line
    amount, unit, rest = m.group(1), m.group(2), (m.group(3) or "").strip()
    if not rest:
        return line
    # Space between amount and unit only for Latin units (e.g. "1 tbsp"); keep "1汤匙" for Chinese
    sep_before_unit = " " if (amount and not amount.endswith(" ") and unit.isascii()) else ""
    new_content = amount + sep_before_unit + unit + " " + rest
    leading = line[: len(line) - len(line.lstrip())]
    trailing = line[len(line.rstrip()) :]
    return leading + new_content + trailing


def ingredient_section_count(lines: list[str]) -> int:
    """
    Return the display count for an ingredient section title (e.g. 食材(n)).

    Counts non-empty lines after stripping. Use this so the title count matches
    the visible list length (avoids "食材(9)" when only 8 items are shown).
    """
    return sum(1 for line in lines if line and line.strip())
