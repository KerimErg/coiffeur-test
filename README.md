# Studio V.O — site du salon de coiffure (Bischheim, 67800)

Site one-page en HTML / CSS / JavaScript vanilla. Aucun framework, aucune étape
de build, aucune dépendance à installer : ouvrez `index.html` dans un navigateur.

```
index.html   structure, contenus, SEO local et JSON-LD
style.css    palette, échelle typographique, layout, motion
script.js    séquence d'ouverture, raccord au scroll, reveals, menu, formulaire
```

## Direction artistique

**Concept — le studio de montage.** « V.O » dit deux choses : les initiales de
Vanessa Oberlé et « version originale ». Le salon est traité comme une salle de
montage, où « coupe » appartient aux deux métiers. D'où la lumière du faisceau,
le magenta et le cyan du tirage argentique, les timecodes, les bobines.

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
- Tous les couples de couleurs texte / fond du site passent le niveau AA
  (rapport minimum mesuré : 4,77).
- `prefers-reduced-motion` : animations et reveals désactivés, tout le contenu
  reste visible dans son état final.
- Motion limitée à `transform` et `opacity`, scroll écouté en passif et lu dans
  un `requestAnimationFrame`.
- Images en `loading="lazy"` avec `width` / `height` déclarés.
- Zéro erreur console.

## Données à remplacer avant mise en ligne

Le nom du salon et la ville sont réels ; **tout le reste est un placeholder
crédible et doit être remplacé** :

- adresse, téléphone (`tel:+33388624107`), e-mail, numéro WhatsApp (`wa.me`) ;
- noms et spécialités de l'équipe, avis clients, horaires ;
- tarifs (ordres de grandeur premium en France, à confirmer par le salon) ;
- photos : les `picsum.photos` servent de gabarits, à remplacer par les visuels
  du salon (mêmes ratios) ;
- coordonnées `geo` et `url` du JSON-LD, `og:image`, et le plan d'accès SVG.

Le formulaire de réservation est validé côté client uniquement et n'envoie
rien : brancher un backend ou un service de prise de rendez-vous.
