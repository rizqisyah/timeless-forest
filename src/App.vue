<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { useWedding } from './composables/useWedding'
import { startReveals } from './motion/reveal'
import CoverSection from './components/cover/CoverSection.vue'
import InviteSheet from './components/invite/InviteSheet.vue'
import DesktopAside from './components/common/DesktopAside.vue'
import MusicButton from './components/common/MusicButton.vue'
import AppToast from './components/common/AppToast.vue'
import GalleryViewer from './components/common/GalleryViewer.vue'

// Starts the getHome request; the cover shows while it is in flight.
const { guestName, coupleNames, invite } = useWedding()
const isOpen = ref(false)
const column = ref<HTMLElement | null>(null)

async function openInvitation() {
  window.scrollTo(0, 0)
  column.value?.scrollTo(0, 0)
  isOpen.value = true
  await nextTick()
  // Entrances are held until now: the sheet was laid out behind the cover all along.
  startReveals()
}
</script>

<template>
  <main class="app-shell" :class="{ 'is-locked': !isOpen }">
    <!-- Left column (desktop only) -->
    <DesktopAside class="desktop-left" />

    <!-- Right column: the invitation itself -->
    <div ref="column" class="desktop-right">
      <Transition name="splash">
        <div v-if="!isOpen" class="cover-layer">
          <CoverSection
            :couple-names="coupleNames"
            :guest-name="guestName"
            :photo="invite.photos.cover"
            @open="openInvitation"
          />
        </div>
      </Transition>

      <InviteSheet class="invitation" :class="{ 'is-visible': isOpen }" :inert="!isOpen" />
    </div>

    <MusicButton v-if="isOpen" />

    <AppToast />
    <GalleryViewer />
  </main>
</template>

<style>
.app-shell.is-locked {
  overflow: hidden;
  height: 100dvh;
}

.desktop-right {
  position: relative;
  width: 100%;
  overflow-x: hidden;
  background: var(--sheet-bg);
}

.cover-layer {
  position: absolute;
  inset: 0 0 auto;
  z-index: 50;
}


@media (max-width: 767px) {
  .desktop-left {
    display: none;
  }
}

/* Desktop: photo panel on the left, the invitation scrolls in its own phone-width column. */
@media (min-width: 768px) {
  .app-shell {
    display: flex;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  .desktop-right {
    flex: none;
    width: var(--card-max);
    height: 100vh;
    overflow-y: auto;
    box-shadow: -8px 0 32px rgb(0 0 0 / 0.35);
    scrollbar-width: thin;
  }

  .app-shell.is-locked .desktop-right {
    overflow: hidden;
  }
}

/* The cover pushes past the viewer while the sheet rises out of the blur behind it. */
.splash-leave-active {
  transition:
    opacity calc(1.3s * var(--motion)) cubic-bezier(0.4, 0, 0.2, 1),
    transform calc(1.4s * var(--motion)) cubic-bezier(0.16, 1, 0.3, 1),
    filter calc(1.3s * var(--motion)) cubic-bezier(0.4, 0, 0.2, 1);
}

.splash-leave-to {
  opacity: 0;
  transform: scale(1.16);
  filter: blur(14px);
}

.invitation {
  opacity: 0;
  transform: translateY(28px) scale(0.965);
  filter: blur(10px);
  transition:
    opacity calc(1.4s * var(--motion)) cubic-bezier(0.16, 1, 0.3, 1) calc(0.45s * var(--motion)),
    transform calc(1.6s * var(--motion)) cubic-bezier(0.16, 1, 0.3, 1) calc(0.45s * var(--motion)),
    filter calc(1.4s * var(--motion)) cubic-bezier(0.16, 1, 0.3, 1) calc(0.45s * var(--motion));
}

/*
 * `none`, not identity values: a lingering transform or filter would make the sheet the
 * containing block of everything fixed inside it, and keeps a 20k px layer composited.
 */
.invitation.is-visible {
  opacity: 1;
  transform: none;
  filter: none;
}

@media (prefers-reduced-motion: reduce) {
  .splash-leave-active,
  .invitation {
    transition: opacity 0.2s linear;
  }

  .splash-leave-to,
  .invitation {
    transform: none;
    filter: none;
  }
}
</style>
