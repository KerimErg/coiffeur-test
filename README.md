# Studio V.O — site du salon de coiffure (Bischheim, 67800)

Site one-page en HTML / CSS / JavaScript vanilla. Aucun framework, aucune étape
de build, aucune dépendance à installer : ouvrez `index.html` dans un navigateur.

```
index.html    structure, contenus, SEO local et JSON-LD
style.css     palette, échelle typographique, layout, motion
script.js     ouverture, tracé du fil au scroll, reveals, menu, formulaire
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

**Concept — le fil.** V.O comme version originale. Un salon vend une matière :
le cheveu. Le site en fait son interface. Une mèche unique, tracée en SVG,
descend la page d'un bout à l'autre — repère de lecture, jauge de progression
et couture entre les sections à la fois. Tout le reste — papier chaud posé sur
espresso, Didone à déliés très fins, un seul accent cuivré — n'est là que pour
la laisser respirer.

**Élément signature — la mèche.** Ses points de passage ne sont pas dessinés à
l'avance : ce sont les sections réelles de la page, mesurées à chaque mise en
page. La courbe épouse donc le document plutôt qu'un tracé figé, et suit les
reflows. Un doublon cuivré, superposé au même chemin, se remplit au fil de la
lecture (`pathLength="1"` + `stroke-dashoffset`) : c'est la barre de
progression. Un nœud s'allume à l'entrée de chaque section. Au pointeur, la
mèche ballotte doucement du côté opposé au curseur. Sur les feuilles claires
elle s'assombrit pour rester lisible.

La mèche vit dans la marge de reliure et ne croise jamais le texte : sa
gouttière est mesurée sur la colonne de texte réelle, pas devinée en
pourcentage — la contrainte tient donc de 320 px à 1920 px. Le hero comme les
bandes sombres adoptent le retrait des feuilles, si bien que l'axe de texte est
le même sur toute la page, à toutes les largeurs.

Deux pièges valent d'être signalés, tous deux corrigés dans `courbe()` et
`drawFil()`. Une interpolation de Catmull-Rom naïve **surcorrige** dès que les
points sont inégalement espacés — et une section fait ici dix fois la hauteur
d'une autre : la courbe partait en boucle hors de la page. Les tangentes sont
donc normalisées et la longueur des poignées bornée à une fraction du segment.
Par ailleurs une image de défilement fait **d'abord toutes les mesures, ensuite
toutes les écritures** : mesurer après avoir écrit forçait un recalcul de mise
en page à chaque image.

**Les sections sont des feuilles.** Plus de bandes pleine largeur découpées en
diagonale : les sections claires sont des feuilles de papier chaud posées sur
l'espresso, filet cuivré au bord supérieur et ombre profonde. Les sections
sombres laissent le fond de page traverser.

**Palette** — un seul accent. Le magenta, le cyan et l'or de la V2 se
partageaient le rôle d'accent sans hiérarchie ; ici le cuivre le tient seul,
parce que c'est le reflet qu'on cherche dans un cheveu.

| Nom | Hex | Usage | Contraste |
| --- | --- | --- | --- |
| Espresso | `#14100E` | fond de page, brun-noir chaud | — |
| Encre | `#0B0908` | cartouches, formulaire, générique | — |
| Craie | `#F4EFE7` | papier des feuilles claires | 16,3 sur espresso |
| Cuivre | `#C2703C` | l'accent : appels à l'action, la mèche | 5,1 (libellé sur aplat) |
| Cuivre clair | `#E0996A` | accent sur fond sombre | 8,1 sur espresso |
| Cuivre sombre | `#8F4A20` | accent sur papier | 5,8 sur craie |
| Fumée | `#A79A8C` | texte secondaire sur sombre | 6,9 sur espresso |
| Cendre | `#6B6055` | texte secondaire sur papier | 5,4 sur craie |

**Typographie** — deux familles au lieu de trois. **Bodoni Moda** en variable
pour tout le titrage : dans un Didone, le délié *est* un cheveu, et l'axe
optique (`opsz`) permet de tenir le même caractère du chapeau de 11 px au titre
de 270 px. **Instrument Sans** pour le labeur et les labels — les anciens
timecodes en monospace sont devenus des capitales interlettrées du même
grotesque, ce qui supprime au passage une famille et ses requêtes.

