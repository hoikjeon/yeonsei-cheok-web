# About-page hospital building imagery

## Current ambient banner

Current asset: `public/images/about/hospital-ambient-banner-v2.webp`. Generated with built-in image_gen from `public/ch-hospital.jpg`, with all other tenants removed and the hospital sign enlarged at center-right. Only this version is displayed. Layout dimensions are unchanged.

### Final v2 prompt

Use case: ads-marketing. Create a refined 3:1 wide hospital website banner background based on the supplied building photo (architectural identity reference ONLY).
Critical correction: feature ONLY the Yonsei Cheok Hospital facade and its sign. Completely REMOVE all other tenant names, clinic/dentist signs, IWIN lettering, storefronts, neighboring buildings and other text; replace those surfaces with natural plain glass. The ONLY text anywhere in the output must be exactly "연세척병원" (five Hangul syllables 연 세 척 병 원), large, clean three-dimensional white building signage with blue 척 and the reference blue-green hospital emblem beside it.
Composition: Left 55% of image is empty smooth very pale blue-gray #e9edf8 for HTML heading; right 45% is a CLOSE-UP of the hospital's green-blue glass facade, centered on the large 연세척병원 sign. Place the complete hospital sign at x=76%, y=48%, safely inside frame, spanning approximately 30% of full image width. Sign is the unmistakable visual focal point, NOT at bottom or hidden by mist. Show several glass rows above and below sign and a hint of characteristic diagonal teal beam near upper-right. Do not prioritize rooftop or full building; focus on hospital sign and its own floors. Subtle orange architectural trim allowed only near edges.
Style: premium clean daylight architectural illustration, natural glass texture, pale airy light, moderate contrast. Smooth broad gradient seamlessly dissolves building into empty left area, like a website medical anatomy banner whose subject occupies the right edge. No busy clouds, brush strokes, waves, torn-paper edges or isolated cutout. Keep sign crisp and clearly legible. Bottom facade can gently fade but sign must remain unobscured. NO OTHER WORDS, phone numbers, tenant brands, labels, people, UI or border. This is a replacement background asset, not a webpage screenshot.

## Previous ambient banner (no longer displayed)

Asset: `public/images/about/hospital-ambient-banner.webp` (1800 × 600, 105866 bytes). Generated with the built-in image_gen tool using `public/ch-hospital.jpg` as the architectural reference, then resized/encoded with Sharp. Displayed as an absolute decorative background through `SubHero.ambientImage`. Original content padding and minimum heights are restored; the image contributes no layout height on any viewport.

Prompt: Create a wide 3:1 daylight architectural background using the actual hospital's green-blue glass grid, diagonal teal roof beam, terraces and Korean signage. Place the facade on the right with a nearly empty pale blue-white left side for HTML text. Blend the left and bottom edges into white mist, soft clouds and subtle brush fades. Natural restrained color, no standalone cutout, pedestal, road, people, headline or UI. Compose for a short banner whose height must remain unchanged.

## Previous cutout (no longer displayed)

Created with the built-in image_gen tool from the user's attached full-building architectural rendering. The about-page screenshot supplied placement context; the site's facade photo was a secondary lettering/color reference.

Final asset: public/images/about/hospital-building-cutout.webp

Historical usage: the separate foreground image increased the banner height, so it was replaced with the ambient background above. This asset is retained only as an unused prior version.

The asset preserves alpha transparency and was resized to 1200 px width and encoded as WebP at quality 88. The source architectural image was re-rendered with isolated building/base, natural reflections and no surrounding road, cars or neighboring buildings.

## Generation prompt

Use case: background-extraction / architectural compositing. Create a newly polished, isolated cutout asset of the Yonsei Cheok Hospital building for the RIGHT side of an existing hospital introduction website banner. From the recent images, the PRIMARY source is the architectural rendering showing the WHOLE green-glass rectangular hospital building, gray structural bands, thin orange rectangular trim around the hospital floors, rooftop railings and a flat pergola roof, with small sidewalk trees. The website screenshot is only placement context. The real close-up facade photo is only secondary lettering/color reference; do not replace the primary rendering's full-building geometry with the photo's cropped geometry.
Preserve the primary building's recognizable shape, floor count, broad glazed front facade and narrow right side, rooftop pergola and hospital signage. Re-render gently with cleaner glass reflections, natural soft daylight and refined realistic architectural illustration quality. Keep facade lettering correctly spelled as '척추/관절 연세척병원 935-1004', blue accent on '척', no invented brand text. Remove ALL surrounding buildings, gray background, sky, road, foreground cars, random people and screenshot UI. Keep the main hospital building with a subtle low landscaped base and at most a few lightly rendered existing street trees; avoid foreground clutter hiding the hospital. Make the building silhouette clean and naturally antialiased, no rectangular photo edges. Gentle soft ground contact shadow may be semitransparent. TRUE TRANSPARENT ALPHA BACKGROUND everywhere outside building/base, including gaps through rooftop pergola; NOT a white/gray background and NOT a painted checkerboard. Building fully visible, centered and comfortably filling a roughly 4:3 landscape canvas with small transparent margins. No extra banner design, no new headline, no border. This is an asset to place over a pale blue-to-warm-cream web banner, so use restrained natural green glass, warm gray details and mild realistic contrast, no dramatic grading, no glowing effects.
