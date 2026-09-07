#!/usr/bin/env python3
"""Verify the self-contained public children's library release."""
import json,re,sys
from pathlib import Path
site=Path(sys.argv[1] if len(sys.argv)>1 else 'public')
page=(site/'books/index.html').read_text();books=json.loads((site/'books/catalog.json').read_text())
assert len(books)==335 and len({b['id'] for b in books})==335
assert not any(k in b for b in books for k in ['position','shelfName','corners','ownershipEvidence','ownershipSource','batch'])
assert not any(b['title'] in ['The Polar Express','Chibi Art Class','Rumpelstiltskin','Homer Price','Fantastic Mr. Fox'] for b in books)
for b in books:
 for k in ['coverImage','spineImage']:
  assert b[k].startswith('/books/'),b[k]
  assert (site/b[k].lstrip('/')).is_file(),b[k]
for asset in re.findall(r'(?:src|href)=[\"\']?(/books/assets/[^\s\"\'>]+)',page):assert (site/asset.lstrip('/')).is_file(),asset
js='\n'.join(p.read_text() for p in (site/'books/assets').glob('*.js'))
assert 'createRoot' in js and 'popstate' in js and 'view' in js and 'index' in js and 'shelf' in js
assert not any(x in js for x in ['Amazon order history','sourcePhotoId','sourcePhoto','shelfName','Position ${'])
assert 'noindex' in page and ('id=root' in page or 'id="root"' in page)
print(f'Books: {len(books)} records, all covers/spines, scoped assets, and public metadata verified.')
