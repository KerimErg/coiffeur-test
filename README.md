# Studio V.O — site du salon de coiffure (Bischheim, 67800)

Site one-page en HTML / CSS / JavaScript vanilla. Aucun framework, aucune étape
de build, aucune dépendance à installer : ouvrez `index.html` dans un navigateur.

```
index.html    structure, contenus, SEO local et JSON-LD
style.css     palette, échelle typographique, layout, motion
script.js     séquence d'ouverture, raccord au scroll, reveals, menu, formulaire
og.png        image de partage (Open Graph), générée depuis le design du site
img/          photographies en WebP, deux largeurs par emplacement
LICENCES.txt  provenance et licence du pack photo
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

## Photographies

Onze photographies sous licence **CC0** (domaine public : usage commercial
libre, aucune attribution obligatoire). Provenance complète dans
`LICENCES.txt`, conservé à la racine.

| Emplacement | Fichier source | Ratio servi |
| --- | --- | --- |
| Équipe — Jonathan | `02-barber-cutting` | 3/4 |
| Équipe — Emilie | `05-hair-cut` | 3/4 |
| Équipe — Julien | `03-barber-window` | 3/4 |
| Galerie 01 | `13-braided-hair` | 3/4 |
| Galerie 02 | `10-woman-haircut` | 16/10 |
| Galerie 03 | `06-scissors-comb` | 1/1 |
| Galerie 04 | `01-barber-razor` | 1/1 |
| Galerie 05 | `08-salon-seats` | 3/4 |
| Galerie 06 | `09-stylist-drying` | 1/1 |
| Galerie 07 | `11-man-barber` | 16/10 |
| Galerie 08 | `04-hairdresser-cut` | 1/1 |

Trois photos du pack ne sont pas utilisées, faute d'emplacement au bon ratio :
`07-salon-interior`, `12-hairdresser` et `14-mannequins`.

Chaque emplacement existe en deux largeurs WebP, déclarées en `srcset` avec un
`sizes` correspondant à la largeur réellement occupée. Résultat mesuré : **47 Ko**
de photos sur un écran de bureau standard, 108 Ko en retina, 141 Ko sur un
mobile retina — contre 1,3 Mo pour les JPEG d'origine. Recadrage centré au
ratio cible, sans agrandissement au-delà de la taille source.

Pas de repli JPEG : le WebP est reconnu par tous les navigateurs courants
depuis 2020. Les recadrages se régénèrent en relançant la conversion sur le
pack d'origine, décrit dans `LICENCES.txt`.

**Ce sont des images d'illustration, pas le salon ni son équipe.** Les trois
visuels placés sous les noms de Jonathan, Emilie et Julien seront lus comme
leurs portraits : ils doivent être remplacés par de vraies photographies de
l'équipe avant que le site ne soit rendu public. Les `alt` décrivent
volontairement le geste photographié, sans affirmer l'identité des personnes.

## V2 — la séance

Le site est traité comme une projection. Sept dispositifs, tous en vanilla, sans
la moindre dépendance.

**Amorce.** Compte à rebours de pellicule au premier chargement : cercle qui
balaie, 3 → 2 → 1 en display, tremblement de projecteur, rayures, flash blanc.
2,2 s, interrompue au clic, à Échap ou par « Passer l'amorce ». Mémorisée en
`sessionStorage` : elle ne rejoue pas dans la même session. Elle est aussi
sautée quand on arrive sur une ancre (`#reservation`, `#prestations`) et sur
connexion contrainte (`saveData`, 2G) — celui qui vient voir les tarifs n'a pas
à regarder un générique.

**Grain et vignettage.** Un seul canvas fixe, trois tuiles de bruit de 128 px
tirées au chargement, redessinées à 12 images/seconde avec un décalage
aléatoire, en `mix-blend-mode: overlay` à 5 % d'opacité. Mis en pause quand
l'onglet passe en arrière-plan. Vignettage en dégradé radial sur les bandes
sombres uniquement.

**Sous-titres V.O.** Six phrases s'écrivent lettre par lettre à l'entrée dans le
viewport, sur une plaque de sous-titre précédée d'un tiret cadratin, curseur
clignotant pendant la frappe. Le texte réel reste dans le DOM en `.sr-only` et
la version animée porte `aria-hidden` : les lecteurs d'écran reçoivent la phrase
entière, jamais une suite de lettres. Les espaces sont de vrais nœuds texte,
sans quoi la plaque ne pourrait plus revenir à la ligne.

