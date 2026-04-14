import urllib.request
import re
import sys

query = sys.argv[1].replace(' ', '+')
url = f'https://www.youtube.com/results?search_query={query}'
html = urllib.request.urlopen(url).read().decode('utf-8')
items = re.findall(r'"videoId":"([^"]{11})".*?"title":\{"runs":\[\{"text":"(.*?)"\}\]', html)

# Keep unique video ids
seen = set()
for vid, title in items:
    if vid not in seen:
        print(f'{vid} : {title.encode("ascii", "ignore").decode("ascii")}')
        seen.add(vid)
        if len(seen) >= 3:
            break
