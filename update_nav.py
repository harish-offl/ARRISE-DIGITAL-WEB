import os
import re

base = r'C:\Users\Annamalai\Desktop\PROJECT FOLDER\ARRISE-DIGITAL-WEB'

def prefix_for(path):
    rel = os.path.relpath(path, base).replace('\\', '/')
    if rel.startswith('clients/'):
        return '../'
    return ''

def nav_templates(prefix):
    nav_top = (
        '      <nav class="nav__links" id="navLinks">\n'
        '        <a href="{0}index.html" class="nav__link">Home</a>\n'
        '        <a href="{0}services.html" class="nav__link">Services</a>\n'
        '        <a href="{0}work.html" class="nav__link">Work</a>\n'
        '        <a href="{0}about.html" class="nav__link">About</a>\n'
        '        <a href="{0}team.html" class="nav__link">Team</a>\n'
        '        <a href="{0}contact.html" class="nav__link">Contact</a>\n'
        '      </nav>'
    ).format(prefix)

    mobile_links = (
        '    <nav class="mobile-menu__links">\n'
        '      <a href="{0}index.html" class="m-link"><span>01</span>Home</a>\n'
        '      <a href="{0}services.html" class="m-link"><span>02</span>Services</a>\n'
        '      <a href="{0}work.html" class="m-link"><span>03</span>Work</a>\n'
        '      <a href="{0}about.html" class="m-link"><span>04</span>About</a>\n'
        '      <a href="{0}team.html" class="m-link"><span>05</span>Team</a>\n'
        '      <a href="{0}contact.html" class="m-link"><span>06</span>Contact</a>\n'
        '    </nav>'
    ).format(prefix)

    footer_quick = (
        '              <li><a href="{0}index.html">Home</a></li>\n'
        '              <li><a href="{0}services.html">Services</a></li>\n'
        '              <li><a href="{0}work.html">Work</a></li>\n'
        '              <li><a href="{0}about.html">About</a></li>\n'
        '              <li><a href="{0}team.html">Team</a></li>\n'
        '              <li><a href="{0}contact.html">Contact</a></li>'
    ).format(prefix)

    return nav_top, mobile_links, footer_quick

files_to_update = []
for root, dirs, files in os.walk(base):
    for f in files:
        if f.endswith('.html'):
            files_to_update.append(os.path.join(root, f))

for path in files_to_update:
    suffix = os.path.relpath(path, base).replace('\\', '/')
    if suffix.startswith('clients/'):
        prefix = '../'
    else:
        prefix = ''
    new_nav_top, new_mobile_links, new_footer_quick = nav_templates(prefix)

    with open(path, 'r', encoding='utf-8', errors='replace') as fh:
        content = fh.read()

    original = content
    content = re.sub(
        r'<nav class="nav__links" id="navLinks">.*?</nav>',
        new_nav_top,
        content,
        flags=re.DOTALL
    )
    content = re.sub(
        r'<nav class="mobile-menu__links">.*?</nav>',
        new_mobile_links,
        content,
        flags=re.DOTALL
    )
    content = re.sub(
        r'(<div class="footer__col">\s*<h4>Quick Links</h4>\s*<ul>\s*\n)(.*?)(\n\s*</ul>)',
        r'\1' + new_footer_quick + r'\3',
        content,
        flags=re.DOTALL
    )

    if content != original:
        with open(path, 'w', encoding='utf-8') as fh:
            fh.write(content)
        print(f'Updated nav: {os.path.relpath(path, base)}')

print('Done')
