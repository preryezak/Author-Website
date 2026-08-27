from pathlib import Path
import pandas as pd

source = Path('/home/ubuntu/upload/affiliates_report_2026_08_27_08_29.csv')
out_dir = Path('/home/ubuntu/ccndaily-books/selar-analysis')
out_dir.mkdir(parents=True, exist_ok=True)

frame = pd.read_csv(source)
for column in ['Sales Count', 'Views Count', 'Percentage', 'Price']:
    frame[column] = pd.to_numeric(frame[column], errors='coerce').fillna(0)
frame['Deactivated'] = frame['Deactivated'].astype(str).str.lower().eq('yes')
frame['Status'] = frame['Status'].astype(str).str.lower()
frame['has_sales'] = frame['Sales Count'] > 0
frame['eligible_active'] = (~frame['Deactivated']) & (frame['Status'] == 'active')

ranked = frame.sort_values(
    by=['has_sales', 'Sales Count', 'Views Count', 'eligible_active'],
    ascending=[False, False, False, False],
    kind='stable',
).copy()
ranked.insert(0, 'Rank', range(1, len(ranked) + 1))
ranked.to_csv(out_dir / 'ranked_affiliates.csv', index=False)

summary = {
    'total_rows': int(len(frame)),
    'rows_with_sales': int(frame['has_sales'].sum()),
    'total_sales': int(frame['Sales Count'].sum()),
    'total_views': int(frame['Views Count'].sum()),
    'active_rows': int(frame['eligible_active'].sum()),
    'deactivated_rows': int(frame['Deactivated'].sum()),
    'status_counts': frame['Status'].value_counts().to_dict(),
}
(out_dir / 'summary.txt').write_text('\n'.join(f'{key}: {value}' for key, value in summary.items()) + '\n', encoding='utf-8')

print('SUMMARY')
for key, value in summary.items():
    print(f'{key}: {value}')
print('\nSALES-PRODUCING AFFILIATES')
print(ranked.loc[ranked['has_sales'], ['Rank', 'Fullname', 'Email', 'Sales Count', 'Views Count', 'Status', 'Deactivated', 'Percentage']].to_string(index=False))
print('\nTOP 40 BY SALES THEN VIEWS')
print(ranked.head(40)[['Rank', 'Fullname', 'Email', 'Sales Count', 'Views Count', 'Status', 'Deactivated', 'Percentage']].to_string(index=False))
print(f'\nWrote {out_dir / "ranked_affiliates.csv"}')
print(f'Wrote {out_dir / "summary.txt"}')
