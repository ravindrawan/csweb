import re, json

with open('admin.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx_trans = text.find('const adminTranslations = {')
idx_si = text.find('si: {', idx_trans)
idx_ta = text.find('ta: {', idx_trans)
idx_end = 35259

en_text = text[idx_trans:idx_si]
si_text = text[idx_si:idx_ta]
ta_text = text[idx_ta:idx_end]

def get_keys(t):
    return re.findall(r'(\w+):\s*["\'{]', t)

en_keys = get_keys(en_text)
si_keys = get_keys(si_text)
ta_keys = get_keys(ta_text)

print(f"EN keys: {len(en_keys)}, SI keys: {len(si_keys)}, TA keys: {len(ta_keys)}")
print("Common keys:", len(set(en_keys) & set(si_keys) & set(ta_keys)))
print("In EN but not in SI:", set(en_keys) - set(si_keys))
print("In EN but not in TA:", set(en_keys) - set(ta_keys))
print("In SI but not in EN:", set(si_keys) - set(en_keys))
