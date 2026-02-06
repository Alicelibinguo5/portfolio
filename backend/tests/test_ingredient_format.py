"""Tests for human-readable ingredient display with proper spacing between metric and name."""

import pytest

from app.utils.ingredient_format import format_ingredient_display, ingredient_section_count


def test_space_after_tablespoon_and_ingredient() -> None:
    """Metric (1汤匙) and ingredient name (新鲜欧芹) must be separated by a space."""
    assert format_ingredient_display("1汤匙新鲜欧芹,切碎") == "1汤匙 新鲜欧芹,切碎"


def test_space_after_pound_and_ingredient() -> None:
    """Metric (2磅) and ingredient name (三文鱼片) must be separated by a space."""
    assert format_ingredient_display("2磅三文鱼片,切成4片") == "2磅 三文鱼片,切成4片"


def test_space_after_tablespoon_oil() -> None:
    assert format_ingredient_display("1汤匙特级初榨橄榄油或植物油") == "1汤匙 特级初榨橄榄油或植物油"


def test_space_after_tablespoon_lemon() -> None:
    assert format_ingredient_display("1汤匙新鲜柠檬汁") == "1汤匙 新鲜柠檬汁"


def test_space_after_teaspoon_mustard() -> None:
    """2汤匙芥末酱 -> space after 2汤匙."""
    assert format_ingredient_display("2汤匙芥末酱") == "2汤匙 芥末酱"


def test_space_after_teaspoon_salt() -> None:
    assert format_ingredient_display("2茶匙细海盐") == "2茶匙 细海盐"


def test_space_after_teaspoon_pepper() -> None:
    assert format_ingredient_display("1/8茶匙黑胡椒,现磨") == "1/8茶匙 黑胡椒,现磨"


def test_fraction_amount() -> None:
    """Fraction like 1/2 should be kept with unit, space before name."""
    assert format_ingredient_display("1/2茶匙细海盐") == "1/2茶匙 细海盐"


def test_no_double_space_if_already_spaced() -> None:
    """If there is already a space after the unit, do not add another."""
    already = "1汤匙 新鲜欧芹"
    assert format_ingredient_display(already) == already


def test_ingredient_without_leading_metric_unchanged() -> None:
    """Line without numeric metric at start is returned unchanged (e.g. 蒜瓣,剁碎)."""
    no_metric = "蒜瓣,剁碎、压碎或磨碎"
    assert format_ingredient_display(no_metric) == no_metric


def test_only_first_metric_gets_space() -> None:
    """If unit appears again in the text, only the first occurrence gets the space."""
    result = format_ingredient_display("2汤匙芥末酱和2汤匙水")
    assert result == "2汤匙 芥末酱和2汤匙水"


def test_empty_string_unchanged() -> None:
    assert format_ingredient_display("") == ""


def test_whitespace_only_unchanged() -> None:
    assert format_ingredient_display("   \n  ") == "   \n  "


def test_english_units() -> None:
    """Latin units (tbsp, tsp) get space after metric when missing."""
    assert format_ingredient_display("1 tbspolive oil") == "1 tbsp olive oil"


# ----- Chinese version: leading slash and title count -----


def test_chinese_leading_slash_pound() -> None:
    """'/2磅三文鱼片,切成4片' should display as '2磅 三文鱼片,切成4片' (stray slash removed)."""
    assert format_ingredient_display("/2磅三文鱼片,切成4片") == "2磅 三文鱼片,切成4片"


def test_chinese_leading_slash_tablespoon() -> None:
    """'/2汤匙芥末酱' -> '2汤匙 芥末酱'."""
    assert format_ingredient_display("/2汤匙芥末酱") == "2汤匙 芥末酱"


def test_chinese_leading_slash_teaspoon_salt() -> None:
    """'/2茶匙细海盐' -> '2茶匙 细海盐'."""
    assert format_ingredient_display("/2茶匙细海盐") == "2茶匙 细海盐"


def test_chinese_leading_slash_fraction_eighth() -> None:
    """'/8茶匙黑胡椒,现磨' -> '1/8茶匙 黑胡椒,现磨' (1/8 is common, '1' was dropped)."""
    assert format_ingredient_display("/8茶匙黑胡椒,现磨") == "1/8茶匙 黑胡椒,现磨"


def test_chinese_leading_slash_fraction_quarter() -> None:
    """'/4杯水' -> '1/4杯 水'."""
    assert format_ingredient_display("/4杯水") == "1/4杯 水"


def test_ingredient_section_count_matches_visible_items() -> None:
    """Title count (e.g. 食材(n)) must match number of visible ingredient lines."""
    # 8 items like on the Chinese recipe page
    lines = [
        "2磅三文鱼片,切成4片",
        "1汤匙新鲜欧芹,切碎",
        "1汤匙特级初榨橄榄油或植物油",
        "1汤匙新鲜柠檬汁",
        "蒜瓣,剁碎、压碎或磨碎",
        "2汤匙芥末酱",
        "2茶匙细海盐",
        "1/8茶匙黑胡椒,现磨",
    ]
    assert ingredient_section_count(lines) == 8


def test_ingredient_section_count_ignores_empty_lines() -> None:
    """Empty or whitespace-only lines must not be counted (avoids title showing 9 when only 8 visible)."""
    lines = [
        "2磅三文鱼片",
        "",
        "1汤匙欧芹",
        "   ",
        "2茶匙盐",
    ]
    assert ingredient_section_count(lines) == 3


def test_ingredient_section_count_empty_list() -> None:
    assert ingredient_section_count([]) == 0


def test_chinese_full_ingredient_list_display() -> None:
    """Full Chinese ingredient list from screenshot: leading slashes fixed and spacing correct."""
    raw = [
        "/2磅三文鱼片,切成4片",
        "1汤匙新鲜欧芹,切碎",
        "1汤匙特级初榨橄榄油或植物油",
        "1汤匙新鲜柠檬汁",
        "蒜瓣,剁碎、压碎或磨碎",
        "/2汤匙芥末酱",
        "/2茶匙细海盐",
        "/8茶匙黑胡椒,现磨",
    ]
    expected = [
        "2磅 三文鱼片,切成4片",
        "1汤匙 新鲜欧芹,切碎",
        "1汤匙 特级初榨橄榄油或植物油",
        "1汤匙 新鲜柠檬汁",
        "蒜瓣,剁碎、压碎或磨碎",
        "2汤匙 芥末酱",
        "2茶匙 细海盐",
        "1/8茶匙 黑胡椒,现磨",
    ]
    for r, e in zip(raw, expected):
        assert format_ingredient_display(r) == e
    assert ingredient_section_count(raw) == 8
