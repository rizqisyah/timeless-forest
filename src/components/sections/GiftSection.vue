<script setup lang="ts">
import SheetBand from '../invite/SheetBand.vue'
import plate from '../../assets/sheet/07-gift.webp'
import copyIcon from '../../assets/sheet/copy.svg'
import { wedding } from '../../data/wedding'
import { useToast } from '../../composables/useToast'

const { show } = useToast()

async function copy(text: string, what: string) {
  try {
    await navigator.clipboard.writeText(text)
    show(`${what} disalin`)
  } catch {
    show('Gagal menyalin')
  }
}
</script>

<template>
  <SheetBand name="gift" :plate="plate" :top="13878" :bottom="15560" label="Wedding Gift">
    <h2 class="sr-only">Wedding Gift</h2>

    <!-- Containers 2239:53 / 2239:37 / 2239:72: a column at y 14033, 68 px apart. -->
    <div class="gift__list">
      <article
        v-for="(acc, i) in wedding.accounts"
        :key="acc.number"
        v-reveal:up="i * 200"
        class="card card--bank"
      >
        <h3 class="card__title">{{ acc.bank }}</h3>
        <p class="card__label card__label--number">Account Number</p>
        <p class="card__value card__value--number">{{ acc.number }}</p>
        <p class="card__label card__label--name">Account Name</p>
        <p class="card__value card__value--name">{{ acc.holder }}</p>
        <button type="button" class="card__copy" @click="copy(acc.number, 'Nomor rekening')">
          <img :src="copyIcon" alt="" width="54" height="54" />
          <span class="sr-only">Salin nomor rekening {{ acc.number }}</span>
        </button>
      </article>

      <article v-reveal:up="wedding.accounts.length * 200" class="card card--address">
        <h3 class="card__title card__title--center">PENGIRIMAN KADO</h3>
        <p class="card__label card__label--address">Alamat</p>
        <p class="card__address">{{ wedding.giftAddress.address }}</p>
        <p class="card__label card__label--recipient">Penerima</p>
        <p class="card__value card__value--recipient">{{ wedding.giftAddress.recipient }}</p>
        <button type="button" class="card__copy card__copy--address" @click="copy(wedding.giftAddress.address, 'Alamat')">
          <img :src="copyIcon" alt="" width="54" height="54" />
          <span class="sr-only">Salin alamat pengiriman kado</span>
        </button>
      </article>
    </div>
  </SheetBand>
</template>

<style scoped>
.gift__list {
  top: calc((14033 - var(--y0)) * var(--px));
  left: calc(32 * var(--px));
  width: calc(683 * var(--px));
  display: flex;
  flex-direction: column;
  gap: calc(68 * var(--px));
}

.card {
  position: relative;
  border-radius: calc(8 * var(--px));
  background: var(--card);
  color: #fff;
}

.card > * {
  position: absolute;
  margin: 0;
  white-space: nowrap;
}

.card--bank {
  height: calc(238.478 * var(--px));
}

.card--address {
  height: calc(305 * var(--px));
}

.card__title,
.card__value {
  left: calc(27 * var(--px));
  font-family: var(--font-card);
  font-size: calc(22.946 * var(--px));
  font-weight: 900;
  line-height: calc(29.83 * var(--px));
}

.card__title {
  top: calc(40.5 * var(--px));
}

.card__title--center {
  top: calc(40 * var(--px));
  left: calc(328.5 * var(--px));
  transform: translateX(-50%);
}

/* Container 2239:53 sets this label in Ibarra Real Nova, 2239:37 in Visia Pro; one style here. */
.card__label {
  left: calc(27 * var(--px));
  font-family: var(--font-card);
  font-size: calc(16.197 * var(--px));
  font-weight: 600;
  line-height: normal;
}

.card__label--number {
  top: calc(86.7 * var(--px));
}

.card__value--number {
  top: calc(111.5 * var(--px));
}

.card__label--name,
.card__label--recipient {
  font-family: var(--font-card-label);
  font-weight: 400;
}

.card__label--name {
  top: calc(155.67 * var(--px));
}

.card__value--name {
  top: calc(178.7 * var(--px));
}

.card__label--address {
  top: calc(85 * var(--px));
  left: calc(28 * var(--px));
}

.card__address {
  top: calc(110 * var(--px));
  left: calc(28 * var(--px));
  width: calc(499 * var(--px));
  font-family: var(--font-card);
  font-size: calc(17.13 * var(--px));
  font-weight: 600;
  line-height: calc(19 * var(--px));
  white-space: normal;
}

.card__label--recipient {
  top: calc(211.2 * var(--px));
  left: calc(28 * var(--px));
}

.card__value--recipient {
  top: calc(234.25 * var(--px));
  left: calc(28 * var(--px));
}

.card__copy {
  top: calc(92 * var(--px));
  left: calc(592 * var(--px));
  width: calc(54 * var(--px));
  height: calc(54 * var(--px));
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  transition: transform 200ms ease;
}

.card__copy--address {
  top: calc(119 * var(--px));
}

.card__copy img {
  width: 100%;
  height: 100%;
}

.card__copy:active {
  transform: scale(0.9);
}

.card__copy:focus-visible {
  outline: calc(2 * var(--px)) solid #fff;
  outline-offset: calc(2 * var(--px));
  border-radius: calc(6 * var(--px));
}
</style>
