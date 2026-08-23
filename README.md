# Studio V.O — site du salon de coiffure (Bischheim, 67800)

Site one-page en HTML / CSS / JavaScript vanilla. Aucun framework, aucune étape
de build, aucune dépendance à installer : ouvrez `index.html` dans un navigateur.

```
index.html   structure, contenus, SEO local et JSON-LD
style.css    palette, échelle typographique, layout, motion
script.js    séquence d'ouverture, raccord au scroll, reveals, menu, formulaire
og.png       image de partage (Open Graph), générée depuis le design du site
```

## Coordonnées publiées

| | |
| --- | --- |
| Adresse | 18 route de Bischwiller, 67800 Bischheim |
| Téléphone | 03 88 19 99 52 (`tel:+33388199952`) |
| E-mail | contact@salonstudiovo.fr |
| Équipe | Jonathan (gérant · coiffeur), Emilie (colorimétrie), Julien (couleur & balayage) |
| Horaires | mardi, mercredi, samedi 09:00–18:00 · jeudi, vendredi 10:00–20:00 · lundi et dimanche fermé |
| Coordonnées | 48.6121619, 7.7513926 (fiche Google Maps du salon) |
| Fiche Google | `maps.google.com/?cid=15147310127541780628` (`hasMap` du JSON-LD) |

Les horaires sont écrits à trois endroits qui doivent rester cohérents : le
tableau de la section Réserver, le `openingHoursSpecification` du JSON-LD, et la
constante `HOURS` de `script.js` qui refuse les créneaux hors ouverture.

Le plan d'accès est un schéma SVG dessiné à la main, pas une carte embarquée :
aucun script tiers, aucun cookie. Le lien « Itinéraire » sous le plan ouvre la
navigation Google Maps vers les coordonnées ci-dessus, via l'URL documentée
`maps/dir/?api=1&destination=lat,lng` — stable, sans paramètre de session.

## Direction artistique

**Concept — le studio de montage.** V.O comme version originale : le salon est
traité comme une salle de montage, où « coupe » appartient aux deux métiers.
D'où la lumière du faisceau, le magenta et le cyan du tirage argentique, les
timecodes, les bobines.

**Élément signature — le raccord.** Le titre du hero est scindé par une
diagonale : au chargement les deux moitiés se raccordent, au scroll elles se
redécoupent et glissent en sens inverse. La même diagonale devient l'arête
entre chaque section, alternée champ / contrechamp, avec un trait magenta qui
se trace à l'entrée dans le viewport.

**Palette**

| Nom | Hex | Usage |
| --- | --- | --- |
| Bleu Salle | `#141C33` | fond des séquences sombres |
| Nitrate | `#0D1426` | footer, planche contact, formulaire |
| Blanc Écran | `#E9ECF2` | fond des séquences claires |
| Faisceau | `#D9B36C` | appels à l'action, prix, accents |
| Magenta Argentique | `#B8336A` | le raccord, les intertitres |
| Cyan Tirage | `#45B4C9` | durées, contrepoint |

**Typographie** — Big Shoulders Display (display, très grand uniquement),
Archivo (labeur), IBM Plex Mono (timecodes et tarifs). Google Fonts,
`font-display: swap`.

## Qualité

- Responsive vérifié de 320 px à 1920 px, sans débordement horizontal.
- HTML sémantique, un seul `h1`, `alt` sur toutes les images, `aria-label` sur
  les icônes, focus clavier visible, lien d'évitement.
- Tous les couples de couleurs texte / fond passent le niveau AA
  (rapport minimum mesuré : 4,77).
- `prefers-reduced-motion` : animations et reveals désactivés, tout le contenu
  reste visible dans son état final.
- Motion limitée à `transform` et `opacity`, scroll écouté en passif et lu dans
  un `requestAnimationFrame`.
- Images en `loading="lazy"` avec `width` / `height` déclarés.
- Zéro erreur console.

## Reste à faire avant mise en ligne

**Photos.** Les portraits de l'équipe et les huit visuels de la planche contact
pointent encore vers `picsum.photos` : ce sont des gabarits. Remplacez-les par
les photos du salon en gardant les ratios (portraits 3/4 ; galerie : `01` et
`05` en 3/4, `02` et `07` en 16/10, les autres en carré) et réécrivez les `alt`
en décrivant la prestation visible.

**URL du site.** `canonical`, `og:url`, `og:image` et le champ `url` du JSON-LD
pointent vers `https://kerimerg.github.io/coiffeur-test/`, l'adresse GitHub
Pages par défaut de ce dépôt. À corriger si le site est publié sur un autre
domaine. Pour activer Pages : *Settings → Pages → Source: Deploy from a branch
→ `main` / `/ (root)`*.

**Avis clients.** La section a été retirée faute de témoignages réels : publier
des avis inventés sur la fiche d'un salon existant n'est pas envisageable. Le
gabarit typographique (citations en display, mise en scène façon sous-titres)
reste disponible dans l'historique — `git show a304530:index.html` pour le HTML
et `git show a304530:style.css` pour les styles — et peut être remis en place
dès que le salon fournit trois avis authentiques, avec l'accord des personnes
citées.

**Formulaire.** La demande de créneau est validée côté client uniquement — nom,
téléphone, prestation, et créneau confronté aux horaires réels — mais n'envoie
rien. Brancher un backend ou un service de prise de rendez-vous.
