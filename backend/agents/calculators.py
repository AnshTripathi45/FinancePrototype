"""
Specialized financial calculators for FMCG & Consumer Sector (Track C).
Derives non-obvious relationships:
1. Volume vs Price Growth Decomposition (UVG vs Realization)
2. Debtor / Receivable Days (DSO) & Working Capital Strain
3. Margin Mirage (Gross Margin vs A&P / Operating Leverage Divergence)
4. Cash Conversion Cycle & OCF-to-EBITDA Divergence
"""

from typing import Dict, List, Any


def compute_price_volume_decomposition(quarters: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Decomposes reported revenue growth into Underlying Volume Growth (UVG)
    and Price/Mix Realization growth across quarterly disclosures.
    """
    records = []
    volume_decline_quarters = 0
    total_revenue_growth = 0.0
    total_volume_growth = 0.0
    total_price_growth = 0.0

    for q in quarters:
        rev_growth = q.get("revenue_growth_yoy", 0.0)
        vol_growth = q.get("volume_growth_yoy", 0.0)
        # Price/Mix contribution = Reported Revenue Growth - Volume Growth
        price_growth = round(rev_growth - vol_growth, 2)
        
        if vol_growth < 0:
            volume_decline_quarters += 1

        records.append({
            "quarter": q.get("quarter"),
            "revenue_growth": rev_growth,
            "volume_growth": vol_growth,
            "price_realization": price_growth,
            "volume_share_of_growth": round((vol_growth / rev_growth * 100), 1) if rev_growth != 0 else 0.0,
            "price_share_of_growth": round((price_growth / rev_growth * 100), 1) if rev_growth != 0 else 0.0
        })
        
        total_revenue_growth += rev_growth
        total_volume_growth += vol_growth
        total_price_growth += price_growth

    n = len(quarters) if quarters else 1
    avg_rev = round(total_revenue_growth / n, 2)
    avg_vol = round(total_volume_growth / n, 2)
    avg_price = round(total_price_growth / n, 2)

    # Calculate growth skew: percentage of overall growth derived purely from pricing
    price_skew_pct = round((avg_price / avg_rev * 100), 1) if avg_rev > 0 else 0.0

    return {
        "quarterly_breakdown": records,
        "total_quarters_analyzed": len(quarters),
        "volume_decline_quarter_count": volume_decline_quarters,
        "avg_quarterly_revenue_growth": avg_rev,
        "avg_underlying_volume_growth": avg_vol,
        "avg_price_realization": avg_price,
        "price_growth_dependency_pct": price_skew_pct,
        "is_price_led": price_skew_pct > 65.0,
        "diagnostic": (
            f"Underlying volumes declined in {volume_decline_quarters} of {len(quarters)} quarters; "
            f"{price_skew_pct}% of average top-line growth was driven by price hikes rather than consumption volume."
        )
    }


def compute_receivable_days_trend(financial_periods: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Computes Days Sales Outstanding (DSO) / Debtor Days:
    DSO = (Trade Receivables / Trailing Annualized Revenue) * 365
    Identifies distributor inventory stuffing and credit expansion.
    """
    history = []
    initial_dso = None
    latest_dso = None

    for p in financial_periods:
        rev = p.get("revenue_cr", 1.0)
        receivables = p.get("trade_receivables_cr", 0.0)
        period_name = p.get("period")
        
        # If quarterly, annualize revenue by * 4
        is_quarterly = p.get("is_quarterly", True)
        annualized_rev = rev * 4.0 if is_quarterly else rev
        
        dso = round((receivables / annualized_rev) * 365.0, 1) if annualized_rev > 0 else 0.0
        
        if initial_dso is None:
            initial_dso = dso
        latest_dso = dso

        history.append({
            "period": period_name,
            "revenue_cr": rev,
            "receivables_cr": receivables,
            "receivable_days": dso
        })

    delta_days = round(latest_dso - initial_dso, 1) if (latest_dso and initial_dso) else 0.0
    pct_increase = round((delta_days / initial_dso * 100), 1) if (initial_dso and initial_dso > 0) else 0.0

    return {
        "periods": history,
        "initial_receivable_days": initial_dso,
        "latest_receivable_days": latest_dso,
        "receivable_days_delta": delta_days,
        "receivable_days_pct_increase": pct_increase,
        "credit_extension_detected": delta_days >= 7.0,
        "diagnostic": (
            f"Distributor receivable days surged from {initial_dso} to {latest_dso} days "
            f"(+{delta_days} days or +{pct_increase}%), indicating working-capital stretch and distributor credit support."
        )
    }


def compute_margin_and_promotional_divergence(periods: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Analyzes Gross Margin vs Advertising & Sales Promotion (A&P) spend.
    Detects if headline EBITDA expansion is an artifact of cutting marketing/A&P
    rather than operational efficiencies.
    """
    results = []
    for p in periods:
        rev = p.get("revenue_cr", 1.0)
        cogs = p.get("cogs_cr", 0.0)
        ad_spend = p.get("advertising_spend_cr", 0.0)
        ebitda = p.get("ebitda_cr", 0.0)

        gross_margin_pct = round(((rev - cogs) / rev) * 100, 2) if rev > 0 else 0.0
        ad_spend_pct = round((ad_spend / rev) * 100, 2) if rev > 0 else 0.0
        ebitda_margin_pct = round((ebitda / rev) * 100, 2) if rev > 0 else 0.0

        results.append({
            "period": p.get("period"),
            "gross_margin_pct": gross_margin_pct,
            "ad_spend_pct": ad_spend_pct,
            "ebitda_margin_pct": ebitda_margin_pct
        })

    first = results[0] if results else {}
    last = results[-1] if results else {}

    gm_change = round(last.get("gross_margin_pct", 0) - first.get("gross_margin_pct", 0), 2)
    ad_change = round(last.get("ad_spend_pct", 0) - first.get("ad_spend_pct", 0), 2)
    ebitda_change = round(last.get("ebitda_margin_pct", 0) - first.get("ebitda_margin_pct", 0), 2)

    return {
        "trend": results,
        "gross_margin_change_bps": int(gm_change * 100),
        "ad_spend_change_bps": int(ad_change * 100),
        "ebitda_margin_change_bps": int(ebitda_change * 100),
        "cut_marketing_to_defend_ebitda": ad_change <= -1.0,
        "diagnostic": (
            f"Gross Margin changed by {gm_change}% while A&P spend changed by {ad_change}%; "
            f"EBITDA margin changed by {ebitda_change}%."
        )
    }


def compute_ocf_ebitda_conversion(periods: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Calculates Cash Flow Quality: Operating Cash Flow (OCF) / EBITDA conversion ratio.
    Ratios falling below 70% in FMCG signify cash trapped in channel inventories and debtors.
    """
    ratios = []
    for p in periods:
        ebitda = p.get("ebitda_cr", 1.0)
        ocf = p.get("ocf_cr", 0.0)
        conv = round((ocf / ebitda * 100), 1) if ebitda > 0 else 0.0
        ratios.append({
            "period": p.get("period"),
            "ebitda_cr": ebitda,
            "ocf_cr": ocf,
            "conversion_ratio_pct": conv
        })

    latest = ratios[-1] if ratios else {}
    return {
        "conversion_history": ratios,
        "latest_conversion_pct": latest.get("conversion_ratio_pct", 0.0),
        "cash_conversion_deterioration": latest.get("conversion_ratio_pct", 100.0) < 70.0,
        "diagnostic": f"Latest OCF-to-EBITDA conversion reached {latest.get('conversion_ratio_pct', 0.0)}%."
    }
