import os
import re

base = r'C:\Users\Annamalai\Downloads\ARRISE-NEW-WEB-main\ARRISE-NEW-WEB-main'

NEW_NAV_TOP = '''      <nav class="nav__links" id="navLinks">
        <a href="index.html" class="nav__link">Home</a>
        <a href="services.html" class="nav__link">Services</a>
        <a href="work.html" class="nav__link">Work</a>
        <a href="about.html" class="nav__link">About</a>
        <a href="contact.html" class="nav__link">Contact</a>
      </nav>'''

NEW_MOBILE_LINKS = '''    <nav class="mobile-menu__links">
      <a href="index.html" class="m-link"><span>01</span>Home</a>
      <a href="services.html" class="m-link"><span>02</span>Services</a>
      <a href="work.html" class="m-link"><span>03</span>Work</a>
      <a href="about.html" class="m-link"><span>04</span>About</a>
      <a href="contact.html" class="m-link"><span>05</span>Contact</a>
    </nav>'''

NEW_FOOTER_QUICK = '''            <ul>
              <li><a href="index.html">Home</a></li>
              <li><a href="services.html">Services</a></li>
              <li><a href="work.html">Work</a></li>
              <li><a href="about.html">About</a></li>
              <li><a href="contact.html">Contact</a></li>
            </ul>'''

files_to_update = []
for root, dirs, files in os.walk(base):
    for f in files:
        if f.endswith('.html'):
            files_to_update.append(os.path.join(root, f))

for path in files_to_update:
    with open(path, 'r', encoding='utf-8', errors='replace') as fh:
        content = fh.read()

    original = content
    content = re.sub(
        r'<nav class="nav__links" id="navLinks">.*?</nav>',
        NEW_NAV_TOP,
        content,
        flags=re.DOTALL
    )
    content = re.sub(
        r'<nav class="mobile-menu__links">.*?</nav>',
        NEW_MOBILE_LINKS,
        content,
        flags=re.DOTALL
    )
    content = re.sub(
        r'(<div class="footer__col">\s*<h4>Quick Links</h4>\s*<ul>)(.*?)(</ul>)',
        r'\1\n' + NEW_FOOTER_QUICK + r'\3',
        content,
        flags=re.DOTALL
    )

    if content != original:
        with open(path, 'w', encoding='utf-8') as fh:
            fh.write(content)
        print(f'Updated nav: {os.path.relpath(path, base)}')

print('Done')
