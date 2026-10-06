<script setup lang="ts">
/*
 * Desktop-only left column, as in TemaEnvelopMaroon: the invitation runs in the 430px
 * column on the right, this side carries a photo, the couple and the verse. Not in the
 * Figma frames — built from Frame 21's photo and Frame 20's palette and type.
 */
import photo from '../../assets/cover/00_2268-45_photo.webp'
import FireFlies from './FireFlies.vue'
import { wedding } from '../../data/wedding'
</script>

<template>
  <aside class="aside" aria-hidden="true">
    <div class="aside__photo" :style="{ backgroundImage: `url(${photo})` }"></div>
    <div class="aside__veil"></div>
    <FireFlies :count="26" />

    <div class="aside__content">
      <header>
        <p class="aside__eyebrow">The Wedding Of</p>
        <h2 class="aside__couple">
          {{ wedding.groom.nickname }} <span class="aside__amp">&amp;</span> {{ wedding.bride.nickname }}
        </h2>
        <p class="aside__date">{{ wedding.akad.day }} · {{ wedding.akad.date }}</p>
      </header>

      <figure class="aside__quote">
        <blockquote>“{{ wedding.quote.text.replace(/"$/, '') }}”</blockquote>
        <figcaption>{{ wedding.quote.source }}</figcaption>
      </figure>
    </div>
  </aside>
</template>

<style scoped>
.aside {
  position: relative;
  flex: 1;
  height: 100vh;
  overflow: hidden;
  background: #202615;
  color: var(--hero-ink);
}

/* A slow drift through the photo, the whole time the page is open. */
.aside__photo {
  position: absolute;
  inset: -4%;
  background-position: center 30%;
  background-size: cover;
  animation: aside-drift calc(36s * var(--motion)) ease-in-out infinite alternate;
}

@keyframes aside-drift {
  from {
    transform: scale(1.04) translate(-1.5%, 0);
  }
  to {
    transform: scale(1.14) translate(1.5%, -2%);
  }
}

.aside__veil {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgb(32 38 21 / 0.55) 0%, rgb(32 38 21 / 0.15) 40%, rgb(20 24 14 / 0.75) 100%),
    radial-gradient(ellipse at 30% 40%, transparent 30%, rgb(20 24 14 / 0.45) 100%);
}

.aside__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: clamp(40px, 6vh, 72px) clamp(40px, 5vw, 80px);
}

/* From 1025 px the music vinyl sits at this panel's bottom-left (40 + 60 px); keep clear of it. */
@media (min-width: 1025px) {
  .aside__content {
    padding-bottom: 130px;
  }
}

.aside__content > * > * {
  animation: aside-in calc(1800ms * var(--motion)) cubic-bezier(0.16, 1, 0.3, 1) backwards;
}

@keyframes aside-in {
  from {
    opacity: 0;
    translate: 0 24px;
    filter: blur(8px);
  }
}

.aside__eyebrow {
  font-family: var(--font-cover-eyebrow);
  font-size: clamp(30px, 3vw, 44px);
  color: var(--cover-title);
  text-shadow: 1px 2px 0 rgb(0 0 0 / 0.35);
  animation-delay: calc(300ms * var(--motion));
}

.aside__couple {
  margin: 8px 0 14px;
  font-family: var(--font-hero-couple);
  font-size: clamp(52px, 5.4vw, 92px);
  font-weight: 400;
  line-height: 1.02;
  text-shadow: 1px 2px 6px rgb(0 0 0 / 0.35);
  animation-delay: calc(550ms * var(--motion));
}

.aside__amp {
  font-family: var(--font-display);
  font-style: italic;
  color: var(--cover-title);
}

.aside__date {
  font-family: var(--font-display);
  font-size: clamp(18px, 1.5vw, 24px);
  letter-spacing: 0.24em;
  color: rgb(217 217 201 / 0.85);
  animation-delay: calc(850ms * var(--motion));
}

.aside__quote {
  max-width: 520px;
  margin: 0;
}

.aside__quote blockquote {
  margin: 0 0 12px;
  font-family: var(--font-quote);
  font-size: clamp(20px, 1.6vw, 26px);
  line-height: 1.5;
  color: rgb(217 217 201 / 0.92);
  animation-delay: calc(1200ms * var(--motion));
}

.aside__quote figcaption {
  font-family: var(--font-display);
  font-size: 15px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgb(217 217 201 / 0.7);
  animation-delay: calc(1450ms * var(--motion));
}

@media (prefers-reduced-motion: reduce) {
  .aside__photo,
  .aside__content > * > * {
    animation: none;
  }
}
</style>
