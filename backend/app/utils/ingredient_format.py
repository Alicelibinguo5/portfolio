"""Format ingredient strings for human-readable display with proper spacing between metric and name."""

from __future__ import annotations

import re

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


def format_ingredient_display(line: str) -> str:
    """
    Ensure exactly one space between the metric (number + unit) and the ingredient name.

    Examples:
        "1汤匙新鲜欧芹,切碎" -> "1汤匙 新鲜欧芹,切碎"
        "2磅三文鱼片,切成4片" -> "2磅 三文鱼片,切成4片"
        "1/2茶匙细海盐" -> "1/2茶匙 细海盐"
    """
    if not line or not line.strip():
        return line
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
