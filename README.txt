WANGXIAN MEMORY ARCHIVE V2

OPEN:
1. Open this folder in VS Code.
2. Install Live Server.
3. Right-click index.html > Open with Live Server.
Password: wangxian

AUDIO:
Put a permitted audio file at assets/audio/ambience.mp3.

IMAGES / COPYRIGHT:
The four included edits are the images you supplied in chat.
A credit line does NOT automatically give permission to reuse an online artist's work.
For new images, use art/photos you made, images you have permission to use, or images with a reuse license.
Keep the creator name + source link + license beside licensed work.
For show/donghua stills, check the rights holder/platform terms before publishing copies on GitHub.

RABBIT RESEARCH STARTING POINTS:
- Bret Hinsch, Passions of the Cut Sleeve (historical scholarship)
- Tu'er Shen overview and references: https://en.wikipedia.org/wiki/Tu%27er_Shen
Treat rabbit symbolism and Wangxian canon as separate unless a canon/official source explicitly connects them.

GITHUB PAGES:
Upload index.html, style.css, script.js and assets/ to the repository root.
Settings > Pages > Deploy from a branch > main > /root > Save.


V3 ADDED:
- forgiving passwords: wangxian / wang xian / 忘羡 / 忘羨
- keyboard focus styles
- View Transitions API with wipe fallback
- ambience preference via localStorage
- gallery lightbox
- searchable archive index

V4 ADDED: six-question branching personality quiz with four archive results, progress animation, restart, and a full visual redesign.


V5 ARCHITECTURE:
css/style.css = shared visual system and variables
css/archive.css = search, lightbox, Memory Room, seal effects
css/quiz.css = quiz-only styling
js/app.js = shared state
js/navigation.js = page navigation, world choice, password seal
js/timeline.js = loads data/timeline.json
js/audio.js = ambience preference
js/gallery.js = delegated lightbox events
js/search.js = automatically indexes page text + data-search terms
js/quiz.js = personality quiz
data/timeline.json = edit timeline memories here

IMPORTANT: timeline.json uses fetch(), so use VS Code Live Server or GitHub Pages. Do not double-click index.html directly.

V6 SECRET:
After a correct password, there is a 5% chance of a rare memory fragment appearing before the archive.
Edit rareMemories in js/navigation.js to change the lines.
Change 0.05 to another decimal to change the probability (0.10 = 10%).