**Bande de projection.** La galerie est un ruban de pellicule horizontal :
perforations, photogrammes, `PLAN 01` à `PLAN 08` en mono. Au-delà de 900 px et
si le mouvement est autorisé, la section s'épingle et le défilement vertical est
traduit en défilement horizontal (`position: sticky` + `transform`), avec barre
de progression et compteur de plan. Partout ailleurs — mobile, reduced-motion,
sans JS — c'est un défileur horizontal natif avec `scroll-snap`. Dans les deux
cas le ruban est atteignable au clavier : flèches pour avancer plan par plan,
`Début` et `Fin` pour les extrémités.

**Curseur de coupe.** Point lumineux à inertie, ciseaux ouverts sur les éléments
cliquables qui se referment au clic, œilleton de visée sur les photos. Desktop
au pointeur fin uniquement ; la première tabulation rend la main au curseur
natif.

**Micro-interactions.** Boutons magnétiques dans un rayon de 80 px avec retour
élastique ; trait de navigation coupé en deux au survol ; tarifs qui défilent
comme un timecode à l'entrée dans le viewport ; changement de bobine — sursaut
vertical de 150 ms et bouffée de grain — entre les sections clés ; titres
révélés par une lame diagonale.

**Générique de fin.** Le pied de page déroule un générique en boucle, arrêté au
survol comme au focus clavier, et mis en pause hors écran. Mentions légales et
réseaux restent en clair en dessous.

### Ce qui a été écarté, et pourquoi

Le brief demandait un **scroll inertiel sur un wrapper transformé** (lerp ~0,08).
Il n'a pas été fait ainsi, pour deux raisons. La première est technique :
`position: sticky` ne fonctionne pas à l'intérieur d'un ancêtre transformé, et
c'est exactement ce dont la bande de projection épinglée a besoin — les deux
effets s'excluent. La seconde est d'usage : détourner le défilement casse la
recherche dans la page, le rebond natif, la molette des trackpads réglés par
l'utilisateur, et pèse sur l'INP.

L'inertie est donc portée par les **calques**, pas par la page : les couches de
parallaxe rejoignent leur cible par lissage à 0,12 et traînent derrière le
scroll, ce qui donne le même glissement de projection. Le défilement reste
natif, la bande reste épinglable, le clavier reste intact.

### Coût mesuré

Défilement scripté de la page entière, 6 s, Chromium à 1440×900 puis 375×760.
Médiane sur trois passes ; l'image de référence est 16,7 ms (60 fps).

| Mesure | V1 | V2 |
| --- | --- | --- |
| Image médiane, desktop | 16,7 ms | 16,7 ms |
| Images > 17 ms, desktop | 0 – 0,6 % | 2 % |
| Images > 17 ms, mobile 375 | 0,6 % | 1,1 % |
| Lighthouse mobile — Performance | 98 | 97 |
| Accessibilité / Bonnes pratiques / SEO | 100 / 100 / 100 | 100 / 100 / 100 |
| FCP · LCP · TBT | 1,8 s · 1,9 s · 0 ms | 1,4 s · 1,7 s · 0 ms |
| CLS | 0,029 | **0,001** |
| Speed Index | 1,8 s | 3,6 s |

Deux chiffres méritent un mot. Le **Speed Index double** : l'amorce couvre la
page pendant 2,2 s, donc l'image ne se stabilise pas avant. C'est le prix de
l'effet, pas un défaut d'exécution — les métriques de réactivité (TBT, CLS)
s'améliorent. Le **CLS s'effondre à 0,001** parce que la mise en page se fait
derrière l'amorce.

Le seul coût de compositing mesurable est le grain : le retirer ramène les
images longues de 2 % à 0,7 % sur desktop. Le lever si besoin : supprimer le
`mix-blend-mode`, ou descendre la cadence de 12 à 8 images/seconde.

### Sous-titres et avis clients

Le brief prévoyait de traiter les avis clients en répliques sous-titrées. La
section a été retirée en amont faute de témoignages réels (voir *Reste à faire*).
Le composant `.vo` est prêt à les accueillir : il suffira d'ajouter `data-vo` sur
les citations.

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

**Photographies de l'équipe.** Voir la section *Photographies* : les visuels
actuels sont des images d'illustration sous CC0, à remplacer par de vraies
photographies de Jonathan, Emilie et Julien.
