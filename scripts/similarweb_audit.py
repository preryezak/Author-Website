import json
import sys
sys.path.append('/opt/.manus/.sandbox-runtime')
from data_api import ApiClient

client = ApiClient()
domain = 'influential-js8xf5fd.manus.space'
results = {}
for name, endpoint, query in [
    ('global_rank', 'SimilarWeb/get_global_rank', {}),
    ('visits_total', 'SimilarWeb/get_visits_total', {'country': 'world', 'granularity': 'monthly'}),
    ('bounce_rate', 'SimilarWeb/get_bounce_rate', {'country': 'world', 'granularity': 'monthly'}),
    ('traffic_by_country', 'SimilarWeb/get_total_traffic_by_country', {'limit': '10'}),
]:
    try:
        results[name] = client.call_api(endpoint, path_params={'domain': domain}, query=query)
    except Exception as exc:
        results[name] = {'error': str(exc)}

with open('/home/ubuntu/ccndaily-books/plans/similarweb-uiux-audit.json', 'w', encoding='utf-8') as handle:
    json.dump({'domain': domain, 'results': results}, handle, indent=2, default=str)
print(json.dumps({'domain': domain, 'results': results}, indent=2, default=str))
