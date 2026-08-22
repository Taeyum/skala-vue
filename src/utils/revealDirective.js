// 스크롤로 뷰포트에 들어올 때 요소를 부드럽게 등장시키는 커스텀 디렉티브.
// 사용: v-reveal 또는 v-reveal="120" (등장 지연 ms — 인접 요소 캐스케이드용)
export const reveal = {
  mounted(el, binding) {
    // 모션 최소화 환경에서는 숨기지 않고 즉시 보여준다 — 콘텐츠가 가려질 여지를 없앤다
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    el.classList.add('reveal-init')
    if (typeof binding.value === 'number') {
      el.style.transitionDelay = `${binding.value}ms`
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('reveal-in')
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    el._revealIO = io
  },
  unmounted(el) {
    el._revealIO?.disconnect()
  },
}