Un détail de composition mérite d'être noté : le prix est découpé en trois
morceaux dans le balisage (`dès`, le chiffre, le symbole). Ce n'est pas de la
coquetterie. Dans un Didone, les barres de l'euro sont des déliés, et au corps
des tarifs elles s'évaporent — « 58 € » se lisait « 58 C ». Le chiffre garde le
Bodoni, `dès` et `€` passent au grotesque. Le compteur d'animation n'a alors
qu'un nœud de texte à écrire, et le découpage tient aussi sans JavaScript.

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

## V3 — les dispositifs

Sept dispositifs, tous en vanilla, sans la moindre dépendance. Les effets de la
V2 ont été conservés, transformés ou remplacés selon ce que la direction
exigeait — ce que chacun est devenu est indiqué au passage.

**Ouverture** *(remplace l'amorce de pellicule).* Au premier chargement, la
mèche se tend seule à l'écran sous la marque, puis le rideau se retire par le
haut : la page était déjà là, dessous. 1,5 s au lieu de 2,2 s, et surtout le
motif d'ouverture n'est pas jetable — c'est le fil permanent du site qui
s'installe. Interrompue au clic, à Échap, à Entrée ou par « Passer
l'ouverture ». Mémorisée en `sessionStorage` : elle ne rejoue pas dans la même
session. Sautée aussi quand on arrive sur une ancre (`#reservation`,
`#prestations`) et sur connexion contrainte (`saveData`, 2G) — celui qui vient
voir les tarifs n'a pas à regarder un générique.

**Le fil.** Décrit en détail plus haut. Un `<svg>` fixe en `viewBox` 0→1000
étiré au viewport (`preserveAspectRatio="none"` + `vector-effect`, pour garder
une épaisseur constante malgré l'étirement non uniforme), deux chemins et sept
cercles. Une seule chaîne `d` reconstruite par image de défilement.

**Grain et lumière** *(le canvas est retiré).* Le grain argentique animé à 12
images/seconde coûtait un remplissage plein écran par image ; il est remplacé
par un bruit `feTurbulence` en SVG inline — aucune requête, aucun canvas, aucun
`requestAnimationFrame`. Le budget récupéré est passé au fil et à une lampe qui
suit le curseur : un simple dégradé radial piloté par deux variables CSS, donc
sans reflow, desktop au pointeur fin uniquement. Vignettage en dégradé radial
fixe sur le fond de page.

**Lignes V.O** *(la plaque de sous-titre disparaît).* Six phrases s'écrivent
lettre par lettre à l'entrée dans le viewport, précédées d'un tiret cadratin,
curseur clignotant pendant la frappe. Le filet sous chaque ligne a été retiré :
sur un paragraphe qui se replie, il soulignait des lignes encore vides. Le
texte réel reste dans le DOM en `.sr-only` et la version animée porte
`aria-hidden` : les lecteurs d'écran reçoivent la phrase entière, jamais une
suite de lettres. Les espaces sont de vrais nœuds texte, sans quoi la phrase ne
pourrait plus revenir à la ligne.

**Les réalisations au rail** *(la pellicule devient une suspension).* Les
perforations et les `PLAN 01` ont laissé place à un rail cuivré d'où chaque
photographie pend par un fil, à des hauteurs volontairement inégales. La
mécanique, elle, est conservée telle quelle : au-delà de 900 px et si le
mouvement est autorisé, la section s'épingle et le défilement vertical est
traduit en défilement horizontal (`position: sticky` + `transform`), avec barre
de progression et compteur. Partout ailleurs — mobile, reduced-motion, sans JS
— c'est un défileur horizontal natif avec `scroll-snap`. Dans les deux cas le
ruban est atteignable au clavier : flèches pour avancer photo par photo,
`Début` et `Fin` pour les extrémités. Le rail est posé dans le flux, juste
avant la liste : il tombe donc au bon endroit dans les deux modes, sans calcul.

**Curseur** *(les ciseaux deviennent un anneau).* Point cuivré à inertie ;
anneau sur les éléments cliquables ; l'anneau s'étire en cheveu vertical sur
les photographies. Desktop au pointeur fin uniquement ; la première tabulation
rend la main au curseur natif.

**Micro-interactions.** Les boutons magnétiques ont été retirés — ils
déplaçaient la cible sous le curseur, et le dessin en pilule cuivrée n'en avait
pas besoin. Restent : le survol d'une ligne de tarif qui tire un cheveu depuis
les deux bords à la fois et décale la ligne ; les tarifs qui se comptent en
montant à l'entrée dans le viewport ; les titres révélés par un balayage
vertical depuis leur ligne de base ; le filet du chapeau qui se tire ; la mèche
de lumière qui balaie un portrait au survol.

**Générique de fin** *(conservé).* Le pied de page déroule un générique en
boucle, arrêté au survol comme au focus clavier, et mis en pause hors écran.
Mentions légales et réseaux restent en clair en dessous.

**Les photographies gardent leur couleur.** La V2 passait portraits et galerie
en `grayscale(1)` sous un voile coloré en `mix-blend-mode: screen`. C'était une
décision qui travaillait contre le commerce : un salon vend de la couleur et de
la matière de cheveu. Le voile cuivré est désormais léger et se lève au survol.

### Ce qui a été écarté, et pourquoi

Le brief demandait un **scroll inertiel sur un wrapper transformé** (lerp ~0,08).
Il n'a pas été fait ainsi, pour deux raisons. La première est technique :
`position: sticky` ne fonctionne pas à l'intérieur d'un ancêtre transformé, et
c'est exactement ce dont la bande des réalisations épinglée a besoin — les deux
effets s'excluent. La seconde est d'usage : détourner le défilement casse la
recherche dans la page, le rebond natif, la molette des trackpads réglés par
l'utilisateur, et pèse sur l'INP.

L'inertie est donc portée par les **calques**, pas par la page : les couches de
parallaxe rejoignent leur cible par lissage à 0,12 et traînent derrière le
scroll, ce qui donne un glissement sans confisquer le défilement. Le défilement reste
natif, la bande reste épinglable, le clavier reste intact.

### Coût mesuré

Défilement scripté de la page entière, 6 s, Chromium à 1440×900 puis 375×760.
Médiane sur trois passes ; l'image de référence est 16,7 ms (60 fps). Lighthouse
en émulation mobile, polices servies en local (voir la réserve plus bas).

| Mesure | V1 | V2 | V3 |
| --- | --- | --- | --- |
| Image médiane, desktop | 16,7 ms | 16,7 ms | 16,7 ms |
| Images > 17 ms, desktop | 0 – 0,6 % | 2 % | 1,7 % |
| Images > 17 ms, mobile 375 | 0,6 % | 1,1 % | 0 % |
| Lighthouse mobile — Performance | 98 | 97 | 97 |
| Accessibilité / Bonnes pratiques / SEO | 100 / 100 / 100 | 100 / 100 / 100 | 100 / 100 / 100 |
| FCP · LCP · TBT | 1,8 s · 1,9 s · 0 ms | 1,4 s · 1,7 s · 0 ms | 2,0 s · 2,3 s · 0 ms |
| CLS | 0,029 | 0,001 | **0** |
| Speed Index | 1,8 s | 3,6 s | 2,7 s |

Trois chiffres méritent un mot. Le **Speed Index revient de 3,6 s à 2,7 s** :
l'ouverture ne couvre plus la page que 1,5 s au lieu de 2,2 s. Le **CLS tombe à
zéro**, la mise en page se faisant derrière l'ouverture. Les **images longues
disparaissent sur mobile** parce que le canvas de grain — un remplissage plein
écran douze fois par seconde — a été remplacé par une texture statique ; ce qui
reste sur desktop vient du `drop-shadow` de la mèche, réservé aux grands écrans
pour cette raison.

**Réserve sur la mesure.** Le conteneur de développement n'atteint pas
`fonts.googleapis.com` : les polices ont été servies depuis un serveur local
pour permettre l'audit. Le coût réseau tiers réel (résolution DNS, poignée de
main TLS vers deux domaines) n'est donc pas compté, et FCP / LCP seront plus
élevés en production — c'était déjà le cas des mesures V1 et V2, faites elles
aussi hors ligne, si bien que la comparaison entre colonnes reste valable. Les
`preconnect` vers les deux domaines sont en place dans `index.html`.

### Lignes V.O et avis clients

Le brief prévoyait de traiter les avis clients en répliques sous-titrées. La
section a été retirée en amont faute de témoignages réels (voir *Reste à faire*).
Le composant `.vo` est prêt à les accueillir : il suffira d'ajouter `data-vo` sur
les citations.

## Qualité

- Responsive vérifié de 320 px à 1920 px, sans débordement horizontal.
- HTML sémantique, un seul `h1`, `alt` sur toutes les images, `aria-label` sur
  les icônes, focus clavier visible, lien d'évitement.
- Tous les couples de couleurs texte / fond passent le niveau AA — rapport le
  plus bas de la palette : 5,1, le libellé des boutons pleins sur l'aplat
  cuivré (audit Lighthouse / axe : 100).
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
