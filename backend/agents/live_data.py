import yfinance as yf


def get_financials(ticker):
    t = yf.Ticker(ticker.upper() + ".NS")
    inc, bs, ann = t.quarterly_income_stmt, t.balance_sheet, t.income_stmt
    out = {"ticker": ticker.upper(), "quarterly_revenue_cr": {}, "yoy_growth_pct": {},
           "annual_dso_days": {}, "source": "Yahoo Finance via yfinance (public financial statements)"}
    qr = out["quarterly_revenue_cr"]
    if "Total Revenue" in inc.index:
        for d in inc.columns:
            v = inc.loc["Total Revenue", d]
            if v == v:
                qr[d.strftime("%Y-%m")] = round(v / 1e7, 1)
    for k, v in qr.items():
        y, m = k.split("-")
        prev = f"{int(y) - 1}-{m}"
        if prev in qr and qr[prev]:
            out["yoy_growth_pct"][k] = round((v / qr[prev] - 1) * 100, 1)
    row = next((r for r in ("Accounts Receivable", "Receivables") if r in bs.index), None)
    if row and "Total Revenue" in ann.index:
        for d in bs.columns:
            if d in ann.columns:
                a, b = bs.loc[row, d], ann.loc["Total Revenue", d]
                if a == a and b == b and b:
                    out["annual_dso_days"][str(d.year)] = round(a / b * 365, 1)
    return out
